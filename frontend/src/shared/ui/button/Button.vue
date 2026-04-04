<template>
  <component
    :is="as"
    :class="buttonClass"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { cn } from '@/shared/lib/utils'
import { buttonVariants } from '@/shared/ui/button/button'

interface Props {
  as?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'primary',
  size: 'default',
})

const attrs = useAttrs()

const buttonClass = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), attrs.class))
</script>
