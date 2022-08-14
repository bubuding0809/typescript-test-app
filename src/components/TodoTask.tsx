import React, { useRef, useState, useEffect } from "react";
import { Todo } from "../utils/types";
import { Chip, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import autoAnimate from "@formkit/auto-animate";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { TodoTaskMenu } from "./TodoTaskMenu";
import { BpCheckBox } from "./BpCheckBox";

interface TodoTaskProps {
  todo: Todo;
  listOrigin: string;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot | undefined;
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: any;
  handleRemoveDateTime: any;
}

export const TodoTask: React.FC<TodoTaskProps> = ({
  todo,
  listOrigin,
  snapshot,
  handleToggle,
  handleDelete,
  handleRemoveDateTime,
}) => {
  // Set up autoAnimation of ul element
  const parent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const [isHover, setIsHover] = useState<boolean>(false);

  const formateDate = (date: string): string => {
    const dateObj = new Date(date);

    if (dateObj.toDateString() === new Date().toDateString()) {
      return "Today";
    }

    const dayOfWeekName = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const monthName = dateObj.toLocaleDateString("en-US", {
      month: "short",
    });
    const day = dateObj.getDate();

    return `${dayOfWeekName}, ${day} ${monthName}`;
  };

  const draggedStyle = (): string => {
    return snapshot?.isDragging
      ? "rounded border-3 border-slate-700 bg-slate-50/80 shadow-solid-small"
      : "";
  };

  return (
    <div
      className={`
      relative flex justify-between items-center 
      px-1 py-1 pr-6
      ${draggedStyle()}
    `}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* todo item content */}
      <div className="flex items-center">
        <BpCheckBox
          className="self-start"
          name={todo.id}
          checked={todo.isChecked}
          onChange={handleToggle}
        />
        <div ref={parent} className="flex flex-col gap-1 items-start">
          <p
            className={`
              text-start text-ellipsis overflow-hidden 
              font-normal text-black
              ${todo.isChecked ? "line-through" : ""}
            `}
          >
            {todo.message}
          </p>
          {todo.description && (
            <Typography textAlign="left" variant="body2" color="textSecondary">
              {todo.description}
            </Typography>
          )}
          {todo.date && (
            <Chip
              sx={{
                color: "text.secondary",
                paddingLeft: "5px",
              }}
              variant="outlined"
              size="small"
              label={`${formateDate(todo.date)}, ${todo.time && todo.time}`}
              icon={<CalendarMonthIcon />}
              onDelete={
                todo.isChecked ? undefined : () => handleRemoveDateTime(todo.id)
              }
            />
          )}
        </div>
      </div>

      {/* Show delete button on hover */}
      {isHover && (
        <div className="absolute top-2 right-0">
          <TodoTaskMenu
            todo={todo}
            listOrigin={listOrigin}
            handleDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};
