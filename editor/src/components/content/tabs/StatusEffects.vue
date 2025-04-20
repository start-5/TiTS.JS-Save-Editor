<script setup lang="ts">
import data from '@/stores/data';
import { safe as game } from '@/stores/game';

import Storage from '@/components/forms/game/Storage.vue';
</script>

<template>
  <Storage v-model="game.character.statusEffects" :items="data.statusEffects" />
</template>
