<script setup lang="ts">
import { computed } from "vue"
import { Bet } from "../types"

const props = defineProps<{
  bet: Bet
}>()

const message = computed(() => {
  const { raise, type } = props.bet
  switch (type) {
    case "big blind":
      return "Big bling"
    case "call":
      return `Call`
    case "check":
      return "Check"
    case "fold":
      return "Fold"
    case "raise":
      return `Raise by ${raise}`
    case "small blind":
      return "Small blind"
  }
  return ""
})
</script>

<template>
  <div class="message">
    <span class="text">{{ message }}</span>
  </div>
</template>

<style scoped>
.message {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  font-size: calc(var(--size) * 5);
  text-align: center;
  animation: 2s linear both message;
}
.text {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: var(--size);
  padding: var(--size);
  color: white;
}
@keyframes message {
  0% {
    translate: 0;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    translate: 0 -50%;
    opacity: 0;
  }
}
</style>
