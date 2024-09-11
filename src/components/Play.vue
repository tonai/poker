<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { createArray, randomInt } from "@tonai/game-utils"

import { Card } from "../cards"
import { playerCards, playerIds, otherPlayers } from "../store"

import Avatar from "./Avatar.vue"

const intervalDelay = 500
const animationDelay = 100

const playerRefs = ref<HTMLDivElement[]>([])
const cardPositions = ref(
  createArray(playerIds.value.length * 2).fill({ left: "50%", top: "50%" })
)
const playerPositions = computed(() =>
  playerRefs.value.map((ref) => {
    const { height, left, top, width } = ref.getBoundingClientRect()
    return { left: `${left + width / 2}px`, top: `${top + height}px` }
  })
)

const deal = computed(() => {
  const entries = Object.entries(playerCards.value)
  return entries
    .map(([id, cards]) => ({ id, card: cards[0] }))
    .concat(entries.map(([id, cards]) => ({ id, card: cards[1] })))
})
const animateIndex = ref(1)
const animatedDeal = computed(() => deal.value.slice(0, animateIndex.value))

function animate() {
  setTimeout(() => {
    const cardPlayerId = deal.value[animateIndex.value - 1].id
    const index = otherPlayers.value.findIndex((id) => id === cardPlayerId)
    cardPositions.value[animateIndex.value - 1] =
      index === -1
        ? { left: "50%", top: "80%" }
        : { ...playerPositions.value[index], scale: 0.5 }
    cardPositions.value[animateIndex.value - 1].rotate =
      `${randomInt(360, -360)}deg`
  }, animationDelay)
}

onMounted(() => {
  animate()
  const interval = setInterval(() => {
    if (animateIndex.value === deal.value.length) {
      clearInterval(interval)
    } else {
      animateIndex.value++
      animate()
    }
  }, intervalDelay)
})
</script>

<template>
  <div class="play">
    <div class="players">
      <div v-for="id of otherPlayers" :key="id" class="player" ref="playerRefs">
        <Avatar :id="id" name />
      </div>
    </div>
    <Card
      v-for="({ card }, index) of animatedDeal"
      :key="`${card.rank}${card.suit}`"
      class="card"
      flipped
      :rank="'J'"
      suit="♣"
      :style="cardPositions[index]"
    />
  </div>
</template>

<style scoped>
.play {
  background: #5db779;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.players {
  display: flex;
  gap: 1vw;
  padding: 0 1vw;
}
.player {
  flex: 1;
}
.card {
  position: absolute;
  translate: -50% 0;
  width: 20vw;
  transition: all 1000ms cubic-bezier(.28,.8,.5,.95);
}
</style>
