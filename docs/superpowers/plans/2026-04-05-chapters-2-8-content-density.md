# 第 2 到第 8 章内容密度提升 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把第 2 到第 8 章统一扩写成更像真实课程的内容密度，每章都达到至少 10 分钟左右的真实学习体感，并显著增加“代码例子驱动讲语法”的教学内容。

**Architecture:** 本轮不修改前后端结构，只在现有 JSON 内容模型上扩写章节详情，并用后端 API 测试锁定新的密度要求与关键教学方向。章节内容按统一模板扩容：更多 `sections`、更多代码例子、更多练习、更多复习项和更完整的测验闭环；文档同步更新为新的推荐密度标准。

**Tech Stack:** Flask、pytest、JSON 内容文件、Vue 前端消费现有 API、Vitest、Vite

---

## 文件结构

- 修改：`backend/content/chapters/variables-and-types.json`
  扩充第 2 章，增加更多变量赋值、类型辨认、代码逐行解释和练习。
- 修改：`backend/content/chapters/input-and-output.json`
  扩充第 3 章，增加输入输出、字符串拼接、类型转换和交互型例子。
- 修改：`backend/content/chapters/conditions.json`
  扩充第 4 章，增加多分支条件、条件阅读和缩进解释。
- 修改：`backend/content/chapters/loops.json`
  扩充第 5 章，增加 for/while 对照、停止条件和死循环示例。
- 修改：`backend/content/chapters/functions.json`
  扩充第 6 章，增加重复代码对照、参数、返回值和函数调用讲解。
- 修改：`backend/content/chapters/lists-and-dicts.json`
  扩充第 7 章，增加结构符号解释、索引、遍历、键值读取和场景区分。
- 修改：`backend/content/chapters/mini-project.json`
  扩充第 8 章，增加更清楚的项目拆解过程、阶段性代码例子和综合练习。
- 修改：`tests/backend/test_api.py`
  增加章节密度、关键代码例子和关键知识点的回归断言。
- 修改：`docs/content-model.md`
  更新内容模型文档中的推荐密度和代码例子驱动写法说明。

## Task 1: 先锁定第 2 到第 8 章的新密度要求

**Files:**
- Modify: `tests/backend/test_api.py`
- Modify: `docs/content-model.md`
- Test: `tests/backend/test_api.py`

- [ ] **Step 1: 先写失败的 API 断言**

```python
def test_chapters_two_to_eight_meet_new_density_baseline():
    app = create_app()
    client = app.test_client()

    chapter_slugs = [
        "variables-and-types",
        "input-and-output",
        "conditions",
        "loops",
        "functions",
        "lists-and-dicts",
        "mini-project",
    ]

    for slug in chapter_slugs:
        response = client.get(f"/api/course/chapters/{slug}")
        data = response.get_json()

        assert response.status_code == 200
        assert len(data["sections"]) >= 9
        assert len(data["practiceTasks"]) >= 3
        assert len(data["reviewChecklist"]) >= 4
        assert len(data["quiz"]) >= 7


def test_input_output_and_functions_chapters_include_code_driven_syntax_teaching():
    app = create_app()
    client = app.test_client()

    io_data = client.get("/api/course/chapters/input-and-output").get_json()
    fn_data = client.get("/api/course/chapters/functions").get_json()

    assert any(section["id"] == "io-example-convert" for section in io_data["sections"])
    assert any("input()" in (section.get("exampleCode") or "") for section in io_data["sections"])
    assert any(section["id"] == "functions-example-refactor" for section in fn_data["sections"])
    assert any("return" in (section.get("exampleCode") or "") for section in fn_data["sections"])
```

- [ ] **Step 2: 运行测试，确认它失败**

Run: `$env:PYTHONPATH='D:\\code\\python-learn\\backend'; backend\\.venv\\Scripts\\pytest.exe tests/backend/test_api.py -v`

Expected: FAIL，当前第 2 到第 8 章至少会有 `practiceTasks`、`reviewChecklist` 或 `sections` 数量不达标，且关键章节还没有新的代码驱动例子。

- [ ] **Step 3: 实现最小测试与文档更新**

```python
def assert_dense_chapter(data: dict) -> None:
    assert len(data["sections"]) >= 9
    assert len(data["practiceTasks"]) >= 3
    assert len(data["reviewChecklist"]) >= 4
    assert len(data["quiz"]) >= 7
```

```markdown
## 建议密度

- 第 1 章建议至少 8 个内容块、2 个练习、3 条复习项、6 道题
- 第 2 到第 8 章建议至少 9 到 12 个内容块、3 个练习、4 条复习项、7 到 8 道题
- 每章至少包含一个短代码例子，并尽量加入“逐行解释代码”的说明块
```

