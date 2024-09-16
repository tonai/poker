<script setup lang="ts">
import { computed } from "vue"

import { Rank, Suit } from "../types"

const props = defineProps<{
  n: number
  rank: Rank
  suit: Suit
}>()

const linkId = computed(() => `#${props.rank}-${props.suit}-${props.n}`)
</script>

<template>
  <use
    :xlink:href="linkId"
    width="164.8"
    height="260.8"
    x="-82.4"
    y="-130.4"
  ></use>
</template>
