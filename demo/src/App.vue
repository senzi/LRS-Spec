<template>
  <div class="min-h-screen bg-[#121212] flex flex-col items-center selection:bg-lrs-green selection:text-black">
    <header class="w-full max-w-5xl flex flex-wrap gap-4 items-center justify-between p-6 border-b border-gray-800">
      <div class="flex items-center gap-2 text-xl font-bold tracking-wider text-[#00ff00]">
        <span class="text-white">LRS</span> // SPEC
      </div>
      <nav class="flex flex-wrap gap-6 text-sm font-mono">
        <router-link to="/" class="text-gray-400 hover:text-[#00ff00] transition-colors"
          active-class="!text-[#00ff00] font-bold">首页 (Home)</router-link>
        <router-link to="/adapt" class="text-gray-400 hover:text-[#00ff00] transition-colors"
          active-class="!text-[#00ff00] font-bold">适配助手 (Adapt)</router-link>
        <router-link to="/skill" class="text-gray-400 hover:text-[#00ff00] transition-colors"
          active-class="!text-[#00ff00] font-bold">技能 (Skill)</router-link>
      </nav>
    </header>
    <main class="w-full max-w-5xl flex-1 p-6">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="w-full max-w-5xl p-6 text-center text-gray-500 text-xs font-mono border-t border-gray-800">
      <p>LRS (LLM Reading Stream) Interactive Demo Site - Built with Vite + Vue + TailwindCSS</p>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
