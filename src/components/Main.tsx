import React, { FormEventHandler, useState, RefObject } from "react";
import { nanoid } from "nanoid";
import { Paper, Typography } from "@mui/material";
import { Todo, Entry } from "../utils/types";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import { TodoEntryForm } from "./TodoEntryForm";
import { TodoPanel } from "./TodoPanel";

export default function Main() {
  const [newEntry, setNewEntry] = useState<Entry>({
    todoMessage: "",
    todoDateTime: null,
    todoDescription: "",
  });

  const [todoListNew, setTodoListNew] = useState<Todo[]>(
    getLocalStorage("todoListNew", [])
  );
  const [todoListDone, setTodoListDone] = useState<Todo[]>(
    getLocalStorage("todoListDone", [])
  );

  //handle new todo entry
  const handleNewEntry: FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    const { todoMessage, todoDateTime, todoDescription } = newEntry;

    if (!todoMessage.trim()) {
      alert("Enter a task mate");
      return;
    }

    setTodoListNew(prevState => {
      const newTodoList = [
        ...prevState,
        {
          id: nanoid(),
          message: todoMessage.trim(),
          isTopLevelItem: true,
          isChecked: false,
          isDragged: false,
          isNestedDragged: {
            isDragged: false,
            isSource: false,
          },
          date: todoDateTime ? todoDateTime.format("YYYY-MM-DD") : null,
          time: todoDateTime ? todoDateTime.format("h:mm a") : null,
          description: todoDescription ? todoDescription.trim() : null,
          subTasks: [],
        },
      ];
      setLocalStorage("todoListNew", newTodoList);
      return newTodoList;
    });
    setNewEntry({
      todoMessage: "",
      todoDateTime: null,
      todoDescription: "",
    });
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
            subTasks: todoItem.subTasks.map(todo => {
              return {
                ...todo,
                isChecked: true,
              };
            }),
          };
        } else {
          newTodoList.push(todoItem);
        }
      });
      setLocalStorage("todoListDone", [toggledTodo, ...todoListDone]);
      setLocalStorage("todoListNew", newTodoList);
      setTodoListDone(prevState => [toggledTodo, ...prevState]);
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
            subTasks: todoItem.subTasks.map(todo => {
              return {
                ...todo,
                isChecked: false,
              };
            }),
          };
        } else {
          newTodoList.push(todoItem);
        }
      });
      setLocalStorage("todoListNew", [...todoListNew, toggledTodo]);
      setLocalStorage("todoListDone", newTodoList);
      setTodoListNew(prevState => [...prevState, toggledTodo]);
      return newTodoList;
    });
  };

  //handle Delete button click for unfinished todos
  const handleDeleteNew = (
    e: React.MouseEvent<HTMLButtonElement>,
    buttonRef: RefObject<HTMLButtonElement>
  ): void => {
    const name = buttonRef.current?.name;
    const newTodoList: Todo[] = [];

    setTodoListNew(prevState => {
      prevState.forEach(todoItem => {
        if (name === todoItem.id) {
          return;
        }
        newTodoList.push(todoItem);
      });
      return newTodoList;
    });
    setLocalStorage("todoListNew", newTodoList);
  };

  //handle Delete button click for finished todos
  const handleDeleteDone = (
    e: React.MouseEvent<HTMLButtonElement>,
    buttonRef: RefObject<HTMLButtonElement>
  ): void => {
    const name = buttonRef.current?.name;
    const newTodoList: Todo[] = [];

    setTodoListDone(prevState => {
      prevState.forEach(todoItem => {
        if (name === todoItem.id) {
          return;
        }
        newTodoList.push(todoItem);
      });
      return newTodoList;
    });
    setLocalStorage("todoListDone", newTodoList);
  };

  //handle removal of datetime from todo item
  const handleRemoveDateTime = (id: string) => {
    setTodoListNew(prevState => {
      const newTodoList = prevState.map(todoItem => {
        return todoItem.id === id
          ? { ...todoItem, date: "", time: "" }
          : todoItem;
      });
      setLocalStorage("todoListNew", newTodoList);
      return newTodoList;
    });
  };

  return (
    <div
      className="py-5 px-2 h-full
        flex flex-col items-center justify-start
        bg-cover bg-green-image overflow-y-auto
      "
    >
      {/* Task main */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        {/* Task Entry form */}
        <TodoEntryForm
          handleNewEntry={handleNewEntry}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
        />

        {/* Task list */}
        <TodoPanel
          todoListNew={todoListNew}
          setTodoListNew={setTodoListNew}
          setTodoListDone={setTodoListDone}
          todoListDone={todoListDone}
          handleToggleEntryNew={handleToggleEntryNew}
          handleToggleEntryDone={handleToggleEntryDone}
          handleDeleteNew={handleDeleteNew}
          handleDeleteDone={handleDeleteDone}
          handleRemoveDateTime={handleRemoveDateTime}
        />
      </div>
    </div>
  );
}
