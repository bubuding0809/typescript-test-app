import React, { FormEventHandler, useState, RefObject, useEffect } from "react";
import { nanoid } from "nanoid";
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

  useEffect(() => {
    setLocalStorage("todoListNew", todoListNew);
    setLocalStorage("todoListDone", todoListDone);

    console.log("updated local storage");
  }, [todoListNew, todoListDone]);

  //handle new todo entry
  const handleNewEntry: FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    const { todoMessage, todoDateTime, todoDescription } = newEntry;

    // Ensure that the todoMessage is not empty
    if (!todoMessage.trim()) {
      alert("Enter a task mate");
      return;
    }

    // Update todoListNew with new todo entry
    setTodoListNew(prevState => {
      return [
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
    });

    //reset newEntry form
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
      setTodoListNew(prevState => [...prevState, toggledTodo]);
      return newTodoList;
    });
  };

  //handle toggling of nested todo entry checkbox for active todos
  const handleToggleSubtask: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name: id } = e.target;

    setTodoListNew(prevState => {
      return prevState.map(todo => {
        return {
          ...todo,
          subTasks: todo.subTasks.map(subTodo => {
            if (subTodo.id === id) {
              return {
                ...subTodo,
                isChecked: !subTodo.isChecked,
              };
            }
            return subTodo;
          }),
        };
      });
    });
  };

  //handle Delete button click for unfinished todos
  const handleDeleteNew = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ): void => {
    const newTodoList: Todo[] = [];

    setTodoListNew(prevState => {
      prevState.forEach(todoItem => {
        if (todoItem.id === id) {
          return;
        }
        newTodoList.push(todoItem);
      });
      return newTodoList;
    });
  };

  //handle Delete button click for finished todos
  const handleDeleteDone = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ): void => {
    const newTodoList: Todo[] = [];

    setTodoListDone(prevState => {
      prevState.forEach(todoItem => {
        if (todoItem.id === id) {
          return;
        }
        newTodoList.push(todoItem);
      });
      return newTodoList;
    });
  };

  //handle removal of datetime from todo item
  const handleRemoveDateTime = (id: string) => {
    setTodoListNew(prevState => {
      return prevState.map(todoItem => {
        return todoItem.id === id
          ? { ...todoItem, date: "", time: "" }
          : todoItem;
      });
    });
  };

  return (
    <div
      className="py-5 px-2 h-full
        flex flex-row justify-center items-start gap-4
        bg-cover bg-green-image overflow-auto
      "
    >
      {/* List */}
      <div className="flex flex-col gap-2 min-w-sm w-full max-w-sm">
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
          handleToggleSubtask={handleToggleSubtask}
          handleDeleteNew={handleDeleteNew}
          handleDeleteDone={handleDeleteDone}
          handleRemoveDateTime={handleRemoveDateTime}
        />
      </div>
    </div>
  );
}
