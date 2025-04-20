<script setup lang="ts">
import type { DamageTypeCollection } from '@/types/game/character';

import data from '@/stores/data';

import Number from '@/components/forms/Number.vue';

defineProps<{
  collection: DamageTypeCollection;
}>();
</script>

<template>
  <Number v-for="(_, index) in collection.values" v-model="collection.values[index]" :label="data.options.damageTypes[index].label" :min="-100" :max="100" :step="10" />
</template>
