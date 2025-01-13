<script setup lang="ts">
import { playSound, randomInt } from "@tonai/game-utils"
import { computed, ref } from "vue"

import { Card } from "../cards"
import { playerId, playerIds, playersReady } from "../store"
import { Rank, Suit } from "../types"
import Avatar from "./Avatar.vue"
import ChipPile from "./ChipPile.vue"

const combinations: { rank: Rank; suit: Suit }[][] = [
  [
    { rank: "P", suit: "♠" },
    { rank: "O", suit: "♠" },
    { rank: "K", suit: "♠" },
    { rank: "E", suit: "♠" },
    { rank: "R", suit: "♠" },
  ],
  [
    { rank: "J", suit: "♥" },
    { rank: "O", suit: "♥" },
    { rank: "K", suit: "♥" },
    { rank: "E", suit: "♥" },
    { rank: "R", suit: "♥" },
  ],
  [
    { rank: 1, suit: "♠" },
    { rank: "K", suit: "♠" },
    { rank: "Q", suit: "♠" },
    { rank: "J", suit: "♠" },
    { rank: 10, suit: "♠" },
  ],
  [
    { rank: 1, suit: "♣" },
    { rank: 1, suit: "♦" },
    { rank: "K", suit: "♠" },
    { rank: 1, suit: "♥" },
    { rank: 1, suit: "♠" },
  ],
]

const disabled = ref(false)
const combination = ref(0)
const flipped = ref([false, false, false, false, false])
const selected = computed(() => playersReady.value.includes(playerId.value))

function toggleCards() {
  if (disabled.value) {
    return
  }
  disabled.value = true
  if (flipped.value[0]) {
    combination.value = randomInt(combinations.length - 1)
  }
  flipped.value[0] = !flipped.value[0]
  let i = 1
  const interval = setInterval(() => {
    flipped.value[i] = !flipped.value[i]
    i++
    if (i >= 5) {
      clearInterval(interval)
      disabled.value = false
    }
  }, 200)
}

function ready() {
  if (selected.value) {
    playSound("cancel")
  } else {
    playSound("select")
  }
  Rune.actions.ready()
}
</script>

<template>
  <div class="startScreen">
    <div class="content">
      <button class="cards" :disabled="disabled" type="button">
        <div
          v-for="(card, index) of combinations[combination]"
          :key="index"
          class="cardContainer"
          @click="toggleCards"
        >
          <Card
            class="card"
            :rank="card.rank"
            :suit="card.suit"
            :flipped="flipped[index]"
          />
        </div>
      </button>
      <div class="players">
        <Avatar v-for="id of playerIds" :id="id" :key="id" name />
      </div>
      <button class="button" :class="{ selected }" type="button" @click="ready">
        Ready
        <Avatar
          v-for="id of playersReady"
          :id="id"
          :key="id"
          class="playerAvatar"
        />
      </button>
      <div class="piles">
        <ChipPile
          :style="{
            bottom: 'calc(var(--size) * -10)',
            left: 'calc(var(--size) * 50)',
            translate: '0 0',
          }"
          :amount="8888"
        />
        <ChipPile
          :style="{
            bottom: 'calc(var(--size) * -10)',
            left: 'calc(var(--size) * 35)',
            translate: '0 0',
          }"
          :amount="6880"
        />
        <ChipPile
          :style="{
            bottom: 'calc(var(--size) * -10)',
            left: 'calc(var(--size) * 22)',
            translate: '0 0',
          }"
          :amount="4001"
        />
        <ChipPile
          :style="{
            bottom: 'calc(var(--size) * -10)',
            left: 'calc(var(--size) * 68)',
            translate: '0 0',
          }"
          :amount="2862"
        />
        <ChipPile
          :style="{
            bottom: 'calc(var(--size) * -10)',
            left: 'calc(var(--size) * 52)',
            translate: '0 0',
          }"
          :amount="3808"
        />
        <ChipPile
          :style="{
            bottom: 'calc(var(--size) * -10)',
            left: 'calc(var(--size) * 38)',
            translate: '0 0',
          }"
          :amount="47"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.startScreen {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  align-items: center;
}

.startScreen:before {
  content: "";
  position: absolute;
  inset: 3vw;
  border: 1px solid white;
  border-radius: 3vw;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
  flex: 1;
  width: calc(var(--size) * 98);
}

.cards {
  display: flex;
  gap: calc(var(--size) * 2);
  padding: 2vh 0;
  background: none;
  border: 0;
  margin: 0 auto;
}

.cardContainer:nth-child(1) {
  rotate: -10deg;
}

.cardContainer:nth-child(2) {
  rotate: -5deg;
  translate: 0 -1.5vh;
}

.cardContainer:nth-child(3) {
  translate: 0 -2vh;
}

.cardContainer:nth-child(4) {
  rotate: 5deg;
  translate: 0 -1.5vh;
}

.cardContainer:nth-child(5) {
  rotate: 10deg;
}

.card {
  height: 12vh;
  animation: float var(--animation-duration) var(--animation-delay) ease-in-out
    infinite both;
}

.cardContainer:nth-child(1) .card {
  --animation-duration: 12s;
  --animation-delay: 0.5s;
}

.cardContainer:nth-child(2) .card {
  --animation-duration: 14s;
  --animation-delay: 0s;
}

.cardContainer:nth-child(3) .card {
  --animation-duration: 10s;
  --animation-delay: 1s;
}

.cardContainer:nth-child(4) .card {
  --animation-duration: 11s;
  --animation-delay: 0.5s;
}

.cardContainer:nth-child(5) .card {
  --animation-duration: 13s;
  --animation-delay: 0s;
}

@keyframes float {
  0% {
    translate: 0 1vh;
  }
  50% {
    translate: 0 -1vh;
  }
  100% {
    translate: 0 1vh;
  }
}

.players {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: calc(var(--size) * 5);
}

.button {
  align-self: center;
  padding: 0 calc(var(--size) * 4);
  display: flex;
  align-items: center;
  gap: var(--size);
  z-index: 1;
}

.playerAvatar {
  width: calc(var(--size) * 8);
  animation: 200ms ease-in both slide-down;
}

@keyframes slide-down {
  0% {
    translate: 0 -100%;
    opacity: 0;
  }
  100% {
    translate: 0 0;
    opacity: 1;
  }
}
</style>
