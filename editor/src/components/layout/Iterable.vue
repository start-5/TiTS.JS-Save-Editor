<script setup lang="ts" generic="T">
import { v4 as uuid } from 'uuid';
import { computed, toRaw } from 'vue';

import Button from '@/components/buttons/Button.vue';
import Collapsible from '@/components/layout/Collapsible.vue';

import addIconPath from '@icons/add.svg';
import copyIconPath from '@icons/copy.svg';
import deleteIconPath from '@icons/delete.svg';

export type ArraySource<T> = T[] | undefined;
export type ObjectSource<T> = Record<string, T> | undefined;

export type Source<T> = ArraySource<T> | ObjectSource<T>;

const props = defineProps<{
  addItem?: () => T;
  getItemLabel?: (item: T) => string;

  items?: Source<T>;

  addDisabled?: boolean;
  removeDisabled?: boolean;
}>();

const sourceIsArray = computed(function () {
  return Array.isArray(props.items);
});
const sourceIsObject = computed(function () {
  return props.items?.constructor === Object;
});

const sourceAsArray = computed(function () {
  return props.items as ArraySource<T>;
});
const sourceAsObject = computed(function () {
  return props.items as ObjectSource<T>;
});

const hasItems = computed(function () {
  if (props.items === undefined) {
    return false;
  }

  if (sourceIsArray.value) {
    return sourceAsArray.value!.length > 0;
  }
  else if (sourceIsObject.value) {
    return Object.keys(sourceAsObject.value!).length > 0;
  }
  else {
    return false;
  }
});

function getItemLabel(item: T): string {
  if (props.items === undefined) {
    return '';
  }

  if (props.getItemLabel !== undefined) {
    return props.getItemLabel(item);
  }

  if (sourceIsArray.value) {
    return sourceAsArray.value!.indexOf(item).toString();
  }
  else if (sourceIsObject.value) {
    return Object.values(sourceAsObject.value!).indexOf(item).toString();
  }
  else {
    return '';
  }
}

function addItemToSource(item: T) {
  if (sourceIsArray.value) {
    sourceAsArray.value!.push(item);
  }
  else if (sourceIsObject.value) {
    sourceAsObject.value![uuid()] = item;
  }
}

function onAddClicked() {
  if (props.addDisabled) {
    return;
  }

  if (props.items === undefined || props.addItem === undefined) {
    return;
  }

  addItemToSource(props.addItem());
}

function onCloneClicked(item: T) {
  if (props.addDisabled) {
    return;
  }

  if (props.items === undefined) {
    return;
  }

  addItemToSource(structuredClone(toRaw(item)));
}

function onRemoveClicked(item: T) {
  if (props.removeDisabled) {
    return;
  }

  if (props.items === undefined) {
    return;
  }

  if (sourceIsArray.value) {
    sourceAsArray.value!.splice(sourceAsArray.value!.indexOf(item), 1);
  }
  else if (sourceIsObject.value) {
    let keyToRemove: string = '';

    Object.entries(sourceAsObject.value!).forEach(function ([key, value]) {
      if (value === item) {
        keyToRemove = key;
      }
    });

    delete sourceAsObject.value![keyToRemove];
  }
}

// FIXME maybe add drag n drop
</script>

<template>
  <div class="flex flex-col gap-4 relative">
    <TransitionGroup name="items">
      <template v-for="(item, index) in sourceAsArray" :key="item">
        <Collapsible :label="getItemLabel(item)">
          <div class="flex flex-col gap-4">
            <slot :item :index></slot>

            <div class="flex gap-2 self-end">
              <Button label="Clone" :icon="copyIconPath" @click="onCloneClicked(item)" :disabled="addDisabled" class="text-sm px-2 py-1" />
              <Button label="Remove" :icon="deleteIconPath" @click="onRemoveClicked(item)" :disabled="removeDisabled" class="text-sm px-2 py-1 bg-red-700 hover:bg-red-600" />
            </div>
          </div>
        </Collapsible>
      </template>
    </TransitionGroup>

    <p v-if="!hasItems" class="text-lg text-center font-bold">No items to show...</p>

    <Button v-if="addItem !== undefined" label="Add" :icon="addIconPath" @click="onAddClicked" :disabled="addDisabled"
      class="text-sm px-2 py-1 self-end bg-green-700 hover:bg-green-600" />
  </div>
</template>

<style scoped>
.items-move,
.items-enter-active,
.items-leave-active {
  transition: all 250ms ease-in-out;
}

.items-enter-from,
.items-leave-to {
  opacity: 0;
  transform: translateX(25px);
}

.items-leave-active {
  position: absolute;
}
</style>
