import { z } from 'zod';
import { createGame } from './game.ts';
import type { GameState } from './game.ts';

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

export function loadGame(): GameState {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null');
    const result = gameSchema.safeParse(saved);

    return result.success ? result.data : createGame();
  } catch {
    return createGame();
  }
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}
