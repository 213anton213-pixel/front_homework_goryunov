import { addNumber, isWon, removeNumber, type GameState } from './game.ts';

export type GameSession = {
  game: GameState;
  message: string;
};

export type GameAction =
  | { type: 'input'; value: string }
  | { type: 'add' }
  | { type: 'remove'; number: number }
  | { type: 'new'; game: GameState };

export function createSession(game: GameState): GameSession {
  return {
    game,
    message: isWon(game)
      ? 'Победа! Вы собрали нужную сумму.'
      : 'Соберите цель из трёх разных чисел.',
  };
}

export function reduceGame(
  session: GameSession,
  action: GameAction,
): GameSession {
  switch (action.type) {
    case 'input':
      return {
        ...session,
        game: { ...session.game, draft: action.value },
      };
    case 'add': {
      const result = addNumber(session.game);
      return { game: result.state, message: result.message };
    }
    case 'remove':
      return {
        game: removeNumber(session.game, action.number),
        message: 'Число удалено. Попробуйте другое.',
      };
    case 'new':
      return {
        game: action.game,
        message: 'Новая цель готова. Соберите её из трёх разных чисел.',
      };
  }
}
