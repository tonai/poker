<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"

import { bets } from "../store"
import { Position } from "../types"

import Amount from "./Amount.vue"
import ChipPile from "./ChipPile.vue"

defineProps<{
  playerPositions: Record<string, Position>
}>()

const animated = ref<boolean[]>([])
const totalRef = ref<HTMLDivElement>()
const totalPosition = computed(() => {
  if (totalRef.value) {
    const { height, left, top } = totalRef.value.getBoundingClientRect()
    return {
      left: `${left}px`,
      top: `calc(${top + height}px - var(--size)* 11)`,
    }
  }
  return {}
})
const total = ref(0)

function startTotalAnimation() {
  setTimeout(() => {
    total.value = bets.value.reduce((acc, { amount }) => acc + amount, 0)
  }, 1000)
}

function startBetAnimation(indexes: number[]) {
  setTimeout(() => indexes.forEach((i) => (animated.value[i] = true)), 100)
  startTotalAnimation()
}
const betLength = ref(bets.value.length)
watch(bets, () => {
  if (bets.value.length > betLength.value) {
    startBetAnimation([betLength.value]) // should increment 1 by 1
    betLength.value = bets.value.length
  }
})

onMounted(() => {
  startBetAnimation([0, 1])
})
</script>

<template>
  <ChipPile
    v-for="(bet, index) of bets"
    :key="index"
    :amount="bet.amount"
    class="pile"
    :style="animated[index] ? totalPosition : playerPositions[bet.id]"
  />
  <div class="pot">
    <div class="title">Pot</div>
    <div ref="totalRef" class="total">
      <ChipPile :amount="total" class="total-pile" />
    </div>
    <Amount :amount="total" class="amount" />
  </div>
</template>

<style scoped>
.pile {
  transition:
    top 1000ms cubic-bezier(0.28, 0.8, 0.5, 0.95),
    left 1000ms linear;
}
.pot {
  position: absolute;
  bottom: calc(var(--size) * 5);
  right: calc(var(--size) * 5);
  border: 1px solid white;
  border-radius: calc(var(--size) * 5);
  background-color: darkgreen;
  height: calc(var(--size) * 50);
  width: calc(var(--size) * 30);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: calc(var(--size) * 2) 0;
}
.title {
  font-size: calc(var(--size) * 7);
}
.total {
  flex: 1;
}
.total-pile {
  bottom: 0;
}
.pot .amount {
  font-size: calc(var(--size) * 7);
}
</style>
