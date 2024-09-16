<script setup lang="ts">
import Chip from "./Chip.vue"

defineProps<{ amount: number }>()
</script>

<template>
  <div class="chips">
    {{ amount }}
    <Chip class="chip" />
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  gap: 5%;
}
.chip {
  width: 1em;
}
</style>