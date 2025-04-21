<script setup lang="ts">
import { watch } from 'vue';

import data from '@/stores/data';
import { safe as game, isPc } from '@/stores/game';

import Group from '@/components/content/Group.vue';
import Tab from '@/components/content/Tab.vue';

import Number from '@/components/forms/Number.vue';
import Select from '@/components/forms/Select.vue';
import String from '@/components/forms/String.vue';

watch(
  function () {
    return game.character.short;
  },
  function (value) {
    game.state.gameInstanceInfo.name = value;

    if (game.character.uniqueName != null) {
      game.character.uniqueName = value;
    }

    // FIXME change mail state
  },
);

watch(
  function () {
    return game.character.level;
  },
  function (value) {
    if (!isPc(game.character)) {
      return;
    }

    game.state.gameInstanceInfo.level = value;
  },
);
</script>

<template>
  <Tab>
    <Group label="General">
      <String v-model="game.character.short" label="Name" />
      <Select v-model="game.character.characterClass" :options="data.options.classes" label="Class" />
      <Select v-model="game.state.flags.PC_UPBRINGING" :options="data.options.upbringings" label="Upbringing" />
      <Number v-model="game.character.credits" label="Credits" :min="0" :step="1000" />
      <Number v-model="game.character.personality" label="Personality" :min="0" :max="100" :step="5" />
      <Number v-model="game.character.exhibitionismRaw" label="Exhibitionism" :min="0" :max="100" :step="5" />
    </Group>

    <Group label="Advancement">
      <Number v-model="game.character.level" label="Level" :step="1" />

      <template v-if="isPc(game.character)">
        <Number v-model="game.character.XPRaw" label="XP" :min="0" :step="1000" />
        <Number v-model="game.character.pendingStatPoints" label="Pending Stat Points" :min="0" :step="1" />
        <Number v-model="game.character.unspentStatPoints" label="Unspent Stat Points" :min="0" :step="1" />
        <Number v-model="game.character.unclaimedClassPerks" label="Unclaimed Class Perks" :min="0" :step="1" />
        <Number v-model="game.character.unclaimedGenericPerks" label="Unclaimed Generic Perks" :min="0" :step="1" />
      </template>
    </Group>

    <Group label="Appearance">
      <Number v-model="game.character.tallness" label="Height" suffix="inches" :min="0" :step="5" />
      <Number v-model="game.character.thickness" label="Thickness" :min="0" :max="100" :step="5" />
      <Number v-model="game.character.tone" label="Muscle Tone" :min="0" :max="100" :step="5" />
      <Number v-model="game.character.femininity" label="Femininity" :step="5" />
    </Group>
  </Tab>
</template>
