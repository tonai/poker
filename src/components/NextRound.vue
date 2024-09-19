<script setup lang="ts">
import { playerId, playersReady } from "../store"

import Avatar from "./Avatar.vue"

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
</style>
