<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { randomInt } from "@tonai/game-utils"

import { otherPlayers, playerId, playerTurn, round, step } from "../store"
import { Position, Step } from "../types"

import Actions from "./Actions.vue"
import Deal from "./Deal.vue"
import Dealer from "./Dealer.vue"
import MainPlayer from "./MainPlayer.vue"
import NextRound from "./NextRound.vue"
import Player from "./Player.vue"
import Pot from "./Pot.vue"

// Positions
const playerRefs = ref<InstanceType<typeof Player>[]>([])
const boundings = computed(() =>
  playerRefs.value
    .filter((ref) => ref.ref)
    .map((ref) => ref.ref!.getBoundingClientRect())
)
const playerDealPositions = computed(() => {
  const entries = boundings.value.map(({ left, top, width }, index) => {
    return [
      otherPlayers.value[index],
      { left: `${left + width / 2}px`, top: `${top}px` },
    ]
  }) as [string, Position][]
  entries.push([playerId.value, { left: "15%", top: "70%" }])
  return Object.fromEntries(entries)
})
const playerCardPositions = computed(() => {
  const entries = boundings.value.map(({ height, left, top, width }, index) => {
    return [
      otherPlayers.value[index],
      { left: `${left + width / 2}px`, top: `${top + height}px` },
    ]
  }) as [string, Position][]
  entries.push([playerId.value, { left: "45%", top: "80%" }])
  return Object.fromEntries(entries)
})
const playerChipsPositions = computed(() => {
  const entries = boundings.value.map(({ height, left, top, width }, index) => {
    return [
      otherPlayers.value[index],
      { left: `${left + width / 2}px`, top: `${top + height}px` },
    ]
  }) as [string, Position][]
  entries.push([
    playerId.value,
    { left: "calc(var(--size) * 15)", top: "calc(100% - var(--size) * 19)" },
  ])
  return Object.fromEntries(entries)
})
const playerDealerPositions = computed(() => {
  const entries = boundings.value.map(({ left, top, width }, index) => {
    return [
      otherPlayers.value[index],
      {
        left: `calc(${left + width / 2}px + var(--size) * 6)`,
        top: `calc(${top}px + var(--size) * 11)`,
      },
    ]
  }) as [string, Position][]
  entries.push([playerId.value, { left: "50%", top: "96%" }])
  return Object.fromEntries(entries)
})

// Start deal animation
const showDeal = ref(false)
onMounted(() => {
  setTimeout(() => (showDeal.value = true), 1000)
})

// Activate play
const canPlay = ref(false)
watch(round, () => (canPlay.value = false))

// Next round
watch(step, () => {
  if (step.value === Step.ROUND_END) {
    const time = 1000 + randomInt(1000, 500)
    setTimeout(() => Dusk.actions.nextRound(), time)
  }
})
</script>

<template>
  <div class="play">
    <Deal
      v-if="showDeal"
      :can-play="canPlay"
      :player-positions="playerDealPositions"
      :player-card-positions="playerCardPositions"
      @ready="canPlay = true"
    />
    <Pot :player-positions="playerChipsPositions" />
    <div class="players">
      <Player v-for="id of otherPlayers" :id="id" :key="id" ref="playerRefs" />
    </div>
    <MainPlayer />
    <Dealer :player-positions="playerDealerPositions" />
    <Actions v-if="canPlay && playerTurn === playerId" />
    <NextRound v-if="step === Step.WIN" />
  </div>
</template>

<style scoped>
.play {
  background: #5db779;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.players {
  display: flex;
  gap: var(--size);
  padding: 0 var(--size);
}
.card {
  position: absolute;
  translate: -50% 0;
  width: calc(var(--size) * 20);
  transition: all 1000ms cubic-bezier(0.28, 0.8, 0.5, 0.95);
}
</style>
