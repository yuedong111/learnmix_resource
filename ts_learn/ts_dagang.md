下面这个大纲不是“死记 TypeScript 语法”，而是按你前面说的思路来设计：

> 学 TypeScript = 学会用类型系统约束 JavaScript 工程，让代码更安全、更好维护、更容易被 AI 生成后审核。



TypeScript 官方对它的定位是：它是在 JavaScript 上增加类型语法的强类型语言，目标是提升大规模 JavaScript 项目的工具支持和可维护性。


---

TypeScript 学习大纲：AI 时代程序员版

第 0 章：先理解 TypeScript 是为了解决什么问题

你要理解的问题

JavaScript 很灵活，但大型项目里容易出现这些问题：

function getUserName(user) {
  return user.name.toUpperCase()
}

如果 user 是 null，或者 name 不是字符串，运行时才会报错。

TypeScript 的作用是提前发现这类问题：

type User = {
  name: string
}

function getUserName(user: User): string {
  return user.name.toUpperCase()
}

这一章重点

你要知道 TypeScript 适合：

前端工程，比如 React、Vue、Next.js；

Node.js 后端工程；

大型 JavaScript 项目重构；

多人协作项目；

需要 AI 生成代码但又希望更容易审核的项目。

不适合把它当成：

高性能系统语言；

替代 Go / Rust / Java 的后端万能语言；

只靠类型就能解决所有运行时错误的工具。

学完要能回答

TypeScript 和 JavaScript 是什么关系？

TypeScript 最终会运行在浏览器里吗？

TypeScript 为什么能提高大型项目可维护性？

为什么 TypeScript 不能完全替代测试？


---

第 1 章：JavaScript 基础必须补齐

很多人学不好 TypeScript，不是因为 TypeScript 难，而是 JavaScript 基础不稳。

TypeScript 是 JavaScript 的超集，所以你必须先理解 JavaScript 的核心机制。

必学内容

1. 变量与作用域

let name = "Tom"
const age = 18

重点理解：

let

const

作用域

变量提升

闭包


---

2. 函数

function add(a: number, b: number): number {
  return a + b
}

重点理解：

普通函数

箭头函数

默认参数

剩余参数

回调函数

高阶函数


---

3. 对象和数组

const user = {
  id: 1,
  name: "Alice"
}

const numbers = [1, 2, 3]

重点理解：

对象属性访问

数组方法：map、filter、reduce

浅拷贝和深拷贝

解构赋值


---

4. 异步编程

async function fetchUser() {
  const res = await fetch("/api/user")
  return res.json()
}

重点理解：

Promise

async / await

try / catch

并发请求

错误处理


---

这一章目标

不是为了“写漂亮 JS”，而是为了看懂 TypeScript 背后的运行逻辑。

因为 TypeScript 编译后还是 JavaScript。


---

第 2 章：TypeScript 基础类型

这一章开始进入 TypeScript 的核心。

1. 基本类型

let name: string = "Tom"
let age: number = 18
let isAdmin: boolean = false

掌握：

string

number

boolean

null

undefined

symbol

bigint


---

2. 数组类型

const scores: number[] = [90, 80, 70]

const names: Array<string> = ["Tom", "Jerry"]

重点理解两种写法：

number[]
Array<number>


---

3. 对象类型

type User = {
  id: number
  name: string
  email?: string
}

重点理解：

必填属性

可选属性

只读属性

对象嵌套


---

4. 函数类型

function sum(a: number, b: number): number {
  return a + b
}

也要会这种写法：

type AddFn = (a: number, b: number) => number

const add: AddFn = (a, b) => a + b


---

5. any、unknown、never

这是 TypeScript 里非常重要的工程判断点。

any

let data: any = "hello"
data.foo.bar()

any 相当于关闭类型检查。

少用。


---

unknown

let data: unknown = "hello"

if (typeof data === "string") {
  console.log(data.toUpperCase())
}

unknown 更安全。

你必须先判断类型，才能使用。


---

never

function fail(message: string): never {
  throw new Error(message)
}

never 表示永远不会正常返回。

常用于异常、穷尽检查。


---

这一章目标

