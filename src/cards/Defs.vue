<script setup lang="ts">
import DefLetters from "../cards/DefLetters.vue"
import DefFiguresClub from "../cards/DefFiguresClub.vue"
import DefFiguresDiamond from "../cards/DefFiguresDiamond.vue"
import DefFiguresHeart from "../cards/DefFiguresHeart.vue"
import DefFiguresSpade from "../cards/DefFiguresSpade.vue"
import DefSuits from "../cards/DefSuits.vue"

import { withFiguresClub, withFiguresDiamond, withFiguresHeart, withFiguresSpade } from './store';
</script>

<template>
  <svg class="defs" viewBox="-120 -168 240 336">
    <defs>
      <DefLetters />
      <DefFiguresClub v-if="withFiguresClub" />
      <DefFiguresDiamond v-if="withFiguresDiamond" />
      <DefFiguresHeart v-if="withFiguresHeart" />
      <DefFiguresSpade v-if="withFiguresSpade" />
      <DefSuits />
    </defs>
  </svg>
</template>