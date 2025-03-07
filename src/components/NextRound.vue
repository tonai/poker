<script setup lang="ts">
import { computed } from "vue"
import { playSound } from "@tonai/game-utils"

import {
  playerId,
  playerOut,
  playersReady,
  roundWinners,
  winnerHands,
} from "../store"
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
const selected = computed(() => playersReady.value.includes(playerId.value))
const winners = computed(() =>
  Object.keys(roundWinners.value)
    .map((id) =>
      id === playerId.value ? "You" : Rune.getPlayerInfo(id).displayName
    )
    .join(" and ")
)

function endRound() {
  if (selected.value) {
    playSound("cancel")
  } else {
    playSound("select")
  }
  Rune.actions.endRound()
}
</script>

<template>
  <div class="nextRound">
    <template v-if="!playerOut">
      <button
        type="button"
        class="button endRound"
        :class="{ selected }"
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
    </template>
    <div class="hand">
      {{ winners }} winning hand<br />
      with {{ winningHand }}
    </div>
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
.endRound {
  animation: 1s ease-out 1s both slide-right;
}
@keyframes slide-right {
  0% {
    translate: -250% 0;
  }
  100% {
    translate: 0 0;
  }
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
  height: calc(var(--size) * 26);
  font-size: calc(var(--size) * 6);
  font-weight: bold;
  animation: 1s ease-in both slide-up;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
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
