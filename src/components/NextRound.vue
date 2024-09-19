<script setup lang="ts">
import { computed } from "vue"

import { playerId, playersReady, winnerHands } from "../store"
import { HandCategory } from "../types"

import Avatar from "./Avatar.vue"

const winningHand = computed(() => {
  if (winnerHands.value[0]) {
    switch (winnerHands.value[0].hand.category) {
      case HandCategory.Flush:
        return "Flush"
      case HandCategory.FourOfAKind:
        return "Four of a kind"
      case HandCategory.FullHouse:
        return "Full house"
      case HandCategory.HighCard:
        return "High card"
      case HandCategory.OnePair:
        return "One pair"
      case HandCategory.Straight:
        return "Straight"
      case HandCategory.StraightFlush:
        return "Straight Flush"
      case HandCategory.ThreeOfAKind:
        return "Three of a kind"
      case HandCategory.TwoPair:
        return "Two pair"
    }
  }
  return ""
})

function endRound() {
  Dusk.actions.endRound()
}
</script>

<template>
  <div class="nextRound">
    <button
      type="button"
      class="button"
      :class="{ selected: playersReady.includes(playerId) }"
      @click="endRound"
    >
      Next round
    </button>
    <div class="playersReady">
      <Avatar
        v-for="id of playersReady"
        :id="id"
        :key="id"
        class="playerReady"
      />
    </div>
    <div class="hand">{{ winningHand }}</div>
  </div>
</template>

<style scoped>
.nextRound {
  position: absolute;
  left: 0;
  right: 0;
  top: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.button {
  z-index: 1;
}
.playersReady {
  position: absolute;
  top: calc(var(--size) * 14);
  display: flex;
  flex-direction: row-reverse;
}
.playersReady .playerReady {
  width: calc(var(--size) * 10);
  margin: 0 calc(var(--size) * -1);
  animation: 0.2s ease-in both slide-down;
}
@keyframes slide-down {
  0% {
    translate: 0 -100%;
  }
  100% {
    translate: 0 0;
  }
}
.hand {
  margin-top: calc(var(--size) * 10);
  font-size: calc(var(--size) * 10);
  font-weight: bold;
  animation: 1s ease-in both slide-up;
}
@keyframes slide-up {
  0% {
    translate: 0 200%;
    scale: 0;
  }
  100% {
    translate: 0 0;
    scale: 1;
  }
}
</style>
