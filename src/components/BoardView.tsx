import { Button, Collapse } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BoardType } from "../utils/types";
import Panel from "./Panel";
import AddIcon from "@mui/icons-material/Add";
import { nanoid } from "nanoid";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { TransitionGroup } from "react-transition-group";
import NaturalDragAnimation from "natural-drag-animation-rbdnd";

const emptyBoardData: BoardType = {
  todoTasks: {},
  panels: {},
  panelOrder: [],
};

const BoardView = () => {
  const [boardData, setBoardData] = useState<BoardType>(
    getLocalStorage("boardData", emptyBoardData)
  );

  const [newPanel, setNewPanel] = useState<string>("");

  useEffect(() => {
    setLocalStorage("boardData", boardData);
  }, [boardData]);

  const handleCreateNewPanel = () => {
    // Create new panel and update state
    const newPanelId = nanoid();
    setBoardData(prevState => ({
      ...prevState,
      panels: {
        ...prevState.panels,
        [newPanelId]: {
          id: newPanelId,
          title: "New panel",
          active: [],
          completed: [],
        },
      },
      panelOrder: [...prevState.panelOrder, newPanelId],
    }));

    setNewPanel(newPanelId);
  };

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, destination, source, type } = result;

    // If draggable is dropped on a invlaid location, return
    if (!destination) {
      return;
    }

    // If draggable is dropped in the same location, return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If draggable is from the board aka a panel, update the board state
    if (type === "board") {
      const newPanelOrder = [...boardData.panelOrder];
      newPanelOrder.splice(source.index, 1);
      newPanelOrder.splice(destination.index, 0, draggableId);

      setBoardData(prevState => {
        const newPanelOrder = [...prevState.panelOrder];
        newPanelOrder.splice(source.index, 1);
        newPanelOrder.splice(destination.index, 0, draggableId);

        return {
          ...prevState,
          panelOrder: newPanelOrder,
        };
      });
    }
  };

  return (
    <div
      className="
      flex p-4 h-full items-start gap-3
      bg-green-image bg-cover overflow-auto
    "
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="board" direction="horizontal">
          {(provided, snapshot) => {
            const dropZoneStyle = snapshot.isDraggingOver
              ? "bg-slate-200/30 shadow-md border-slate-200/20"
              : "";
            return (
              <div
                className={`
                  h-full rounded-xl ${dropZoneStyle}
                  transition-all ease-in-out duration-500
                `}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <TransitionGroup className="flex gap-4">
                  {boardData.panelOrder.map((panelId, index) => (
                    <Collapse
                      key={panelId}
                      orientation="horizontal"
                      timeout={{ enter: 250, exit: 250 }}
                    >
                      <Draggable draggableId={panelId} index={index}>
                        {(provided, snapshot) => (
                          <NaturalDragAnimation
                            style={provided.draggableProps.style}
                            snapshot={snapshot}
                            rotationMultiplier={0.5}
                            rotationFade={0.5}
                          >
                            {(style: React.CSSProperties) => (
                              <Panel
                                style={style}
                                provided={provided}
                                snapshot={snapshot}
                                panelData={boardData.panels[panelId]}
                                boardData={boardData}
                                setBoardData={setBoardData}
                                newPanel={newPanel}
                                setNewPanel={setNewPanel}
                              />
                            )}
                          </NaturalDragAnimation>
                        )}
                      </Draggable>
                    </Collapse>
                  ))}
                  {provided.placeholder}
                </TransitionGroup>
              </div>
            );
          }}
        </Droppable>
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
