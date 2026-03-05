# LRS (LLM Reading Stream) Specification v1.0

## 1. Introduction
LRS is a protocol designed to bridge the gap between static web content and LLM context windows. It provides a machine-optimized, sliceable, and self-describing stream of Markdown.

## 2. Endpoint Requirement
A compliant LRS site MUST expose the endpoint at `/lrs.md`.

## 3. Query Parameters
- `limit=[int]`: Optional. Returns the last N records.
- `year=[YYYY]`: Optional. Filters records by year.
- `month=[MM]`: Optional. Filters records by month (requires `year`).
- `countOnly=true`: Optional. MUST return a JSON object with:
  - `postCount`: Number of items.
  - `totalChars`: Total character count.
  - `advice`: Guidance for the LLM (e.g., "Too large, please filter").

## 4. Response Format
### 4.1 Self-Description Mode (No Params)
If no parameters are provided, the server MUST return the content of `SKILL.md`.

### 4.2 Data Stream Mode (With Params)
The response MUST be `text/markdown`. Each item is separated by `---`.
Each item MUST contain YAML frontmatter:
---
id: [unique-slug]
title: [string]
date: [ISO-8601]
url: [absolute-url]
---
[Markdown Content]