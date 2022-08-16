import autoAnimate from "@formkit/auto-animate";
import { useRef, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { BoardType, PanelType, Todo } from "../utils/types";
import { TodoItem } from "./TodoItem";
import { TransitionGroup } from "react-transition-group";
import { Collapse } from "@mui/material";

interface TodoListProps {
  boardData: BoardType;
  panelData: PanelType;
  todoList: string[];
  droppableId: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  boardData,
  panelData,
  todoList,
  droppableId,
}: TodoListProps) => {
  // Set up autoAnimation of div element
  const parent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <Droppable droppableId={droppableId} type={droppableId + "-main"}>
      {(provided, snapshot) => (
        <div
          className={`m-2 rounded 
          ${
            snapshot.isDraggingOver
              ? "transition duration-200 delay-100 ease-in bg-[#F0F7EC] shadow-inner"
              : "transition duration-300 delay-150 ease-out"
          }

          `}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <TransitionGroup className="flex flex-col gap-1.5">
            {todoList.length ? (
              todoList.map((taskId, index) => (
                <Collapse key={taskId}>
                  <Draggable draggableId={taskId} index={index}>
                    {(provided, snapshot) => (
                      <TodoItem
                        task={boardData.todoTasks[taskId]}
                        boardData={boardData}
                        panelData={panelData}
                        provided={provided}
                        snapshot={snapshot}
                        listOrigin={droppableId}
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
