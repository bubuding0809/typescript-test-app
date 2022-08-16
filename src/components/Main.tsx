import React, { FormEventHandler, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Todo, Entry } from "../utils/types";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import { TodoEntryForm } from "./TodoEntryForm";
import { TodoPanel } from "./TodoPanel";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

export default function Main() {
  const [windowWidth, windowHeight] = useWindowSize();

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

  const [isShowConfetti, setIsShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    setLocalStorage("todoListNew", todoListNew);
    setLocalStorage("todoListDone", todoListDone);

    if (todoListDone.length && !todoListNew.length) {
      setIsShowConfetti(true);
      setTimeout(() => {
        setIsShowConfetti(false);
      }, 3000);
    }
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
  const handleDeleteNew = (id: string): void => {
    setTodoListNew(prevState => {
      return prevState.reduce((newTodoList: Todo[], todo: Todo) => {
        if (todo.id !== id) {
          return [
            ...newTodoList,
            {
              ...todo,
              subTasks: todo.subTasks.filter((todo: Todo) => todo.id !== id),
            },
          ];
        }
        return newTodoList;
      }, []);
    });
  };

  //handle Delete button click for finished todos
  const handleDeleteDone = (id: string): void => {
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

    setTodoListNew(prevState => {
      return prevState.reduce((newTodoList: Todo[], todo: Todo) => {
        if (todo.id !== id) {
          return [
            ...newTodoList,
            {
              ...todo,
              subTasks: todo.subTasks.map((todo: Todo) =>
                todo.id === id ? { ...todo, date: "", time: "" } : todo
              ),
            },
          ];
        }
        return [...newTodoList, { ...todo, date: "", time: "" }];
      }, []);
    });
  };

  //handle moving of subtask to top level
  const handleUnappendSubtask = (id: string) => {
    setTodoListNew(prevState => {
      return prevState.reduce((newTodoList: Todo[], todo: Todo) => {
        let unappendedTodo: Todo | undefined;

        // If the subtask is found under the top level task, filter it out of the list and save it in the unappendedTodo variable
        const newTodo = {
          ...todo,
          subTasks: todo.subTasks.filter((subTodo: Todo) => {
            if (subTodo.id === id) {
              unappendedTodo = {
                ...subTodo,
                isTopLevelItem: true,
              };
              return false;
            }
            return true;
          }),
        };

        // if unappendedTodo is defined, add it to newTodoList
        if (unappendedTodo) {
          return [...newTodoList, newTodo, unappendedTodo];
        }
        return [...newTodoList, newTodo];
      }, []);
    });
  };

  return (
    <div
      className="py-5 px-2 h-full
        flex flex-row justify-center items-start gap-4
        bg-cover bg-green-image overflow-auto
      "
    >
      {isShowConfetti && <Confetti width={windowWidth} height={windowHeight} />}
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
          handleUnappendSubtask={handleUnappendSubtask}
        />
      </div>
    </div>
  );
}
