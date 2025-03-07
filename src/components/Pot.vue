<script setup lang="ts">
import { onMounted, ref, watch } from "vue"

import { bets, blind, playerId, playersReady, roundWinners } from "../store"
import { PilePosition, Position } from "../types"

import Amount from "./Amount.vue"
import ChipPile from "./ChipPile.vue"
import { playSound } from "@tonai/game-utils"

const props = defineProps<{
  playerPositions: Record<string, Position>
}>()

const position = {
  left: "var(--left)",
  top: "var(--top)",
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
  setTimeout(() => {
    indexes.forEach((i) => (betPositions.value[i] = { ...position }))
    const total = indexes.reduce(
      (acc, i) => acc + (bets.value[i]?.amount ?? 0),
      0
    )
    if (total > 0) {
      playSound("chips")
    }
  }, 100)
  startTotalAnimation(indexes)
}
onMounted(() => {
  startBetAnimation(Object.keys(bets.value).map(Number))
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
  const winners = Object.keys(roundWinners.value)
  if (winners.length > 0 && playersReady.value.length === 0) {
    setTimeout(() => {
      totalPosition.value = Object.fromEntries(
        winners.map((id) => [id, props.playerPositions[id]])
      )
      total.value = 0
      if (winners.includes(playerId.value)) {
        playSound("won")
      } else {
        playSound("lost")
      }
    }, 1200)
    setTimeout(() => {
      animationEnd.value = true
    }, 2200)
  }
})
</script>

<template>
  <div class="pot">
    <div class="title">Blind {{ blind }}</div>
    <Amount :amount="total" class="amount" />
  </div>
  <ChipPile
    v-for="(bet, index) of bets"
    :key="index"
    :amount="bet.amount"
    class="pile"
    :style="betPositions[index] ?? playerPositions[bet.id] ?? position"
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
  color: white;
  padding: calc(var(--size) * 2) 0;
}
.title {
  font-size: calc(var(--size) * 6);
}
.pot .total-pile {
  position: fixed;
}
.pot .amount {
  margin-top: auto;
  font-size: calc(var(--size) * 7);
}
</style>
