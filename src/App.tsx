import { useEffect, useReducer } from 'react';
import { createGame, isWon } from './game.ts';
import { createSession, reduceGame } from './state.ts';
import { loadGame, saveGame } from './storage.ts';
import ScoreBoard from './components/ScoreBoard.tsx';
import NumberList from './components/NumberList.tsx';
import NumberForm from './components/NumberForm.tsx';

export default function App() {
  const [session, dispatch] = useReducer(reduceGame, undefined, () =>
    createSession(loadGame()),
  );
  const { game, message } = session;
  const won = isWon(game);

  useEffect(() => {
    saveGame(game);
  }, [game]);

  return (
    <main className="game">
      <header className="heading">
        <p className="eyebrow">Числовая головоломка</p>
        <h1>
          Собери <span>сумму.</span>
        </h1>
        <p>Три разных числа. Одна точная сумма.</p>
      </header>

      <section className="board" aria-label="Игровое поле">
        <ScoreBoard target={game.target} numbers={game.numbers} />
        <NumberList
          numbers={game.numbers}
          onRemove={(number) => dispatch({ type: 'remove', number })}
        />
        <NumberForm
          draft={game.draft}
          won={won}
          onDraftChange={(value) => dispatch({ type: 'input', value })}
          onAdd={() => dispatch({ type: 'add' })}
        />
        <p
          id="message"
          className={won ? 'message success' : 'message'}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
        <footer className="board-footer">
          <span>Прогресс сохраняется автоматически</span>
          <button
            id="new-game"
            className="secondary"
            type="button"
            onClick={() => dispatch({ type: 'new', game: createGame() })}
          >
            Новая игра
          </button>
        </footer>
      </section>

      <aside className="rules" aria-labelledby="rules-title">
        <h2 id="rules-title">Как играть</h2>
        <p>
          Добавьте ровно три разных целых числа от 1 до 9. Их сумма должна
          совпасть с целью. Не получилось? Удалите любое число и попробуйте
          другое.
        </p>
      </aside>
    </main>
  );
}
