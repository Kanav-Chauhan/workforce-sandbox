"use client";

import { useSyncExternalStore } from "react";
import type { Todo } from "@/types/todo";

const STORAGE_KEY = "todos";

// Stable reference used for the server render and for hydration, so the
// first client render always matches the server HTML.
const EMPTY: Todo[] = [];

// Module-level store: every component using the hook shares one list.
let todos: Todo[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.text === "string" &&
    typeof item.done === "boolean"
  );
}

/** Reads saved tasks. Missing, corrupt or unreadable data gives an empty list. */
function readStorage(): Todo[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(isTodo);
  } catch {
    return EMPTY;
  }
}

function writeStorage(next: Todo[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage is full or blocked: keep working from memory.
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function handleStorage(event: StorageEvent): void {
  if (event.storageArea !== window.localStorage) return;
  // `key` is null when the whole storage was cleared.
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  todos = readStorage();
  loaded = true;
  emit();
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

// Client only: React never calls this on the server or while hydrating.
function getSnapshot(): Todo[] {
  if (!loaded) {
    todos = readStorage();
    loaded = true;
  }
  return todos;
}

function getServerSnapshot(): Todo[] {
  return EMPTY;
}

/**
 * The only place that writes to localStorage. It always starts from the
 * loaded list (`getSnapshot`), so saved tasks can never be replaced by the
 * initial empty state.
 */
function update(change: (current: Todo[]) => Todo[]): void {
  const current = getSnapshot();
  const next = change(current);
  if (next === current) return;
  todos = next;
  writeStorage(next);
  emit();
}

function addTodo(text: string): void {
  const trimmed = text.trim();
  if (trimmed === "") return;
  update((current) => [
    ...current,
    { id: crypto.randomUUID(), text: trimmed, done: false },
  ]);
}

function toggleTodo(id: string): void {
  update((current) =>
    current.some((todo) => todo.id === id)
      ? current.map((todo) =>
          todo.id === id ? { ...todo, done: !todo.done } : todo,
        )
      : current,
  );
}

function deleteTodo(id: string): void {
  update((current) =>
    current.some((todo) => todo.id === id)
      ? current.filter((todo) => todo.id !== id)
      : current,
  );
}

export function useTodos(): {
  todos: Todo[];
  addTodo(text: string): void;
  toggleTodo(id: string): void;
  deleteTodo(id: string): void;
} {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return { todos: current, addTodo, toggleTodo, deleteTodo };
}