你要能看懂 AI 生成的 TypeScript 类型是否太宽泛。

尤其要警惕：

let result: any

因为这通常意味着 AI 偷懒了。


---

第 3 章：TypeScript 类型设计能力

这一章是 TypeScript 真正值钱的地方。

会写语法不难，难的是会设计类型。


---

1. type 和 interface

type User = {
  id: number
  name: string
}

interface User {
  id: number
  name: string
}

你要理解：

二者大部分场景都能用；

interface 更适合描述对象结构；

type 更灵活，适合联合类型、组合类型。


---

2. 联合类型

type Status = "pending" | "success" | "failed"

这个非常重要。

它可以限制变量只能是几个固定值。

比这样更安全：

let status: string


---

3. 字面量类型

type Role = "admin" | "user" | "guest"

适合定义：

用户角色

订单状态

任务状态

审核状态

接口返回状态


---

4. 交叉类型

type User = {
  id: number
  name: string
}

type Admin = User & {
  permissions: string[]
}

表示合并多个类型。


---

5. 类型收窄

function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase())
  } else {
    console.log(id.toFixed(2))
  }
}

重点理解：

typeof

instanceof

in

自定义类型守卫


---

6. 判别联合类型

这是工程里非常常用的高级技巧。

type ApiResult =
  | { status: "success"; data: string }
  | { status: "error"; message: string }

function handleResult(result: ApiResult) {
  if (result.status === "success") {
    console.log(result.data)
  } else {
    console.log(result.message)
  }
}

好处是：

不同状态对应不同字段；

减少错误判断；

适合 API 返回值设计。


---

这一章目标

你要能做到：

不是简单给变量加类型，而是用类型表达业务规则。

比如订单系统里，不应该这样写：

type OrderStatus = string

而应该这样写：

type OrderStatus = "created" | "paid" | "shipped" | "cancelled"


---

第 4 章：泛型 Generics

泛型是 TypeScript 学习中的一个分水岭。

简单理解：

> 泛型就是“类型参数”。



就像函数参数可以接收不同的值，泛型可以接收不同的类型。


---

1. 基础泛型

function identity<T>(value: T): T {
  return value
}

const a = identity<string>("hello")
const b = identity<number>(123)


---

2. 泛型数组

function first<T>(arr: T[]): T | undefined {
  return arr[0]
}


---

3. 泛型接口

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

使用：

type User = {
  id: number
  name: string
}

const response: ApiResponse<User> = {
  code: 0,
  message: "success",
  data: {
    id: 1,
    name: "Tom"
  }
}


---

4. 泛型约束

function getLength<T extends { length: number }>(value: T): number {
  return value.length
}

意思是：

T 可以是很多类型，但必须有 length 属性。


---

这一章目标

你要能理解这些真实工程里的类型：

Promise<T>
Array<T>
Record<K, V>
ApiResponse<T>
PageResult<T>

比如分页接口可以这样设计：

type PageResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}


---

第 5 章：TypeScript 工具类型

TypeScript 内置了很多工具类型，实际项目里非常常用。


---

1. Partial<T>

把所有属性变成可选。

type User = {
  id: number
  name: string
  email: string
}

type UpdateUserDto = Partial<User>

适合更新接口。


---

2. Pick<T, K>

只选一部分字段。

type UserPreview = Pick<User, "id" | "name">

适合列表页、卡片信息。


---

3. Omit<T, K>

去掉某些字段。

type CreateUserDto = Omit<User, "id">

适合创建接口。


---

4. Record<K, V>

定义键值对象。

type RolePermissionMap = Record<string, string[]>

也可以更严格：

type Role = "admin" | "user"

type RolePermissionMap = Record<Role, string[]>


---

5. Readonly<T>

只读对象。

type Config = Readonly<{
  apiBaseUrl: string
  timeout: number
}>


---

6. ReturnType<T>

获取函数返回值类型。

function createUser() {
  return {
    id: 1,
    name: "Tom"
  }
}

type User = ReturnType<typeof createUser>


---

这一章目标

你要能看懂别人项目里的复杂类型。

尤其是：

