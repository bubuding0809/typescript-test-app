import React, { useRef, useState } from "react";
import { Todo } from "../utils/types";
import { IconButton } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ClearIcon from "@mui/icons-material/Clear";

interface TodoItemProps {
  todo: Todo;
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: any;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleToggle,
  handleDelete,
}: TodoItemProps) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      key={todo.id}
      className={`flex justify-between items-center border rounded p-2 shadow mb-2 mx-2 
        hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-blue-500/50 
        ${todo.isChecked ? "bg-gray-200" : ""}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="flex items-center">
        <Checkbox
          size="small"
          name={todo.id}
          checked={todo.isChecked}
          onChange={handleToggle}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon color="success" />}
        />
        <p
          className={`text-start text-ellipsis overflow-hidden ${
            todo.isChecked ? "line-through text-slate-500" : ""
          }`}
        >
          {todo.message}
        </p>
      </div>
      {isHover && (
        <IconButton
          ref={buttonRef}
          size="small"
          onClick={(e) => handleDelete(e, buttonRef)}
          name={todo.id}
        >
          <ClearIcon />
        </IconButton>
      )}
    </div>
  );
};
