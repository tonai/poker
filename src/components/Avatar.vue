<script setup lang="ts">
import { Player, PlayerId } from "dusk-games-sdk"
import { computed } from "vue"

const props = defineProps<{
  id?: PlayerId
  name?: boolean
  player?: Player
}>()

const player = computed(
  () => props.player ?? Dusk.getPlayerInfo(props.id ?? "")
)
</script>

<template>
  <div class="avatar">
    <div v-if="name" class="name">{{ player.displayName }}</div>
    <div class="wrapper">
      <img class="image" :src="player.avatarUrl" />
    </div>
  </div>
</template>

<style scoped>
.avatar {
  display: inline-flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 100%;
}
.name {
  text-align: center;
  margin-top: 1vw;
  background-color: white;
  padding: 1vw;
  border-radius: 2vw;
  font-size: 5vw;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  position: absolute;
  max-width: 100%;
  box-sizing: border-box;
}
.name + .wrapper {
  margin-top: 10vw;
}
.wrapper {
  aspect-ratio: 1 / 1;
  position: relative;
  width: 100%;
  max-width: 30vw;
}
.image {
  display: block;
  border: min(1vw, 0.5vh) solid var(--border-color);
  border-radius: 50%;
  background-color: var(--border-color);
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  aspect-ratio: 1 / 1;
  left: 50%;
  translate: -50% 0;
}
</style>