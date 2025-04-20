<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { SelectOptions } from '@shared/types/editor/ui';
import type { StorageItem } from '@shared/types/game/storage';

import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

import Modal from '@/components/layout/Modal.vue';

import Button from '@/components/buttons/Button.vue';
import MultiButton from '@/components/buttons/MultiButton.vue';
import Number from '@/components/forms/Number.vue';
import Select from '@/components/forms/Select.vue';
import String from '@/components/forms/String.vue';
import Switch from '@/components/forms/Switch.vue';

import editIconPath from '@icons/edit.svg';

type Filter = {
  selected: boolean | null;
  search: string | null;
  sort: {
    key: keyof StorageItem;
    direction: 'asc' | 'desc';
  };
};

type Modal = {
  item: StorageItem | null;
  visible: boolean;
};

const model = defineModel<StorageItem[]>({
  default: [],
});

const props = defineProps<{
  items: StorageItem[];
  editableKeys?: (keyof StorageItem)[];
}>();

let _items: StorageItem[] = [];
let isToggling: boolean = false;

const scrollerForceRenderKey = ref(0);

const filter = ref<Filter>(getDefaultFilter());

const modal = ref<Modal>({
  item: null,
  visible: false,
});

const sortKeyOptions: SelectOptions<string> = [
  'storageName',
  'value1',
  'value2',
  'value3',
  'value4',
  'minutesLeft',
  'tooltip',
].map(function (key) {
  return {
    value: key,
    label: key,
  };
});

const sortDirectionOptions: SelectOptions<string> = [
  {
    value: 'asc',
    label: 'Ascending',
  },
  {
    value: 'desc',
    label: 'Descending',
  },
];

const selectedOptions: SelectOptions<boolean> = [
  {
    value: true,
    label: 'Selected',
  },
  {
    value: false,
    label: 'Unselected',
  },
];

const items = computed(function () {
  let items = _items;

  if (items.length === 0) {
    return items;
  }

  if (filter.value.selected !== null) {
    items = items.filter(filter.value.selected ? isSelected : isNotSelected);
  }

  if (items.length === 0) {
    return items;
  }

  if (filter.value.search !== null) {
    const search = filter.value.search.toLowerCase();

    items = items.filter(function (item) {
      return item.storageName.toLowerCase().includes(search) || item.tooltip.toLowerCase().includes(search);
    });
  }

  if (items.length === 0) {
    return items;
  }

  return sortItems(items);
});

watch(model, function () {
  if (!isToggling) {
    updateItems();
  }
  else {
    isToggling = false;
  }
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
    selected: null,
    search: null,
    sort: {
      key: 'storageName',
      direction: 'asc',
    },
  };
}

function updateItems() {
  filter.value = getDefaultFilter();

  _items = sortItems(model.value.concat(props.items.filter(function (a) {
    return !model.value.some(function (b) {
      return a.storageName === b.storageName;
    });
  })));
}

function sortItems(items: StorageItem[]) {
  const key = filter.value.sort.key;
  const direction = filter.value.sort.direction;

  const type = typeof items[0][key];

  let sort: (a: StorageItem, b: StorageItem) => number;

  switch (type) {
    case 'string':
      sort = function (_a, _b) {
        const a = (direction === 'asc' ? _a : _b)[key] as string;
        const b = (direction === 'asc' ? _b : _a)[key] as string;

        return a.localeCompare(b);
      };
      break;

    case 'number':
      sort = function (_a, _b) {
        const a = (direction === 'asc' ? _a : _b)[key] as number;
        const b = (direction === 'asc' ? _b : _a)[key] as number;

        return a - b;
      };
      break;

    default:
      throw new Error(`Invalid sort key ${key}`);
  }

  return items.sort(sort);
}

function isSelected(item: StorageItem): boolean {
  return model.value.includes(item);
}

function isNotSelected(item: StorageItem): boolean {
  return !isSelected(item);
}

