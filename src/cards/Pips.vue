<script setup lang="ts">
import { Rank } from "../types"

defineProps<{
  color: string
  rank: Rank
  suitId: string
}>()
</script>

<template>
  <!-- Center Big -->
  <use
    v-if="rank === 1"
    :xlink:href="suitId"
    :fill="color"
    height="164.8"
    width="164.8"
    x="-82.4"
    y="-82.4"
  ></use>
  <!-- Center -->
  <use
    v-if="rank === 3 || rank === 5 || rank === 9"
    :xlink:href="suitId"
    :fill="color"
    height="70"
    width="70"
    x="-35"
    y="-35"
  ></use>
  <!-- Top / Bottom -->
  <template v-if="rank === 2 || rank === 3">
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="-35"
      y="-135.501"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="-35"
      y="-135.501"
      transform="rotate(180)"
    ></use>
  </template>
  <!-- Top Left / Top Right / Bottom Left / Bottom Right -->
  <template v-if="typeof rank === 'number' && rank >= 4 && rank <= 10">
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="-87.501"
      y="-135.501"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="17.501"
      y="-135.501"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="-87.501"
      y="-135.501"
      transform="rotate(180)"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="17.501"
      y="-135.501"
      transform="rotate(180)"
    ></use>
  </template>
  <!-- Left / Right -->
  <template v-if="typeof rank === 'number' && rank >= 6 && rank <= 8">
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="-87.501"
      y="-35"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="17.501"
      y="-35"
    ></use>
  </template>
  <!-- Middle Top -->
  <use
    v-if="rank === 7 || rank === 8"
    :xlink:href="suitId"
    :fill="color"
    height="70"
    width="70"
    x="-35"
    y="-85.25"
  ></use>
  <!-- Middle Bottom -->
  <use
    v-if="rank === 8"
    :xlink:href="suitId"
    :fill="color"
    height="70"
    width="70"
    x="-35"
    y="-85.25"
    transform="rotate(180)"
  ></use>
  <!-- Middle Top Left / Middle Top Right / Middle Bottom Left / Middle Bottom Right -->
  <template v-if="rank === 9 || rank === 10">
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="-87.501"
      y="-68.5"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="17.501"
      y="-68.5"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="-87.501"
      y="-68.5"
      transform="rotate(180)"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="17.501"
      y="-68.5"
      transform="rotate(180)"
    ></use>
  </template>
  <!-- Middle Top / Middle Bottom -->
  <template v-if="rank === 10">
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="-35"
      y="-102"
    ></use>
    <use
      :xlink:href="suitId"
      :fill="color"
      height="70"
      width="70"
      x="-35"
      y="-102"
      transform="rotate(180)"
    ></use>
  </template>
</template>
