<template>
  <CardSurface class="p-5">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">
          {{ typeLabel }}
        </p>
        <h3 class="mt-2 text-base font-semibold text-[color:var(--color-foreground)]">
          {{ question.prompt }}
        </h3>
      </div>
      <PillBadge>{{ question.knowledgePoint }}</PillBadge>
    </div>

    <div v-if="question.type === 'fill_blank'">
      <label class="block text-sm text-[color:var(--color-secondary-foreground)]" :for="question.id">
        请直接写出你认为正确的答案
      </label>
      <Input
        :id="question.id"
        :value="String(modelValue ?? '')"
        class="mt-3"
        @input="onInput(($event.target as HTMLInputElement).value)"
      />
    </div>

    <fieldset v-else class="space-y-3" :aria-labelledby="`${question.id}-legend`">
      <legend :id="`${question.id}-legend`" class="sr-only">
        {{ question.prompt }}
      </legend>
      <RadioGroup
        :model-value="String(modelValue ?? '')"
        :name="question.id"
        :options="normalizedOptions"
        @update:model-value="onInput"
      />
    </fieldset>

    <div v-if="showResult" class="mt-4 rounded-[20px] px-4 py-3 text-sm leading-6" :class="isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'">
      <p class="font-semibold">{{ isCorrect ? '答对了' : '再看一下' }}</p>
      <p class="mt-1">{{ question.explanation }}</p>
    </div>
  </CardSurface>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { QuizQuestion } from '@/entities/content/model/types'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import Input from '@/shared/ui/input/Input.vue'
import RadioGroup from '@/shared/ui/radio-group/RadioGroup.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

const props = withDefaults(
  defineProps<{
    question: QuizQuestion
    modelValue?: string
    showResult?: boolean
    isCorrect?: boolean
  }>(),
  {
    modelValue: '',
    showResult: false,
    isCorrect: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const typeLabelMap: Record<QuizQuestion['type'], string> = {
  single_choice: '单选题',
  true_false: '判断题',
  fill_blank: '填空题',
}

const typeLabel = computed(() => typeLabelMap[props.question.type])

const normalizedOptions = computed(() => {
  if (props.question.type === 'true_false') {
    return [
      { label: '正确', value: 'true' },
      { label: '错误', value: 'false' },
    ]
  }

  return (props.question.options ?? []).map((option) => ({ label: option, value: option }))
})

function onInput(value: string) {
  emit('update:modelValue', value)
}
</script>
