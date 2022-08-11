import React, { useRef, useState, useEffect } from "react";
import { Todo } from "../utils/types";
import { Box, IconButton, Chip, Typography, Divider } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import autoAnimate from "@formkit/auto-animate";
import { Draggable, DraggableProvided, Droppable } from "react-beautiful-dnd";
import { TodoTask } from "./TodoTask";

interface TodoItemProps {
  provided: DraggableProvided;
  todo: Todo;
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: any;
  handleRemoveDateTime: any;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  provided,
  todo,
  handleToggle,
  handleDelete,
  handleRemoveDateTime,
}: TodoItemProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`
        flex flex-col hover:shadow-inner rounded
        ${todo.isChecked ? "bg-gray-300" : "bg-white"}
        ${
          todo.isDragged &&
          "border-3 border-slate-700 bg-slate-50/80 shadow-solid-small"
        }
      `}
    >
      <TodoTask
        provided={provided}
        todo={todo}
        handleToggle={handleToggle}
        handleDelete={handleDelete}
        handleRemoveDateTime={handleRemoveDateTime}
      />

      {/* sub tasks */}
      <div className="pl-6">
        <Droppable droppableId={todo.id} type={"active-subtask"}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {todo.subTasks.map((subTodo, index) => (
                <Draggable
                  key={subTodo.id}
                  draggableId={subTodo.id}
                  index={index}
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Divider
                        sx={{
                          marginX: 2.5,
                        }}
                      />
                      <TodoTask
                        provided={provided}
                        todo={subTodo}
                        handleToggle={() => {}}
                        handleDelete={() => {}}
                        handleRemoveDateTime={() => {}}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
