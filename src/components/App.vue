<script setup lang="ts">
import { onMounted } from "vue"

import { Defs } from "../cards"
import {
  bets,
  blind,
  communityCards,
  dealerIndex,
  gameRound,
  playerId,
  playerCards,
  playerChips,
  playerIds,
  playersReady,
  remainingPlayers,
  round,
  roundWinners,
  step,
  turnIndex,
  winnerHands,
} from "../store"
import { Step } from "../types"

import Play from "./Play.vue"
import StartScreen from "./StartScreen.vue"

onMounted(() => {
  Rune.initClient({
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
      if (communityCards.value !== game.communityCards) {
        communityCards.value = game.communityCards
      }
      if (dealerIndex.value !== game.dealerIndex) {
        dealerIndex.value = game.dealerIndex
      }
      if (gameRound.value !== game.game) {
        gameRound.value = game.game
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
      if (remainingPlayers.value !== game.remainingPlayers) {
        remainingPlayers.value = game.remainingPlayers
      }
      if (round.value !== game.round) {
        round.value = game.round
      }
      if (roundWinners.value !== game.roundWinners) {
        roundWinners.value = game.roundWinners
      }
      if (step.value !== game.step) {
        step.value = game.step
      }
      if (turnIndex.value !== game.turnIndex) {
        turnIndex.value = game.turnIndex
      }
      if (winnerHands.value !== game.winnerHands) {
        winnerHands.value = game.winnerHands
      }
    },
  })
})
</script>

<template>
  <Defs />
  <StartScreen v-if="step === Step.WAIT" />
  <Play
    v-if="step === Step.PLAY || step === Step.ROUND_END || step === Step.WIN"
    :key="gameRound"
  />
</template>

<style scoped>
.defs {
  display: none;
}
</style>
