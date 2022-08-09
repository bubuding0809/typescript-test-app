import React, { useRef, useState, useEffect } from "react";
import { Todo } from "../utils/types";
import { Box, IconButton, Chip, Typography, Divider } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import autoAnimate from "@formkit/auto-animate";
import { DraggableProvided } from "react-beautiful-dnd";

interface TodoItemProps {
  provided: DraggableProvided;
  todo: Todo;
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: any;
  handleRemoveDateTime: any;
  isLast: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  provided,
  todo,
  handleToggle,
  handleDelete,
  handleRemoveDateTime,
  isLast,
}: TodoItemProps) => {
  // Set up autoAnimation of ul element
  const parent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const [isHover, setIsHover] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const formateDate = (date: string) => {
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

  return (
    <Box
      className="flex flex-col"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div
        className={`
            relative flex justify-between items-center 
            px-3 py-3 pr-8 hover:shadow-inner rounded
            ${todo.isChecked ? "bg-gray-300" : "bg-white"}
            ${
              todo.isDragged &&
              "border-3 border-slate-700 bg-slate-50/80 shadow-solid-small"
            } 
          `}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {/* todo item content */}
        <div className="flex items-center">
          <Checkbox
            className="self-start"
            size="small"
            name={todo.id}
            checked={todo.isChecked}
            onChange={handleToggle}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleIcon color="success" />}
          />
          <div ref={parent} className="flex flex-col gap-1 items-start">
            <p
              className={`
                text-start text-ellipsis overflow-hidden 
                text-[#35605A]
                ${todo.isChecked ? "text-[#35605a] line-through" : ""}
              `}
            >
              {todo.message}
            </p>
            {todo.description && (
              <Typography
                textAlign="left"
                variant="body2"
                color="textSecondary"
              >
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
                  todo.isChecked
                    ? undefined
                    : () => handleRemoveDateTime(todo.id)
                }
              />
            )}
          </div>
        </div>

        {/* Show delete button on hover */}
        {isHover && (
          <IconButton
            sx={{
              position: "absolute",
              top: "19px",
              right: "8px",
            }}
            ref={buttonRef}
            size="small"
            onClick={e => handleDelete(e, buttonRef)}
            name={todo.id}
          >
            <ClearIcon
              sx={{
                fontSize: 15,
              }}
            />
          </IconButton>
        )}
      </div>
      {/* {!isLast && (
        <Divider
          sx={{
            width: "95%",
            alignSelf: "center",
          }}
        />
      )} */}
    </Box>
  );
};
