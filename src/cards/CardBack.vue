<script setup lang="ts">
import Background from "./Background.vue"
import Back from "./Back.vue"
</script>

<template>
  <svg class="card-back" viewBox="-120 -168 240 336">
    <Background />
    <Back />
  </svg>
</template>

<style scoped>
.card-back {
  aspect-ratio: 25 / 35;
}
</style>
