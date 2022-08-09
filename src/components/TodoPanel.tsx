import { Todo } from "../utils/types";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import { ChangeEventHandler, useEffect, useState, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { DragDropContext, DropResult, DragStart } from "react-beautiful-dnd";
import { TodoPanelDivider } from "./TodoPanelDivider";
import { TodoList } from "./TodoList";

interface TodoListProps {
  todoListNew: Todo[];
  setTodoListNew: React.Dispatch<React.SetStateAction<Todo[]>>;
  todoListDone: Todo[];
  setTodoListDone: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleToggleEntryNew: ChangeEventHandler<HTMLInputElement>;
  handleToggleEntryDone: ChangeEventHandler<HTMLInputElement>;
  handleDeleteNew: any;
  handleDeleteDone: any;
  handleRemoveDateTime: any;
}

export const TodoPanel: React.FC<TodoListProps> = ({
  todoListNew,
  setTodoListNew,
  todoListDone,
  setTodoListDone,
  handleToggleEntryNew,
  handleToggleEntryDone,
  handleDeleteNew,
  handleDeleteDone,
  handleRemoveDateTime,
}: TodoListProps) => {
  // Set up autoAnimation of ul element
  const parent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const [isReveal, setIsReveal] = useState<boolean>(
    getLocalStorage("isReveal", false)
  );

  const [isDragActive, setIsDragActive] = useState({
    active: false,
    completed: false,
  });

  const handleReveal: React.ChangeEventHandler<HTMLInputElement> = () => {
    setIsReveal(prevState => {
      setLocalStorage("isReveal", !prevState);
      return !prevState;
    });
  };

  const handleDragStart = (initial: DragStart) => {
    const { draggableId, source } = initial;
    setTodoListNew(prevState => {
      return prevState.map(todo => {
        if (todo.id === draggableId) {
          return {
            ...todo,
            isDragged: true,
          };
        } else {
          return { ...todo };
        }
      });
    });

    setIsDragActive(prevState => ({
      ...prevState,
      active: true,
    }));
  };

  const handleDragEndActive = (result: DropResult) => {
    console.log(result);

    const { draggableId, source, destination } = result;
    setTodoListNew(prevState => {
      return prevState.map(todo => {
        if (todo.id === draggableId) {
          return {
            ...todo,
            isDragged: false,
          };
        } else {
          return { ...todo };
        }
      });
    });
    setIsDragActive(prevState => ({
      ...prevState,
      [source.droppableId]: false,
    }));

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newTodoList = [...todoListNew];
    const [draggedTodoItem] = newTodoList.splice(source.index, 1);
    newTodoList.splice(destination.index, 0, draggedTodoItem);

    setTodoListNew(
      newTodoList.map(todo => {
        if (todo.id === draggableId) {
          return {
            ...todo,
            isDragged: false,
          };
        } else {
          return { ...todo };
        }
      })
    );
  };

  const handleDragEndCompleted = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newTodoList = [...todoListDone];
    const [draggedTodoItem] = newTodoList.splice(source.index, 1);
    newTodoList.splice(destination.index, 0, draggedTodoItem);

    setTodoListDone(newTodoList);
  };

  return (
    <div ref={parent} className="w-auto">
      {/* Render un-completed tasks */}
      <DragDropContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEndActive}
      >
        <TodoList
          droppableId="active"
          isDragActive={isDragActive.active}
          todoList={todoListNew}
          handleToggle={handleToggleEntryNew}
          handleDelete={handleDeleteNew}
          handleRemoveDateTime={handleRemoveDateTime}
        />
      </DragDropContext>

      {/* Active - completed divider */}
      <TodoPanelDivider isReveal={isReveal} handleReveal={handleReveal} />

      {/* Render completed tasks */}
      <DragDropContext onDragEnd={handleDragEndCompleted}>
        {isReveal && (
          <TodoList
            droppableId="completed"
            isDragActive={isDragActive.completed}
            todoList={todoListDone}
            handleToggle={handleToggleEntryDone}
            handleDelete={handleDeleteDone}
            handleRemoveDateTime={handleDeleteDone}
          />
        )}
      </DragDropContext>
    </div>
  );
};
