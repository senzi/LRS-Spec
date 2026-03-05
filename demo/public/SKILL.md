# SKILL.md (LRS Agent 技能描述)

**文件用途**：当 Agent **无参数**访问 `lrs.closeai.moe/lrs.md` 时返回。该文档定义了与本站 LRS 接口交互的标准流程与参数规范。

---

# Skill: LRS_Content_Retriever

## 1. 核心定义 (Core Definition)

本站点支持 **LRS (LLM Reading Stream)** 协议。所有内容均以纯净 Markdown 格式输出，并附带 YAML 元数据，旨在为 LLM 提供结构化的上下文支持。

## 2. 交互流程 (Interaction Workflow)

Agent 在访问本站内容时，建议遵循以下标准流程：

1. **预检 (Pre-flight)**：调用 `?countOnly=true` 获取当前范围内的统计信息。
2. **评估 (Assessment)**：解析返回的 JSON，根据 `totalChars` 评估是否会超出当前的上下文窗口（Context Window）。
3. **获取 (Fetching)**：
* **批量获取**：使用 `?limit=N` 获取最近的文章列表及摘要。
* **精确获取**：根据列表中的 `slug` 或 `id`，使用 `?slug=[id]` 获取指定页面的全文 Markdown。



## 3. 请求参数 (Query Parameters)

| 参数名 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `countOnly` | Boolean | **预检模式**。返回统计 JSON，不返回正文。 | `?countOnly=true` |
| `limit` | Integer | **列表模式**。返回最近的 N 条记录（含 Frontmatter）。 | `?limit=5` |
| `slug` | String | **单篇模式**。通过唯一 ID 获取指定页面的全文内容。 | `?slug=about` |
| `all` | Boolean | **全量模式**。返回当前接口下的所有页面内容。 | `?all=true` |

## 4. 预检接口响应结构 (JSON Schema)

当请求包含 `countOnly=true` 时，服务端返回以下格式的 JSON：

```json
{
  "protocol_version": "1.0",
  "postCount": 42,         // 当前筛选条件下的文章总数
  "totalChars": 15600,     // 当前筛选条件下的总字符数 (Markdown Body)
  "supported_params": [    // 本站支持的参数列表
    "limit",
    "slug",
    "all",
    "countOnly"
  ]
}

```

## 5. 数据格式规范 (Data Format)

* **分隔符**：多篇文章之间使用 `\n\n---\n\n` 分隔。
* **元数据**：每篇开头均包含 YAML Frontmatter（含 `id`, `title`, `url`）。
* **链接处理**：正文中所有图片和超链接均已转换为**绝对路径 URL**。

## 6. 接口地址 (Base URL)

`https://lrs.closeai.moe/lrs.md`

## 7. 站点索引 (Site Index)

- `/lrs.md?slug=spec` : **LRS 协议技术规范 (SPEC.md)** - 核心定义与参数说明。
- `/lrs.md?slug=skill` : **Agent 技能描述 (SKILL.md)** - 交互流程与预检指南（当前页面）。
- `/lrs.md?slug=adapt` : **开发适配指南 (ADAPT.md)** - 提示词工具与接入代码参考。
