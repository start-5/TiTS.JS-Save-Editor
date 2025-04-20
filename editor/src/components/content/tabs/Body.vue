<script setup lang="ts">
import data, { validBodyPartFlagsOptions, validBodyPartTypesOptions } from '@/stores/data';
import { safe as game } from '@/stores/game';

import Group from '@/components/content/Group.vue';
import NestedGroup from '@/components/content/NestedGroup.vue';
import Tab from '@/components/content/Tab.vue';

import MultiSwitch from '@/components/forms/MultiSwitch.vue';
import Number from '@/components/forms/Number.vue';
import Select from '@/components/forms/Select.vue';
import String from '@/components/forms/String.vue';
import Switch from '@/components/forms/Switch.vue';
</script>

<template>
  <Tab>
    <Group label="Torso">
      <NestedGroup>
        <Number v-model="game.character.hipRatingRaw" label="Hip Size" :min="0" :step="1" />
        <Number v-model="game.character.hipRatingMod" label="Hip Size Modifier" :min="0" :step="1" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.bellyRatingRaw" label="Belly Size" :min="0" :step="1" />
        <Number v-model="game.character.bellyRatingMod" label="Belly Size Modifier" :min="0" :step="1" />
      </NestedGroup>
    </Group>

    <Group label="Skin">
      <Select v-model="game.character.skinType" :options="data.options.skinTypes" label="Skin Type" />

      <String v-model="game.character.skinTone" label="Skin Tone" /> <!-- FIXME autocomplete -->
      <String v-model="game.character.skinAccent" label="Skin Accent" /> <!-- FIXME autocomplete -->
      <String v-model="game.character.furColor" label="Fur Color" /> <!-- FIXME autocomplete -->
      <String v-model="game.character.scaleColor" label="Scale Color" /> <!-- FIXME autocomplete -->

      <MultiSwitch v-model="game.character.skinFlags" :options="validBodyPartFlagsOptions('skin')" label="Skin Flags" />
    </Group>

    <Group label="Ass">
      <Switch v-model="game.character.analVirgin" label="Is Virgin" />

      <NestedGroup>
        <Number v-model="game.character.buttRatingRaw" label="Size" :min="0" :step="1" />
        <Number v-model="game.character.buttRatingMod" label="Size Modifier" :min="0" :step="1" />
      </NestedGroup>

      <Number v-model="game.character.ass.bonusCapacity" label="Bonus Capacity" :min="0" :step="10" />
      <Number v-model="game.character.ass.minLooseness" label="Minimum Looseness" :min="0" :step="1" />

      <NestedGroup>
        <Number v-model="game.character.ass.loosenessRaw" label="Looseness" :min="0" :step="1" />
        <Number v-model="game.character.ass.loosenessMod" label="Looseness Modifier" :min="0" :step="1" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.ass.wetnessRaw" label="Wetness" :min="0" :step="1" />
        <Number v-model="game.character.ass.wetnessMod" label="Wetness Modifier" :min="0" :step="1" />
      </NestedGroup>

      <Number v-model="game.character.ass.shrinkCounter" label="Shrink Counter" :min="0" :step="5" />

      <MultiSwitch v-model="game.character.ass.flags" :options="validBodyPartFlagsOptions('ass')" label="Flags" />
    </Group>

    <Group label="Arms">
      <Select v-model="game.character.armType" :options="validBodyPartTypesOptions('arm')" label="Arm Type" />
      <MultiSwitch v-model="game.character.armFlags" :options="validBodyPartFlagsOptions('arm')" label="Arm Flags" />
    </Group>

    <Group label="Wings">
      <Select v-model="game.character.wingType" :options="validBodyPartTypesOptions('wing')" label="Wing Type" />
      <Number v-model="game.character.wingCount" label="Wing Count" :min="0" :step="1" />
    </Group>

    <Group label="Legs">
      <Select v-model="game.character.legType" :options="validBodyPartTypesOptions('leg')" label="Leg Type" />
      <Number v-model="game.character.legCount" label="Leg Count" :min="0" :step="1" />
      <MultiSwitch v-model="game.character.legFlags" :options="validBodyPartFlagsOptions('leg')" label="Leg Flags" />
    </Group>

    <Group label="Miscellaneous">
      <Switch v-model="game.character.gills" label="Has Gills" />
      <Number v-model="game.character.elasticity" label="Elasticity" :min="0" :step="1" />
      <Select v-model="game.character.genitalSpot" :options="data.options.genitalSpots" label="Genital Spot" />
      <MultiSwitch v-model="game.character.crotchFlags" :options="validBodyPartFlagsOptions('crotch')" label="Crotch Flags" />
    </Group>
  </Tab>
</template>
