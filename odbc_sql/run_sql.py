import re, sys, io
from pathlib import Path
import pyodbc
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
# ========== 连接信息 ==========
server = "sqlmi-datahub-dev.public.4daf3b0b0385.database.chinacloudapi.cn"
port = 3342
user = "frank.fu"
password = "wp4w2o6T#^"
database = "datahubdev" 

SQL_ROOT = r"out"

# 是否递归扫描子目录
RECURSIVE = True

CONTINUE_ON_ERROR = True

SKIP_NAME_RE = re.compile(r"(bak|backup)", re.IGNORECASE)

GO_SPLIT_RE = re.compile(r"(?im)^\s*GO\s*$")


def read_text_smart(path: Path) -> str:
    data = path.read_bytes()

    # BOM-based quick checks
    if data.startswith(b"\xff\xfe") or data.startswith(b"\xfe\xff"):
        return data.decode("utf-16")
    if data.startswith(b"\xef\xbb\xbf"):
        return data.decode("utf-8-sig")

    # for enc in ("utf-8", "gbk", "cp1252", "latin1"):
    #     try:
    #         return data.decode(enc)
    #     except UnicodeDecodeError:
    #         continue

    return data.decode("utf-8", errors="replace")


def should_skip_file(p: Path) -> bool:
    return SKIP_NAME_RE.search(p.name) is not None


def split_sql_batches(sql_text: str) -> list[str]:
    """
    Split SQL script into executable batches by GO delimiter lines.
    """
    parts = GO_SPLIT_RE.split(sql_text)
    return [p.strip() for p in parts if p.strip()]


def connect_sqlserver() -> pyodbc.Connection:
    conn_str = (
        "DRIVER={ODBC Driver 18 for SQL Server};"
        f"SERVER={server},{port};"
        f"DATABASE={database};"
        f"UID={user};PWD={password};"
        "Encrypt=yes;"
        "TrustServerCertificate=yes;"
        "Connection Timeout=30;"
    )
    return pyodbc.connect(conn_str, autocommit=True)


def exec_sql_file(cur: pyodbc.Cursor, file_path: Path) -> None:
    sql_text = read_text_smart(file_path)
    batches = split_sql_batches(sql_text)

    for i, batch in enumerate(batches, start=1):
        try:
            cur.execute(batch)
        except Exception as e:
            preview = batch[:200].replace("\n", " ").replace("\r", " ")
            raise RuntimeError(
                f"Failed: {file_path}   | Error: {e}"
            ) from e

def safe_print(text):
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode('gbk', errors='replace').decode('gbk'))

def main():
    sql_root = Path(SQL_ROOT)
    if not sql_root.exists():
        raise SystemExit(f"SQL_ROOT not found: {sql_root}")

    cn = connect_sqlserver()
    cur = cn.cursor()

    # 验证连接
    cur.execute("SELECT @@VERSION")
    print("Connected. SQL Server version:")
    print(cur.fetchone()[0])
    print("-" * 80)

    # 收集文件
    pattern = "**/*.sql" if RECURSIVE else "*.sql"
    files = sorted([p for p in sql_root.glob(pattern) if p.is_file()])

    processed = 0
    skipped = 0
    failed = 0

    for f in files:
        if should_skip_file(f):
            skipped += 1
            continue

        # print(f"[RUN ] {f}")
        try:
            exec_sql_file(cur, f)
            processed += 1
            # print(f"[ OK ] {f}")
        except Exception as e:
            failed += 1
            print(f"[FAIL] {f}\n{e}\n")

            if not CONTINUE_ON_ERROR:
                break

    # 关闭连接
    try:
        cur.close()
    except Exception:
        pass
    cn.close()

    print("-" * 80)
    print(f"Done. processed={processed}, skipped={skipped}, failed={failed}")


if __name__ == "__main__":
    main()