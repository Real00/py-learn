<template>
  <nav class="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-4">
    <div class="surface-blur grid grid-cols-3 gap-2 rounded-full border border-white/60 bg-white/85 p-2 shadow-[var(--shadow-soft)]">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex min-h-12 flex-col items-center justify-center rounded-full text-xs font-semibold transition-colors duration-200"
        :class="route.path === item.to ? 'bg-[color:var(--color-primary)] text-white' : 'text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-secondary)]'"
        :aria-current="route.path === item.to ? 'page' : undefined"
      >
        <component :is="item.icon" class="mb-1 h-4 w-4" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { BookOpen, House, Trophy } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const items = [
  { to: '/', label: '首页', icon: House },
  { to: '/course', label: '课程', icon: BookOpen },
  { to: '/progress', label: '进度', icon: Trophy },
]
</script>
