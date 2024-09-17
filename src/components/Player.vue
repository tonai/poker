<script setup lang="ts">
import { ref, watch } from "vue"
import { playerChips } from "../store"

import Amount from "./Amount.vue"
import Avatar from "./Avatar.vue"

const props = defineProps<{
  id: string
}>()

const player = ref<HTMLDivElement>()
const amount = ref(playerChips.value[props.id])

watch(playerChips, () => {
  if (amount.value > playerChips.value[props.id]) {
    amount.value = playerChips.value[props.id]
  } else if (amount.value < playerChips.value[props.id]) {
    setTimeout(() => (amount.value = playerChips.value[props.id]), 2200)
  }
})

defineExpose({ ref: player })
</script>

<template>
  <div ref="player" class="player">
    <div class="avatar">
      <Avatar :id="id" name />
    </div>
    <Amount :amount="amount" class="amount" />
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
