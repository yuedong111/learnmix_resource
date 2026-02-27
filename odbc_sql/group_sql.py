import argparse
import re
from pathlib import Path


USE_OLD = "USE [datahubdbprod]"
USE_NEW = "USE [datahubdev]"


SKIP_NAME_RE = re.compile(r"(bak|backup|test|Test)", re.IGNORECASE)


def should_skip_file(path: Path) -> bool:
    """
    Skip files whose filename contains 'bak' or 'backup' (case-insensitive).
    """
    return SKIP_NAME_RE.search(path.name) is not None


def read_text_smart(path: Path) -> str:
    """
    Try common encodings used on Windows / SQL exports.
    """
    data = path.read_bytes()

    # BOM-based quick checks
    if data.startswith(b"\xff\xfe") or data.startswith(b"\xfe\xff"):
        return data.decode("utf-16")
    if data.startswith(b"\xef\xbb\xbf"):
        return data.decode("utf-8-sig")

    # Try a few common encodings
    for enc in ("utf-8", "gbk", "cp1252", "latin1"):
        try:
            return data.decode(enc)
        except UnicodeDecodeError:
            continue

    # Fallback (should rarely happen)
    return data.decode("latin1", errors="replace")


def replace_first_line_use(sql: str) -> str:
    """
    Replace first line USE [datahubdbprod] -> USE [datahubdev]
    (Robust to BOM and trailing spaces / semicolon)
    """
    lines = sql.splitlines(True)  # keep line endings
    if not lines:
        return sql

    first = lines[0].lstrip("\ufeff")  # strip BOM char if any
    if re.match(r"^\s*USE\s+\[datahubdbprod\]\s*;?\s*$", first, flags=re.IGNORECASE):
        # Keep original line ending (if any)
        line_ending = ""
        m = re.search(r"(\r\n|\n|\r)$", lines[0])
        if m:
            line_ending = m.group(1)
        lines[0] = USE_NEW + line_ending

    return "".join(lines)

def add_drop_before_create_view(sql: str) -> str:
    """
    Before each CREATE VIEW <name>..., insert:
    DROP VIEW IF EXISTS <name>;
    Keeps indentation.
    """
    pattern = re.compile(
        r"(?im)^(?P<indent>[ \t]*)CREATE\s+VIEW\s+(?P<view>[^\s(]+)(?P<rest>.*)$"
    )

    def repl(m: re.Match) -> str:
        indent = m.group("indent") or ""
        view = m.group("view")
        rest = m.group("rest") or ""
        return (
            f"{indent}DROP VIEW IF EXISTS {view};\n"
            f"{indent}GO \n"
            f"{indent}CREATE VIEW {view}{rest}"
        )

    return pattern.sub(repl, sql)

def add_drop_before_create_table(sql: str) -> str:
    """
    Before each CREATE TABLE <name>..., insert:
    DROP TABLE IF EXISTS <name>;
    Keeps indentation, works even if CREATE TABLE and columns are on same line.
    """
    pattern = re.compile(
        r"(?im)^(?P<indent>[ \t]*)CREATE\s+TABLE\s+(?P<table>[^\s(]+)(?P<rest>.*)$"
    )

    def repl(m: re.Match) -> str:
        indent = m.group("indent") or ""
        table = m.group("table")
        rest = m.group("rest") or ""
        return (
            f"{indent}DROP TABLE IF EXISTS {table};\n"
            f"{indent}CREATE TABLE {table}{rest}"
        )

    return pattern.sub(repl, sql)

def add_drop_before_create_procedure(sql: str) -> str:
    """
    Before each CREATE PROCEDURE/PROC <name>..., insert:
    DROP PROCEDURE IF EXISTS <name>;
    GO
    CREATE PROCEDURE/PROC ...
    (CREATE PROC/PROCEDURE must be first statement in a batch)
    """
    pattern = re.compile(
        r"(?im)^(?P<indent>[ \t]*)CREATE\s+(?P<kw>PROC(?:EDURE)?)\s+(?P<proc>[^\s(]+)(?P<rest>.*)$"
    )

    def repl(m: re.Match) -> str:
        indent = m.group("indent") or ""
        kw = m.group("kw")         # PROC or PROCEDURE
        proc = m.group("proc")     # object name
        rest = m.group("rest") or ""
        return (
            f"{indent}DROP PROCEDURE IF EXISTS {proc};\n"
            f"{indent}GO\n"
            f"{indent}CREATE {kw} {proc}{rest}"
        )

    return pattern.sub(repl, sql)

def compute_group_dir(filename: str) -> str:
    """
    Use the token before the first '.' in filename (without extension if needed).
    Example: enrich.SP_XXX.sql -> enrich
    """
    token = filename.split(".", 1)[0].strip()
    return token if token else "misc"


def process_file(src_file: Path, dst_root: Path) -> Path:
    sql = read_text_smart(src_file)

    sql = replace_first_line_use(sql)
    sql = add_drop_before_create_table(sql)
    sql = add_drop_before_create_view(sql)
    sql = add_drop_before_create_procedure(sql)

    group = compute_group_dir(src_file.name)
    out_dir = dst_root / group
    out_dir.mkdir(parents=True, exist_ok=True)

    out_path = out_dir / src_file.name
    out_path.write_text(sql, encoding="utf-8", newline="\n")
    return out_path


def main():
    parser = argparse.ArgumentParser(
        description="Process SQL files: replace USE line, add DROP before CREATE TABLE, and group outputs by filename prefix."
    )
    parser.add_argument(
        "--src",
        required=True,
        help=r"Source directory, e.g. C:\Users\pengchencq\test\current all script\current script",
    )
    parser.add_argument(
        "--dst",
        required=True,
        help=r"Destination directory, e.g. C:\Users\pengchencq\test\current all script\current script_out",
    )
    parser.add_argument(
        "--recursive",
        action="store_true",
        default=True,
        help="Scan recursively (default: true). Use --no-recursive to disable.",
    )
    parser.add_argument(
        "--no-recursive",
        dest="recursive",
        action="store_false",
        help="Do not scan recursively.",
    )
    parser.add_argument(
        "--ext",
        default=".sql",
        help="File extension to process (default: .sql).",
    )

    args = parser.parse_args()
    src_root = Path(args.src)
    dst_root = Path(args.dst)
    ext = args.ext.lower()

    if not src_root.exists():
        raise SystemExit(f"Source dir not found: {src_root}")

    dst_root.mkdir(parents=True, exist_ok=True)

    files = src_root.rglob(f"*{ext}") if args.recursive else src_root.glob(f"*{ext}")

    processed = 0
    skipped = 0

    for f in files:
        if not f.is_file():
            continue

        if should_skip_file(f):
            skipped += 1
            continue

        process_file(f, dst_root)
        processed += 1

    print(f"Done. Processed {processed} file(s), skipped {skipped} file(s). Output: {dst_root}")


if __name__ == "__main__":
    main()