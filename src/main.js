import './style.css';
import { createGame, getSum, isWon, addNumber, removeNumber } from './game.js';
import { loadGame, saveGame } from './storage.js';

const form = document.querySelector('#number-form');
const input = document.querySelector('#number-input');
const list = document.querySelector('#numbers');
const target = document.querySelector('#target');
const sum = document.querySelector('#sum');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');
const messageElement = document.querySelector('#message');
const addButton = document.querySelector('#add-button');
const newGameButton = document.querySelector('#new-game');

let state = loadGame();
let message = isWon(state)
  ? 'Победа! Вы собрали нужную сумму.'
  : 'Соберите цель из трёх разных чисел.';

function render() {
  target.textContent = state.target;
  sum.textContent = getSum(state.numbers);
  count.textContent = `Выбрано ${state.numbers.length} из 3`;
  empty.hidden = state.numbers.length > 0;
  messageElement.textContent = message;
  messageElement.classList.toggle('success', isWon(state));
  addButton.disabled = isWon(state);

  if (input.value !== state.draft) {
    input.value = state.draft;
  }

  list.replaceChildren();
  for (const number of state.numbers) {
    const item = document.createElement('li');
    const value = document.createElement('strong');
    const button = document.createElement('button');
    value.textContent = number;
    button.type = 'button';
    button.textContent = '×';
    button.dataset.number = number;
    button.setAttribute('aria-label', `Удалить число ${number}`);
    item.append(value, button);
    list.append(item);
  }
}

function update(nextState, nextMessage) {
  state = nextState;
  message = nextMessage;
  saveGame(state);
  render();
}

input.addEventListener('input', (event) => {
  state = { ...state, draft: event.target.value };
  saveGame(state);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = addNumber(state);
  update(result.state, result.message);
});

list.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-number]');
  if (button) {
    update(
      removeNumber(state, Number(button.dataset.number)),
      'Число удалено. Попробуйте другое.',
    );
  }
});

newGameButton.addEventListener('click', () => {
  update(createGame(), 'Новая цель готова. Соберите её из трёх разных чисел.');
});

saveGame(state);
render();
