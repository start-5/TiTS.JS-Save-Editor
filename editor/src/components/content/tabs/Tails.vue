<script setup lang="ts">
import { validBodyPartFlagsOptions, validBodyPartTypesOptions } from '@/stores/data';
import { safe as game } from '@/stores/game';

import Group from '@/components/content/Group.vue';
import Tab from '@/components/content/Tab.vue';

import Cock from '@/components/forms/game/Cock.vue';
import Vagina from '@/components/forms/game/Vagina.vue';

import MultiSwitch from '@/components/forms/MultiSwitch.vue';
import Number from '@/components/forms/Number.vue';
import Select from '@/components/forms/Select.vue';
</script>

<template>
  <Tab>
    <Group label="Tail">
      <Select v-model="game.character.tailType" :options="validBodyPartTypesOptions('tail')" label="Tail Type" />
      <Number v-model="game.character.tailCount" label="Tail Count" :min="0" :step="1" />
      <MultiSwitch v-model="game.character.tailFlags" :options="validBodyPartFlagsOptions('tail')" label="Tail Flags" />
    </Group>

    <Group label="Tailcock">
      <Cock :cock="game.character.tailCock" />
    </Group>

    <Group label="Tailcunt">
      <Vagina :vagina="game.character.tailCunt" />
    </Group>
  </Tab>
</template>
