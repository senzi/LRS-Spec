# LRS (LLM Reading Stream) Specification v1.0

## 1. 概述 (Overview)

**LRS** 是一种基于 HTTP 的内容联合协议，旨在为大语言模型（LLM）提供机器原生的、可切片的、自描述的结构化 Markdown 数据流。

* **目标**：降低 Token 消耗，解决上下文窗口限制，提高 AI 总结与推理的准确性。
* **核心格式**：Markdown + YAML Frontmatter。

---

## 2. 入口规范 (Endpoint)

支持 LRS 的站点 **必须** 提供一个统一的入口路径：

* **标准路径**：`/lrs.md`
* **响应头**：`Content-Type: text/markdown; charset=utf-8`

---

## 3. 请求参数 (Query Parameters)

服务端 **必须** 支持以下参数及其组合逻辑。多个参数使用 `&` 连接。

| 参数名 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `limit` | Integer | 返回最近的 N 条记录。 | `?limit=5` |
| `year` | YYYY | 过滤特定年份的内容。 | `?year=2025` |
| `month` | MM | 过滤特定月份（通常配合 `year` 使用）。 | `?year=2025&month=12` |
| `slug` | String | 精确匹配。通过唯一 ID/Slug 请求单篇内容。 | `?slug=post-id` |
| `countOnly` | Boolean | **预检模式**。不返回正文，仅返回统计 JSON。 | `?countOnly=true` |
| `all` | Boolean | 全量模式。返回过滤条件下的全部数据。 | `?all=true` |

**组合逻辑：**

1. **交集过滤**：多个参数之间为 `AND` 关系（如 `?year=2025&limit=3`）。
2. **优先级**：`countOnly=true` 具有最高优先级，存在时服务端禁止渲染正文。

---

## 4. 响应逻辑 (Response Logic)

### 4.1 自描述模式 (Self-Describing Mode)

当 **无参数** 访问 `/lrs.md` 时，服务端应返回该站点的 **能力说明书**（`SKILL.md` 的内容）。

### 4.2 统计模式 (Metadata Mode)

当携带 `countOnly=true` 时，返回 JSON 格式：

```json
{
  "protocol_version": "1.0",
  "postCount": 12,
  "totalChars": 24500,
  "advice": "Context window safe. Suggest fetching all."
}

```

### 4.3 内容流模式 (Stream Mode)

当携带有效查询参数（非 `countOnly`）时，返回 Markdown 片段流：

1. **分隔符**：文章间必须使用 `\n\n---\n\n` 分隔。
2. **元数据**：每篇开头必须包含 YAML Frontmatter。
3. **URL 补全**：正文中的相对路径（图片、链接）必须转换为 **绝对 URL**。

---

## 5. 数据结构样板 (Data Structure)

```markdown
---
id: "post-slug-001"
title: "关于 AGI 的思考"
date: "2026-03-04T12:00:00Z"
url: "https://example.com/posts/agi-thoughts"
tags: ["AI", "Philosophical"]
---

这里是文章的 Markdown 正文内容。包含绝对路径图片 ![Alt](https://example.com/img.png) 
和链接 [查看更多](https://example.com/more)。

---

---
id: "post-slug-002"
...

```

---

## 6. 错误处理 (Error Handling)

* **400 Bad Request**：参数格式非法（如 `month=13`）。
* **404 Not Found**：请求的资源（Slug 或时间切片）不存在。
* **500 Internal Error**：服务端解析或渲染失败。

---

## 7. 扩展建议 (Extensibility)

开发者可自定义非标准参数，建议使用 `ext-` 前缀：

* `?ext-tag=tech`: 过滤标签。
* `?ext-category=news`: 过滤分类。

---