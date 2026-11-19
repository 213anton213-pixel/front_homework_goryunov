type NumberListProps = {
  numbers: readonly number[];
  onRemove: (number: number) => void;
};

export default function NumberList({ numbers, onRemove }: NumberListProps) {
  return (
    <div className="selection">
      <h2>
        Ваши числа <span>от 1 до 9</span>
      </h2>
      <ul id="numbers" aria-label="Выбранные числа">
        {numbers.map((number) => (
          <li key={number}>
            <strong>{number}</strong>
            <button
              type="button"
              aria-label={`Удалить число ${number}`}
              onClick={() => onRemove(number)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {numbers.length === 0 && (
        <p className="empty">
          Здесь появятся ваши числа.
          <br />
          Ненужное можно удалить.
        </p>
      )}
    </div>
  );
}
