<script setup lang="ts">
import { computed, ref } from "vue"

import {
  blind,
  maxRoundBet,
  playerChips,
  playerId,
  playerBets,
  roundBets,
} from "../store"

import Amount from "./Amount.vue"
import Chip from "./Chip.vue"

const checkOrCallBet = computed(
  () => maxRoundBet.value - (playerBets.value[playerId.value] ?? 0)
)
const minRaise = computed(
  () =>
    roundBets.value.find(({ type }) => type === "raise")?.raise ?? blind.value
)

const action = ref<"checkOrCall" | "fold" | "raise">()
const raiseValue = ref(minRaise.value)

function select(type: "checkOrCall" | "fold" | "raise") {
  if (action.value === type) {
    action.value = undefined
  } else {
    action.value = type
  }
}

function confirm() {
  if (action.value) {
    if (action.value === "checkOrCall") {
      Dusk.actions.action({
        type: action.value,
        amount: checkOrCallBet.value,
      })
    } else if (action.value === "raise") {
      Dusk.actions.action({
        type: action.value,
        amount: raiseValue.value + checkOrCallBet.value,
        raise: raiseValue.value,
      })
    } else {
      Dusk.actions.action({
        type: action.value,
        amount: 0,
      })
    }
    action.value = undefined
  }
}
</script>

<template>
  <div class="actions">
    <div class="buttons">
      <button
        type="button"
        class="button"
        :class="{ selected: action === 'checkOrCall' }"
        @click="select('checkOrCall')"
      >
        {{ checkOrCallBet === 0 ? "Check" : "Call" }}
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
      <div v-if="action === 'raise'" class="field">
        <label for="raise">{{ checkOrCallBet }} +&nbsp;</label>
        <input
          id="raise"
          v-model="raiseValue"
          class="input"
          type="number"
          step="1"
          :min="minRaise"
          :max="playerChips[playerId] - checkOrCallBet"
        />
        <Chip class="chip" />
      </div>
      <Amount
        v-if="action === 'checkOrCall'"
        class="checkOrCall"
        :amount="checkOrCallBet"
      />
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
.field {
  flex: 1;
}
.chip {
  position: absolute;
  width: 1em;
  right: calc(var(--size) * 2);
  top: 50%;
  translate: 0 -50%;
}
.checkOrCall {
  font-size: calc(var(--size) * 8);
  flex: 1;
}
/* .action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--size) * 10);
} */
</style>
