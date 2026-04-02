基于 Python 简单应用的 GitHub Actions 教程总整理

这篇整理基于 GitHub Docs 的 Actions Tutorials 页面来做一个“Python 小应用版”串讲。官方教程页覆盖的重点不只是最基础的 workflow，还包括：示例 workflow、Python 构建测试、GITHUB_TOKEN 认证、自定义 action、发布包、Issue 自动化、artifacts、容器化服务、从其他 CI 迁移、以及 Actions Runner Controller。下面我会用一个简单 Python 项目把这些重点串起来。 


---

1. 我们先用一个最小 Python 项目做载体

假设你有一个很简单的仓库：

demo-python-actions/
├─ app/
│ ├─ __init__.py
│ └─ calc.py
├─ tests/
│ └─ test_calc.py
├─ requirements.txt
├─ requirements-dev.txt
├─ .github/
│ ├─ workflows/
│ │ ├─ ci.yml
│ │ ├─ release.yml
│ │ ├─ weekly-issue.yml
│ │ └─ integration-postgres.yml
│ └─ actions/
│ └─ setup-python-project/
│ └─ action.yml

示例代码：

app/calc.py

def add(a: int, b: int) -> int:
    return a + b

tests/test_calc.py

from app.calc import add

def test_add():
    assert add(1, 2) == 3

requirements.txt



requirements-dev.txt

pytest
build


---

2. GitHub Actions 最核心的脑图

先别急着背 YAML，你只要先记住这个关系：

workflow：一次自动化流程

on：什么时候触发

jobs：要做几组任务

steps：每组任务里的具体步骤

runner：这些步骤跑在哪台机器上


GitHub 的示例教程里明确说明：workflow 用 YAML 写，放在仓库的 .github/workflows/ 目录下；最基础的例子就是在 push 时触发一个 job，再由这个 job 执行多个 step。 


---

3. 第一个最重要的文件：CI 工作流

这是你最该先掌握的，也是官方 Python 教程最核心的路径：构建 + 安装依赖 + 测试。官方 Python 教程说明了几个重点：
1）可以直接从 Python workflow template 起步；
2）推荐用 actions/setup-python 指定 Python 版本；
3）GitHub-hosted runner 自带 Python/PyPy 工具缓存；
4）后续再扩展依赖安装、测试、artifact、发布 PyPI。 

.github/workflows/ci.yml

name: Python CI

run-name: CI for ${{ github.ref_name }}

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        python-version: ["3.10", "3.11"]

    steps:
      - name: Checkout source code
        uses: actions/checkout@v5

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements-dev.txt

      - name: Run tests
        run: |
          pytest -q

这段 YAML 你要会看什么？

你先自己想一下：
on、jobs、steps 分别在这段里对应哪几块？

我先给你提示：

on：决定什么时候跑

jobs.test：定义一个叫 test 的 job

steps：按顺序执行 checkout、setup-python、install、pytest

strategy.matrix：表示同一套测试会在多个 Python 版本上跑


这个思路其实就是官方“example workflow”+“build and test Python”两篇教程合在一起的最实用版本。官方也强调 setup-python 是推荐用法，因为它能保证不同 runner 上 Python 版本行为一致。 


---

4. 为什么第一步几乎总是 checkout？

因为 runner 是 GitHub 提供的一台临时机器。
如果你不先把仓库代码拉下来，后面的 pytest 根本找不到你的项目文件。

所以几乎所有 workflow 的第一步都会有：

- uses: actions/checkout@v5

这和你在本地开发时先 git clone，本质上是一个意思。示例 workflow 教程里的基础例子也是先 checkout，再做后续动作。 


---

5. Artifact：把构建结果或测试结果“存起来”

官方 artifacts 教程讲了两件很实用的事：

可以把构建结果、测试报告上传保存

可以在 不同 jobs 之间传递文件

还可以设置保留天数，并校验 artifact digest 


