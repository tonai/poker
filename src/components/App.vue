<script setup lang="ts">
import { onMounted } from "vue"

import { Defs } from "../cards"
import {
  bets,
  blind,
  dealerIndex,
  playerId,
  playerCards,
  playerChips,
  playerIds,
  playersReady,
  round,
  step,
  turnIndex,
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
      if (blind.value !== game.blind) {
        blind.value = game.blind
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
      if (round.value !== game.round) {
        round.value = game.round
      }
      if (step.value !== game.step) {
        step.value = game.step
      }
      if (turnIndex.value !== game.turnIndex) {
        turnIndex.value = game.turnIndex
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
