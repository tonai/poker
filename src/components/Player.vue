<script setup lang="ts">
import { computed, ref, watch } from "vue"

import {
  allInPlayers,
  bets,
  playerChips,
  remainingPlayers,
  winners,
} from "../store"

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
  <div
    ref="player"
    class="player"
    :class="{
      winner: winners.length > 0 && winners.includes(id),
      loser: winners.length > 0 && !winners.includes(id),
      out: !remainingPlayers.includes(id),
    }"
  >
    <div class="avatar">
      <Avatar :id="id" name />
    </div>
    <Amount
      :all-in="allInPlayers.includes(id)"
      :amount="amount"
      class="amount"
    />
    <div class="messages">
      <Message v-for="(bet, index) of playerBets" :key="index" :bet="bet" />
    </div>
  </div>
</template>

<style scoped>
.player {
  flex: 1;
  position: relative;
  transition: opacity 1s ease;
  opacity: 1;
  transition: translate 500ms ease-out;
}
.player:before {
  content: "";
  display: block;
  position: absolute;
  border-radius: calc(var(--size) * 3);
  transition: scale 1s ease;
  scale: 0;
  top: 0;
  max-width: calc(var(--size) * 30);
  bottom: 0;
  left: 50%;
  translate: -50% 0;
  width: 100%;
}
.winner:before {
  scale: 1;
  background-color: green;
  animation: 200ms linear 1s 6 both blink;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.loser {
  opacity: 0.5;
}
.out {
  translate: 0 calc(var(--size) * -10);
  opacity: 0.5;
}
.avatar {
  position: relative;
}
.player .amount {
  font-size: calc(var(--size) * 5);
  position: relative;
}
.messages {
  position: absolute;
  inset: 0;
}
</style>
