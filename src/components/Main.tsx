import React, { FormEventHandler, useState, useRef, useEffect } from "react";
import { Todo } from "../utils/types";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import autoAnimate from "@formkit/auto-animate";

export default function Main() {
  const [todoList, setTodoList] = useState<Todo[]>(
    getLocalStorage("todoList", [])
  );
  const [formEntry, setFormEntry] = useState<string>("");
  const parent = useRef(null);

  // Set up autoAnimation of ul element
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  //handle new todo entry
  const handleNewEntry: FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();

    if (!formEntry.trim()) {
      alert("Enter a task mate1");
      return;
    }

    setTodoList((prevState) => {
      const latestEntry = prevState.at(0);
      const newTodoList = [
        {
          id: latestEntry ? latestEntry.id + 1 : 1,
          message: formEntry,
          isChecked: false,
        },
        ...prevState,
      ];
      setLocalStorage("todoList", newTodoList);
      return newTodoList;
    });
    setFormEntry("");
  };

  //handle toggling of todo entry checkbox
  const handleToggleEntry: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newTodoList: Todo[] = [];
    var checkedItem: Todo;

    setTodoList((prevState) => {
      prevState.forEach((todoItem) => {
        if (todoItem.id === parseInt(e.target.name)) {
          checkedItem = {
            ...todoItem,
            isChecked: !todoItem.isChecked,
          };
        } else {
          newTodoList.push(todoItem);
        }
      });

      if (checkedItem.isChecked) {
        newTodoList.push(checkedItem);
      } else {
        newTodoList.unshift(checkedItem);
      }

      setLocalStorage("todoList", newTodoList);
      return newTodoList;
    });
  };

  // Map todo items into react components
  const todos: JSX.Element[] = todoList.map((todo: Todo): JSX.Element => {
    return (
      <li key={todo.id} className="flex justify-between items-center">
        <p
          className={`text-ellipsis overflow-hidden ${
            todo.isChecked && "line-through"
          }`}
        >
          {todo.message}
        </p>
        <input
          name={todo.id.toString()}
          type="checkbox"
          checked={todo.isChecked}
          onChange={handleToggleEntry}
        />
      </li>
    );
  });

  return (
    <div className="grid gap-5 grid-cols-1 px-96 pt-5">
      <form onSubmit={handleNewEntry}>
        <input
          type="text"
          className="w-full h-10 p-2 font-mono text-lg font-semibold border-solid border-2 rounded-lg focus:rounded-lg hover:border-black"
          value={formEntry}
          onChange={(e) => setFormEntry(e.target.value)}
          autoFocus
        />
      </form>
      <ul ref={parent} className="w-auto">
        {todos}
      </ul>
    </div>
  );
}
