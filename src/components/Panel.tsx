import React, { CSSProperties, FormEventHandler, useState } from "react";
import { nanoid } from "nanoid";
import { Entry, BoardType } from "../utils/types";
import { TodoEntryForm } from "./TodoEntryForm";
import { TodoMain } from "./TodoMain";
import { PanelType } from "../utils/types";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

interface PanelProps {
  style: CSSProperties;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  panelData: PanelType;
  boardData: BoardType;
  setBoardData: React.Dispatch<React.SetStateAction<BoardType>>;
  newPanel: string;
  setNewPanel: React.Dispatch<React.SetStateAction<string>>;
}

const Panel = ({
  style,
  provided,
  snapshot,
  panelData,
  boardData,
  setBoardData,
  newPanel,
  setNewPanel,
}: PanelProps): JSX.Element => {
  const {
    id: panelId,
    active: activeList,
    completed: completedList,
  } = panelData;

  const [newEntry, setNewEntry] = useState<Entry>({
    todoMessage: "",
    todoDateTime: null,
    todoDescription: "",
  });

  //handle new todo entry
  const handleNewEntry: FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    const { todoMessage, todoDateTime, todoDescription } = newEntry;

    // Ensure that the todoMessage is not empty
    if (!todoMessage.trim()) {
      alert("Enter a task mate");
      return;
    }

    // Update active list with new item
    const newTaskId = nanoid();
    setBoardData(prevState => ({
      ...prevState,
      todoTasks: {
        ...prevState.todoTasks,
        [newTaskId]: {
          id: newTaskId,
          title: todoMessage.trim(),
          date: todoDateTime ? todoDateTime.format("YYYY-MM-DD") : "",
          time: todoDateTime ? todoDateTime.format("h:mm a") : "",
          description: todoDescription ? todoDescription.trim() : "",
          subtasks: [],
          isCompleted: false,
          isTopLevel: true,
        },
      },
      panels: {
        ...prevState.panels,
        [panelData.id]: {
          ...panelData,
          active: [newTaskId, ...panelData.active],
        },
      },
    }));

    //reset newEntry form
    setNewEntry({
      todoMessage: "",
      todoDateTime: null,
      todoDescription: "",
    });
  };

  const onDragStyle = snapshot.isDragging ? "" : "";

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={style}
      className={`flex flex-col gap-2 min-w-sm w-80 max-w-sm ${onDragStyle}`}
    >
      {/* Task Entry form */}
      <TodoEntryForm
        handleNewEntry={handleNewEntry}
        newEntry={newEntry}
        setNewEntry={setNewEntry}
      />

      {/* Task list */}
      <TodoMain
        provided={provided}
        panelData={panelData}
        boardData={boardData}
        setBoardData={setBoardData}
        activeList={activeList}
        completedList={completedList}
        newPanel={newPanel}
        setNewPanel={setNewPanel}
      />
    </div>
  );
};

export default Panel;
