<script setup lang="ts">
import data, { validBodyPartFlagsOptions, validBodyPartTypesOptions } from '@/stores/data';
import { safe as game } from '@/stores/game';

import Group from '@/components/content/Group.vue';
import Tab from '@/components/content/Tab.vue';

import MultiSwitch from '@/components/forms/MultiSwitch.vue';
import Number from '@/components/forms/Number.vue';
import Select from '@/components/forms/Select.vue';
import String from '@/components/forms/String.vue';
</script>

<template>
  <Tab>
    <Group label="Face">
      <Select v-model="game.character.faceType" :options="validBodyPartTypesOptions('face')" label="Face Type" />
      <MultiSwitch v-model="game.character.faceFlags" :options="validBodyPartFlagsOptions('face')" label="Face Flags" />
    </Group>

    <Group label="Eyes">
      <Select v-model="game.character.eyeType" :options="validBodyPartTypesOptions('eye')" label="Eye Type" />
      <String v-model="game.character.eyeColor" label="Eye Color" /> <!-- FIXME autocomplete -->
    </Group>

    <Group label="Ears">
      <Select v-model="game.character.earType" :options="validBodyPartTypesOptions('ear')" label="Ear Type" />
      <Number v-model="game.character.earLength" label="Ear Length" suffix="inches" :min="0" :step="1" />
      <MultiSwitch v-model="game.character.earFlags" :options="validBodyPartFlagsOptions('ear')" label="Ear Flags" />
    </Group>

    <Group label="Lips">
      <String v-model="game.character.lipColor" label="Lip Color" /> <!-- FIXME autocomplete -->
      <Number v-model="game.character.lipMod" label="Lip Size" :min="0" :step="1" />
    </Group>

    <Group label="Tongue">
      <Select v-model="game.character.tongueType" :options="validBodyPartTypesOptions('tongue')" label="Tongue Type" />
      <MultiSwitch v-model="game.character.tongueFlags" :options="validBodyPartFlagsOptions('tongue')" label="Tongue Flags" />
    </Group>

    <Group label="Hair">
      <Select v-model="game.character.hairType" :options="data.options.hairTypes" label="Hair Type" />
      <Number v-model="game.character.hairLength" label="Hair Length" suffix="inches" :min="0" :step="1" />
      <String v-model="game.character.hairColor" label="Hair Color" /> <!-- FIXME autocomplete -->
      <Select v-model="game.character.hairStyle" :options="data.options.hairStyles" label="Hair Style" />
    </Group>

    <Group label="Beard">
      <Number v-model="game.character.beardLength" label="Beard Length" suffix="inches" :min="0" :step="1" />
      <Select v-model="game.character.beardType" :options="data.options.hairTypes" label="Beard Type" />
      <Select v-model="game.character.beardStyle" :options="data.options.beardStyles" label="Beard Style" />
    </Group>

    <Group label="Horns">
      <Select v-model="game.character.hornType" :options="validBodyPartTypesOptions('horn')" label="Horn Type" />
      <Number v-model="game.character.horns" label="Horn Count" :min="0" :step="1" />
      <Number v-model="game.character.hornLength" label="Horn Length" suffix="inches" :min="0" :step="1" />
    </Group>

    <Group label="Antennae">
      <Select v-model="game.character.antennaeType" :options="validBodyPartTypesOptions('antennae')" label="Antennae Type" />
      <Number v-model="game.character.antennae" label="Antennae Count" :min="0" :step="1" />
    </Group>
  </Tab>
</template>
