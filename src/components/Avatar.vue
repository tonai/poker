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
  margin-top: var(--size);
  background-color: white;
  padding: var(--size);
  border-radius: calc(var(--size) * 2);
  font-size: calc(var(--size) * 5);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  position: absolute;
  max-width: 100%;
  box-sizing: border-box;
}
.name + .wrapper {
  margin-top: calc(var(--size) * 10);
}
.wrapper {
  aspect-ratio: 1 / 1;
  position: relative;
  width: 100%;
  max-width: calc(var(--size) * 15);
}
.image {
  display: block;
  border-radius: 50%;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  aspect-ratio: 1 / 1;
  left: 50%;
  translate: -50% 0;
}
/* .dealer {
  position: absolute;
  top: calc(var(--size) * -1);
  right: calc(var(--size) * -1);
} */
</style>