- [ ] **Step 4: 再跑一遍测试，确认仍然只有内容断言失败**

Run: `$env:PYTHONPATH='D:\\code\\python-learn\\backend'; backend\\.venv\\Scripts\\pytest.exe tests/backend/test_api.py -v`

Expected: FAIL，但失败点应集中在章节内容尚未扩写，而不是测试代码本身报错。

## Task 2: 扩写第 2 到第 4 章为代码例子驱动的基础模块

**Files:**
- Modify: `backend/content/chapters/variables-and-types.json`
- Modify: `backend/content/chapters/input-and-output.json`
- Modify: `backend/content/chapters/conditions.json`
- Test: `tests/backend/test_api.py`

- [ ] **Step 1: 先确认这三章当前结构不足**

Run: `Get-Content -Raw 'backend/content/chapters/variables-and-types.json'`
Run: `Get-Content -Raw 'backend/content/chapters/input-and-output.json'`
Run: `Get-Content -Raw 'backend/content/chapters/conditions.json'`

Expected: 可以看到每章练习和复习项仍偏少，代码例子数量也不足以支撑 10 分钟左右学习。

- [ ] **Step 2: 扩写第 2 章**

在 `backend/content/chapters/variables-and-types.json` 中至少加入：

```json
{
  "sections": [
    {
      "id": "variables-example-update",
      "type": "example",
      "title": "变量的值可以被更新",
      "content": "变量不是一次写死后就永远不变。你可以先保存一个值，后面再把它改成新的值。",
      "exampleTitle": "更新购物车数量",
      "exampleCode": "count = 1\ncount = 2\nprint(count)"
    },
    {
      "id": "variables-explanation-read-code",
      "type": "explanation",
      "title": "按行看这段变量代码在做什么",
      "content": "第一行先把 1 放进 count；第二行把旧值换成 2；第三行输出当前最新的值。变量名没变，但盒子里的内容已经更新了。"
    },
    {
      "id": "variables-example-string-number",
      "type": "example",
      "title": "同样看起来像数字，代码写法却不同",
      "content": "当值外面有引号时，程序会把它当成文字；没有引号时，才更像真正的数字。",
      "exampleTitle": "字符串数字 vs 整数",
      "exampleCode": "age_text = \"18\"\nage_number = 18\nprint(age_text)\nprint(age_number)"
    }
  ],
  "practiceTasks": [
    {
      "id": "variables-practice-3",
      "title": "按行解释变量更新",
      "prompt": "观察 `count = 1`、`count = 2`、`print(count)`，用自己的话说明每一行在做什么。",
      "hints": [
        "重点看第二行是不是重新给 count 放了一个新值。"
      ],
      "expectedOutcome": "能解释变量可以被重新赋值。"
    }
  ],
  "reviewChecklist": [
    {
      "id": "variables-review-4",
      "text": "我知道变量的值可以被后续代码更新。"
    }
  ]
}
```

- [ ] **Step 3: 扩写第 3 章**

在 `backend/content/chapters/input-and-output.json` 中至少加入：

```json
{
  "sections": [
    {
      "id": "io-example-convert",
      "type": "example",
      "title": "为什么输入后常常要先转换类型",
      "content": "当用户输入数量时，得到的通常还是字符串。如果你想拿它做乘法或加法，常常要先转换成数字。",
      "exampleTitle": "把输入数量转成整数",
      "exampleCode": "count_text = input(\"请输入购买数量：\")\ncount = int(count_text)\nprint(count * 2)"
    },
    {
      "id": "io-explanation-convert-lines",
      "type": "explanation",
      "title": "逐行读这段输入转换代码",
      "content": "第一行拿到的是用户输入的文字；第二行用 int() 把它变成更适合计算的整数；第三行才真正开始用这个数字做运算。"
    },
    {
      "id": "io-tip-read-syntax",
      "type": "tip",
      "title": "看到括号，不要急着害怕",
      "content": "像 input()、print()、int() 这样的写法，先把它们理解成“带名字的动作”，括号里装的是它们当前要处理的内容。"
    }
  ],
  "practiceTasks": [
    {
      "id": "io-practice-3",
      "title": "判断哪一行在做类型转换",
      "prompt": "看 `count_text = input(...)`、`count = int(count_text)`、`print(count * 2)`，指出哪一行把文字变成了数字。",
      "hints": [
        "重点找 `int(...)`。"
      ],
      "expectedOutcome": "能识别类型转换的那一行。"
    }
  ],
  "reviewChecklist": [
    {
      "id": "io-review-4",
      "text": "我知道 `int()` 常用于把输入得到的文字转换成整数。"
    }
  ]
}
```

