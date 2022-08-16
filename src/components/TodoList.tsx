import autoAnimate from "@formkit/auto-animate";
import { useRef, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Todo } from "../utils/types";
import { TodoItem } from "./TodoItem";
import { TransitionGroup } from "react-transition-group";
import { Collapse } from "@mui/material";

interface TodoListProps {
  isCombineEnabled: boolean;
  droppableId: string;
  isDragActive: boolean;
  todoList: Todo[];
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  handleToggleSubtask: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: any;
  handleRemoveDateTime: any;
  handleUnappendSubtask: any;
}

export const TodoList: React.FC<TodoListProps> = ({
  isCombineEnabled,
  droppableId,
  isDragActive,
  todoList,
  handleToggle,
  handleToggleSubtask,
  handleDelete,
  handleRemoveDateTime,
  handleUnappendSubtask,
}: TodoListProps) => {
  // Set up autoAnimation of div element
  const parent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  // Change bg color of list when drag is active
  const bgColor = () =>
    isDragActive ? "transition ease delay-200 bg-[#F0F7EC]/80" : "";

  return (
    <Droppable
      droppableId={droppableId}
      type={droppableId + "-main"}
      isCombineEnabled={isCombineEnabled}
    >
      {(provided, snapshot) => (
        <div
          className={`m-2 rounded 
            ${
              snapshot.isDraggingOver
                ? "transition ease-in delay-200 bg-[#F0F7EC] shadow-inner"
                : bgColor()
            }
          `}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <TransitionGroup className="flex flex-col gap-1.5">
            {todoList.length ? (
              todoList.map((todo, index) => (
                <Collapse key={todo.id}>
                  <Draggable draggableId={todo.id} index={index}>
                    {provided => (
                      <TodoItem
                        provided={provided}
                        todo={todo}
                        listOrigin={droppableId}
                        handleToggle={handleToggle}
                        handleToggleSubtask={handleToggleSubtask}
                        handleDelete={handleDelete}
                        handleRemoveDateTime={handleRemoveDateTime}
                        handleUnappendSubtask={handleUnappendSubtask}
                      />
                    )}
                  </Draggable>
                </Collapse>
              ))
            ) : (
              <Collapse>
                <div className="py-2 text-center">
                  <p>Nothing {droppableId}</p>
                </div>
              </Collapse>
            )}
          </TransitionGroup>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
