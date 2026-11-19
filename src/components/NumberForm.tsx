import type { FormEvent } from 'react';

type NumberFormProps = {
  draft: string;
  won: boolean;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
};

export default function NumberForm({
  draft,
  won,
  onDraftChange,
  onAdd,
}: NumberFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAdd();
  }

  return (
    <form id="number-form" noValidate onSubmit={handleSubmit}>
      <label htmlFor="number-input">Какое число добавим?</label>
      <div className="input-row">
        <input
          id="number-input"
          name="number"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={20}
          placeholder="Например, 5"
          aria-describedby="message"
          value={draft}
          onChange={(event) => onDraftChange(event.currentTarget.value)}
        />
        <button id="add-button" type="submit" disabled={won}>
          Добавить <span aria-hidden="true">+</span>
        </button>
      </div>
    </form>
  );
}