Partial<T>
Pick<T, K>
Omit<T, K>
Record<K, V>
ReturnType<T>
Parameters<T>

这些在真实项目里非常高频。


---

第 6 章：TypeScript 工程配置

这部分非常重要。

很多人会写 TypeScript，但不会配置 TypeScript 项目。


---

1. tsconfig.json

你要重点理解：

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

重点配置：

target

module

strict

baseUrl

paths

outDir

rootDir

esModuleInterop


---

2. strict 模式

建议新项目开启：

{
  "compilerOptions": {
    "strict": true
  }
}

这会让 TypeScript 更严格。

AI 生成代码时，如果类型不严谨，编译器会更容易发现问题。


---

3. 编译流程

你要理解：

.ts 文件不是直接运行；

TypeScript 会编译成 JavaScript；

最终运行的是 JavaScript；

类型只在编译阶段存在。


---

4. 包管理工具

了解：

npm

pnpm

yarn


---

5. 常见命令

npm install typescript -D

npx tsc --init

npx tsc

npx ts-node src/index.ts


---

这一章目标

你要能独立创建一个 TypeScript 项目，而不是只在在线编辑器里写代码。


---

第 7 章：TypeScript + 前端框架

如果你做前端，重点学这部分。


---

1. TypeScript + React

重点掌握：

组件 Props 类型

事件类型

useState 类型

useRef 类型

自定义 Hook 类型

API 返回值类型

示例：

type UserCardProps = {
  name: string
  age: number
}

function UserCard(props: UserCardProps) {
  return <div>{props.name}</div>
}


---

2. React 状态类型

type User = {
  id: number
  name: string
}

const [user, setUser] = useState<User | null>(null)

重点理解为什么要写：

User | null

因为初始状态可能还没有加载到用户数据。


---

3. 表单类型

重点掌握：

输入框事件类型

表单数据类型

表单校验类型


---

4. API 请求类型

type User = {
  id: number
  name: string
}

async function getUser(): Promise<User> {
  const res = await fetch("/api/user")
  return res.json()
}

注意：这里还有运行时风险。

因为 res.json() 返回的数据不一定真的符合 User 类型。

这就是后面要学运行时校验的原因。


---

第 8 章：TypeScript + Node.js 后端

如果你做后端，也建议学这部分。


---

1. TypeScript 写 Node 服务

可以选择：

Express

Fastify

NestJS

Hono


---

2. 路由类型

type CreateUserRequest = {
  name: string
  email: string
}

type CreateUserResponse = {
  id: number
  name: string
  email: string
}


---

3. DTO 类型设计

DTO = Data Transfer Object，也就是接口输入输出对象。

比如：

type CreateUserDto = {
  name: string
  email: string
}

type UpdateUserDto = Partial<CreateUserDto>


---

4. Service 层类型

type User = {
  id: number
  name: string
  email: string
}

class UserService {
  async findById(id: number): Promise<User | null> {
    return null
  }
}


---

5. 数据库类型

如果使用 Prisma、Drizzle、TypeORM 等工具，要理解：

数据库 schema 如何生成类型；

类型和真实数据库字段如何保持一致；

迁移时类型如何更新。


---

第 9 章：运行时校验

这是 TypeScript 非常容易被误解的地方。

TypeScript 只能在编译阶段检查类型。

但是外部输入，比如：

HTTP 请求；

数据库数据；

第三方 API 返回；

用户输入；

文件内容；

这些数据在运行时才出现。

所以只写 TypeScript 类型是不够的。


---

推荐学习 Zod

示例：

import { z } from "zod"

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
})

type User = z.infer<typeof UserSchema>

使用：

const result = UserSchema.safeParse(data)

if (!result.success) {
  throw new Error("Invalid user data")
}

const user = result.data


---

这一章目标

你要形成一个重要意识：

> TypeScript 类型不等于运行时数据一定安全。



AI 生成代码时，经常会犯这个错误：

const user = await res.json() as User

这只是“强行告诉 TypeScript 它是 User”，并没有真的验证数据。

更好的方式是：

const data = await res.json()
const user = UserSchema.parse(data)


---

第 10 章：错误处理与异常设计

TypeScript 项目里，错误处理非常重要。


