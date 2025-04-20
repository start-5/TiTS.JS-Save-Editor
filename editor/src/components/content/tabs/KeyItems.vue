<script setup lang="ts">
import data from '@/stores/data';
import { safe as game } from '@/stores/game';

import Storage from '@/components/forms/game/Storage.vue';
</script>

<template>
  <Storage v-model="game.character.keyItems" :items="data.keyItems" :editableKeys="['tooltip', 'value1', 'value2', 'value3', 'value4']" />
</template>
