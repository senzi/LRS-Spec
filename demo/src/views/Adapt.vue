<template>
  <div class="space-y-8 max-w-3xl mx-auto">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-white flex items-center gap-3">
        <span class="w-2 h-8 bg-green-500 rounded-full block"></span>
        适配助手 (Adaptation Helper)
      </h1>
      <p class="text-gray-400">一键生成适配 LRS 规范的通用 AI Prompt。</p>
    </div>

    <div class="space-y-2">
      <h2 class="text-xl font-bold text-white">通用 Prompt</h2>
      <p class="text-sm text-gray-500">将以下 prompt 复制发送给在用的 AI Agents，让它帮你改代码。</p>

      <div v-if="loading" class="text-gray-500 animate-pulse font-mono py-4">加载中...</div>
      <div v-else-if="error" class="text-red-400 font-mono py-4">{{ error }}</div>
      <PromptCard v-else :content="promptContent" title="AI Prompt: Adapt to LRS" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PromptCard from '../components/PromptCard.vue'

const promptContent = ref('')
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch('/ADAPT.md')
    if (!res.ok) throw new Error('Failed to load file: ' + res.status)
    promptContent.value = await res.text()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
