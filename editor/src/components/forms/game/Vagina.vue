<script setup lang="ts">
import type { Vagina } from '@/types/game/body';

import { validBodyPartFlagsOptions, validBodyPartTypesOptions } from '@/stores/data';
import NestedGroup from '@/components/content/NestedGroup.vue';

import MultiSwitch from '@/components/forms/MultiSwitch.vue';
import Number from '@/components/forms/Number.vue';
import Select from '@/components/forms/Select.vue';
import String from '@/components/forms/String.vue';
import Switch from '@/components/forms/Switch.vue';

defineProps<{
  vagina: Vagina;
}>();
</script>

<template>
  <Switch v-model="vagina.hymen" label="Is Virgin" />

  <Select v-model="vagina.type" :options="validBodyPartTypesOptions('vagina')" label="Type" />

  <String v-model="vagina.vaginaColor" label="Color" /> <!-- FIXME autocomplete -->

  <Number v-model="vagina.bonusCapacity" label="Bonus Capacity" :min="0" :step="5" />
  <Number v-model="vagina.minLooseness" label="Minimum Looseness" :min="0" :step="1" />

  <NestedGroup>
    <Number v-model="vagina.loosenessRaw" label="Looseness" :min="0" :step="1" />
    <Number v-model="vagina.loosenessMod" label="Looseness Modifier" :min="0" :step="1" />
  </NestedGroup>
  <NestedGroup>
    <Number v-model="vagina.wetnessRaw" label="Wetness" :min="0" :step="1" />
    <Number v-model="vagina.wetnessMod" label="Wetness Modifier" :min="0" :step="1" />
  </NestedGroup>

  <Number v-model="vagina.clits" label="Clit Count" :min="1" :step="1" />

  <Number v-model="vagina.shrinkCounter" label="Shrink Counter" :min="0" :step="5" />

  <MultiSwitch v-model="vagina.flags" :options="validBodyPartFlagsOptions('vagina')" label="Flags" />
</template>
