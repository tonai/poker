<script setup lang="ts">
import { computed } from "vue"

import { Rank, Suit } from "../types"

import Figure from "./Figure.vue"
import Pips from "./Pips.vue"
import Jack from "./Jack.vue"
import King from "./King.vue"
import Queen from "./Queen.vue"

const props = defineProps<{
  rank: Rank
  suit: Suit
}>()

const color = computed(() =>
  props.suit === "♣" || props.suit === "♠" ? "black" : "red"
)
const rankId = computed(() => `#card-${props.rank}`)
const suitId = computed(() => `#${props.suit}`)
const isFigure = computed(() => ["J", "Q", "K"].includes(String(props.rank)))
const isLetter = computed(() =>
  ["P", "O", "E", "R"].includes(String(props.rank))
)
</script>

<template>
  <!-- Top Left Corner -->
  <use
    :xlink:href="rankId"
    :stroke="color"
    :fill="color"
    height="32"
    width="32"
    :x="isLetter ? -108.5 : -114.4"
    y="-156"
  ></use>
  <use
    :xlink:href="suitId"
    :fill="color"
    height="26.769"
    width="26.769"
    x="-111.784"
    y="-119"
  ></use>
  <!-- Bottom Right Corner -->
  <g transform="rotate(180)">
    <use
      :xlink:href="rankId"
      :stroke="color"
      :fill="color"
      height="32"
      width="32"
      :x="isLetter ? -108.5 : -114.4"
      y="-156"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="26.769"
      width="26.769"
      x="-111.784"
      y="-119"
    ></use>
  </g>
  <!-- Pips -->
  <Pips :color="color" :rank="rank" :suit-id="suitId" />
  <!-- Figures -->
  <template v-if="isFigure">
    <template v-for="n in 6" :key="n">
      <Figure :n="n" :rank="rank" :suit="suit" />
      <g transform="rotate(180)">
        <Figure :n="n" :rank="rank" :suit="suit" />
      </g>
    </template>
  </template>
  <!-- Jack -->
  <template v-if="rank === 'J'">
    <Jack :color="color" :suit="suit" :suit-id="suitId" />
    <g transform="rotate(180)">
      <Jack :color="color" :suit="suit" :suit-id="suitId" />
    </g>
  </template>
  <!-- Queen -->
  <template v-if="rank === 'Q'">
    <Queen :color="color" :suit="suit" :suit-id="suitId" />
    <g transform="rotate(180)">
      <Queen :color="color" :suit="suit" :suit-id="suitId" />
    </g>
  </template>
  <!-- King -->
  <template v-if="rank === 'K'">
    <King :color="color" :suit="suit" :suit-id="suitId" />
    <g transform="rotate(180)">
      <King :color="color" :suit="suit" :suit-id="suitId" />
    </g>
  </template>
  <!-- Letters -->
  <use
    v-if="isLetter"
    :xlink:href="rankId"
    :stroke="color"
    :fill="color"
    height="160"
    width="160"
    x="-49.5"
    y="-82.5"
  ></use>
  <!-- Rect -->
  <rect
    v-if="typeof rank === 'string'"
    stroke="#44F"
    fill="none"
    width="164.8"
    height="260.8"
    x="-82.4"
    y="-130.4"
  ></rect>
  <!-- Figure Left Suit -->
  <template
    v-if="
      rank === 'K' ||
      (rank === 'J' && suit === '♠') ||
      (rank === 'Q' && suit === '♥')
    "
  >
    <use
      :xlink:href="suitId"
      :fill="color"
      height="55.68"
      width="55.68"
      x="-89.68"
      y="-132.16"
    ></use>
    <g transform="rotate(180)">
      <use
        :xlink:href="suitId"
        :fill="color"
        height="55.68"
        width="55.68"
        x="-89.68"
        y="-132.16"
      ></use>
    </g>
  </template>
  <!-- Figure Right Suit -->
  <template
    v-if="(rank === 'J' && suit !== '♠') || (rank === 'Q' && suit !== '♥')"
  >
    <use
      :xlink:href="suitId"
      :fill="color"
      height="55.68"
      width="55.68"
      x="34"
      y="-132.16"
    ></use>
    <g transform="rotate(180)">
      <use
        :xlink:href="suitId"
        :fill="color"
        height="55.68"
        width="55.68"
        x="34"
        y="-132.16"
      ></use>
    </g>
  </template>
</template>
