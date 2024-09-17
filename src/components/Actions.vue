<script setup lang="ts">
import { computed, ref } from "vue"

import {
  maxRoundBet,
  playerChips,
  playerId,
  playerBets,
  playerTurn,
} from "../store"

import Amount from "./Amount.vue"
import Chip from "./Chip.vue"

const minBet = computed(
  () => maxRoundBet.value - (playerBets.value[playerId.value] ?? 0)
)

const action = ref<"checkOrCall" | "fold" | "raise">()
const raiseValue = ref(minBet.value)

function select(type: "checkOrCall" | "fold" | "raise") {
  if (action.value === type) {
    action.value = undefined
  } else {
    action.value = type
  }
}

function confirm() {
  if (action.value) {
    Dusk.actions.action({
      type: action.value,
      amount: action.value === "checkOrCall" ? minBet.value : raiseValue.value,
    })
    action.value = undefined
  }
}
</script>

<template>
  <div v-if="playerTurn === playerId" class="actions">
    <div class="buttons">
      <button
        type="button"
        class="button"
        :class="{ selected: action === 'checkOrCall' }"
        @click="select('checkOrCall')"
      >
        {{ minBet === 0 ? "Check" : "Call" }}
      </button>
      <button
        type="button"
        class="button"
        :class="{ selected: action === 'raise' }"
        @click="select('raise')"
      >
        Raise
      </button>
      <button
        type="button"
        class="button"
        :class="{ selected: action === 'fold' }"
        @click="select('fold')"
      >
        Fold
      </button>
    </div>
    <div v-if="action" class="details">
      <div class="action">
        <div v-if="action === 'raise'" class="wrapper">
          <input
            v-model="raiseValue"
            class="input"
            type="number"
            step="1"
            :min="minBet"
            :max="playerChips[playerId]"
          />
          <Chip class="chip" />
        </div>
        <Amount v-if="action === 'checkOrCall'" :amount="minBet" />
      </div>
      <button type="button" class="button" @click="confirm">Confirm</button>
    </div>
  </div>
</template>

<style scoped>
.actions {
  position: absolute;
  left: 0;
  right: 0;
  top: 30%;
  padding: 0 calc(var(--size) * 5);
}
.buttons {
  display: flex;
  justify-content: space-between;
}
.details {
  display: flex;
  justify-content: space-between;
  margin-top: calc(var(--size) * 7.5);
  gap: calc(var(--size) * 7.5);
}
.wrapper {
  flex: 1;
  position: relative;
}
.input {
  width: 100%;
}
.chip {
  position: absolute;
  width: 1em;
  right: calc(var(--size) * 2);
  top: 50%;
  translate: 0 -50%;
}
.action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--size) * 10);
}
</style>
