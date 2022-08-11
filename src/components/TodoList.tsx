import autoAnimate from "@formkit/auto-animate";
import { useRef, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Todo } from "../utils/types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  droppableId: string;
  isDragActive: boolean;
  todoList: Todo[];
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: any;
  handleRemoveDateTime: any;
}

export const TodoList: React.FC<TodoListProps> = ({
  droppableId,
  isDragActive,
  todoList,
  handleToggle,
  handleDelete,
  handleRemoveDateTime,
}: TodoListProps) => {
  // Set up autoAnimation of div element
  const parent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const bgColor = () => {
    if (!isDragActive) {
      return "bg-gray-200/70";
    } else {
      return "bg-[#F0F7EC]";
    }
  };

  return (
    <Droppable
      droppableId={droppableId}
      type={droppableId + "-main"}
      isCombineEnabled
    >
      {(provided) => (
        <div
          className={`
            flex flex-col gap-2 first:rounded-t last:rounded-b p-2 
            ${bgColor()}
          `}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {todoList.length ? (
            todoList.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided) => (
                  <TodoItem
                    provided={provided}
                    todo={todo}
                    handleToggle={handleToggle}
                    handleDelete={handleDelete}
                    handleRemoveDateTime={handleRemoveDateTime}
                  />
                )}
              </Draggable>
            ))
          ) : (
            <div className="py-2">
              <p>Nothing {droppableId}</p>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
