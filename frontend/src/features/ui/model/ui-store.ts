import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    showWelcomeTip: true,
  }),
  actions: {
    dismissWelcomeTip() {
      this.showWelcomeTip = false
    },
  },
})
