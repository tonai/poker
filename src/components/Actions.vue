<script setup lang="ts">
import { computed, ref } from "vue"

import { getAction } from "../helpers"
import {
  blind,
  disableRaise,
  maxRoundBet,
  playerChips,
  playerId,
  playerBets,
  roundBets,
} from "../store"

import Amount from "./Amount.vue"
import Chip from "./Chip.vue"
import { playSound } from "@tonai/game-utils"

type GroupedActionType = "allIn" | "check" | "fold" | "raise"

const checkOrCallBet = computed(
  () => maxRoundBet.value - (playerBets.value[playerId.value] ?? 0)
)
const minRaise = computed(
  () => roundBets.value.find(({ raise }) => raise)?.raise ?? blind.value
)

const action = ref<GroupedActionType>()
const raiseValue = ref(minRaise.value)

function select(type: GroupedActionType) {
  playSound("select")
  if (action.value === type) {
    action.value = undefined
  } else {
    action.value = type
  }
}

function confirm() {
  if (action.value) {
    playSound("confirm")
    Rune.actions.action(
      getAction(
        checkOrCallBet.value,
        action.value === "raise"
          ? raiseValue.value
          : action.value === "allIn"
            ? playerChips.value[playerId.value] - checkOrCallBet.value
            : 0,
        playerChips.value[playerId.value],
        action.value
      )
    )
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
        :class="{ selected: action === 'check' }"
        :disabled="checkOrCallBet > playerChips[playerId]"
        @click="select('check')"
      >
        {{ checkOrCallBet === 0 ? "Check" : "Call" }}
      </button>
      <button
        type="button"
        class="button"
        :class="{ selected: action === 'raise' }"
        :disabled="minRaise > playerChips[playerId] || disableRaise"
        @click="select('raise')"
      >
        Raise
      </button>
      <button
        type="button"
        class="button"
        :class="{ selected: action === 'allIn' }"
        @click="select('allIn')"
      >
        All-in
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
        v-if="action === 'check'"
        class="checkOrCall"
        :amount="checkOrCallBet"
      />
      <button type="button" class="button confirm" @click="confirm">
        Confirm
      </button>
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
.confirm {
  margin-left: auto;
}
</style>
