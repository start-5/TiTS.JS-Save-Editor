<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { SelectOptions } from '@shared/types/editor/ui';
import type { FlagValue } from '@/types/game/flags';

import data from '@/stores/data';
import { safe as game } from '@/stores/game';

import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

import MultiButton from '@/components/buttons/MultiButton.vue';
import String from '@/components/forms/String.vue';

type Filter = {
  defined: boolean | null;
  search: string | null;
};

const scrollerForceRenderKey = ref(0);

const filter = ref<Filter>(getDefaultFilter());

const definedOptions: SelectOptions<boolean> = [
  {
    value: true,
    label: 'Defined',
  },
  {
    value: false,
    label: 'Undefined',
  },
];

const flags = computed(function () {
  const existingFlags = Object.keys(game.state.flags);

  const edgeCases = [
    '',
    'artistOverrides',
    'customMannequin',
    'pathOverrides',
    'savedSpreadsheets',
  ];

  let flags = existingFlags
    .concat(data.flags.filter(function (a) {
      return !existingFlags.some(function (b) {
        return a === b;
      });
    }))
    .filter(function (flag) {
      return !edgeCases.includes(flag);
    })
    .sort(function (a, b) {
      return a.localeCompare(b);
    });

  if (flags.length === 0) {
    return flags;
  }

  if (filter.value.defined !== null) {
    flags = flags.filter(filter.value.defined ? isDefined : isNotDefined);
  }

  if (flags.length === 0) {
    return flags;
  }

  if (filter.value.search !== null) {
    const search = filter.value.search.toLowerCase();

    flags = flags.filter(function (flag) {
      return flag.toLowerCase().includes(search);
    });
  }

  return flags;
});

watch(
  filter,
  function () {
    scrollerForceRenderKey.value++;
  },
  {
    deep: true,
  },
);

function getDefaultFilter(): Filter {
  return {
    defined: null,
    search: null,
  };
}

function isDefined(flag: string): boolean {
  return game.state.flags[flag] !== undefined;
}

function isNotDefined(flag: string): boolean {
  return !isDefined(flag);
}

function isValidType(flag: string): boolean {
  return ['boolean', 'number', 'string', 'undefined'].includes(typeof game.state.flags[flag]);
}

function onInput(flag: string, event: Event) {
  const input = event.target as HTMLInputElement;

  let value: FlagValue = input.value.trim().replace(/\s/g, '');

  if (value === 'true') {
    value = true;
  }
  else if (value === 'false') {
    value = false;
  }
  else if (value === '') {
    value = undefined;
  }
  else if (!isNaN(+value) && isFinite(+value)) {
    value = +value;
  }

  game.state.flags[flag] = value;
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="sticky -top-[40px] pt-10 pb-1 -mt-10 z-10 flex items-end gap-2 bg-game-background overflow-x-auto">
      <String v-model="filter.search" placeholder="Enter text to search..." class="flex-1 min-w-[200px]" />
      <MultiButton v-model="filter.defined" :options="definedOptions" buttonClass="py-1" nullable />
    </div>

    <DynamicScroller :key="scrollerForceRenderKey" :items="flags" :minItemSize="60" pageMode>
      <template #default="{ item, active }">
        <DynamicScrollerItem :item :active>

          <label class="group grid grid-cols-2 items-center gap-4 px-2 py-3" :class="isValidType(item) ? 'hover:bg-game-highlight/15 cursor-pointer transition' : 'opacity-50'">

            <span class="text-xs lg:text-base truncate">{{ item }}</span>

            <input
              :value="game.state.flags[item]"
              @input="(event) => onInput(item, event)"
              :disabled="!isValidType(item)"
              class="w-full py-1 px-3 bg-game-shadow/20 hover:bg-game-foreground-a rounded-md border-2 border-game-foreground-a active:border-game-focus focus:border-game-focus outline-none transition" />

          </label>

          <hr class="text-game-foreground-a" />

        </DynamicScrollerItem>
      </template>
    </DynamicScroller>

    <p v-if="flags.length === 0" class="text-lg text-center font-bold">No items to show...</p>
  </div>
</template>
