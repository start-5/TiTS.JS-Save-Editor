<script setup lang="ts" generic="T">
import { v4 as uuid } from 'uuid';
import { computed, type ModelRef } from 'vue';

import Group from '@/components/content/Group.vue';

import Iterable, { type ArraySource, type ObjectSource, type Source } from '@/components/layout/Iterable.vue';

import Button from '@/components/buttons/Button.vue';

import addIconPath from '@icons/add.svg';
import deleteIconPath from '@icons/delete.svg';

const model = defineModel<Source<T>>();

const props = defineProps<{
  label?: string;

  addItem?: () => T;
  getItemLabel?: (item: T) => string;

  addDisabled?: boolean;
  removeDisabled?: boolean;
}>();

const sourceIsArray = computed(function () {
  return Array.isArray(model.value);
});
const sourceIsObject = computed(function () {
  return model.value?.constructor === Object;
});

const sourceAsArray = computed(function () {
  return model as ModelRef<ArraySource<T>>;
});
const sourceAsObject = computed(function () {
  return model as ModelRef<ObjectSource<T>>;
});

function onClearClicked() {
  if (props.removeDisabled) {
    return;
  }

  if (model.value === undefined) {
    return;
  }

  if (sourceIsArray.value) {
    sourceAsArray.value.value = [];
  }
  else if (sourceIsObject.value) {
    sourceAsObject.value.value = {};
  }
}

function onAddClicked() {
  if (props.addDisabled) {
    return;
  }

  if (model.value === undefined || props.addItem === undefined) {
    return;
  }

  const item = props.addItem();

  if (sourceIsArray.value) {
    sourceAsArray.value.value!.push(item);
  }
  else if (sourceIsObject.value) {
    sourceAsObject.value.value![uuid()] = item;
  }
}
</script>

<template>
  <Group>
    <template #label>
      <div class="flex justify-between border-b-2 border-game-foreground-a p-4">
        <span class="text-xl font-semibold truncate">{{ label }}</span>

        <div class="flex gap-2">
          <Button label="Clear" :icon="deleteIconPath" @click="onClearClicked" :disabled="removeDisabled" class="text-sm px-2 py-1 bg-red-700 hover:bg-red-600" />
          <Button label="Add" :icon="addIconPath" @click="onAddClicked" :disabled="addDisabled" class="text-sm px-2 py-1 bg-green-700 hover:bg-green-600" />
        </div>
      </div>
    </template>

    <Iterable :items="model" :getItemLabel :addDisabled :removeDisabled>
      <template #default="{ item, index }">
        <slot :item :index></slot>
      </template>
    </Iterable>
  </Group>
</template>
