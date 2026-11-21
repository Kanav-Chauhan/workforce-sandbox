import type { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
  onToggle(id: string): void;
  onDelete(id: string): void;
};

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="py-6 text-center text-zinc-500 dark:text-zinc-400">
        No tasks yet.
      </p>
    );
  }

  return (
    <ul className="w-full divide-y divide-zinc-200 dark:divide-zinc-800">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
