<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="text-center py-12 space-y-6">
      <h1 class="text-5xl font-extrabold tracking-tight text-white sm:text-6xl max-w-2xl mx-auto">
        Read the <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">Web</span>
        like<br />a Language Model
      </h1>
      <p class="text-lg text-gray-400 max-w-xl mx-auto">
        LRS (LLM Reading Stream) 是一个为 AI 时代设计的极简机器可读协议。摒弃 HTML 标签，返回纯粹的数据流，大幅降低 Token 消耗。
      </p>
      <div class="flex justify-center gap-4">
        <router-link to="/adapt"
          class="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold transition-colors">
          适配站点
        </router-link>
        <a href="#spec"
          class="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold transition-colors">
          阅读规范
        </a>
      </div>
    </section>

    <!-- Compare Section -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
      <!-- Traditional RSS/HTML -->
      <div class="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl shadow-red-900/10">
        <h3 class="text-red-400 font-bold mb-4 flex items-center justify-between">
          <span>HTML / RSS</span>
          <span class="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">20,000+ Tokens</span>
        </h3>
        <pre class="text-xs text-gray-500 overflow-hidden font-mono h-48 opacity-70">
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;style&gt;...&lt;/style&gt;
  &lt;script&gt;...&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div class="container wrapper main-content"&gt;
    &lt;h1 v-bind:class="{ active: isActive }"&gt;
      Hello World
    &lt;/h1&gt;
    &lt;p style="color: red; margin: 10px;"&gt;
      Welcome to my noisy blog...
    &lt;/p&gt;
    &lt;!-- 10,000 lines of junk --&gt;
  &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
        </pre>
      </div>

      <!-- LRS -->
      <div class="bg-gray-900 border border-green-900/50 p-6 rounded-lg shadow-xl shadow-green-900/20">
        <h3 class="text-green-400 font-bold mb-4 flex items-center justify-between">
          <span>LRS Markdown Stream</span>
          <span class="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">40 Tokens (99.8% saved)</span>
        </h3>
        <pre class="text-xs text-green-300 overflow-hidden font-mono h-48">
---
id: "post-hello"
title: "Hello World"
date: "2026-03-05"
url: "https://demo.com/hello"
---

# Hello World

Welcome to my pure markdown blog.
Ready for AI ingestion.
        </pre>
      </div>
    </section>

    <!-- Site Index Section -->
    <section class="pt-12">
      <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span class="w-2 h-6 bg-green-500 rounded-full block"></span> 站点索引 (Site Index)
      </h2>
      <div class="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl text-gray-300">
        <ul class="space-y-4">
          <li class="flex items-start gap-4">
            <a href="/lrs.md?slug=spec" target="_blank"
              class="text-green-400 hover:text-green-300 font-mono whitespace-nowrap shrink-0 hover:underline">/lrs.md?slug=spec</a>
            <span><strong class="text-white">LRS 协议技术规范 (SPEC.md)</strong> - 核心定义与参数说明。</span>
          </li>
          <li class="flex items-start gap-4">
            <a href="/lrs.md?slug=skill" target="_blank"
              class="text-green-400 hover:text-green-300 font-mono whitespace-nowrap shrink-0 hover:underline">/lrs.md?slug=skill</a>
            <span><strong class="text-white">Agent 技能描述 (SKILL.md)</strong> - 交互流程与预检指南（当前页面）。</span>
          </li>
          <li class="flex items-start gap-4">
            <a href="/lrs.md?slug=adapt" target="_blank"
              class="text-green-400 hover:text-green-300 font-mono whitespace-nowrap shrink-0 hover:underline">/lrs.md?slug=adapt</a>
            <span><strong class="text-white">开发适配指南 (ADAPT.md)</strong> - 提示词工具与接入代码参考。</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Spec Viewer Section -->
    <section id="spec" class="pt-12">
      <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span class="w-2 h-6 bg-green-500 rounded-full block"></span> 规范文档 (SPEC.md)
      </h2>
      <SpecReader fileUrl="/SPEC.md" />
    </section>
  </div>
</template>

<script setup>
import SpecReader from '../components/SpecReader.vue'
</script>
