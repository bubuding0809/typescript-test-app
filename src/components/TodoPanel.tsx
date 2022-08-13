import { Todo } from "../utils/types";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import { ChangeEventHandler, useEffect, useState, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { DragDropContext, DropResult, DragStart } from "react-beautiful-dnd";
import { TodoPanelDivider } from "./TodoPanelDivider";
import { TodoList } from "./TodoList";
import { Typography, Paper } from "@mui/material";

interface TodoListProps {
  todoListNew: Todo[];
  setTodoListNew: React.Dispatch<React.SetStateAction<Todo[]>>;
  todoListDone: Todo[];
  setTodoListDone: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleToggleEntryNew: ChangeEventHandler<HTMLInputElement>;
  handleToggleEntryDone: ChangeEventHandler<HTMLInputElement>;
  handleToggleSubtask: ChangeEventHandler<HTMLInputElement>;
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
  handleToggleSubtask,
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

  const [isCombineEnabled, setIsCombineEnabled] = useState<boolean>(false);

  const handleReveal: React.ChangeEventHandler<HTMLInputElement> = () => {
    setIsReveal(prevState => {
      setLocalStorage("isReveal", !prevState);
      return !prevState;
    });
  };

  const handleResetFlags = () => {
    //reset isCombineEnabled flag
    setIsCombineEnabled(false);

    // Set all drag flags to false
    setTodoListNew(prevState =>
      prevState.map(todo => ({
        ...todo,
        isDragged: false,
        isNestedDragged: {
          ...todo.isNestedDragged,
          isDragged: false,
          isSource: false,
        },
      }))
    );

    //set list drag flag to false
    setIsDragActive(prevState => ({
      ...prevState,
      active: false,
    }));
  };

  const handleDragStart = (initial: DragStart) => {
    const { draggableId, source, type } = initial;
    console.log(initial);
    // Set source todo isNestedDragged to true if draggable type is "main"
    if (type !== "active-main") {
      setTodoListNew(prevState => {
        return prevState.map(todo => {
          return {
            ...todo,
            isNestedDragged: {
              isDragged: true,
              isSource: todo.id === source.droppableId,
            },
          };
        });
      });
      return;
    }

    // Set todo isDragged to true if draggable type is "main"
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

    // set isCombineEnabled flag to true if draggable has no children
    todoListNew.forEach(todo => {
      if (todo.id === draggableId && todo.subTasks.length === 0) {
        setIsCombineEnabled(true);
      }
    });
  };

  const handleDragEndActive = (result: DropResult) => {
    const { draggableId, source, destination, combine, type } = result;

    // Reset all drag flags
    handleResetFlags();

    // Handle combination of tasks
    if (combine) {
      console.info("Combining tasks", draggableId, combine.draggableId);
      const targetId = combine.draggableId;
      setTodoListNew(prevState => {
        let subTodo: Todo;
        return prevState
          .filter(todo => {
            if (todo.id === draggableId) {
              subTodo = { ...todo, isTopLevelItem: false };
              return false;
            }
            return true;
          })
          .map(todo => {
            if (todo.id === targetId)
              return {
                ...todo,
                subTasks: [...todo.subTasks, subTodo],
              };
            return todo;
          });
      });
      return;
    }

    // Check for drop outside droppable zone
    if (!destination) {
      console.info("Drop outside droppable zone");
      return;
    }

    // Check for no change in postion
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      console.info("No change in position");
      return;
    }

    // Handle nested subtask re-arrangement
    if (type !== "active-main") {
      setTodoListNew(prevState => {
        const newTodoList = [...prevState];

        let subTask: Todo;

        // Remove subtask from source toplevel item
        newTodoList.forEach(todo => {
          if (todo.id === source.droppableId) {
            subTask = todo.subTasks.splice(source.index, 1)[0];
          }
        });

        // Add subtask to destination toplevel item
        newTodoList.forEach(todo => {
          if (todo.id === destination.droppableId) {
            todo.subTasks.splice(destination.index, 0, subTask);
          }
        });

        return newTodoList;
      });
      return;
    }

    // Handle rearrange ment of top level items and setting isDragged to false
    setTodoListNew(prevState => {
      const newTodoList = [...prevState];
      const [draggedTodoItem] = newTodoList.splice(source.index, 1);
      newTodoList.splice(destination.index, 0, draggedTodoItem);

      // Set isDragged to false for all toplevel items
      newTodoList.forEach(todo => ({
        ...todo,
        isDragged: false,
      }));

      return newTodoList;
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
    <Paper
      sx={{
        backgroundColor: "#e5e7eb",
      }}
      className="flex flex-col"
      elevation={3}
    >
      {/* Panel header */}
      <div className="flex px-3 pt-2 bg-gray-200 rounded-t">
        <Typography variant="body1" fontWeight={600} fontSize={18} color="">
          School Work
        </Typography>
      </div>

      {/* Panel body */}
      <div ref={parent} className="flex flex-col">
        {/* Render un-completed tasks */}
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEndActive}
        >
          <TodoList
            isCombineEnabled={isCombineEnabled}
            droppableId="active"
            isDragActive={isDragActive.active}
            todoList={todoListNew}
            handleToggle={handleToggleEntryNew}
            handleToggleSubtask={handleToggleSubtask}
            handleDelete={handleDeleteNew}
            handleRemoveDateTime={handleRemoveDateTime}
          />
        </DragDropContext>

        {/* Active - completed divider */}
        <TodoPanelDivider
          activeCount={todoListNew.length}
          completedCount={todoListDone.length}
          isReveal={isReveal}
          handleReveal={handleReveal}
        />

        {/* Render completed tasks */}
        <DragDropContext onDragEnd={handleDragEndCompleted}>
          {isReveal && (
            <TodoList
              isCombineEnabled={false}
              droppableId="completed"
              isDragActive={isDragActive.completed}
              todoList={todoListDone}
              handleToggle={handleToggleEntryDone}
              handleToggleSubtask={handleToggleSubtask}
              handleDelete={handleDeleteDone}
              handleRemoveDateTime={handleDeleteDone}
            />
          )}
        </DragDropContext>
      </div>
    </Paper>
  );
};
