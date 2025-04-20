<script setup lang="ts">
import type { Cock, Vagina } from '@/types/game/body';

import data from '@/stores/data';
import { safe as game } from '@/stores/game';

import Group from '@/components/content/Group.vue';
import IterableGroup from '@/components/content/IterableGroup.vue';
import NestedGroup from '@/components/content/NestedGroup.vue';
import Tab from '@/components/content/Tab.vue';

import CockComponent from '@/components/forms/game/Cock.vue';
import VaginaComponent from '@/components/forms/game/Vagina.vue';

import Number from '@/components/forms/Number.vue';
import Select from '@/components/forms/Select.vue';
import Switch from '@/components/forms/Switch.vue';

function addCock(): Cock {
  return {
    classInstance: 'Cock',
    neverSerialize: false,
    version: 3,

    cLengthRaw: 5.5,
    cLengthMod: 0,
    cThicknessRatioRaw: 1,
    cThicknessRatioMod: 0,
    cType: 0,
    cockColor: 'pink',
    knotMultiplier: 1,
    flaccidMultiplier: 0.25,
    virgin: true,
    flags: [],
    piercing: null,
    cocksock: null,
  };
}

function getCockLabel(cock: Cock) {
  const color = cock.cockColor;
  const length = cock.cLengthRaw + cock.cLengthMod;

  const type = data.options.bodyPartTypes.find(function (option) {
    return option.value === cock.cType;
  })?.label.toLowerCase() ?? 'unknown';

  return `A ${color} ${length}" ${type} cock`;
}

function addVagina(): Vagina {
  return {
    classInstance: 'Vagina',
    neverSerialize: false,
    version: 3,

    type: 0,
    hymen: true,
    clits: 1,
    vaginaColor: 'pink',
    wetnessRaw: 1,
    wetnessMod: 0,
    loosenessRaw: 1,
    loosenessMod: 0,
    minLooseness: 1,
    bonusCapacity: 0,
    shrinkCounter: 0,
    flags: [],
    fullness: 0,
    piercing: null,
    clitPiercing: null,
  };
}

function getVaginaLabel(vagina: Vagina) {
  const color = vagina.vaginaColor;

  const type = data.options.bodyPartTypes.find(function (option) {
    return option.value === vagina.type;
  })?.label.toLowerCase() ?? 'unknown';

  return `A ${color} ${type} vagina`;
}
</script>

<template>
  <Tab class="lg:!grid-cols-2">
    <Group label="Male Organs">
      <Switch v-model="game.character.cockVirgin" label="Is Cock Virgin" />

      <Number v-model="game.character.balls" label="Ball Count" :min="0" :step="1" />
      <NestedGroup>
        <Number v-model="game.character.ballSizeRaw" label="Ball Size" suffix="inches" :min="0" :step="1" />
        <Number v-model="game.character.ballSizeMod" label="Ball Size Modifier" suffix="inches" :min="0" :step="1" />
      </NestedGroup>
      <Number v-model="game.character.Internal_ballFullness" label="Ball Fullness" :min="0" :step="10" />
      <Number v-model="game.character.Internal_ballEfficiency" label="Ball Efficiency" :min="0" :step="10" />

      <Select v-model="game.character.cumType" :options="data.options.fluidTypes" label="Cum Type" />
      <NestedGroup>
        <Number v-model="game.character.cumMultiplierRaw" label="Cum Multiplier" :min="0" :step="10" />
        <Number v-model="game.character.cumMultiplierMod" label="Cum Multiplier Modifier" :min="0" :step="10" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.cumQualityRaw" label="Cum Quality" :min="0" :step="10" />
        <Number v-model="game.character.cumQualityMod" label="Cum Quality Modifier" :min="0" :step="10" />
      </NestedGroup>

      <Number v-model="game.character.refractoryRate" label="Refractory Rate" :min="0" :step="5" />

    </Group>

    <IterableGroup v-model="game.character.cocks" label="Cocks" :addItem="addCock" :getItemLabel="getCockLabel">
      <template #default="{ item: cock }">
        <CockComponent :cock />
      </template>
    </IterableGroup>

    <Group label="Female Organs">
      <Switch v-model="game.character.vaginalVirgin" label="Is Vaginal Virgin" />

      <NestedGroup>
        <Number v-model="game.character.fertilityRaw" label="Fertility" :min="0" :step="1" />
        <Number v-model="game.character.fertilityMod" label="Fertility Modifier" :min="0" :step="1" />
      </NestedGroup>

      <Select v-model="game.character.girlCumType" :options="data.options.fluidTypes" label="Girl Cum Type" />
      <NestedGroup>
        <Number v-model="game.character.girlCumMultiplierRaw" label="Girl Cum Multiplier" :min="0" :step="10" />
        <Number v-model="game.character.girlCumMultiplierMod" label="Girl Cum Multiplier Modifier" :min="0" :step="10" />
      </NestedGroup>

      <Number v-model="game.character.clitLength" label="Clit Length" suffix="inches" :min="0" :step="1" />
    </Group>

    <IterableGroup v-model="game.character.vaginas" label="Vaginas" :addItem="addVagina" :getItemLabel="getVaginaLabel">
      <template #default="{ item: vagina }">
        <VaginaComponent :vagina />
      </template>
    </IterableGroup>
  </Tab>
</template>
