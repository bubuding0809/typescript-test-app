import React, {
  FormEventHandler,
  useState,
  useRef,
  useEffect,
  LegacyRef,
} from "react";
import { Todo } from "../utils/types";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import autoAnimate from "@formkit/auto-animate";
import { nanoid } from "nanoid";

export default function Main() {
  const [newEntry, setNewEntry] = useState<string>("");
  const [todoListNew, setTodoListNew] = useState<Todo[]>(
    getLocalStorage("todoListNew", [])
  );
  const [todoListDone, setTodoListDone] = useState<Todo[]>(
    getLocalStorage("todoListDone", [])
  );

  // Set up autoAnimation of ul element
  const parent: LegacyRef<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  //handle new todo entry
  const handleNewEntry: FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    const newTodoMessage = newEntry.trim();

    if (!newTodoMessage) {
      alert("Enter a task mate");
      return;
    }

    setTodoListNew(prevState => {
      const newTodoList = [
        ...prevState,
        {
          id: nanoid(),
          message: newTodoMessage,
          isChecked: false,
        },
      ];
      setLocalStorage("todoListNew", newTodoList);
      return newTodoList;
    });
    setNewEntry("");
  };

  //handle toggling of todo entry checkbox for unfinished todos
  const handleToggleEntryNew: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newTodoList: Todo[] = [];
    let toggledTodo: Todo;

    setTodoListNew(prevState => {
      prevState.forEach(todoItem => {
        if (todoItem.id === e.target.name) {
          toggledTodo = {
            ...todoItem,
            isChecked: true,
          };
        } else {
          newTodoList.push(todoItem);
        }
      });
      todoListDone.unshift(toggledTodo);
      setLocalStorage("todoListDone", todoListDone);
      setLocalStorage("todoListNew", newTodoList);
      return newTodoList;
    });
  };

  //handle toggling of todo entry checkbox for finished todos
  const handleToggleEntryDone: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newTodoList: Todo[] = [];
    let toggledTodo: Todo;

    setTodoListDone(prevState => {
      prevState.forEach(todoItem => {
        if (todoItem.id === e.target.name) {
          toggledTodo = {
            ...todoItem,
            isChecked: false,
          };
        } else {
          newTodoList.push(todoItem);
        }
      });
      todoListNew.push(toggledTodo);
      setLocalStorage("todoListDone", todoListDone);
      setLocalStorage("todoListNew", newTodoList);
      return newTodoList;
    });
  };

  // Map todo items into react components
  const renderTodos = (
    todoList: Todo[],
    handleToggle: React.ChangeEventHandler<HTMLInputElement>
  ): JSX.Element[] =>
    todoList.map((todo: Todo): JSX.Element => {
      return (
        <div
          key={todo.id}
          className={`flex justify-between items-center border rounded p-3 shadow mb-1 ${
            todo.isChecked && "bg-gray-200"
          }`}
        >
          <p
            className={`text-start text-ellipsis overflow-hidden ${
              todo.isChecked && "line-through text-slate-500"
            }`}
          >
            {todo.message}
          </p>
          <input
            name={todo.id}
            type="checkbox"
            checked={todo.isChecked}
            onChange={handleToggle}
          />
        </div>
      );
    });

  return (
    <div className="flex justify-center">
      <div className="grid gap-5 grid-cols-1 pt-5 px-4 w-96">
        <form onSubmit={handleNewEntry}>
          <input
            type="text"
            className="w-full h-10 p-2 font-mono text-lg font-semibold border-solid border-2 rounded-lg focus:rounded-lg hover:border-black"
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            autoFocus
          />
        </form>
        <div ref={parent} className="w-auto">
          {renderTodos(todoListNew, handleToggleEntryNew)}
          {renderTodos(todoListDone, handleToggleEntryDone)}
        </div>
      </div>
    </div>
  );
}
