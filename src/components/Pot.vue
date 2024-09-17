<script setup lang="ts">
import { onMounted, ref, watch } from "vue"

import { bets, roundWinners } from "../store"
import { PilePosition, Position } from "../types"

import Amount from "./Amount.vue"
import ChipPile from "./ChipPile.vue"

const props = defineProps<{
  playerPositions: Record<string, Position>
}>()

const position = {
  left: "calc(100% - var(--size) * 20)",
  top: "calc(100% - var(--size) * 25)",
}

const betPositions = ref<PilePosition[]>([])
const total = ref(0)

// Bet
const betLength = ref(bets.value.length)
function startTotalAnimation(indexes: number[]) {
  setTimeout(() => {
    total.value = bets.value.reduce((acc, { amount }) => acc + amount, 0)
    indexes.forEach((i) => (betPositions.value[i].display = "none"))
  }, 1000)
}
function startBetAnimation(indexes: number[]) {
  setTimeout(
    () => indexes.forEach((i) => (betPositions.value[i] = { ...position })),
    100
  )
  startTotalAnimation(indexes)
}
onMounted(() => {
  startBetAnimation([0, 1])
})
watch(bets, () => {
  if (bets.value.length > betLength.value) {
    startBetAnimation([betLength.value]) // should increment 1 by 1
    betLength.value = bets.value.length
  }
})

// Pot win
const totalPosition = ref<Record<string, Position>>({})
const animationEnd = ref(false)
watch(roundWinners, () => {
  setTimeout(() => {
    totalPosition.value = Object.fromEntries(
      Object.keys(roundWinners.value).map((id) => [
        id,
        props.playerPositions[id],
      ])
    )
    total.value = 0
  }, 1200)
  setTimeout(() => {
    animationEnd.value = true
  }, 2200)
})
</script>

<template>
  <div class="pot">
    <div class="title">Pot</div>
    <Amount :amount="total" class="amount" />
  </div>
  <ChipPile
    v-for="(bet, index) of bets"
    :key="index"
    :amount="bet.amount"
    class="pile"
    :style="betPositions[index] ?? playerPositions[bet.id]"
  />
  <template v-if="!animationEnd">
    <ChipPile
      v-for="(amount, id) of roundWinners"
      :key="id"
      :amount="amount"
      class="pile"
      :style="totalPosition[id] ?? position"
    />
  </template>
  <ChipPile :amount="total" class="total-pile" :style="position" />
</template>

<style scoped>
.pile {
  transition:
    top 1000ms cubic-bezier(0.28, 0.8, 0.5, 0.95),
    left 1000ms linear;
}
.pot {
  position: absolute;
  bottom: calc(var(--size) * 5);
  right: calc(var(--size) * 5);
  border: 1px solid white;
  border-radius: calc(var(--size) * 5);
  background-color: darkgreen;
  height: calc(var(--size) * 50);
  width: calc(var(--size) * 30);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding: calc(var(--size) * 2) 0;
}
.title {
  font-size: calc(var(--size) * 7);
}
.pot .total-pile {
  position: fixed;
}
.pot .amount {
  font-size: calc(var(--size) * 7);
}
</style>
