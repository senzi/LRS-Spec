<template>
  <div class="relative group mt-4">
    <div
      class="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200">
    </div>
    <div class="relative bg-black border border-gray-800 rounded-lg overflow-hidden">
      <div class="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div class="text-xs text-gray-400 font-mono">{{ title }}</div>
        <button @click="copyPrompt"
          class="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-green-400 transition-colors">
          {{ copied ? '已复制 (Copied!)' : '复制 (Copy)' }}
        </button>
      </div>
      <pre
        class="p-4 text-sm text-gray-300 font-mono overflow-auto whitespace-pre-wrap max-h-96"><code>{{ content }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'AI Prompt'
  },
  content: {
    type: String,
    required: true
  }
})

const copied = ref(false)

const copyPrompt = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.content)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = props.content
      textArea.style.position = "absolute"
      textArea.style.left = "-999999px"
      document.body.prepend(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (error) {
        console.error('Fallback copy failed', error)
      } finally {
        textArea.remove()
      }
    }
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}
</script>