function onItemClicked(item: StorageItem) {
  if (isSelected(item)) {
    model.value.splice(model.value.indexOf(item), 1);
  }
  else {
    model.value.push(item);
  }
}

function onToggleClicked() {
  isToggling = true;

  const anySelected = model.value.length > 0;

  if (anySelected) {
    model.value = [];
  }
  else {
    model.value = items.value;
  }
}

function onEditClicked(item: StorageItem, event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  modal.value.item = item;
  modal.value.visible = true;
}

function canEdit(key: keyof StorageItem) {
  if (props.editableKeys === undefined || props.editableKeys.length === 0) {
    return true;
  }

  return props.editableKeys.includes(key);
}

updateItems();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="sticky -top-[40px] pt-10 pb-1 -mt-10 z-10 flex items-end gap-2 bg-game-background overflow-x-auto">
      <String v-model="filter.search" placeholder="Enter text to search..." class="flex-1 min-w-[200px]" />
      <Select v-model="filter.sort.key" :options="sortKeyOptions" placeholder="Sort by..." class="flex-1 min-w-[200px]" />
      <MultiButton v-model="filter.sort.direction" :options="sortDirectionOptions" buttonClass="py-1" />
      <MultiButton v-model="filter.selected" :options="selectedOptions" buttonClass="py-1" nullable />

      <Button label="Toggle" @click="onToggleClicked" class="border-2 border-game-foreground-a py-1" />
    </div>

    <DynamicScroller :key="scrollerForceRenderKey" :items keyField="storageName" :minItemSize="60" pageMode>
      <template #default="{ item, active }">
        <DynamicScrollerItem :item :active :sizeDependencies="[item.tooltip]">

          <template v-for="_ in [{ isSelected: isSelected(item) }]">
            <div @click="onItemClicked(item)"
              class="group flex flex-col gap-2 px-2 py-4 hover:bg-game-highlight/15 cursor-pointer transition"
              :class="{ 'text-game-text/50': !_.isSelected }">

              <div class="flex items-center gap-2">
                <Switch v-model="_.isSelected" :label="item.storageName" class="pointer-events-none" />

                <Button v-if="_.isSelected" @click="onEditClicked(item, $event)" :icon="editIconPath" class="p-1" />
              </div>

              <span v-if="item.tooltip">{{ item.tooltip }}</span>

            </div>
          </template>

          <hr class="text-game-foreground-a" />

        </DynamicScrollerItem>
      </template>
    </DynamicScroller>

    <p v-if="items.length === 0" class="text-lg text-center font-bold">No items to show...</p>

    <Modal v-model:visible="modal.visible" :label="modal.item?.storageName">
      <div v-if="modal.item !== null" class="grid grid-cols-2 gap-4">
        <String v-if="canEdit('tooltip')" v-model="modal.item.tooltip" label="Tooltip" class="col-span-2" />

        <Number v-if="canEdit('value1')" v-model="modal.item.value1" label="Value 1" />
        <Number v-if="canEdit('value2')" v-model="modal.item.value2" label="Value 2" />
        <Number v-if="canEdit('value3')" v-model="modal.item.value3" label="Value 3" />
        <Number v-if="canEdit('value4')" v-model="modal.item.value4" label="Value 4" />

        <Number v-if="canEdit('minutesLeft')" v-model="modal.item.minutesLeft" label="Minutes Left" :min="0" class="col-span-2" />

        <String v-if="canEdit('iconName')" v-model="modal.item.iconName" label="Icon Name" />
        <String v-if="canEdit('iconShade')" v-model="modal.item.iconShade" label="Icon Shade" />

        <Switch v-if="canEdit('combatOnly')" v-model="modal.item.combatOnly" label="Is Combat Only" />
        <Switch v-if="canEdit('hidden')" v-model="modal.item.hidden" label="Is Hidden" />
      </div>
    </Modal>
  </div>
</template>
