import React, {
  FormEventHandler,
  useState,
  useEffect,
  ReactElement,
} from "react";
import { nanoid } from "nanoid";
import { Todo, Entry, BoardType } from "../utils/types";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import { TodoEntryForm } from "./TodoEntryForm";
import { TodoMain } from "./TodoMain";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { PanelType } from "../utils/types";

interface PanelProps {
  panelData: PanelType;
  boardData: BoardType;
  setBoardData: React.Dispatch<React.SetStateAction<BoardType>>;
}

const Panel = ({
  panelData,
  boardData,
  setBoardData,
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

  return (
    <div className="flex flex-col gap-2 min-w-sm max-w-sm">
      {/* Task Entry form */}
      <TodoEntryForm
        handleNewEntry={handleNewEntry}
        newEntry={newEntry}
        setNewEntry={setNewEntry}
      />

      {/* Task list */}
      <TodoMain
        panelData={panelData}
        boardData={boardData}
        setBoardData={setBoardData}
        activeList={activeList}
        completedList={completedList}
      />
    </div>
  );
};

export default Panel;