你可以把 CI 再加强一点：

name: Python CI with Artifact

on:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v5

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install deps
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements-dev.txt

      - name: Run tests and generate report
        run: |
          mkdir -p reports
          pytest -q | tee reports/pytest-output.txt
          python -m build

      - name: Upload test report
        uses: actions/upload-artifact@v4
        with:
          name: pytest-report
          path: reports/pytest-output.txt
          retention-days: 5

      - name: Upload dist package
        uses: actions/upload-artifact@v4
        with:
          name: python-dist
          path: dist/

它解决什么问题？

比如你在 PR 里测试失败了，你就能直接去 Actions 页面下载测试输出或构建产物。
这比“只看终端日志”更工程化。


---

6. 多个 Job 怎么串起来？

官方 artifacts 教程还专门讲了：
想让后一个 job 用前一个 job 的文件，要靠：

upload-artifact

download-artifact

needs


也就是“前一个 job 成功后，后一个 job 再继续”。 

比如你可以这样拆分：

name: Build then Verify

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: |
          python -m pip install --upgrade pip
          pip install -r requirements-dev.txt
          python -m build
      - uses: actions/upload-artifact@v4
        with:
          name: dist-files
          path: dist/

  verify:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v5
        with:
          name: dist-files
      - run: ls -R

这里你可以把它理解成工厂流水线：

build：先打包

verify：再验货



---

7. GITHUB_TOKEN：让 workflow 有“仓库操作权限”

官方 GITHUB_TOKEN 教程的重点是：

在 workflow 里可以用 ${{ secrets.GITHUB_TOKEN }}

它可以用于调用 GitHub API 或 GitHub CLI

安全上要遵循 最小权限原则

用 permissions 显式限制权限更安全 


比如你希望测试失败时自动创建 issue：

name: Open issue on failure

on:
  workflow_dispatch:

jobs:
  open-issue:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write

    steps:
      - name: Create issue
        run: |
          gh issue create \
            --repo ${{ github.repository }} \
            --title "CI check required" \
            --body "Please inspect the workflow results."
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

这里最该记住什么？

不是“会不会写 gh 命令”，而是：
自动化脚本也是需要权限控制的。


---

8. 管理工作项：定时创建 Issue

官方 “Scheduling issue creation” 教程展示了一个很典型的项目管理自动化：
通过 schedule + cron 定时创建 issue，比如每周例会 agenda。这个 workflow 通常也会配合 GitHub CLI 和 issues: write 权限一起用。 

.github/workflows/weekly-issue.yml

name: Weekly Team Sync

on:
  schedule:
    - cron: "20 7 * * 1" # 每周一 UTC 07:20
  workflow_dispatch:

jobs:
  create-issue:
    runs-on: ubuntu-latest
    permissions:
      issues: write

    steps:
      - name: Create weekly issue
        run: |
          gh issue create \
            --repo ${{ github.repository }} \
            --title "Weekly sync - $(date +%F)" \
            --body "1. Review CI status\n2. Review open PRs\n3. Review release plan"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

这已经不只是“代码 CI”了，而是 把仓库管理流程也自动化。


---

9. 容器化服务：给测试临时拉一个 PostgreSQL

这一块是很多人第一次觉得 GitHub Actions 真正“能打”的地方。
官方 PostgreSQL service container 教程说明：你可以在 job 旁边挂一个 services.postgres，这样 integration test 就能连到临时数据库；如果 job 也跑在容器里，服务之间网络配置会更简单，可以直接通过服务 label 访问。 

.github/workflows/integration-postgres.yml

name: Integration Test with PostgreSQL

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  integration-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: demo_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v5

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install deps
        run: |
          python -m pip install --upgrade pip
          pip install pytest psycopg2-binary

      - name: Run integration test
        env:
          DB_HOST: 127.0.0.1
          DB_PORT: 5432
          DB_NAME: demo_db
          DB_USER: postgres
          DB_PASSWORD: postgres
        run: |
          pytest -q tests/

