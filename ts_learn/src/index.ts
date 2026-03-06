// 定义一个函数，返回当前时间的 ISO 字符串格式
// : string 表示返回值类型注解，明确告诉 TypeScript 这个函数返回字符串
function formatNow(): string {
    // 这里返回 string，就是”边界”：调用者只关心拿到一个字符串
    // new Date() 创建当前时间的 Date 对象
    // .toISOString() 将其转换为 “2026-03-04T12:34:56.789Z” 格式的字符串
    return new Date().toISOString();
}

// 定义一个类型别名，描述 readArgs 函数的返回值结构
// 这是一种"对象类型"，包含三个属性
type ReadArgsResult = {
    // raw: 原始参数数组（已去掉前两个元素）
    raw: string[];
    // flags: 键值对形式的参数，值可以是字符串或布尔值
    // Record<string, string | boolean> 是一个对象类型，键是 string，值是 string 或 boolean
    flags: Record<string, string | boolean>;
    // positionals: 位置参数数组（不带 -- 前缀的参数）
    positionals: string[];
};

// 定义一个解析命令行参数的函数
// argv: 参数类型是 string[]（字符串数组）
// 返回值类型是上面定义的 ReadArgsResult
function readArgs(argv: string[]): ReadArgsResult {
    // argv 传进来就是边界：string[]
    // 内部实现细节 TS 会推断很多类型，你不需要到处写

    // slice(2) 去掉前两个元素（node 路径 和 脚本路径）
    // 例如：["node", "index.js", "--verbose", "file.txt"] -> ["--verbose", "file.txt"]
    const raw = argv.slice(2);

    // 创建一个空对象，用于存储 flag 形式的参数
    // Record<string, string | boolean> 是 TypeScript 类型，表示对象键是字符串，值是字符串或布尔值
    const flags: Record<string, string | boolean> = {};

    // 创建一个空数组，用于存储位置参数
    const positionals: string[] = [];

    // for...of 循环遍历 raw 数组中的每一项
    // item 的类型会被 TypeScript 自动推断为 string
    for (const item of raw) {
        // 支持：--name=alice 这种带值的 flag
        // startsWith("--") 检查字符串是否以 "--" 开头
        // includes("=") 检查字符串中是否包含 "="
        if (item.startsWith("--") && item.includes("=")) {
            // slice(2) 去掉 "--" 前缀，然后用 "=" 分割
            // 例如："--name=alice" -> ["name", "alice"]
            const [k, v] = item.slice(2).split("=");
            // 注意：split 后的元素可能是 undefined（noUncheckedIndexedAccess 会提醒你）
            // k 和 v 的类型是 string | undefined
            // k && v !== undefined 确保 k 不为空字符串且 v 不是 undefined
            if (k && v !== undefined) flags[k] = v;
            // continue 跳过本次循环的剩余代码，直接进入下一次迭代
            continue;
        }

        // 支持：--verbose 这种布尔 flag（不带值）
        if (item.startsWith("--")) {
            // slice(2) 去掉 "--" 前缀，得到 flag 的键名
            const key = item.slice(2);
            // if (key) 确保 key 不是空字符串
            if (key) flags[key] = true;
            continue;
        }

        // 其他：位置参数（不以 "--" 开头的参数）
        positionals.push(item);
    }

    // 返回解析结果，包含三个属性
    // { raw, flags, positionals } 是对象简写，等价于 { raw: raw, flags: flags, positionals: positionals }
    return { raw, flags, positionals };
}

// 定义一个读取环境变量的函数
// keys: 要读取的环境变量名数组
// 返回值：一个对象，键是环境变量名，值是对应的值（可能是 undefined）
function readEnv(keys: string[]): Record<string, string | undefined> {
    // 创建一个空对象，用于存储环境变量的键值对
    // Record<string, string | undefined> 表示值可能是字符串或 undefined
    const out: Record<string, string | undefined> = {};
    // 遍历所有要读取的环境变量名
    for (const k of keys) {
        // process.env 是 Node.js 中的全局对象，包含所有环境变量
        // process.env[k] 访问指定名称的环境变量，如果不存在则返回 undefined
        out[k] = process.env[k];
    }
    return out;
}

// 定义主函数，程序的入口逻辑
// 没有参数，也没有返回值（返回类型是 void，可以省略不写）
function main() {
    // 调用 formatNow() 函数获取当前时间字符串
    const now = formatNow();

    // 调用 readArgs() 解析命令行参数
    // process.argv 是 Node.js 全局变量，包含命令行参数数组
    const args = readArgs(process.argv);

    // 只是示例：读取两个常见 env
    // 传入环境变量名数组，返回对应的环境变量值对象
    const env = readEnv(["NODE_ENV", "DEBUG"]);

    // console.log 是 Node.js 全局函数，用于打印输出到控制台
    console.log("=== TS CLI Starter ===");  // 打印标题
    console.log("now:", now);                // 打印当前时间
    console.log("argv.raw:", args.raw);      // 打印原始参数
    console.log("argv.flags:", args.flags);  // 打印解析后的 flags
    console.log("argv.positionals:", args.positionals);  // 打印位置参数
    console.log("env:", env);                // 打印环境变量
}

// 调用 main 函数执行程序
// 注意：这里的括号 () 是函数调用的标志
main();