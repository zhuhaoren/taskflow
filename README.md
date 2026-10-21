# TaskFlow · 轻量任务清单

软件工程课程实验项目：以一个小型前后端分离的静态 Web 应用为载体，实践 Git 版本管理、分支管理与 GitHub 协作开发流程。

## 功能

- 任务录入与列表展示
- 任务完成状态切换
- 任务筛选（全部 / 进行中 / 已完成）
- 完成率统计
- 数据本地持久化（localStorage）

## 目录结构

```
taskflow/
├── index.html            # 页面结构
├── assets/
│   ├── css/style.css     # 样式
│   └── js/app.js         # 业务逻辑
├── docs/
│   └── CONTRIBUTING.md   # 协作规范
├── .gitignore
└── README.md
```

## 本地运行

项目为纯静态页面，无需构建。直接双击 `index.html`，或用任意静态服务器打开：

```bash
python -m http.server 8080
# 浏览器访问 http://localhost:8080
```

## 版本约定

采用语义化版本号 `MAJOR.MINOR.PATCH`，每个迭代结束打一次标签，例如 `v1.0.0`。

## 分支约定

| 分支 | 用途 |
| --- | --- |
| `main` | 可发布的主干，只接受通过 Pull Request 合入的代码 |
| `feature/*` | 功能开发分支，从 `main` 切出，完成后提 PR |
| `hotfix/*` | 线上缺陷修复分支，修复后尽快合回 `main` |
