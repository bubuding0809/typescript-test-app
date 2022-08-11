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
    setIsReveal((prevState) => {
      setLocalStorage("isReveal", !prevState);
      return !prevState;
    });
  };

  const handleDragStart = (initial: DragStart) => {
    const { draggableId, source } = initial;
    setTodoListNew((prevState) => {
      return prevState.map((todo) => {
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

    setIsDragActive((prevState) => ({
      ...prevState,
      active: true,
    }));
  };

  const handleDragEndActive = (result: DropResult) => {
    console.log(result);
    const { draggableId, source, destination, combine, type } = result;

    // Set isDragged to false
    setTodoListNew((prevState) => {
      return prevState.map((todo) => {
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

    //set isDrag to false
    setIsDragActive((prevState) => ({
      ...prevState,
      [source.droppableId]: false,
    }));

    // Check for drop outside droppable zone
    if (!destination) {
      return;
    }

    // Check for no change in postion
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Handle nested subtask re-arrangement
    if (type !== "active-main") {
      console.log("re-arranging nested subtasks");
      const [sourceToplevelItem] = todoListNew.filter(
        (todo) => todo.id === source.droppableId
      );
      console.log(sourceToplevelItem);
      return;
    }

    // Handle combination of tasks
    if (combine) {
      const targetId = combine.draggableId;
      setTodoListNew((prevState) => {
        let subTodo: Todo;
        const newTodoList = prevState
          .filter((todo) => {
            if (todo.id === draggableId) {
              subTodo = todo;
              return false;
            }
            return true;
          })
          .map((todo) => {
            if (todo.id === targetId)
              return {
                ...todo,
                subTasks: [...todo.subTasks, subTodo],
              };
            return todo;
          });
        setLocalStorage("todoListNew", newTodoList);
        return newTodoList;
      });
    }

    // Handle rearrange ment of top level items and setting isDragged to false
    setTodoListNew((prevState) => {
      const newTodoList = prevState;
      const [draggedTodoItem] = newTodoList.splice(source.index, 1);
      newTodoList.splice(destination.index, 0, draggedTodoItem);
      return newTodoList.map((todo) => {
        if (todo.id === draggableId) {
          return {
            ...todo,
            isDragged: false,
          };
        }
        return todo;
      });
    });
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
