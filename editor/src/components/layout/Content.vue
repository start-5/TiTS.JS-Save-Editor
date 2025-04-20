<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';

import { type SelectOptions } from '@shared/types/editor/ui';

import game from '@/stores/game';

import FadeTransition from '@/components/transitions/FadeTransition.vue';

import Select from '@/components/forms/Select.vue';

const fallbackComponent = defineAsyncComponent(() => import('@/components/content/FileNotLoaded.vue'));

const tabs = [
  { label: 'Game', component: defineAsyncComponent(() => import('@/components/content/tabs/Game.vue')) },
  { label: 'General', component: defineAsyncComponent(() => import('@/components/content/tabs/General.vue')) },
  { label: 'Stats', component: defineAsyncComponent(() => import('@/components/content/tabs/Stats.vue')) },
  { label: 'Head', component: defineAsyncComponent(() => import('@/components/content/tabs/Head.vue')) },
  { label: 'Body', component: defineAsyncComponent(() => import('@/components/content/tabs/Body.vue')) },
  { label: 'Chest', component: defineAsyncComponent(() => import('@/components/content/tabs/Chest.vue')) },
  { label: 'Tails', component: defineAsyncComponent(() => import('@/components/content/tabs/Tails.vue')) },
  { label: 'Crotch', component: defineAsyncComponent(() => import('@/components/content/tabs/Crotch.vue')) },
  { label: 'Ships', component: defineAsyncComponent(() => import('@/components/content/tabs/Ships.vue')) },
  { label: 'Key Items', component: defineAsyncComponent(() => import('@/components/content/tabs/KeyItems.vue')) },
  { label: 'Perks', component: defineAsyncComponent(() => import('@/components/content/tabs/Perks.vue')) },
  { label: 'Status Effects', component: defineAsyncComponent(() => import('@/components/content/tabs/StatusEffects.vue')) },
  { label: 'Flags', component: defineAsyncComponent(() => import('@/components/content/tabs/Flags.vue')) },
];

const activeTabIndex = ref(0);

const activeTabComponent = computed(function () {
  if (!game.isLoaded) {
    return fallbackComponent;
  }

  return tabs[activeTabIndex.value].component;
});

function onTabClicked(index: number) {
  activeTabIndex.value = index;
}

const characterOptions = computed<SelectOptions<string>>(function () {
  if (game.state === null) {
    return [];
  }

  return Object.keys(game.state.characters).map(function (key) {
    return {
      label: key,
      value: key,
    };
  })
});
</script>

<template>
  <div class="h-full flex flex-col min-h-0">

    <div class="w-full px-4 md:px-10 pb-6 shrink-0">
      <Select v-model="game.characterId" :options="characterOptions" label="Character" input-class="h-[40px]"
        :placeholder="!game.isLoaded ? 'Load a file to start editing...' : undefined" />
    </div>

    <div class="flex flex-nowrap overflow-y-hidden px-4 md:px-10 border-b-3 border-game-highlight shrink-0">
      <button v-for="(tab, index) in tabs" :key="index" @click="onTabClicked(index)" class="cursor-pointer px-4 py-2 rounded-t-md transition"
        :class="activeTabIndex === index ? 'bg-game-highlight' : 'text-game-text/50 hover:bg-game-highlight/50'">
        <span class="text-xl font-bold whitespace-nowrap">{{ tab.label }}</span>
      </button>
    </div>

    <div class="h-full p-4 md:p-10 overflow-y-auto">
      <FadeTransition>
        <component :is="activeTabComponent" />
      </FadeTransition>
    </div>

  </div>
</template>
