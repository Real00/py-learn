<template>
  <LessonBlock :section="section" />
</template>

<script setup lang="ts">
import type { ChapterSection } from '@/entities/content/model/types'

import LessonBlock from '@/components/course/LessonBlock.vue'

defineProps<{
  section: ChapterSection
}>()
</script>
