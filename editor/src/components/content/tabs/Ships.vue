<script setup lang="ts">
import type { Ship } from '@/types/game/ship';

import { safe as game } from '@/stores/game';

import Group from '@/components/content/Group.vue';

import Iterable from '@/components/layout/Iterable.vue';

import ShipComponent from '@/components/forms/game/Ship.vue';

function getShipLabel(ship: Ship) {
  return ship.short;
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <Group label="Active">
      <Iterable :items="game.state.ships" :getItemLabel="getShipLabel" addDisabled removeDisabled>
        <template #default="{ item: ship }">
          <ShipComponent :ship />
        </template>
      </Iterable>
    </Group>

    <Group label="Inactive">
      <Iterable :items="game.state.inactivePlayerOwnedShips" :getItemLabel="getShipLabel" addDisabled removeDisabled>
        <template #default="{ item: ship }">
          <ShipComponent :ship />
        </template>
      </Iterable>
    </Group>
  </div>
</template>
