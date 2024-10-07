<script setup lang="ts">
import { playerId, playersReady } from "../store"

function ready() {
  Rune.actions.ready()
}
</script>

<template>
  <button
    :class="{ selected: playersReady.includes(playerId) }"
    type="button"
    @click="ready"
  >
    Ready
  </button>
</template>
