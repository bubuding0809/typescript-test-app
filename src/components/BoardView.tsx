import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BoardType } from "../utils/types";
import Panel from "./Panel";
import AddIcon from "@mui/icons-material/Add";
import { nanoid } from "nanoid";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import { DragDropContext } from "react-beautiful-dnd";

const emptyBoardData: BoardType = {
  todoTasks: {},
  panels: {},
  panelOrder: [],
};

const BoardView = () => {
  const [boardData, setBoardData] = useState<BoardType>(
    getLocalStorage("boardData", emptyBoardData)
  );

  const [isPanelNew, setIsPanelNew] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setLocalStorage("boardData", boardData);
    console.log(boardData);
  }, [boardData]);

  const handleCreateNewPanel = () => {
    // Create new panel and update state
    const newPanelId = nanoid();
    setBoardData((prevState) => ({
      ...prevState,
      panels: {
        ...prevState.panels,
        [newPanelId]: {
          id: newPanelId,
          title: "",
          active: [],
          completed: [],
        },
      },
      panelOrder: [...prevState.panelOrder, newPanelId],
    }));

    setIsPanelNew((prevState) => ({
      ...prevState,
      [newPanelId]: true,
    }));
  };

  return (
    <div
      className="
      flex p-4 gap-4 h-full items-start
      bg-green-image bg-cover overflow-auto
    "
    >
      <DragDropContext onDragEnd={(result) => console.log(result)}>
        {boardData.panelOrder.map((panelId) => {
          const panelData = boardData.panels[panelId];
          return (
            <Panel
              key={panelId}
              panelData={panelData}
              boardData={boardData}
              setBoardData={setBoardData}
              isPanelNew={isPanelNew}
              setIsPanelNew={setIsPanelNew}
            />
          );
        })}
      </DragDropContext>
      <Button
        sx={{
          backgroundColor: "rgba(220, 220, 220, 0.6)",
          border: "1px solid rgba(175, 175, 175, 0.36)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          borderRadius: "4px",
          maxWidth: "40px",
          maxHeight: "40px",
          minWidth: "40px",
          minHeight: "40px",
        }}
        color="success"
        onClick={handleCreateNewPanel}
      >
        <AddIcon color="action" />
      </Button>
    </div>
  );
};

export default BoardView;
