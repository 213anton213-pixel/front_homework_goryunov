import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGame,
  getSum,
  isWon,
  addNumber,
  removeNumber,
} from '../src/game.js';

test('новая игра начинается с достижимой целью и пустым списком', () => {
  const state = createGame();

  assert.ok(Number.isInteger(state.target));
  assert.ok(state.target >= 6 && state.target <= 24);
  assert.deepEqual(state.numbers, []);
  assert.equal(state.draft, '');
});

test('добавлять можно только целые числа от 1 до 9', () => {
  for (const draft of ['', '0', '10', '-1', '1.5', 'abc', '1e0']) {
    const state = { target: 15, numbers: [], draft };

    assert.deepEqual(addNumber(state).state, state);
  }

  const result = addNumber({ target: 15, numbers: [], draft: ' 4 ' });

  assert.deepEqual(result.state.numbers, [4]);
  assert.equal(result.state.draft, '');
});

test('одно число нельзя добавить дважды', () => {
  const state = { target: 15, numbers: [4], draft: '4' };

  assert.deepEqual(addNumber(state).state, state);
  assert.match(addNumber(state).message, /уже есть/);
});

test('в списке может быть не больше трёх чисел', () => {
  const state = { target: 20, numbers: [1, 2, 3], draft: '4' };

  assert.deepEqual(addNumber(state).state, state);
  assert.match(addNumber(state).message, /только три/);
});

test('для победы нужны ровно три числа с нужной суммой', () => {
  assert.equal(getSum([2, 5, 8]), 15);
  assert.equal(isWon({ target: 15, numbers: [2, 5, 8] }), true);
  assert.equal(isWon({ target: 15, numbers: [6, 9] }), false);
  assert.equal(isWon({ target: 15, numbers: [1, 2, 3] }), false);

  const result = addNumber({ target: 15, numbers: [2, 5], draft: '8' });

  assert.equal(isWon(result.state), true);
  assert.match(result.message, /Победа/);
});

test('после победы добавление закрыто, но ход можно отменить', () => {
  const state = { target: 15, numbers: [2, 5, 8], draft: '9' };

  assert.deepEqual(addNumber(state).state, state);

  const nextState = removeNumber(state, 5);

  assert.deepEqual(nextState.numbers, [2, 8]);
  assert.equal(isWon(nextState), false);
  assert.equal(nextState.draft, '9');
});

test('ходы создают новое состояние и не меняют исходное', () => {
  const state = Object.freeze({
    target: 15,
    numbers: Object.freeze([2]),
    draft: '5',
  });

  assert.deepEqual(addNumber(state).state.numbers, [2, 5]);
  assert.deepEqual(removeNumber(state, 2).numbers, []);
  assert.deepEqual(state, { target: 15, numbers: [2], draft: '5' });
});
