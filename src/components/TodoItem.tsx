import React, { useRef, useState, useEffect } from "react";
import { Todo } from "../utils/types";
import { Divider } from "@mui/material";
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
  const nestedListStyle = () => {
    if (!todo.isNestedDragged.isDragged) {
      return "";
    }
    if (todo.isNestedDragged.isSource) {
      return "bg-emerald-100/50 rounded shadow-inner";
    } else {
      return "bg-sky-100/50 rounded shadow-inner";
    }
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`
        flex flex-col hover:shadow-inner rounded p-1
        ${todo.isChecked ? "bg-gray-300" : "bg-white"}
        ${
          todo.isDragged &&
          "border-3 border-slate-700 bg-slate-50/80 shadow-solid-small"
        }
      `}
    >
      <TodoTask
        provided={provided}
        snapshot={undefined}
        todo={todo}
        handleToggle={handleToggle}
        handleDelete={handleDelete}
        handleRemoveDateTime={handleRemoveDateTime}
      />

      {/* sub tasks */}
      {todo.subTasks.length > 0 && (
        <div className={`ml-6 py-2 ${nestedListStyle()}`}>
          <Droppable droppableId={todo.id} type={"active-subtask"}>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {todo.subTasks.map((subTodo, index) => (
                  <Draggable
                    key={subTodo.id}
                    draggableId={subTodo.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        {!snapshot.isDragging && (
                          <Divider
                            sx={{
                              marginX: 2.5,
                            }}
                          />
                        )}
                        <TodoTask
                          provided={provided}
                          snapshot={snapshot}
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
      )}
    </div>
  );
};
