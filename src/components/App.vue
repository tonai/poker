<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { initSounds, playMusic } from "@tonai/game-utils"

import { Defs } from "../cards"
import {
  bets,
  blind,
  communityCards,
  dealerIndex,
  gameRound,
  playerId,
  persistedData,
  playerCards,
  playerChips,
  playerIds,
  playersJoined,
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
        if (persistedData.value !== game.persisted[yourPlayerId]) {
          persistedData.value = game.persisted[yourPlayerId]
        }
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
      if (playersJoined.value !== game.playersJoined) {
        playersJoined.value = game.playersJoined
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

const music = ref<HTMLAudioElement>()
onMounted(() => {
  initSounds({
    cancel: ["sounds/cancel.mp3"],
    cardSingleFlip: [
      "sounds/card_single_flip_01.mp3",
      "sounds/card_single_flip_02.mp3",
      "sounds/card_single_flip_03.mp3",
      "sounds/card_single_flip_04.mp3",
    ],
    chips: [
      "sounds/Coin_Falling_On_Surface_01.mp3",
      "sounds/Coin_Falling_On_Surface_02.mp3",
      "sounds/Coin_Falling_On_Surface_03.mp3",
      "sounds/Coin_Falling_On_Surface_04.mp3",
    ],
    confirm: ["sounds/confirm.mp3"],
    music: ["sounds/music.mp3"],
    select: ["sounds/select.mp3"],
    shuffle: [
      "sounds/cards_shuffle_01.mp3",
      "sounds/cards_shuffle_02.mp3",
      "sounds/cards_shuffle_03.mp3",
    ],
    won: "sounds/Game_Coin_Win_01.mp3",
    // all-in
    // fold
    // card deal
  })
  playMusic("music", 0.2)
})
onUnmounted(() => music.value?.pause())
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
