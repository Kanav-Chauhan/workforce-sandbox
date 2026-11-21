"use client";

import type { Todo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
  onToggle(id: string): void;
  onDelete(id: string): void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-2 py-1">
      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 py-2">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
          className="size-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        />
        <span
          className={
            todo.done
              ? "min-w-0 break-words text-zinc-400 line-through dark:text-zinc-500"
              : "min-w-0 break-words text-zinc-900 dark:text-zinc-100"
          }
        >
          {todo.text}
        </span>
      </label>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </button>
    </li>
  );
}
