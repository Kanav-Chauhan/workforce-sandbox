"use client";

import { useState, type FormEvent } from "react";

type TodoFormProps = {
  onAdd(text: string): void;
};

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <label htmlFor="new-todo" className="sr-only">
        New task
      </label>
      <input
        id="new-todo"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add a task…"
        autoComplete="off"
        className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Add
      </button>
    </form>
  );
}
