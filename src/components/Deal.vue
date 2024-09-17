<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { createArray, randomInt } from "@tonai/game-utils"

import { Card } from "../cards"
import { playerCards, playerId, playerIds } from "../store"
import { CardPosition, Position } from "../types"

const props = defineProps<{
  canPlay: boolean
  playerPositions: Record<string, Position>
}>()

const emit = defineEmits<{ (e: "ready"): void }>()

const intervalDelay = 500
const animationDelay = 100

const isRevealed = ref(false)
const cardPositions = ref<CardPosition[]>(
  createArray(playerIds.value.length * 2, { left: "50%", top: "50%" })
)

const deal = computed(() =>
  playerCards.value
    .map(({ cards, id }) => ({ id, card: cards[0] }))
    .concat(playerCards.value.map(({ cards, id }) => ({ id, card: cards[1] })))
)
const animateIndex = ref(1)
const animatedDeal = computed(() => deal.value.slice(0, animateIndex.value))

function animate() {
  setTimeout(() => {
    const cardPlayerId = deal.value[animateIndex.value - 1].id
    cardPositions.value[animateIndex.value - 1] = {
      ...props.playerPositions[cardPlayerId],
      rotate: `${randomInt(360, -360)}deg`,
      scale: cardPlayerId === playerId.value ? 1 : 0.65,
    }
  }, animationDelay)
}

function reveal() {
  let first = true
  deal.value.forEach(({ id }, index) => {
    if (id === playerId.value) {
      cardPositions.value[index].rotate = "0deg"
      if (first) {
        cardPositions.value[index].translate = "-120% -10%"
        first = false
      } else {
        cardPositions.value[index].translate = "-15% -10%"
      }
    }
  })
  setTimeout(() => (isRevealed.value = true), 1000)
}

onMounted(() => {
  animate()
  const interval = setInterval(() => {
    if (animateIndex.value === deal.value.length) {
      clearInterval(interval)
      emit("ready")
    } else {
      animateIndex.value++
      animate()
    }
  }, intervalDelay)
})
</script>

<template>
  <Card
    v-for="({ card, id }, index) of animatedDeal"
    :key="`${card.rank}${card.suit}`"
    class="card"
    :flipped="id !== playerId || !isRevealed"
    :rank="card.rank"
    :suit="card.suit"
    :style="cardPositions[index]"
  />
  <button v-if="canPlay" type="button" class="reveal" @click="reveal"></button>
</template>

<style scoped>
.card {
  position: absolute;
  translate: -50% 0;
  width: calc(var(--size) * 20);
  transition: all 1000ms cubic-bezier(0.28, 0.8, 0.5, 0.95);
}
.reveal {
  position: absolute;
  left: 50%;
  top: 80%;
  width: calc(var(--size) * 34);
  height: calc(var(--size) * 38);
  translate: -50% -12.5%;
  border: 0;
  background: none;
  cursor: pointer;
}
</style>
