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
  step,
  winnerCards,
} from "../store"
import { CardPosition, CommunityCardPosition, Position, Step } from "../types"

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
  createArray(12, {
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
      left: "var(--left)",
      top: "var(--top2)",
      ...props.playerCardPositions[cardPlayerId],
      rotate: `${randomInt(360, -360)}deg`,
      scale: cardPlayerId === playerId.value ? 1 : 0.5,
    }
  }, animationDelay)
}
onMounted(() => {
  animateDeal()
  const interval = setInterval(() => {
    if (dealIndex.value === deal.value.length) {
      clearInterval(interval)
      emit("ready")
      if (round.value === 4) {
        playerIds.value.forEach(reveal)
      }
    } else {
      dealIndex.value++
      animateDeal()
    }
  }, intervalDelay)
})

// Reveal cards
const revealed = ref<string[]>([])
function reveal(revealId: string) {
  let first = true
  deal.value.forEach(({ id }, index) => {
    if (id === revealId) {
      dealCardPositions.value[index].rotate = "0deg"
      if (first) {
        dealCardPositions.value[index].translate =
          revealId === playerId.value ? "-100% -10%" : "-77% -10%"
        first = false
      } else {
        dealCardPositions.value[index].translate =
          revealId === playerId.value ? "5% -10%" : "-21% -10%"
      }
    }
  })
  setTimeout(() => revealed.value.push(revealId), 1000)
}

// Discard
const discardIds = ref<string[]>([])
function discard(id: string) {
  if (!discardIds.value.includes(id)) {
    discardIds.value.push(id)
    deal.value.forEach((card, index) => {
      if (card.id === id) {
        dealCardPositions.value[index].translate = "-50% 0"
        dealCardPositions.value[index].left = "var(--left)"
        dealCardPositions.value[index].top = "var(--top2)"
        dealCardPositions.value[index].scale = 0.5
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
function animateCommunityCard() {
  setTimeout(() => {
    communityCardPositions.value[communityCardsIndex.value - 1] = {
      flipped: false,
      left: `${(100 / 5) * (communityCardsIndex.value - 1) + 10}%`,
      top: "50%",
    }
  }, animationDelay)
}
function animateCommunityCards() {
  animateCommunityCard()
  const interval = setInterval(() => {
    if (communityCardsIndex.value === communityCards.value.length) {
      clearInterval(interval)
      emit("ready")
    } else {
      communityCardsIndex.value++
      animateCommunityCard()
    }
  }, intervalDelay)
}
watch(round, () => {
  animateCommunityCards()
})
onMounted(() => {
  if (communityCards.value.length) {
    setTimeout(animateCommunityCards, playerCards.value.length * 1000)
  }
})

// Showdown
watch(round, () => {
  if (round.value === 4) {
    playerIds.value.forEach(reveal)
  }
})

// End round
watch(step, () => {
  if (step.value === Step.ROUND_END) {
    for (const id of playerIds.value) {
      discard(id)
    }
    communityCardPositions.value.forEach((position) => {
      position.flipped = true
      position.left = "var(--left)"
      position.top = "var(--top2)"
      position.scale = 0.5
    })
  }
})

// Player join/left
watch(
  playerIds,
  () => {
    deal.value.forEach((card, index) => {
      if (
        playerIds.value.includes(card.id) &&
        !discardIds.value.includes(card.id)
      ) {
        // Update position
        dealCardPositions.value[index].left =
          props.playerCardPositions[card.id].left
        dealCardPositions.value[index].top =
          props.playerCardPositions[card.id].top
      } else {
        // Discard
        dealCardPositions.value[index].translate = "-50% 0"
        dealCardPositions.value[index].left = "var(--left)"
        dealCardPositions.value[index].top = "var(--top2)"
        dealCardPositions.value[index].scale = 0.5
      }
    })
    communityCardPositions.value.forEach((card) => {
      if (card.flipped && card.scale !== 0.5) {
        // Update start position
        card.left = props.playerPositions[dealerId.value].left
        card.top = props.playerPositions[dealerId.value].top
      }
    })
  },
  { flush: "post" }
)
</script>

<template>
  <Card
    v-for="({ card, id }, index) of animatedDeal"
    :key="`${card.rank}${card.suit}`"
    class="card"
    :class="{
      pulsate:
        id === playerId &&
        canPlay &&
        !revealed.includes(playerId) &&
        !discardIds.includes(id),
    }"
    :flipped="!revealed.includes(id) || discardIds.includes(id)"
    :opacity="
      winnerCards.length > 0 &&
      !winnerCards.includes(`${card.rank}${card.suit}`)
    "
    :rank="card.rank"
    :suit="card.suit"
    :style="dealCardPositions[index]"
  />
  <Card
    v-for="(card, index) of animatedCommunityCards"
    :key="`${card.rank}${card.suit}`"
    class="card"
    :flipped="communityCardPositions[index].flipped"
    :opacity="
      winnerCards.length > 0 &&
      !winnerCards.includes(`${card.rank}${card.suit}`)
    "
    :rank="card.rank"
    :suit="card.suit"
    :style="communityCardPositions[index]"
  />
  <button
    v-if="canPlay && !revealed.includes(playerId)"
    type="button"
    class="reveal"
    @click="reveal(playerId)"
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
