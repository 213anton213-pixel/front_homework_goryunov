export function createGame() {
  return {
    target: Math.floor(Math.random() * 19) + 6,
    numbers: [],
    draft: '',
  };
}

export function getSum(numbers) {
  return numbers.reduce((sum, number) => sum + number, 0);
}

export function isWon(state) {
  return state.numbers.length === 3 && getSum(state.numbers) === state.target;
}

export function addNumber(state) {
  if (isWon(state)) {
    return { state, message: 'Вы уже победили! Начните новую игру.' };
  }

  const value = state.draft.trim();

  if (!/^[1-9]$/.test(value)) {
    return { state, message: 'Введите целое число от 1 до 9.' };
  }

  const number = Number(value);

  if (state.numbers.includes(number)) {
    return { state, message: 'Это число уже есть в списке.' };
  }

  if (state.numbers.length === 3) {
    return {
      state,
      message: 'Можно выбрать только три числа. Сначала удалите одно из них.',
    };
  }

  const nextState = {
    ...state,
    numbers: [...state.numbers, number],
    draft: '',
  };

  let message = 'Число добавлено.';

  if (isWon(nextState)) {
    message = 'Победа! Вы собрали нужную сумму.';
  } else if (nextState.numbers.length === 3) {
    message = 'Сумма не совпала. Удалите число и попробуйте другое.';
  }

  return { state: nextState, message };
}

export function removeNumber(state, number) {
  return {
    ...state,
    numbers: state.numbers.filter((item) => item !== number),
  };
}
