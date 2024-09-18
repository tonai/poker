<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { createArray, randomInt } from "@tonai/game-utils"

import { Card } from "../cards"
import {
  communityCards,
  dealerId,
  foldPlayers,
  playerCards,
  playerId,
  playerIds,
  round,
  roundWinners,
} from "../store"
import { CardPosition, CommunityCardPosition, Position } from "../types"

const props = defineProps<{
  canPlay: boolean
  playerPositions: Record<string, Position>
  playerCardPositions: Record<string, Position>
}>()

const emit = defineEmits<{ (e: "ready"): void }>()

const intervalDelay = 500
const animationDelay = 100

// Deal cards
const dealCardPositions = ref<CardPosition[]>(
  createArray(playerIds.value.length * 2, {
    ...props.playerPositions[dealerId.value],
  })
)
const deal = computed(() =>
  playerCards.value
    .map(({ cards, id }) => ({ id, card: cards[0] }))
    .concat(playerCards.value.map(({ cards, id }) => ({ id, card: cards[1] })))
)
const dealIndex = ref(1)
const animatedDeal = computed(() => deal.value.slice(0, dealIndex.value))
function animateDeal() {
  setTimeout(() => {
    const cardPlayerId = deal.value[dealIndex.value - 1].id
    dealCardPositions.value[dealIndex.value - 1] = {
      ...props.playerCardPositions[cardPlayerId],
      rotate: `${randomInt(360, -360)}deg`,
      scale: cardPlayerId === playerId.value ? 1 : 0.65,
    }
  }, animationDelay)
}
onMounted(() => {
  animateDeal()
  const interval = setInterval(() => {
    if (dealIndex.value === deal.value.length) {
      clearInterval(interval)
      emit("ready")
    } else {
      dealIndex.value++
      animateDeal()
    }
  }, intervalDelay)
})

// Reveal your cards
const isRevealed = ref(false)
function reveal() {
  let first = true
  deal.value.forEach(({ id }, index) => {
    if (id === playerId.value) {
      dealCardPositions.value[index].rotate = "0deg"
      if (first) {
        dealCardPositions.value[index].translate = "-100% -10%"
        first = false
      } else {
        dealCardPositions.value[index].translate = "5% -10%"
      }
    }
  })
  setTimeout(() => (isRevealed.value = true), 1000)
}

// Discard
const discardIds = ref<string[]>([])
function discard(id: string) {
  if (!discardIds.value.includes(id)) {
    discardIds.value.push(id)
    deal.value.forEach((card, index) => {
      if (card.id === id) {
        dealCardPositions.value[index].translate = "-50% 0"
        dealCardPositions.value[index].left = "calc(100% - var(--size) * 20)"
        dealCardPositions.value[index].top = "calc(100% - var(--size) * 40)"
        dealCardPositions.value[index].scale = 0.65
      }
    })
  }
}

// Fold
watch(foldPlayers, () => {
  for (const id of foldPlayers.value) {
    discard(id)
  }
})

// Flop, Turn, River
const communityCardPositions = ref<CommunityCardPosition[]>(
  createArray(5, { ...props.playerPositions[dealerId.value], flipped: true })
)
const communityCardsIndex = ref(1)
const animatedCommunityCards = computed(() =>
  communityCards.value.slice(0, communityCardsIndex.value)
)
function animateCommunityCards() {
  setTimeout(() => {
    // const cardPlayerId = deal.value[dealIndex.value - 1].id
    communityCardPositions.value[communityCardsIndex.value - 1] = {
      flipped: false,
      left: `${(100 / 5) * (communityCardsIndex.value - 1) + 10}%`,
      top: "50%",
    }
  }, animationDelay)
}
watch(round, () => {
  animateCommunityCards()
  const interval = setInterval(() => {
    if (communityCardsIndex.value === communityCards.value.length) {
      clearInterval(interval)
      emit("ready")
    } else {
      communityCardsIndex.value++
      animateCommunityCards()
    }
  }, intervalDelay)
})

// End round
watch(roundWinners, () => {
  const ids = Object.keys(roundWinners.value)
  for (const id of ids) {
    discard(id)
  }
  communityCardPositions.value.forEach((position) => {
    position.flipped = true
    position.left = "calc(100% - var(--size) * 20)"
    position.top = "calc(100% - var(--size) * 40)"
    position.scale = 0.65
  })
})
</script>

<template>
  <Card
    v-for="({ card, id }, index) of animatedDeal"
    :key="`${card.rank}${card.suit}`"
    class="card"
    :class="{
      pulsate:
        id === playerId && canPlay && !isRevealed && !discardIds.includes(id),
    }"
    :flipped="id !== playerId || !isRevealed || discardIds.includes(id)"
    :rank="card.rank"
    :suit="card.suit"
    :style="dealCardPositions[index]"
  />
  <Card
    v-for="(card, index) of animatedCommunityCards"
    :key="`${card.rank}${card.suit}`"
    class="card"
    :flipped="communityCardPositions[index].flipped"
    :rank="card.rank"
    :suit="card.suit"
    :style="communityCardPositions[index]"
  />
  <button
    v-if="canPlay && !isRevealed"
    type="button"
    class="reveal"
    @click="reveal"
  ></button>
</template>

<style scoped>
.card {
  position: absolute;
  translate: -50% 0;
  width: calc(var(--size) * 20);
  transition: all 1000ms cubic-bezier(0.28, 0.8, 0.5, 0.95);
}
.pulsate {
  animation: 2s linear infinite both pulse;
}
@keyframes pulse {
  0% {
    scale: 1;
  }
  50% {
    scale: 1.2;
  }
  100% {
    scale: 1;
  }
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
