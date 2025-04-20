<script setup lang="ts">
import { safe as game } from '@/stores/game';

import Group from '@/components/content/Group.vue';
import Tab from '@/components/content/Tab.vue';

import Number from '@/components/forms/Number.vue';
import String from '@/components/forms/String.vue';
import Switch from '@/components/forms/Switch.vue';
</script>

<template>
  <Tab>
    <Group label="Save Slot">
      <String v-model="game.state.gameInstanceInfo.note" label="Note" />
    </Group>

    <Group label="Time">
      <Number v-model="game.state.days" label="Days" :min="0" :step="1" />
      <Number v-model="game.state.hours" label="Hours" :min="0" :max="23" :step="1" />
      <Number v-model="game.state.minutes" label="Minutes" :min="0" :max="59" :step="5" />
    </Group>

    <Group label="Miscellaneous">
      <String v-model="game.state.gameBuild" label="Game Build" readonly />
      <Switch v-model="game.state.debugMode" label="Debug Mode" />
    </Group>
  </Tab>
</template>
