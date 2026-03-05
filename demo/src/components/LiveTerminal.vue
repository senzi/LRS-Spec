<template>
  <div
    class="bg-black border flex flex-col border-gray-800 rounded-lg overflow-hidden font-mono shadow-[0_0_15px_rgba(0,255,0,0.1)]">
    <div class="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
      <div class="w-3 h-3 rounded-full bg-red-500"></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div class="w-3 h-3 rounded-full bg-green-500"></div>
      <span class="ml-2 text-xs text-gray-400">agent_terminal_hax_0.9</span>
    </div>
    <div class="p-4 text-sm text-green-400 overflow-y-auto flex-1 scrollbar-hide" ref="consoleEl">
      <div v-for="(line, idx) in logs" :key="idx" class="mb-1"
        :class="line.type === 'error' ? 'text-red-400' : line.type === 'system' ? 'text-gray-400' : 'text-green-400'">
        <span v-if="line.prefix" class="mr-2 select-none" :class="line.prefixClass">{{ line.prefix }}</span>
        <span class="whitespace-pre-wrap">{{ line.text }}</span>
      </div>
      <div v-if="isTyping" class="animate-pulse inline-block w-2 h-4 bg-green-400 align-middle"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  commands: {
    type: Array,
    default: () => []
  }
})

const logs = ref([
  { type: 'system', text: 'Initializing Agent Sandbox Environment...' },
  { type: 'system', text: 'Connected to LRS Node.' }
])

const isTyping = ref(false)
const consoleEl = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (consoleEl.value) {
      consoleEl.value.scrollTop = consoleEl.value.scrollHeight
    }
  })
}

const simulate = async () => {
  if (!props.commands || props.commands.length === 0) return

  for (const cmd of props.commands) {
    if (cmd.delay) await new Promise(r => setTimeout(r, cmd.delay))

    if (cmd.type === 'input') {
      isTyping.value = true
      let currentText = ''
      const logLineIndex = logs.value.push({ type: 'input', prefix: 'agent@lrs:~$', prefixClass: 'text-blue-400', text: '' }) - 1

      for (let i = 0; i < cmd.text.length; i++) {
        await new Promise(r => setTimeout(r, 20 + Math.random() * 30))
        currentText += cmd.text[i]
        logs.value[logLineIndex].text = currentText
        scrollToBottom()
      }
      isTyping.value = false
    } else {
      logs.value.push({ type: cmd.type || 'output', text: cmd.text })
      scrollToBottom()
    }
  }
}

onMounted(() => {
  setTimeout(simulate, 800)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
