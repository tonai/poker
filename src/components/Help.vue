<script setup lang="ts">
import { ref } from "vue"

import { Card } from "../cards"

const isOpened = ref(false)

function open() {
  isOpened.value = true
}

function close() {
  isOpened.value = false
}
</script>

<template>
  <button class="help-button open" type="button" @click="open">?</button>
  <div class="help-backdrop" :class="{ isOpened }" @click="close"></div>
  <div class="help" :class="{ isOpened }">
    <h2 class="title">Rankings</h2>
    <button className="help-button close" type="button" @click="close">
      ✕
    </button>
    <table class="table">
      <colgroup>
        <col class="col-name" />
        <col class="col-hand" />
      </colgroup>
      <tbody>
        <tr>
          <td>Straight Flush</td>
          <td>
            <div class="cards">
              <Card class="card" :rank="1" suit="♠" />
              <Card class="card" rank="K" suit="♠" />
              <Card class="card" rank="Q" suit="♠" />
              <Card class="card" rank="J" suit="♠" />
              <Card class="card" :rank="10" suit="♠" />
            </div>
          </td>
        </tr>
        <tr>
          <td>Four of a Kind</td>
          <td>
            <div class="cards">
              <Card class="card" rank="K" suit="♠" />
              <Card class="card" rank="K" suit="♣" />
              <Card class="card" rank="K" suit="♥" />
              <Card class="card" rank="K" suit="♦" />
            </div>
          </td>
        </tr>
        <tr>
          <td>Full House</td>
          <td>
            <div class="cards">
              <Card class="card" rank="K" suit="♠" />
              <Card class="card" rank="K" suit="♣" />
              <Card class="card" rank="K" suit="♥" />
              <Card class="card" :rank="5" suit="♣" />
              <Card class="card" :rank="5" suit="♦" />
            </div>
          </td>
        </tr>
        <tr>
          <td>Flush</td>
          <td>
            <div class="cards">
              <Card class="card" rank="Q" suit="♠" />
              <Card class="card" :rank="9" suit="♠" />
              <Card class="card" :rank="8" suit="♠" />
              <Card class="card" :rank="4" suit="♠" />
              <Card class="card" :rank="2" suit="♠" />
            </div>
          </td>
        </tr>
        <tr>
          <td>Straight</td>
          <td>
            <div class="cards">
              <Card class="card" :rank="5" suit="♥" />
              <Card class="card" :rank="4" suit="♣" />
              <Card class="card" :rank="3" suit="♦" />
              <Card class="card" :rank="2" suit="♥" />
              <Card class="card" :rank="1" suit="♦" />
            </div>
          </td>
        </tr>
        <tr>
          <td>Three of a Kind</td>
          <td>
            <div class="cards">
              <Card class="card" :rank="5" suit="♣" />
              <Card class="card" :rank="5" suit="♥" />
              <Card class="card" :rank="5" suit="♦" />
            </div>
          </td>
        </tr>
        <tr>
          <td>Two Pair</td>
          <td>
            <div class="cards">
              <Card class="card" :rank="5" suit="♣" />
              <Card class="card" :rank="5" suit="♦" />
              <Card class="card" :rank="3" suit="♠" />
              <Card class="card" :rank="3" suit="♣" />
            </div>
          </td>
        </tr>
        <tr>
          <td>One Pair</td>
          <td>
            <div class="cards">
              <Card class="card" :rank="5" suit="♥" />
              <Card class="card" :rank="5" suit="♦" />
            </div>
          </td>
        </tr>
        <tr>
          <td>High Card</td>
          <td>
            <div class="cards">
              <Card class="card" rank="K" suit="♥" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.help-button {
  position: absolute;
  display: inline-block;
  min-width: calc(var(--size) * 10);
  min-height: calc(var(--size) * 10);
  background-color: white;
  border-radius: calc(var(--size) * 5);
  border: 0;
  font-size: calc(var(--size) * 8);
  font-weight: bold;
}
.open {
  cursor: help;
  bottom: calc(var(--size) * 58);
  right: calc(var(--size) * 20);
  translate: 50% 0;
}
.close {
  top: calc(var(--size) * 5);
  right: calc(var(--size) * 5);
}
.help-backdrop {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  inset: 0;
  opacity: 0;
  z-index: 2;
  transition: opacity ease 0.3s;
  pointer-events: none;
}
.help-backdrop.isOpened {
  opacity: 1;
  pointer-events: all;
}
.help {
  position: absolute;
  border: 1px solid white;
  background-color: darkgreen;
  border-radius: calc(var(--size) * 5);
  color: white;
  padding: calc(var(--size) * 5) calc(var(--size) * 2) 0;
  font-size: calc(var(--size) * 6);
  inset: calc(var(--size) * 8);
  z-index: 3;
  translate: 200% 0;
  transition: translate ease 0.3s;
}
.help.isOpened {
  translate: 0 0;
}
.title {
  text-align: center;
  margin: 0 0 calc(var(--size) * 4);
  padding-right: calc(var(--size) * 15);
}
.table {
  width: 100%;
  font-size: calc(var(--size) * 5);
  text-align: right;
}
.table td {
  height: calc(var(--size) * 15);
  padding: var(--size);
}
.cards {
  display: flex;
  gap: var(--size);
}
.card {
  height: calc(var(--size) * 15);
}
</style>
