<script setup lang="ts">
import { ref } from "vue"
import { playerChips } from "../store"

import Amount from "./Amount.vue"
import Avatar from "./Avatar.vue"

defineProps<{
  id: string
}>()

const player = ref<HTMLDivElement>()

defineExpose({ ref: player })
</script>

<template>
  <div ref="player" class="player">
    <div class="avatar">
      <Avatar :id="id" name />
    </div>
    <Amount :amount="playerChips[id]" class="amount" />
  </div>
</template>

<style scoped>
.player {
  flex: 1;
}
.avatar {
  position: relative;
}
.player .amount {
  font-size: calc(var(--size) * 5);
}
</style>
