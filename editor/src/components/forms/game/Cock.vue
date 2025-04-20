<script setup lang="ts">
import type { Cock } from '@/types/game/body';

import { validBodyPartFlagsOptions, validBodyPartTypesOptions } from '@/stores/data';
import NestedGroup from '@/components/content/NestedGroup.vue';

import MultiSwitch from '@/components/forms/MultiSwitch.vue';
import Number from '@/components/forms/Number.vue';
import Select from '@/components/forms/Select.vue';
import String from '@/components/forms/String.vue';
import Switch from '@/components/forms/Switch.vue';

defineProps<{
  cock: Cock;
}>();
</script>

<template>
  <Switch v-model="cock.virgin" label="Is Virgin" />

  <Select v-model="cock.cType" :options="validBodyPartTypesOptions('cock')" label="Type" />

  <String v-model="cock.cockColor" label="Color" /> <!-- FIXME autocomplete -->

  <NestedGroup>
    <Number v-model="cock.cLengthRaw" label="Length" suffix="inches" :min="0" :step="1" />
    <Number v-model="cock.cLengthMod" label="Length Modifier" suffix="inches" :min="0" :step="1" />
  </NestedGroup>
  <NestedGroup>
    <Number v-model="cock.cThicknessRatioRaw" label="Thickness Ratio" :min="0" :step="1" />
    <Number v-model="cock.cThicknessRatioMod" label="Thickness Ratio Modifier" :min="0" :step="1" />
  </NestedGroup>

  <Number v-model="cock.knotMultiplier" label="Knot Multiplier" :min="0" :step="1" />

  <Number v-model="cock.flaccidMultiplier" label="Flaccid Multiplier" :min="0" :step="1" />

  <MultiSwitch v-model="cock.flags" :options="validBodyPartFlagsOptions('cock')" label="Flags" />
</template>
