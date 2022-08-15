import React, { useRef, useState, useEffect } from "react";
import { Todo } from "../utils/types";
import { Chip, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import autoAnimate from "@formkit/auto-animate";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { TodoTaskMenu } from "./TodoTaskMenu";
import { BpCheckBox } from "./custom/BpCheckBox";

interface TodoTaskProps {
  todo: Todo;
  listOrigin: string;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot | undefined;
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: any;
  handleRemoveDateTime: any;
  handleUnappendSubtask: any;
}

export const TodoTask: React.FC<TodoTaskProps> = ({
  todo,
  listOrigin,
  snapshot,
  handleToggle,
  handleDelete,
  handleRemoveDateTime,
  handleUnappendSubtask,
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
      px-1 py-1 
      ${draggedStyle()}
    `}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* todo item content */}
      <div className="flex flex-col items-stretch w-full mr-4">
        {/* CheckBox and task title */}
        <div className="flex justify-start items-start gap-1">
          <BpCheckBox
            className="self-start"
            name={todo.id}
            checked={todo.isChecked}
            onChange={handleToggle}
          />
          <Typography
            sx={{
              textDecoration: todo.isChecked ? "line-through" : "",
              width: "100%",
            }}
          >
            {todo.message}
          </Typography>
          {isHover && (
            <div className="absolute -right-0.5 top-0.5">
              <TodoTaskMenu
                handleUnappend={handleUnappendSubtask}
                todo={todo}
                listOrigin={listOrigin}
                handleDelete={handleDelete}
              />
            </div>
          )}
        </div>

        {/* Task details: description, time, etc... */}
        <div ref={parent} className="flex flex-col gap-1 ml-6 items-start">
          {todo.description && (
            <div className="flex gap-1">
              <DescriptionIcon
                sx={{
                  color: "#9cb380",
                  opacity: 0.8,
                  fontSize: "18px",
                }}
              />
              <Typography
                textAlign="left"
                variant="body2"
                color="textSecondary"
              >
                {todo.description}
              </Typography>
              {/* Show delete button on hover */}
            </div>
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
    </div>
  );
};
