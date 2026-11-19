import { getSum } from '../game.ts';

type ScoreBoardProps = {
  target: number;
  numbers: readonly number[];
};

export default function ScoreBoard({ target, numbers }: ScoreBoardProps) {
  return (
    <div className="scoreboard">
      <div className="target">
        <span>Ваша цель</span>
        <strong id="target">{target}</strong>
      </div>
      <div className="current">
        <span>Сейчас в сумме</span>
        <strong id="sum">{getSum(numbers)}</strong>
        <span id="count">Выбрано {numbers.length} из 3</span>
      </div>
    </div>
  );
}
