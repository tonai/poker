<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { bets, playerChips } from "../store"

import Amount from "./Amount.vue"
import Avatar from "./Avatar.vue"
import Message from "./Message.vue"

const props = defineProps<{
  id: string
}>()

const player = ref<HTMLDivElement>()
defineExpose({ ref: player })

// Amount sync with bet transitions
const amount = ref(playerChips.value[props.id])
watch(playerChips, () => {
  if (amount.value > playerChips.value[props.id]) {
    amount.value = playerChips.value[props.id]
  } else if (amount.value < playerChips.value[props.id]) {
    setTimeout(() => (amount.value = playerChips.value[props.id]), 2200)
  }
})

// Action messages
const playerBets = computed(() =>
  bets.value.filter(({ id }) => id === props.id)
)
</script>

<template>
  <div ref="player" class="player">
    <div class="avatar">
      <Avatar :id="id" name />
    </div>
    <Amount :amount="amount" class="amount" />
    <div class="messages">
      <Message v-for="(bet, index) of playerBets" :key="index" :bet="bet" />
    </div>
  </div>
</template>

<style scoped>
.player {
  flex: 1;
  position: relative;
}
.avatar {
  position: relative;
}
.player .amount {
  font-size: calc(var(--size) * 5);
}
.messages {
  position: absolute;
  inset: 0;
}
</style>
