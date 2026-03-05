<template>
  <div class="bg-gray-900 border border-gray-800 rounded-lg p-6 overflow-auto max-h-[600px] shadow-lg">
    <div v-if="loading" class="text-gray-500 animate-pulse font-mono">加载规格文档中...</div>
    <div v-else-if="error" class="text-red-400 font-mono">{{ error }}</div>
    <div v-else class="markdown-body prose prose-invert prose-green max-w-none text-gray-300" v-html="htmlContent"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  fileUrl: {
    type: String,
    required: true
  }
})

const loading = ref(true)
const error = ref(null)
const htmlContent = ref('')

onMounted(async () => {
  try {
    const res = await fetch(props.fileUrl)
    if (!res.ok) throw new Error('无法加载文件: ' + res.status)
    const text = await res.text()
    htmlContent.value = marked.parse(text)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style>
.markdown-body h1, .markdown-body h2, .markdown-body h3 {
  color: #fff;
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.markdown-body p {
  margin-bottom: 1rem;
  line-height: 1.6;
}
.markdown-body code {
  background: #1f2937;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  color: #00ff00;
  font-family: monospace;
}
.markdown-body pre {
  background: #111827;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  border: 1px solid #374151;
}
.markdown-body ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
</style>
