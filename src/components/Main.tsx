import React, {
  FormEventHandler,
  useState,
  useRef,
  useEffect,
  LegacyRef,
  RefObject,
} from "react";
import { AntSwitch } from "./customSwitches";
import { TodoItem } from "./TodoItem";
import { Todo } from "../utils/types";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import autoAnimate from "@formkit/auto-animate";
import { nanoid } from "nanoid";
import { Paper } from "@mui/material";

export default function Main() {
  const [newEntry, setNewEntry] = useState<string>("");
  const [isReveal, setIsReveal] = useState<boolean>(
    getLocalStorage("isReveal", false)
  );
  const [todoListNew, setTodoListNew] = useState<Todo[]>(
    getLocalStorage("todoListNew", [])
  );
  const [todoListDone, setTodoListDone] = useState<Todo[]>(
    getLocalStorage("todoListDone", [])
  );

  // Set up autoAnimation of ul element
  const parent1: LegacyRef<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const parent2: LegacyRef<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const parent3: LegacyRef<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    parent1.current && autoAnimate(parent1.current);
    parent2.current && autoAnimate(parent2.current);
    parent3.current && autoAnimate(parent3.current);
  }, [parent1, parent2, parent3]);

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

    setTodoListNew((prevState) => {
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

    setTodoListNew((prevState) => {
      prevState.forEach((todoItem) => {
        if (todoItem.id === e.target.name) {
          toggledTodo = {
            ...todoItem,
            isChecked: true,
          };
        } else {
          newTodoList.push(todoItem);
        }
      });
      setLocalStorage("todoListDone", [toggledTodo, ...todoListDone]);
      setLocalStorage("todoListNew", newTodoList);
      setTodoListDone((prevState) => [toggledTodo, ...prevState]);
      return newTodoList;
    });
  };

  //handle toggling of todo entry checkbox for finished todos
  const handleToggleEntryDone: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newTodoList: Todo[] = [];
    let toggledTodo: Todo;

    setTodoListDone((prevState) => {
      prevState.forEach((todoItem) => {
        if (todoItem.id === e.target.name) {
          toggledTodo = {
            ...todoItem,
            isChecked: false,
          };
        } else {
          newTodoList.push(todoItem);
        }
      });
      setLocalStorage("todoListNew", [...todoListNew, toggledTodo]);
      setLocalStorage("todoListDone", newTodoList);
      setTodoListNew((prevState) => [...prevState, toggledTodo]);
      return newTodoList;
    });
  };

  const handleDeleteNew = (
    e: React.MouseEvent<HTMLButtonElement>,
    buttonRef: RefObject<HTMLButtonElement>
  ): void => {
    const name = buttonRef.current?.name;
    const newTodoList: Todo[] = [];

    setTodoListNew((prevState) => {
      prevState.forEach((todoItem) => {
        if (name === todoItem.id) {
          return;
        }
        newTodoList.push(todoItem);
      });
      return newTodoList;
    });
    setLocalStorage("todoListNew", newTodoList);
  };

  const handleDeleteDone = (
    e: React.MouseEvent<HTMLButtonElement>,
    buttonRef: RefObject<HTMLButtonElement>
  ): void => {
    const name = buttonRef.current?.name;
    const newTodoList: Todo[] = [];

    setTodoListDone((prevState) => {
      prevState.forEach((todoItem) => {
        if (name === todoItem.id) {
          return;
        }
        newTodoList.push(todoItem);
      });
      return newTodoList;
    });
    setLocalStorage("todoListDone", newTodoList);
  };

  const handleReveal: React.ChangeEventHandler<HTMLInputElement> = () => {
    setIsReveal((prevState) => {
      setLocalStorage("isReveal", !prevState);
      return !prevState;
    });
  };

  // Map todo items into react components
  const renderTodoList = (
    todoList: Todo[],
    handleToggle: React.ChangeEventHandler<HTMLInputElement>,
    handleDelete: any
  ): JSX.Element[] =>
    todoList.map((todo: Todo): JSX.Element => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
        />
      );
    });

  return (
    <div className="flex justify-center py-5 px-2">
      {/* Task main */}
      <Paper className="grid gap-2 grid-cols-1 w-96" elevation={3}>
        {/* Task Entry form */}
        <form onSubmit={handleNewEntry} className="p-2">
          <input
            type="text"
            className="w-full h-10 p-2 font-mono text-lg font-semibold border-solid border-2 rounded-lg focus:rounded-lg hover:border-black"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            autoFocus
          />
        </form>

        {/* Task list */}
        <div ref={parent1} className="w-auto">
          {/* Render un-completed tasks */}
          {renderTodoList(todoListNew, handleToggleEntryNew, handleDeleteNew)}

          {/* Divider */}
          <div
            className={`bg-[#323244] text-white h-10 p-4 flex justify-between items-center ${
              isReveal ? (todoListDone.length > 0 ? "mb-2" : "") : "rounded-b"
            }`}
          >
            <h1>Completed</h1>
            <AntSwitch onChange={handleReveal} checked={isReveal} />
          </div>

          {/* Render completed tasks */}
          {isReveal &&
            (todoListDone.length > 0 ? (
              renderTodoList(
                todoListDone,
                handleToggleEntryDone,
                handleDeleteDone
              )
            ) : (
              <div className="py-2">
                <p>Nothing completed</p>
              </div>
            ))}
        </div>
      </Paper>
    </div>
  );
}
