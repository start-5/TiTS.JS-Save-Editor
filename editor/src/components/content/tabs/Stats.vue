<script setup lang="ts">
import { safe as game } from '@/stores/game';

import Group from '@/components/content/Group.vue';
import NestedGroup from '@/components/content/NestedGroup.vue';
import Tab from '@/components/content/Tab.vue';

import DamageTypeCollection from '@/components/forms/game/DamageTypeCollection.vue';

import Number from '@/components/forms/Number.vue';
</script>

<template>
  <Tab>
    <Group label="Core">
      <NestedGroup>
        <Number v-model="game.character.Internal_aimRaw" label="Aim" :min="0" :step="5" />
        <Number v-model="game.character.aimMod" label="Aim Modifier" :min="0" :step="5" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.Internal_intelligenceRaw" label="Intelligence" :min="0" :step="5" />
        <Number v-model="game.character.intelligenceMod" label="Intelligence Modifier" :min="0" :step="5" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.Internal_physiqueRaw" label="Physique" :min="0" :step="5" />
        <Number v-model="game.character.physiqueMod" label="Physique Modifier" :min="0" :step="5" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.Internal_reflexesRaw" label="Reflexes" :min="0" :step="5" />
        <Number v-model="game.character.reflexesMod" label="Reflexes Modifier" :min="0" :step="5" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.Internal_willpowerRaw" label="Willpower" :min="0" :step="5" />
        <Number v-model="game.character.willpowerMod" label="Willpower Modifier" :min="0" :step="5" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.Internal_libidoRaw" label="Libido" :min="0" :step="5" />
        <Number v-model="game.character.libidoMod" label="Libido Modifier" :min="0" :step="5" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.Internal_taintRaw" label="Taint" :min="0" :step="5" />
        <Number v-model="game.character.taintMod" label="Taint Modifier" :min="0" :step="5" />
      </NestedGroup>
    </Group>

    <Group label="Combat">
      <NestedGroup>
        <Number v-model="game.character.HPRaw" label="Hit Points" :min="0" :step="100" />
        <Number v-model="game.character.HPMod" label="Hit Points Modifier" :min="0" :step="100" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.energyRaw" label="Energy" :min="0" :step="100" />
        <Number v-model="game.character.energyMod" label="Energy Modifier" :min="0" :step="100" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.lustRaw" label="Lust" :min="0" :step="5" />
        <Number v-model="game.character.lustMod" label="Lust Modifier" :min="0" :step="5" />
      </NestedGroup>

      <Number v-model="game.character.shieldsRaw" label="Shields" :min="0" :step="100" />
    </Group>

    <Group label="Pregnancy">
      <NestedGroup>
        <Number v-model="game.character.pregnancyMultiplierRaw" label="Quantity Multiplier" :min="0" :step="1" />
        <Number v-model="game.character.pregnancyMultiplierMod" label="Quantity Multiplier Modifier" :min="0" :step="1" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.pregnancyIncubationBonusMotherRaw" label="Incubation (Mother)" :min="0" :step="1" />
        <Number v-model="game.character.pregnancyIncubationBonusMotherMod" label="Incubation (Mother) Modifier" :min="0" :step="1" />
      </NestedGroup>
      <NestedGroup>
        <Number v-model="game.character.pregnancyIncubationBonusFatherRaw" label="Incubation (Father)" :min="0" :step="1" />
        <Number v-model="game.character.pregnancyIncubationBonusFatherMod" label="Incubation (Father) Modifier" :min="0" :step="1" />
      </NestedGroup>
    </Group>

    <Group label="Hit Point Resistances">
      <DamageTypeCollection :collection="game.character.baseHPResistances" />
    </Group>

    <Group label="Shield Resistances">
      <DamageTypeCollection :collection="game.character.baseShieldResistances" />
    </Group>
  </Tab>
</template>
