<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

import { otherPlayers, playerId } from "../store"
import { Position } from "../types"

import Deal from "./Deal.vue"
import MainPlayer from "./MainPlayer.vue"
import Player from "./Player.vue"
import Pot from "./Pot.vue"

const playerRefs = ref<InstanceType<typeof Player>[]>([])
const boundings = computed(() =>
  playerRefs.value
    .filter((ref) => ref.ref)
    .map((ref) => ref.ref!.getBoundingClientRect())
)
const playerCardPositions = computed(() => {
  const entries = boundings.value.map(({ height, left, top, width }, index) => {
    return [
      otherPlayers.value[index],
      { left: `${left + width / 2}px`, top: `${top + height}px` },
    ]
  }) as [string, Position][]
  entries.push([playerId.value, { left: "50%", top: "80%" }])
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
    { left: "calc(var(--size) * 15)", top: "calc(var(--size) * 181)" },
  ])
  return Object.fromEntries(entries)
})

const showDeal = ref(false)
onMounted(() => {
  setTimeout(() => (showDeal.value = true), 1000)
})
</script>

<template>
  <div class="play">
    <Deal v-if="showDeal" :player-positions="playerCardPositions" />
    <Pot :player-positions="playerChipsPositions" />
    <div class="players">
      <Player v-for="id of otherPlayers" :id="id" :key="id" ref="playerRefs" />
    </div>
    <MainPlayer />
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
