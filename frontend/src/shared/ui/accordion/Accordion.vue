<template>
  <div class="divide-y divide-[color:var(--color-border)] overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-white">
    <details
      v-for="item in items"
      :key="item.value"
      class="group"
      :open="item.value === defaultValue"
    >
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-medium text-[color:var(--color-foreground)]">
        <span>{{ item.title }}</span>
        <span class="text-[color:var(--color-muted-foreground)] transition-transform group-open:rotate-45">+</span>
      </summary>
      <div class="px-4 pb-4 text-sm leading-6 text-[color:var(--color-muted-foreground)]">
        {{ item.content }}
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
interface AccordionItem {
  value: string
  title: string
  content: string
}

withDefaults(
  defineProps<{
    items: AccordionItem[]
    defaultValue?: string
  }>(),
  {
    defaultValue: '',
  },
)
</script>