- [ ] **Step 4: 扩写第 4 章**

在 `backend/content/chapters/conditions.json` 中至少加入：

```json
{
  "sections": [
    {
      "id": "conditions-example-read-branches",
      "type": "example",
      "title": "按条件变化读不同分支",
      "content": "读 if/elif/else 时，不要只看代码排在那里，还要结合当前变量值判断哪一段真的会执行。",
      "exampleTitle": "根据年龄给出提示",
      "exampleCode": "age = 16\nif age >= 18:\n    print(\"可以自己报名\")\nelse:\n    print(\"需要监护人协助\")"
    },
    {
      "id": "conditions-explanation-lines",
      "type": "explanation",
      "title": "逐行看 if 条件为什么会走到 else",
      "content": "第一行把 age 设为 16；第二行判断 16 是否大于等于 18，这个条件不成立；所以程序跳过 if 里的输出，转去执行 else 里的提示。"
    },
    {
      "id": "conditions-tip-operators",
      "type": "tip",
      "title": "比较运算符先读成一句人话",
      "content": "像 `>=` 可以先读成“大于等于”。先把条件读成人话，理解会容易很多。"
    }
  ],
  "practiceTasks": [
    {
      "id": "conditions-practice-3",
      "title": "先读条件，再判断会执行哪一行",
      "prompt": "假设 `age = 16`，看一段 if/else 代码时，先把条件读成人话，再说出程序最终会打印什么。",
      "hints": [
        "第一步不是看 print，而是先判断条件是真是假。"
      ],
      "expectedOutcome": "能按条件真假判断真正执行的分支。"
    }
  ],
  "reviewChecklist": [
    {
      "id": "conditions-review-4",
      "text": "我知道读条件代码时要先判断条件真假，再看执行结果。"
    }
  ]
}
```

- [ ] **Step 5: 跑一次 API 测试，看剩余失败是否只落在第 5 到第 8 章**

Run: `$env:PYTHONPATH='D:\\code\\python-learn\\backend'; backend\\.venv\\Scripts\\pytest.exe tests/backend/test_api.py -v`

Expected: 第 2 到第 4 章相关断言开始通过，剩余失败主要集中在未扩写的第 5 到第 8 章。

## Task 3: 扩写第 5 到第 6 章为“读循环 / 读函数”模块

**Files:**
- Modify: `backend/content/chapters/loops.json`
- Modify: `backend/content/chapters/functions.json`
- Test: `tests/backend/test_api.py`

- [ ] **Step 1: 先确认当前循环和函数章节的不足**

Run: `Get-Content -Raw 'backend/content/chapters/loops.json'`
Run: `Get-Content -Raw 'backend/content/chapters/functions.json'`

Expected: 能看到当前还缺少更细的“逐行读代码”讲解、第三个练习和第四条复习项。

- [ ] **Step 2: 扩写第 5 章**

在 `backend/content/chapters/loops.json` 中至少加入：

```json
{
  "sections": [
    {
      "id": "loops-example-read-for",
      "type": "example",
      "title": "逐行读一个最短的 for 循环",
      "content": "先不要急着写复杂循环，先学会看 `for` 是如何一轮一轮把动作重复起来的。",
      "exampleTitle": "三次问候",
      "exampleCode": "for number in range(3):\n    print(number)"
    },
    {
      "id": "loops-explanation-read-for",
      "type": "explanation",
      "title": "这段 for 循环到底会执行几次",
      "content": "range(3) 可以先理解成“准备 0、1、2 这三次机会”；每次循环都会把一个值放进 number，然后执行一次 print(number)。"
    },
    {
      "id": "loops-example-stop-while",
      "type": "example",
      "title": "while 为什么一定要有变化",
      "content": "如果循环里不更新条件相关的变量，程序就很可能停不下来。",
      "exampleTitle": "逐步接近停止条件",
      "exampleCode": "count = 0\nwhile count < 3:\n    print(count)\n    count = count + 1"
    }
  ],
  "practiceTasks": [
    {
      "id": "loops-practice-3",
      "title": "回答读循环三问",
      "prompt": "看一个简单循环后，回答：重复的是什么、会重复几次、什么时候停。",
      "hints": [
        "先找循环头，再看循环体里有没有变化。"
      ],
      "expectedOutcome": "能用自己的话解释循环执行过程。"
    }
  ],
  "reviewChecklist": [
    {
      "id": "loops-review-4",
      "text": "我会用“重复什么、重复几次、何时停下”去读循环。"
    }
  ]
}
```