---

1. 不要滥用 throw new Error

简单项目可以这样：

throw new Error("User not found")

但复杂项目最好定义错误类型：

class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NotFoundError"
  }
}


---

2. 返回值表达错误

有些团队喜欢这样：

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

使用：

function parseNumber(value: string): Result<number> {
  const n = Number(value)

  if (Number.isNaN(n)) {
    return { ok: false, error: "Invalid number" }
  }

  return { ok: true, data: n }
}


---

3. API 错误格式

type ApiError = {
  code: string
  message: string
  details?: unknown
}


---

这一章目标

你要学会设计稳定的错误结构，而不是到处 throw，也不是到处返回 null。


---

第 11 章：测试

AI 时代，测试更重要。

因为 AI 写代码很快，但你需要测试来验证它对不对。


---

1. 单元测试

学习：

Vitest

Jest

示例：

function add(a: number, b: number): number {
  return a + b
}

测试：

import { expect, test } from "vitest"

test("add two numbers", () => {
  expect(add(1, 2)).toBe(3)
})


---

2. 类型测试

有些库会测试类型是否正确。

了解：

tsd

expect-type


---

3. 接口测试

学习：

Supertest

Postman

Playwright API testing


---

4. 前端测试

学习：

React Testing Library

Playwright


---

这一章目标

你要养成习惯：

AI 生成代码后，不是看一眼觉得能跑就行，而是补测试验证。


---

第 12 章：代码质量与工程规范

TypeScript 项目真正上线，需要工程规范。


---

1. ESLint

负责检查代码问题。

例如：

未使用变量；

不安全的 any；

不规范的 Promise 使用；

可能的空值问题。


---

2. Prettier

负责格式化代码。


---

3. Git Hooks

可以用：

Husky

lint-staged

提交前自动检查：

npm run lint
npm run test
npm run typecheck


---

4. CI/CD

GitHub Actions 里常见流程：

npm ci
npm run lint
npm run typecheck
npm run test
npm run build


---

这一章目标

你要知道：

> TypeScript 不是只靠编辑器报红线，真正项目要靠 lint、test、typecheck、build 一起保证质量。




---

第 13 章：模块系统与打包

TypeScript 项目经常遇到模块问题。

尤其是：

CommonJS

ES Module

Node.js

浏览器

打包工具

之间的关系。


---

必学内容

1. import / export

export function add(a: number, b: number) {
  return a + b
}

import { add } from "./math"


---

2. CommonJS

module.exports = {}

const lib = require("lib")


---

3. ES Module

export default function app() {}

import app from "./app"


---

4. 打包工具

了解：

Vite

Webpack

tsup

esbuild

Rollup


---

这一章目标

你要能排查这些常见问题：

为什么 import 报错？

为什么默认导入不生效？

为什么 Node 里 ESM 和 CJS 冲突？

为什么打包后路径不对？


---

第 14 章：安全与性能

TypeScript 不是安全万能药。

它能减少类型错误，但不能自动解决安全问题。


---

1. 常见安全问题

你要了解：

XSS

CSRF

SQL 注入

命令注入

敏感信息泄露

依赖包漏洞


---

2. TypeScript 能帮什么

它可以帮你：

限制输入输出类型；

减少空值错误；

让权限、状态、角色更清晰；

避免部分错误调用。


---

3. TypeScript 不能帮什么

它不能自动防止：

用户输入恶意脚本；

SQL 拼接错误；

接口越权；

密码泄露；

第三方包漏洞。


---

4. 性能意识

要理解：

TypeScript 类型检查发生在编译阶段；

运行时执行的是 JavaScript；

类型本身不会提升运行性能；

性能问题仍然要用 JavaScript / Node.js / 浏览器工具分析。


---

第 15 章：AI 生成 TypeScript 代码的审核能力

这是你现在最应该重点练的。


---

1. 审核类型是否过宽

警惕：

any
object
Function
Record<string, any>

更好的方式：

type User = {
  id: number
  name: string
}


---

2. 审核是否缺少空值处理

警惕：

user.name.toUpperCase()

更安全：

if (!user) {
  return
}

