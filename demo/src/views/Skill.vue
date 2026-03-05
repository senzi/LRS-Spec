<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-white flex items-center gap-3">
        <span class="w-2 h-8 bg-green-500 rounded-full block"></span>
        Agent 技能预览 (Skill)
      </h1>
      <p class="text-gray-400">展示如何指导 AI Agent 或大语言模型更聪明地爬取网站日志。</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">Agent 技能卡片</h2>
        </div>
        <p class="text-sm text-gray-500">将此 Prompt 提供给你的自定义 GPTs / Agent 系统提示词。</p>
        <SpecReader fileUrl="/SKILL.md" class="!max-h-[500px]" />
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-bold text-white">终端调用模拟</h2>
        <p class="text-sm text-gray-500">模拟 Agent 发现 LRS 后的行为</p>
        <LiveTerminal :commands="mockCommands" class="h-[500px]" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SpecReader from '../components/SpecReader.vue'
import LiveTerminal from '../components/LiveTerminal.vue'

const mockCommands = ref([
  { type: 'system', text: '[AGENT] Checking LRS endpoint support...', delay: 500 },
  { type: 'input', text: 'curl "https://blog.me.com/lrs.md?countOnly=true"', delay: 800 },
  { type: 'output', text: '{\n  "protocol_version": "1.0",\n  "postCount": 42,\n  "totalChars": 15600,\n  "supported_params": ["limit", "slug", "all", "countOnly"]\n}' },
  { type: 'system', text: '[AGENT] Context window safe (15.6k chars). Fetching recent 2 posts...', delay: 1000 },
  { type: 'input', text: 'curl "https://blog.me.com/lrs.md?limit=2"', delay: 800 },
  { type: 'output', text: '\n---\nid: "post-1"\ntitle: "为什么 LRS 是未来"\nurl: "https://blog.me.com/p/1"\n---\n\nAI 需要干净的数据，而不是 divs。LRS 提供了纯正的 Markdown...' },
  { type: 'output', text: '\n\n---\nid: "post-2"\ntitle: "Vue 3 组合式 API"\nurl: "https://blog.me.com/p/2"\n---\n\nVue 3 composition API 很好重构逻辑...' },
  { type: 'system', text: '\n[AGENT] Successfully ingested 2 posts. Tokens used: 168 (Saved ~90% vs HTML)', delay: 500 }
])
</script>
