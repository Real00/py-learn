<template>
  <div
    role="radiogroup"
    :class="cn('space-y-3', props.class)"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="flex cursor-pointer items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-foreground)] transition-colors hover:border-[color:var(--color-primary)]"
      :class="
        modelValue === option.value
          ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white shadow-[0_10px_24px_rgba(13,124,255,0.22)] [&_span]:text-white'
          : ''
      "
    >
      <input
        class="h-4 w-4 accent-[color:var(--color-primary)]"
        type="radio"
        :name="name"
        :value="option.value"
        :checked="modelValue === option.value"
        @change="emit('update:modelValue', option.value)"
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/shared/lib/utils'

interface RadioOption {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options: RadioOption[]
    name?: string
    class?: string
  }>(),
  {
    modelValue: '',
    name: undefined,
    class: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
