<script setup lang="ts">
import type { Ship } from '@/types/game/ship';

import Group from '@/components/content/Group.vue';
import NestedGroup from '@/components/content/NestedGroup.vue';
import Tab from '@/components/content/Tab.vue';

import Number from '@/components/forms/Number.vue';
import String from '@/components/forms/String.vue';
import Switch from '@/components/forms/Switch.vue';

defineProps<{
  ship: Ship;
}>();
</script>

<template>
  <Tab class="lg:!grid-cols-2">
    <Group label="General">
      <String v-model="ship.short" label="Name" />
      <String v-model="ship.modelDisplay" label="Manufacturer / Model" />
      <String v-if="ship.classInstance !== 'Sidewinder'" v-model="ship.long" label="Description" />
    </Group>

    <Group label="Stats">
      <Number v-model="ship.level" label="Level" :min="0" :step="1" />

      <Number v-model="ship.shieldsRaw" label="Shields" :min="0" :step="10" />
      <NestedGroup>
        <Number v-model="ship.HPRaw" label="Armor" :min="0" :step="10" />
        <Number v-model="ship.HPMod" label="Armor Modifier" :min="0" :step="10" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="ship.energyRaw" label="Energy" :min="0" :step="10" />
        <Number v-model="ship.energyMod" label="Energy Modifier" :min="0" :step="10" />
      </NestedGroup>
      <Number v-model="ship.powerRaw" label="Power" :min="0" :step="5" />
      <Number v-model="ship.agilityRaw" label="Agility" :min="0" :step="5" />
      <Number v-model="ship.sensorsRaw" label="Sensors" :min="0" :step="5" />
      <Number v-model="ship.systemsRaw" label="Systems" :min="0" :step="5" />
      <Number v-model="ship.speedRaw" label="Thrust" :min="0" :step="5" />
    </Group>

    <Group label="Storage Capacity">
      <Number v-model="ship.capacityRaw" label="Modules / Crew" :min="0" :step="5" />
      <Number v-model="ship.wardrobeSizeRaw" label="Wardrobe" :min="0" :step="5" />
      <Number v-model="ship.equipmentSizeRaw" label="Equipment" :min="0" :step="5" />
      <Number v-model="ship.consumableSizeRaw" label="Consumables" :min="0" :step="5" />
      <Number v-model="ship.valuablesSizeRaw" label="Valuables" :min="0" :step="5" />
      <Number v-model="ship.toysSizeRaw" label="Toys" :min="0" :step="5" />
      <Number v-model="ship.gunCapacityRaw" label="Weapons" :min="0" :step="5" />
    </Group>

    <Group label="Miscellaneous">
      <Switch v-model="ship.holodeck" label="Has Holodeck" />
    </Group>
  </Tab>
</template>
