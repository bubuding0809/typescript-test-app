import autoAnimate from "@formkit/auto-animate";
import { useRef, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Todo } from "../utils/types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  isCombineEnabled: boolean;
  droppableId: string;
  isDragActive: boolean;
  todoList: Todo[];
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: any;
  handleRemoveDateTime: any;
}

export const TodoList: React.FC<TodoListProps> = ({
  isCombineEnabled,
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

  const bgColor = () =>
    !isDragActive ? "bg-gray-200" : "bg-[#F0F7EC] shadow-inner";

  return (
    <Droppable
      droppableId={droppableId}
      type={droppableId + "-main"}
      isCombineEnabled={isCombineEnabled}
    >
      {provided => (
        <div
          className={`
            flex flex-col gap-2 m-2
            ${bgColor()}
          `}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {todoList.length ? (
            todoList.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {provided => (
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
            <div className="py-2 text-center">
              <p>Nothing {droppableId}</p>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
