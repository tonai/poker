<script setup lang="ts">
import { playerId, playersReady } from '../store'

function ready() {
  Dusk.actions.ready()
}
</script>

<template>
  <button :class="{ selected: playersReady.includes(playerId) }" type="button" @click="ready">Ready</button>
</template>