工程意义是什么？

你不用在外面手动准备测试数据库。
workflow 自己就能把依赖环境临时拉起来。


---

10. 发布包：从“测试通过”走向“产出可分发结果”

官方 Python 教程最后还覆盖了 publishing to PyPI，也就是：
CI 不只是验证代码，还可以在合适条件下把包发布出去。官方教程的整体定位就是“build, test, and publish a Python package”。 

一个最小发布 workflow 可以长这样：

.github/workflows/release.yml

name: Publish Package

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
      - uses: actions/checkout@v5

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Build package
        run: |
          python -m pip install --upgrade pip
          pip install build
          python -m build

      - name: Upload dist artifact
        uses: actions/upload-artifact@v4
        with:
          name: release-dist
          path: dist/

你现在先不用急着真的推 PyPI。
先理解这条链路：

代码通过测试 → 构建产物 → 触发 release → 发布


---

11. 自定义 Action：把重复步骤封装起来

官方教程页还专门有 “Create actions”，包括 JavaScript action 和 composite action。对于 Python 项目，最实用的通常是 composite action：把重复的 setup 步骤封装一下。 

.github/actions/setup-python-project/action.yml

name: "Setup Python Project"
description: "Install Python and project dependencies"

inputs:
  python-version:
    description: "Python version"
    required: true
    default: "3.11"

runs:
  using: "composite"
  steps:
    - uses: actions/setup-python@v5
      with:
        python-version: ${{ inputs.python-version }}

    - shell: bash
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements-dev.txt

然后在 CI 里复用：

- uses: ./.github/actions/setup-python-project
  with:
    python-version: "3.11"

你可以这样理解

workflow：整个流水线

action：流水线里可复用的小积木



---

12. 其他官方重点，怎么映射到这个 Python 示例？

这里是“教程总整理”的关键部分。

A. Example workflow

对应你最基础的 ci.yml 骨架：.github/workflows、on、jobs、steps。 

B. Build and test Python

对应 actions/setup-python、依赖安装、pytest、矩阵测试。 

C. GITHUB_TOKEN

对应自动创建 issue、调用 GitHub CLI / API、设置最小权限。 

D. Store and share data

对应 upload-artifact / download-artifact / needs。 

E. Containerized services

对应 PostgreSQL integration test。 

F. Create actions

对应自定义 composite action。 

G. Publishing packages

对应 release workflow 与 Python 包发布思路。 

H. Managing your work

对应定时 issue、自动标签、自动评论、关闭 inactive issue 等仓库运营自动化。 

I. Migrate to GitHub Actions

这类教程重点是：如果你原来用 Jenkins / Travis / GitLab CI / CircleCI，可以参考官方迁移指南逐项映射概念和语法。它属于“迁移工程”主题，不一定要塞进这个简单 Python demo 的代码里。 

J. Actions Runner Controller

这是更偏平台化、Kubernetes 化的 runner 管理能力，适合团队规模较大、需要弹性 runner 的场景，也不是入门 Python demo 必须实现的部分，但它确实是官方 tutorials 的一部分。 


---

13. 给 newbee 的一条学习顺序

别一上来全学完。推荐顺序是：

1. 先读懂 ci.yml


2. 再加 matrix


3. 再加 artifact


4. 再学 GITHUB_TOKEN


5. 再加定时 issue


6. 最后再碰 Postgres service、custom action、publish



这样你不会一开始就被 YAML 吓住。


---

14. 一句话总结

如果把 GitHub Actions 当成一个工厂：

workflow = 一条生产线

event trigger = 开工条件

job = 一个工位

step = 工位里的操作步骤

artifact = 半成品/成品

service container = 临时配套设备

GITHUB_TOKEN = 工厂操作权限

custom action = 标准化工序

publish = 成品出厂
