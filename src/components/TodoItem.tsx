import React, { useRef, useState, useEffect } from "react";
import { Collapse, IconButton, Typography } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { Todo } from "../utils/types";
import { Divider } from "@mui/material";
import { Draggable, DraggableProvided, Droppable } from "react-beautiful-dnd";
import { TodoTask } from "./TodoTask";
import autoAnimate from "@formkit/auto-animate";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface TodoItemProps {
  todo: Todo;
  provided: DraggableProvided;
  listOrigin: string;
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  handleToggleSubtask: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: any;
  handleRemoveDateTime: any;
  handleUnappendSubtask: any;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  provided,
  listOrigin,
  handleToggle,
  handleToggleSubtask,
  handleDelete,
  handleRemoveDateTime,
  handleUnappendSubtask,
}: TodoItemProps) => {
  const [isRevealSubtasks, setIsRevealSubtasks] = useState(false);

  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent, isRevealSubtasks]);

  const nestListPreviewStyle = () => {
    if (listOrigin === "active") {
      return "bg-gradient-to-br from-emerald-100/50 to-gray-100";
    }
    return "bg-gradient-to-br from-gray-100/50 to-slate-200/50";
  };

  const nestedListStyle = () => {
    if (!todo.isNestedDragged.isDragged) {
      return "";
    }
    if (todo.isNestedDragged.isSource) {
      return "bg-emerald-100/50 shadow-inner rounded-r";
    } else {
      return "bg-sky-100/50 shadow-inner rounded-r";
    }
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`
        flex flex-col hover:shadow-inner rounded p-1 shadow
        ${todo.isChecked ? "bg-gray-300" : "bg-white"}
        ${
          todo.isDragged
            ? "border-3 border-slate-700 bg-slate-50/80 shadow-solid-small"
            : "border"
        }
      `}
    >
      <TodoTask
        todo={todo}
        provided={provided}
        listOrigin={listOrigin}
        snapshot={undefined}
        handleToggle={handleToggle}
        handleDelete={handleDelete}
        handleRemoveDateTime={handleRemoveDateTime}
        handleUnappendSubtask={handleUnappendSubtask}
      />

      {/* sub tasks */}
      {todo.subTasks.length > 0 && (
        <div
          ref={parent}
          className="flex justify-start items-center p-1.5 gap-1"
        >
          <IconButton
            sx={{
              padding: "0",
              alignSelf: "flex-start",
            }}
            size="small"
            onClick={() => setIsRevealSubtasks(prevState => !prevState)}
          >
            {isRevealSubtasks ? (
              <ExpandMoreIcon sx={{ fontSize: "20px" }} />
            ) : (
              <ChevronRightIcon sx={{ fontSize: "20px" }} />
            )}
          </IconButton>

          {isRevealSubtasks ? (
            <div className={`px-1 w-full border-l-2 ${nestedListStyle()}`}>
              <Droppable droppableId={todo.id} type={"active-subtask"}>
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <TransitionGroup className="flex flex-col">
                      {todo.subTasks.map((subTodo, index) => (
                        <Collapse key={subTodo.id}>
                          <Draggable
                            draggableId={subTodo.id}
                            index={index}
                            isDragDisabled={listOrigin !== "active"}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {!snapshot.isDragging && index !== 0 && (
                                  <Divider
                                    sx={{
                                      marginX: 1,
                                      marginY: 0.5,
                                    }}
                                  />
                                )}
                                <TodoTask
                                  todo={subTodo}
                                  listOrigin={listOrigin}
                                  provided={provided}
                                  snapshot={snapshot}
                                  handleToggle={handleToggleSubtask}
                                  handleDelete={handleDelete}
                                  handleRemoveDateTime={handleRemoveDateTime}
                                  handleUnappendSubtask={handleUnappendSubtask}
                                />
                              </div>
                            )}
                          </Draggable>
                        </Collapse>
                      ))}
                    </TransitionGroup>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ) : (
            <Typography
              className={`
                rounded border cursor-pointer
                ${nestListPreviewStyle()}
              `}
              variant="subtitle2"
              sx={{
                lineHeight: "20px",
                width: "100%",
                paddingX: "10px",
                paddingY: "2px",
              }}
              onClick={() => setIsRevealSubtasks(true)}
            >
              {`${todo.subTasks.length} sub tasks`}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};
