<script setup lang="ts">
import type { BreastRow } from '@/types/game/body';

import data, { validBodyPartFlagsOptions, validBodyPartTypesOptions } from '@/stores/data';
import { safe as game } from '@/stores/game';

import { getCupSize } from '@/utils/general';

import Group from '@/components/content/Group.vue';
import IterableGroup from '@/components/content/IterableGroup.vue';
import NestedGroup from '@/components/content/NestedGroup.vue';
import Tab from '@/components/content/Tab.vue';

import MultiSwitch from '@/components/forms/MultiSwitch.vue';
import Number from '@/components/forms/Number.vue';
import Select from '@/components/forms/Select.vue';
import String from '@/components/forms/String.vue';

function addBreastRow(): BreastRow {
  return {
    classInstance: 'BreastRow',
    neverSerialize: false,
    version: 2,

    breasts: 2,
    nippleType: 0,
    areolaFlags: [],
    breastRatingRaw: 0,
    breastRatingMod: 0,
    breastRatingLactationMod: 0,
    breastRatingHoneypotMod: 0,
    fullness: 0,
    piercing: null,
  };
}

function getBreastRowLabel(breastRow: BreastRow) {
  const count = breastRow.breasts;
  const rating = breastRow.breastRatingRaw + breastRow.breastRatingMod + breastRow.breastRatingLactationMod + breastRow.breastRatingHoneypotMod;

  return `${count} ${getCupSize(rating)} breast${(count > 1 ? 's' : '')}`;
}
</script>

<template>
  <Tab>
    <IterableGroup v-model="game.character.breastRows" label="Breast Rows" :addItem="addBreastRow" :getItemLabel="getBreastRowLabel">
      <template #default="{ item: breastRow }">
        <Number v-model="breastRow.breasts" label="Breast Count" :min="1" :step="1" />

        <NestedGroup>
          <Number v-model="breastRow.breastRatingRaw" label="Cup Size" :min="0" :step="1" />
          <Number v-model="breastRow.breastRatingMod" label="Cup Size Modifier" :min="0" :step="1" />
        </NestedGroup>
        <NestedGroup>
          <Number v-model="breastRow.breastRatingLactationMod" label="Lactation Modifier" :min="0" :step="1" />
          <Number v-model="breastRow.breastRatingHoneypotMod" label="Honeypot Modifier" :min="0" :step="1" />
        </NestedGroup>

        <Select v-model="breastRow.nippleType" :options="data.options.nippleTypes" label="Nipple Type" />

        <MultiSwitch v-model="breastRow.areolaFlags" :options="validBodyPartFlagsOptions('areola')" label="Areola Flags" />
      </template>
    </IterableGroup>

    <Group label="Nipples">
      <String v-model="game.character.nippleColor" label="Nipple Color" /> <!-- FIXME autocomplete -->
      <Number v-model="game.character.nipplesPerBreast" label="Nipples per Breast" :min="0" :step="1" />

      <NestedGroup>
        <Number v-model="game.character.nippleLengthRatio" label="Nipple Length Ratio" :min="0" :step="1" />
        <Number v-model="game.character.nippleWidthRatio" label="Nipple Width Ratio" :min="0" :step="1" />
      </NestedGroup>

      <NestedGroup>
        <Select v-model="game.character.dickNippleType" :options="validBodyPartTypesOptions('cock')" label="DickNipple Type" />
        <Number v-model="game.character.dickNippleMultiplier" label="DickNipple Multiplier" :min="0" :step="1" />
      </NestedGroup>
    </Group>

    <Group label="Milk">
      <Select v-model="game.character.milkType" :options="data.options.fluidTypes" label="Milk Type" />
      <Number v-model="game.character.milkFullness" label="Milk Fullness" :min="0" :step="5" />
      <Number v-model="game.character.milkRate" label="Milk Rate" :min="0" :step="5" />
      <Number v-model="game.character.milkMultiplier" label="Milk Multiplier" :min="0" :step="5" />
      <Number v-model="game.character.milkStorageMultiplier" label="Milk Storage Multiplier" :min="0" :step="5" />
    </Group>
  </Tab>
</template>
