<script setup lang="ts">
import { computed } from "vue"

import { getChips } from "../helpers"

import Chip3D from "./Chip3D.vue"

const props = defineProps<{ amount: number }>()

const chips = computed(() => getChips(props.amount))
</script>

<template>
  <div class="chip-pile">
    <Chip3D
      v-for="(value, index) of chips"
      :key="index"
      class="chip"
      :amount="value"
      :style="{ translate: `0 -${6 * index}%` }"
    />
  </div>
</template>

<style scoped>
.chip-pile {
  position: absolute;
  font-size: var(--size);
  translate: -50% -50%;
  width: calc(var(--size) * 20);
  height: calc(var(--size) * 20);
}
.chip {
  position: absolute;
}
</style>
