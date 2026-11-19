import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { isWon, type GameState } from '../src/game.ts';
import { loadGame, saveGame, SAVE_KEY } from '../src/storage.ts';

const originalStorage = Object.getOwnPropertyDescriptor(
  globalThis,
  'localStorage',
);
let storage: Storage;

beforeEach(() => {
  const values = new Map<string, string>();
  storage = {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key) {
      return values.get(key) ?? null;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
});

afterEach(() => {
  if (originalStorage) {
    Object.defineProperty(globalThis, 'localStorage', originalStorage);
  } else {
    Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

function assertFreshGame() {
  const state = loadGame();
  assert.ok(Number.isInteger(state.target));
  assert.ok(state.target >= 6 && state.target <= 24);
  assert.deepEqual(state.numbers, []);
  assert.equal(state.draft, '');
}

test('сохранение восстанавливает цель, числа, черновик и победу', () => {
  const states: GameState[] = [
    { target: 15, numbers: [2], draft: '5' },
    { target: 15, numbers: [2, 5, 8], draft: '' },
  ];

  for (const state of states) {
    saveGame(state);
    assert.deepEqual(loadGame(), state);
  }

  assert.equal(isWon(loadGame()), true);
});

test('сохранение из ДЗ №2 загружается без изменения формата и ключа', () => {
  assert.equal(SAVE_KEY, 'sum-game');
  storage.setItem('sum-game', '{"target":15,"numbers":[4],"draft":"7"}');

  assert.deepEqual(loadGame(), { target: 15, numbers: [4], draft: '7' });
});

test('без сохранения начинается новая игра', () => {
  assertFreshGame();
});

test('повреждённый JSON заменяется новой игрой', () => {
  storage.setItem(SAVE_KEY, '{broken');
  assertFreshGame();
});

test('JSON с недопустимыми игровыми данными заменяется новой игрой', () => {
  const invalidStates = [
    null,
    [],
    {},
    { target: 5, numbers: [], draft: '' },
    { target: 25, numbers: [], draft: '' },
    { target: 15.5, numbers: [], draft: '' },
    { target: 15, numbers: [2, 2], draft: '' },
    { target: 15, numbers: [0], draft: '' },
    { target: 15, numbers: [10], draft: '' },
    { target: 15, numbers: [1.5], draft: '' },
    { target: 15, numbers: ['2'], draft: '' },
    { target: 15, numbers: [1, 2, 3, 4], draft: '' },
    { target: 15, numbers: [], draft: 5 },
    { target: 15, numbers: [], draft: 'x'.repeat(21) },
    { target: 15, numbers: [], draft: '', extra: true },
  ];

  for (const state of invalidStates) {
    storage.setItem(SAVE_KEY, JSON.stringify(state));
    assertFreshGame();
  }
});

test('ошибка чтения хранилища не мешает начать игру', () => {
  storage.getItem = () => {
    throw new Error('Reading unavailable');
  };

  assertFreshGame();
});

test('запрет доступа к localStorage не приводит к падению игры', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage unavailable');
    },
  });

  assertFreshGame();
  assert.doesNotThrow(() => saveGame({ target: 15, numbers: [], draft: '5' }));
});

test('ошибка записи не выбрасывается из saveGame', () => {
  storage.setItem = () => {
    throw new Error('Writing unavailable');
  };

  assert.doesNotThrow(() => saveGame({ target: 15, numbers: [2], draft: '5' }));
});
