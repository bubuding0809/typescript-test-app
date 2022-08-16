import React, { useRef, useState, useEffect } from "react";
import { Collapse, IconButton, Typography } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { BoardType, PanelType, TaskType } from "../utils/types";
import { Divider } from "@mui/material";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableStateSnapshot,
  Droppable,
} from "react-beautiful-dnd";
import { TodoTask } from "./TodoTask";
import autoAnimate from "@formkit/auto-animate";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface TodoItemProps {
  boardData: BoardType;
  panelData: PanelType;
  task: TaskType;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  listOrigin: string;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  boardData,
  panelData,
  task,
  provided,
  snapshot,
  listOrigin,
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

  const nestedListStyle = (snapshot: DroppableStateSnapshot) => {
    const { isDraggingOver, draggingFromThisWith, draggingOverWith } = snapshot;

    if (!isDraggingOver) {
      return "";
    }

    if (draggingFromThisWith === draggingOverWith)
      return "bg-emerald-100/50 shadow-inner rounded-r";
    else {
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
        ${task.isCompleted ? "bg-gray-300" : "bg-white"}
        ${
          snapshot.isDragging
            ? "border-3 border-slate-700 bg-slate-50/80 shadow-solid-small"
            : "border"
        }
      `}
    >
      <TodoTask
        task={task}
        provided={provided}
        listOrigin={listOrigin}
        handleToggle={() => {}}
        handleDelete={() => {}}
        handleRemoveDateTime={() => {}}
        handleUnappendSubtask={() => {}}
      />

      {/* sub tasks */}
      {task.subtasks.length > 0 && (
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
            <Droppable droppableId={task.id} type={"active-subtask"}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`px-1 w-full border-l-2 ${nestedListStyle(
                    snapshot
                  )}`}
                >
                  <TransitionGroup className="flex flex-col">
                    {task.subtasks.map((subtask, index) => (
                      <Collapse key={boardData.todoTasks[subtask].id}>
                        <Draggable
                          draggableId={boardData.todoTasks[subtask].id}
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
                                task={task}
                                listOrigin={listOrigin}
                                provided={provided}
                                snapshot={snapshot}
                                handleToggle={() => {}}
                                handleDelete={() => {}}
                                handleRemoveDateTime={() => {}}
                                handleUnappendSubtask={() => {}}
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
              {`${task.subtasks.length} sub tasks`}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};