user.name.toUpperCase()

或者：

user?.name?.toUpperCase()


---

3. 审核外部数据是否做了校验

警惕：

const user = await res.json() as User

更好：

const data = await res.json()
const user = UserSchema.parse(data)


---

4. 审核异步错误是否处理

警惕：

const data = await fetchData()

更稳：

try {
  const data = await fetchData()
} catch (err) {
  console.error(err)
}


---

5. 审核 API 类型是否和业务一致

比如订单状态不应该写成：

type OrderStatus = string

应该写成：

type OrderStatus = "created" | "paid" | "shipped" | "cancelled"


---

6. 审核是否有测试

AI 生成代码后，你应该追问：

有没有单元测试？

有没有边界情况？

有没有错误输入测试？

有没有空值测试？

有没有并发或异步异常测试？


---

第 16 章：推荐实战项目

学习 TypeScript 最好不要只看语法。

你可以按下面顺序做项目。


---

项目 1：Todo List

目标：掌握基础类型、对象类型、数组类型。

功能：

新增任务；

完成任务；

删除任务；

按状态筛选。

重点类型：

type Todo = {
  id: number
  title: string
  completed: boolean
}


---

项目 2：用户管理后台

目标：掌握 API 类型、表单类型、状态类型。

功能：

用户列表；

新增用户；

编辑用户；

删除用户；

搜索用户。

重点类型：

type User = {
  id: number
  name: string
  email: string
  role: "admin" | "user"
}


---

项目 3：Node.js REST API

目标：掌握后端 TypeScript。

功能：

创建用户；

查询用户；

更新用户；

删除用户；

统一错误处理。

重点：

DTO

Service

Controller

Zod 校验

测试


---

项目 4：RAG / AI 问答小系统前端

这个比较适合你现在的方向。

功能：

上传文档；

展示解析状态；

输入问题；

展示 AI 回答；

展示引用来源；

展示错误状态。

重点类型：

type DocumentStatus = "uploading" | "parsing" | "ready" | "failed"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

type Citation = {
  documentId: string
  chunkId: string
  text: string
}

这个项目能让你真正理解 TypeScript 在 AI 应用里的价值。


---

推荐学习顺序

第一阶段：入门，1 到 2 周

目标：看懂 TypeScript 基础代码。

学习：

JavaScript 基础复习；

基本类型；

数组和对象；

函数类型；

type 和 interface；

联合类型；

可选属性；

空值处理。

产出：

写一个 Todo List。


---

第二阶段：进阶，2 到 3 周

目标：能设计业务类型。

学习：

泛型；

工具类型；

类型收窄；

判别联合类型；

API 响应类型；

错误类型；

DTO 类型设计。

产出：

写一个用户管理系统。


---

第三阶段：工程化，2 到 3 周

目标：能做真实项目。

学习：

tsconfig.json；

ESLint；

Prettier；

Vitest；

项目目录结构；

前端或后端框架；

运行时校验；

CI 类型检查。

产出：

写一个 Node.js REST API 或 React 管理后台。


---

第四阶段：AI 代码审核，长期训练

目标：能判断 AI 生成的 TypeScript 是否可靠。

重点检查：

有没有滥用 any；

有没有错误的类型断言；

有没有缺少运行时校验；

有没有空值风险；

有没有异常处理；

有没有测试；

类型是否表达了真实业务规则。


---

最终学习路线图

可以按这个路线走：

JavaScript 基础
   ↓
TypeScript 基础类型
   ↓
type / interface / union
   ↓
泛型
   ↓
工具类型
   ↓
类型收窄与判别联合
   ↓
tsconfig + 工程化
   ↓
React / Node.js 实战
   ↓
Zod 运行时校验
   ↓
测试 + lint + build
   ↓
AI 代码审核能力


---

你学习 TypeScript 时要记住的一句话

> TypeScript 的价值不是让你多写几个类型，而是把业务规则、数据结构和错误边界提前暴露出来。



AI 可以帮你生成 TypeScript 代码，但你必须能判断：

类型是否准确；

业务状态是否完整；

外部数据是否安全；

错误处理是否可靠；

项目是否能长期维护。
