export async function onRequest(context) {
    const { request, env } = context;
    const urlObj = new URL(request.url);
    const baseUrl = urlObj.origin;

    const countOnly = urlObj.searchParams.get('countOnly') === 'true';
    const limitStr = urlObj.searchParams.get('limit');
    const slug = urlObj.searchParams.get('slug');
    const all = urlObj.searchParams.get('all') === 'true';

    // Define our available articles for the demo
    const articles = [
        { slug: 'spec', file: '/SPEC.md', title: 'LRS Protocol Specification' },
        { slug: 'skill', file: '/SKILL.md', title: 'LRS Agent Skill' },
        { slug: 'adapt', file: '/ADAPT.md', title: 'LRS Adapt Guide' }
    ];

    // 从 Cloudflare Pages 的本地静态资产中提取文件
    const fetchLocalFile = async (filePath) => {
        // ASSETS 绑定允许访问项目构建输出（即 Vite build 后的 dist 目录文件）
        const assetUrl = new URL(filePath, request.url);
        const response = await env.ASSETS.fetch(assetUrl);
        if (!response.ok) return null;
        return await response.text();
    };

    // 1. 无参数 -> 直接返回 SKILL.md (根路径自描述)
    if (!countOnly && !limitStr && !slug && !all && !urlObj.searchParams.has('countOnly')) {
        const content = await fetchLocalFile('/SKILL.md');
        if (!content) {
            return new Response('Internal Server Error: SKILL.md not found in static assets', { status: 500 });
        }
        return new Response(content, {
            headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
        });
    }

    // 处理单篇文章：添加 YAML Frontmatter 和 补全绝对路径
    const processArticle = async (article) => {
        let rawContent = await fetchLocalFile(article.file);
        if (!rawContent) return null; // 如果文件没找到则忽略

        // 补全 Markdown 语法中的相对路径 `[...] (...)` 和 `![...] (...)`
        let content = rawContent.replace(/(!?\[[^\]]*\]\()([^\)]+)(\))/g, (match, p1, p2, p3) => {
            const url = p2.trim();
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
url: "${baseUrl}${article.file}"
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
        selectedArticles = articles.slice(0, limit);
    }

    const processedContents = [];
    for (const article of selectedArticles) {
        const content = await processArticle(article);
        if (content) {
            processedContents.push(content);
        }
    }

    // 计算字符统计（以处理后的 Markdown 为准）
    const totalChars = processedContents.reduce((sum, content) => sum + content.length, 0);

    // 2. 预检模式
    if (countOnly) {
        return new Response(JSON.stringify({
            protocol_version: "1.0",
            postCount: processedContents.length,
            totalChars: totalChars,
            supported_params: ["limit", "slug", "all", "countOnly"]
        }), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }

    if (processedContents.length === 0) {
        return new Response('Not Found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }

    // 返回 Markdown 数据流 (文章间使用 \n\n---\n\n 分隔)
    return new Response(processedContents.join('\n\n---\n\n'), {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
    });
}