- [ ] **Step 3: 扩写第 6 章**

在 `backend/content/chapters/functions.json` 中至少加入：

```json
{
  "sections": [
    {
      "id": "functions-example-refactor",
      "type": "example",
      "title": "把重复步骤改写成函数",
      "content": "当同样的打印逻辑要写很多次时，可以先看看不提函数是什么样，再看看提成函数后代码怎样更短。",
      "exampleTitle": "从重复输出到函数复用",
      "exampleCode": "def print_order_summary(name, total):\n    print(\"用户：\" + name)\n    print(\"总价：\", total)\n\nprint_order_summary(\"小王\", 36)"
    },
    {
      "id": "functions-explanation-read-def",
      "type": "explanation",
      "title": "逐行看 def、参数和调用",
      "content": "第一行用 def 定义函数名和参数；缩进里的两行是函数要执行的动作；最后一行不是定义，而是真正调用这个函数，并把具体值传进去。"
    },
    {
      "id": "functions-tip-return-meaning",
      "type": "tip",
      "title": "看到 return，先理解成“把结果交回去”",
      "content": "return 不一定神秘。你可以先把它理解成：函数内部已经算完了，现在把结果交给外面继续使用。"
    }
  ],
  "practiceTasks": [
    {
      "id": "functions-practice-3",
      "title": "找出定义和调用分别在哪",
      "prompt": "看一段最短函数例子时，指出哪一部分是在“定义函数”，哪一部分是在“调用函数”。",
      "hints": [
        "带 `def` 的地方通常在定义；单独写函数名加括号时通常是在调用。"
      ],
      "expectedOutcome": "能区分定义与调用。"
    }
  ],
  "reviewChecklist": [
    {
      "id": "functions-review-4",
      "text": "我知道函数定义和函数调用是两件不同的事。"
    }
  ]
}
```

- [ ] **Step 4: 跑一次 API 测试，看剩余失败是否只落在第 7 到第 8 章**

Run: `$env:PYTHONPATH='D:\\code\\python-learn\\backend'; backend\\.venv\\Scripts\\pytest.exe tests/backend/test_api.py -v`

Expected: 第 5 到第 6 章相关断言通过，剩余失败主要集中在第 7 到第 8 章。

## Task 4: 扩写第 7 到第 8 章为“数据结构 / 综合项目”模块并完成文档更新

**Files:**
- Modify: `backend/content/chapters/lists-and-dicts.json`
- Modify: `backend/content/chapters/mini-project.json`
- Modify: `docs/content-model.md`
- Test: `tests/backend/test_api.py`

- [ ] **Step 1: 先确认当前数据结构和项目章的不足**

Run: `Get-Content -Raw 'backend/content/chapters/lists-and-dicts.json'`
Run: `Get-Content -Raw 'backend/content/chapters/mini-project.json'`

Expected: 能看到这两章当前还缺少更多结构符号解释、更多代码驱动讲解，以及第三个练习和第四条复习项。

- [ ] **Step 2: 扩写第 7 章**

在 `backend/content/chapters/lists-and-dicts.json` 中至少加入：

```json
{
  "sections": [
    {
      "id": "collections-explanation-symbols",
      "type": "explanation",
      "title": "先把符号看熟：方括号、花括号、冒号、逗号",
      "content": "列表常见的是方括号；字典常见的是花括号和键值之间的冒号。零基础阶段先把它们看熟，读代码就不会总被符号卡住。"
    },
    {
      "id": "collections-example-list-loop",
      "type": "example",
      "title": "把列表和循环连起来看",
      "content": "当你有一组名字时，常常会用 for 循环一个一个处理它们。",
      "exampleTitle": "遍历学生名单",
      "exampleCode": "students = [\"小李\", \"小王\", \"小周\"]\nfor student in students:\n    print(student)"
    },
    {
      "id": "collections-example-dict-read",
      "type": "example",
      "title": "读字典时，重点看键和值的关系",
      "content": "字典不是按第几个取，而是按键去找对应值。",
      "exampleTitle": "读取商品价格",
      "exampleCode": "product = {\"name\": \"笔记本\", \"price\": 12}\nprint(product[\"price\"])"
    }
  ],
  "practiceTasks": [
    {
      "id": "collections-practice-3",
      "title": "看代码判断这是列表还是字典",
      "prompt": "观察带方括号和带花括号的两段短代码，分别判断它们更像列表还是字典，并说明依据。",
      "hints": [
        "重点看有没有键和值的对应关系。"
      ],
      "expectedOutcome": "能根据代码形状判断列表和字典。"
    }
  ],
  "reviewChecklist": [
    {
      "id": "collections-review-4",
      "text": "我能通过代码里的符号形状初步判断是列表还是字典。"
    }
  ]
}
```

