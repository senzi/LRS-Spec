import fs from 'fs';
import path from 'path';

export default function lrsPlugin() {
    const lrsMiddleware = async (req, res, next) => {
        // Only intercept /lrs.md requests
        if (!req.url.startsWith('/lrs.md')) {
            return next();
        }

        // fallback to localhost if host header is missing
        const host = req.headers.host || 'localhost:5173';
        // try to determine protocol, usually http for local dev
        const protocol = (req.headers['x-forwarded-proto'] || 'http').split(',')[0];
        const baseUrl = `${protocol}://${host}`;
        const urlObj = new URL(req.url, baseUrl);

        const countOnly = urlObj.searchParams.get('countOnly') === 'true';
        const limitStr = urlObj.searchParams.get('limit');
        const slug = urlObj.searchParams.get('slug');
        const all = urlObj.searchParams.get('all') === 'true';

        const publicDir = path.resolve(process.cwd(), 'public');

        // Define our available articles for the demo
        const articles = [
            { slug: 'spec', file: 'SPEC.md', title: 'LRS Protocol Specification' },
            { slug: 'skill', file: 'SKILL.md', title: 'LRS Agent Skill' },
            { slug: 'adapt', file: 'ADAPT.md', title: 'LRS Adapt Guide' }
        ];

        // 1. 无参数 -> 直接返回 SKILL.md (根路径自描述)
        if (!countOnly && !limitStr && !slug && !all && !urlObj.searchParams.has('countOnly')) {
            try {
                const content = fs.readFileSync(path.join(publicDir, 'SKILL.md'), 'utf-8');
                res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
                return res.end(content);
            } catch (e) {
                res.statusCode = 500;
                return res.end('Internal Server Error: SKILL.md not found');
            }
        }

        // 处理单篇文章：添加 YAML Frontmatter 和 补全绝对路径
        const processArticle = (article) => {
            let rawContent = '';
            try {
                rawContent = fs.readFileSync(path.join(publicDir, article.file), 'utf-8');
            } catch (e) {
                return null; // Ignore if file missing
            }

            // 补全 Markdown 语法中的相对路径 `[...] (...)` 和 `![...] (...)`
            let content = rawContent.replace(/(!?\[[^\]]*\]\()([^\)]+)(\))/g, (match, p1, p2, p3) => {
                const url = p2.trim();
                // 忽略已经是绝对路径或特殊协议的 URL
                if (/^(http:|https:|data:|mailto:|tel:|#)/i.test(url)) return match;
                try {
                    return p1 + new URL(url, baseUrl).href + p3;
                } catch (e) {
                    return match;
                }
            });

            // 补全 HTML 语法中的相对路径 `src="..."` 和 `href="..."`
            content = content.replace(/(src|href)=["']([^"']+)["']/gi, (match, attr, url) => {
                if (/^(http:|https:|data:|mailto:|tel:|#)/i.test(url)) return match;
                try {
                    return `${attr}="${new URL(url, baseUrl).href}"`;
                } catch (e) {
                    return match;
                }
            });

            // 生成 YAML Frontmatter
            const frontmatter = `---
id: "${article.slug}"
title: "${article.title}"
url: "${baseUrl}/${article.file}"
---
`;
            return frontmatter + content;
        };

        let selectedArticles = [];

        // 3. 单篇模式
        if (slug) {
            const article = articles.find(a => a.slug === slug);
            if (article) {
                selectedArticles = [article];
            }
        }
        // 4. 列表模式 / 全量模式
        else {
            let limit = articles.length; // 默认返回全部
            if (limitStr) {
                limit = parseInt(limitStr, 10);
                if (isNaN(limit) || limit < 0) limit = articles.length;
            }
            // The most recent N articles. We assume the defined array is chronological.
            selectedArticles = articles.slice(0, limit);
        }

        const processedContents = selectedArticles
            .map(processArticle)
            .filter(Boolean); // remove any failed readings

        // 计算字符统计（以处理后的 Markdown 为准）
        const totalChars = processedContents.reduce((sum, content) => sum + content.length, 0);

        // 2. 预检模式
        if (countOnly) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.end(JSON.stringify({
                protocol_version: "1.0",
                postCount: processedContents.length,
                totalChars: totalChars,
                supported_params: ["limit", "slug", "all", "countOnly"]
            }));
        }

        if (processedContents.length === 0) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.end('Not Found');
        }

        // 返回 Markdown 数据流 (文章间使用 \n\n---\n\n 分隔)
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        return res.end(processedContents.join('\n\n---\n\n'));
    };

    return {
        name: 'vite-plugin-lrs',
        configureServer(server) {
            server.middlewares.use(lrsMiddleware);
        },
        configurePreviewServer(server) {
            server.middlewares.use(lrsMiddleware);
        }
    };
}
