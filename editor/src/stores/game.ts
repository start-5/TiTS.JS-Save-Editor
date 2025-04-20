import { reactive } from 'vue';

import type { GameState } from '@/types/game/state';
import type { Character, PlayerCharacter } from '@/types/game/character';

export function isPc(character: Character): character is PlayerCharacter {
  return character.classInstance === 'PlayerCharacter';
}

type GameStore = {
  state: GameState | null;

  readonly isLoaded: boolean;

  characterId: string | null;
};

type GameStoreSafe = {
  readonly state: GameState;
  readonly character: Character;
};

const store = reactive<GameStore>({
  state: null,

  get isLoaded() {
    return this.state !== null;
  },

  characterId: 'PC',
});

const safe = reactive<GameStoreSafe>({
  get state() {
    if (store.state === null) {
      throw new Error('Attempted to access state before a file was loaded.');
    }

    return store.state;
  },
  get character() {
    const id = store.characterId;

    if (id === null) {
      throw new Error('Attempted to access character before it was selected.');
    }

    const character = this.state.characters[id];

    if (character === undefined) {
      throw new Error(`Attempted to access invalid character '${id}'.`);
    }

    return character;
  },
});

export default store;
export { safe };