- [ ] **Step 3: 扩写第 8 章并更新文档**

在 `backend/content/chapters/mini-project.json` 中至少加入：

```json
{
  "sections": [
    {
      "id": "project-explanation-stages",
      "type": "explanation",
      "title": "把一个小程序拆成 4 个阶段",
      "content": "你可以把入门项目先拆成：准备数据、接收输入、做判断或计算、输出结果。分阶段理解，会比把整段代码一次吞下去容易很多。"
    },
    {
      "id": "project-example-stage-read",
      "type": "example",
      "title": "逐段读综合小程序",
      "content": "看综合代码时，不要一行一行孤立地看，而要先问每一段在负责什么。",
      "exampleTitle": "输入、计算、判断、输出",
      "exampleCode": "price = 12\ncount = int(input(\"请输入购买数量：\"))\ntotal = price * count\nif total >= 50:\n    print(\"总价：\", total)\n    print(\"可免配送费\")\nelse:\n    print(\"总价：\", total)"
    },
    {
      "id": "project-tip-build-order",
      "type": "tip",
      "title": "先让主流程跑通，再慢慢补细节",
      "content": "项目实践里，先做最小可运行版本最重要。不要一开始就加太多额外功能，否则很容易在半路卡住。"
    }
  ],
  "practiceTasks": [
    {
      "id": "project-practice-3",
      "title": "把综合代码按阶段分段",
      "prompt": "面对一段综合小程序代码时，试着把它分成“输入”“计算”“判断”“输出”几段，并说出每段作用。",
      "hints": [
        "不要先纠结每个符号，先看这一段整体想做什么。"
      ],
      "expectedOutcome": "能按功能阶段阅读综合代码。"
    }
  ],
  "reviewChecklist": [
    {
      "id": "project-review-4",
      "text": "我知道看综合代码时可以先按功能阶段拆开理解。"
    }
  ]
}
```

同时在 `docs/content-model.md` 中更新：

```markdown
- 第 2 到第 8 章建议至少提供 3 个练习任务和 7 到 8 道测验题
- 推荐在每章加入多个短代码例子，并至少有一个“逐行解释代码”的内容块
```

- [ ] **Step 4: 跑完整后端验证**

Run: `$env:PYTHONPATH='D:\\code\\python-learn\\backend'; backend\\.venv\\Scripts\\pytest.exe tests/backend -v`

Expected: PASS，所有 API 和 schema 测试通过。

## Task 5: 运行前端回归并完成全量验证

**Files:**
- Modify: `tests/backend/test_api.py`
- Test: `tests/backend/test_api.py`
- Test: `frontend test/build`

- [ ] **Step 1: 跑前端测试**

Run: `pnpm --dir frontend test`

Expected: PASS，前端现有测试不应因纯内容扩写而回归。

- [ ] **Step 2: 跑前端构建**

Run: `pnpm --dir frontend build`

Expected: PASS，前端构建继续通过。

- [ ] **Step 3: 提交本轮内容扩写**

```bash
git add backend/content/chapters/variables-and-types.json backend/content/chapters/input-and-output.json backend/content/chapters/conditions.json backend/content/chapters/loops.json backend/content/chapters/functions.json backend/content/chapters/lists-and-dicts.json backend/content/chapters/mini-project.json tests/backend/test_api.py docs/content-model.md
git commit -m "feat: expand chapters two to eight lesson density"
```

## 自检

### Spec coverage

- 第 2 到第 8 章整体扩写：Task 2、Task 3、Task 4 覆盖。
- 统一教学模板：Task 2 到 Task 4 都按同一结构补充内容。
- 增加更多代码例子：Task 2 到 Task 4 覆盖。
- 用代码讲语法：Task 2 到 Task 4 的新增 `example` + `explanation` 块覆盖。
- 测试与文档更新：Task 1、Task 4、Task 5 覆盖。

### Placeholder scan

- 没有 `TODO`、`TBD` 或“之后补上”的占位词。
- 每个任务都写明了文件、命令、预期结果和至少一段实际内容骨架。

### Type consistency

- 全程沿用现有字段：`sections`、`practiceTasks`、`reviewChecklist`、`quiz`。
- 没有引入新的 section type 或新的 JSON 顶层字段。
