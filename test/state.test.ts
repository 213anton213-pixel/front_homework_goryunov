import test from 'node:test';
import assert from 'node:assert/strict';
import { isWon } from '../src/game.ts';
import { createSession, reduceGame } from '../src/state.ts';

test('загрузка завершённой партии восстанавливает сообщение о победе', () => {
  const game = { target: 15, numbers: [2, 5, 8], draft: '' };
  const session = createSession(game);

  assert.equal(session.game, game);
  assert.match(session.message, /Победа/);
});

test('ввод меняет только черновик и сохраняет список, цель и сообщение', () => {
  const session = createSession({ target: 15, numbers: [2], draft: '5' });
  const nextSession = reduceGame(session, { type: 'input', value: '8' });

  assert.equal(nextSession.game.draft, '8');
  assert.equal(nextSession.game.target, session.game.target);
  assert.equal(nextSession.game.numbers, session.game.numbers);
  assert.equal(nextSession.message, session.message);
  assert.equal(session.game.draft, '5');
});

test('добавление победного числа согласованно обновляет партию и сообщение', () => {
  const session = createSession({ target: 15, numbers: [2, 5], draft: '8' });
  const nextSession = reduceGame(session, { type: 'add' });

  assert.deepEqual(nextSession.game.numbers, [2, 5, 8]);
  assert.equal(nextSession.game.draft, '');
  assert.equal(nextSession.game.target, 15);
  assert.ok(isWon(nextSession.game));
  assert.match(nextSession.message, /Победа/);
});

test('ошибка добавления сохраняет партию и введённый текст', () => {
  const session = createSession({ target: 15, numbers: [2], draft: '2' });
  const nextSession = reduceGame(session, { type: 'add' });

  assert.equal(nextSession.game, session.game);
  assert.equal(nextSession.game.draft, '2');
  assert.match(nextSession.message, /уже есть/);
});

test('удаление отменяет победу, сохраняя цель и черновик', () => {
  const session = createSession({ target: 15, numbers: [2, 5, 8], draft: '9' });
  const nextSession = reduceGame(session, { type: 'remove', number: 5 });

  assert.deepEqual(nextSession.game.numbers, [2, 8]);
  assert.equal(nextSession.game.target, 15);
  assert.equal(nextSession.game.draft, '9');
  assert.equal(isWon(nextSession.game), false);
  assert.match(nextSession.message, /удалено/);
});

test('новая игра использует переданную партию и не меняет исходное состояние', () => {
  const session = Object.freeze({
    game: Object.freeze({
      target: 15,
      numbers: Object.freeze([2, 5, 8]),
      draft: '9',
    }),
    message: 'Победа! Вы собрали нужную сумму.',
  });
  const newGame = { target: 20, numbers: [], draft: '' };
  const nextSession = reduceGame(session, { type: 'new', game: newGame });

  assert.deepEqual(nextSession.game, { target: 20, numbers: [], draft: '' });
  assert.match(nextSession.message, /Новая цель/);
  assert.deepEqual(session.game, {
    target: 15,
    numbers: [2, 5, 8],
    draft: '9',
  });
  assert.deepEqual(reduceGame(session, { type: 'input', value: '1' }).game, {
    target: 15,
    numbers: [2, 5, 8],
    draft: '1',
  });
  assert.deepEqual(
    reduceGame(session, { type: 'remove', number: 2 }).game.numbers,
    [5, 8],
  );
});
