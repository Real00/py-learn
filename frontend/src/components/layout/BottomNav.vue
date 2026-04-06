<template>
  <nav class="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-4">
    <div
      class="surface-blur grid grid-cols-3 gap-2 rounded-[28px] border border-[color:var(--color-border-strong)] bg-white/92 p-2 shadow-[0_18px_42px_rgba(31,47,67,0.16)] ring-1 ring-[rgba(255,255,255,0.78)]"
    >
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex min-h-12 flex-col items-center justify-center rounded-[22px] border text-xs font-semibold transition-colors duration-200"
        :class="
          isActive(item.to)
            ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white shadow-[0_10px_24px_rgba(13,124,255,0.28)] [&_span]:text-white [&_svg]:text-white'
            : 'border-transparent text-[color:var(--color-muted-foreground)] hover:border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)]'
        "
        :aria-current="isActive(item.to) ? 'page' : undefined"
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

function isActive(to: string) {
  if (to === '/') {
    return route.name === 'home'
  }

  if (to === '/course') {
    return route.name === 'course' || route.name === 'chapter' || route.name === 'review'
  }

  if (to === '/progress') {
    return route.name === 'progress'
  }

  return route.path === to
}
</script>
