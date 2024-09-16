<script setup lang="ts">
import { onMounted } from "vue"

import { Defs } from "../cards"
import {
  bets,
  dealerIndex,
  playerId,
  playerCards,
  playerChips,
  playerIds,
  playersReady,
  step,
} from "../store"
import { Step } from "../types"

import Play from "./Play.vue"
import StartScreen from "./StartScreen.vue"

onMounted(() => {
  Dusk.initClient({
    onChange: ({ game, yourPlayerId }) => {
      if (yourPlayerId && playerId.value !== yourPlayerId) {
        playerId.value = yourPlayerId
      }
      if (bets.value !== game.bets) {
        bets.value = game.bets
      }
      if (dealerIndex.value !== game.dealerIndex) {
        dealerIndex.value = game.dealerIndex
      }
      if (playerCards.value !== game.playerCards) {
        playerCards.value = game.playerCards
      }
      if (playerChips.value !== game.playerChips) {
        playerChips.value = game.playerChips
      }
      if (playerIds.value !== game.playerIds) {
        playerIds.value = game.playerIds
      }
      if (playersReady.value !== game.playersReady) {
        playersReady.value = game.playersReady
      }
      if (step.value !== game.step) {
        step.value = game.step
      }
    },
  })
})
</script>

<template>
  <Defs />
  <StartScreen v-if="step === Step.WAIT" />
  <Play v-if="step === Step.PLAY" />
</template>

<style scoped>
.defs {
  display: none;
}
</style>
