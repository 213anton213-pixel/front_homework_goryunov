import { z } from 'zod';
import { createGame } from './game.js';

export const SAVE_KEY = 'sum-game';

const gameSchema = z
  .object({
    target: z.number().int().min(6).max(24),
    numbers: z
      .array(z.number().int().min(1).max(9))
      .max(3)
      .refine((numbers) => new Set(numbers).size === numbers.length),
    draft: z.string().max(20),
  })
  .strict();

export function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    const result = gameSchema.safeParse(saved);

    return result.success ? result.data : createGame();
  } catch {
    return createGame();
  }
}

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}
