import { TaskType, BoardType, PanelType } from "../utils/types";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage";
import React, { ChangeEventHandler, useEffect, useState, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import {
  DragDropContext,
  DropResult,
  DragStart,
  DraggableProvidedDragHandleProps,
  DraggableProvided,
} from "react-beautiful-dnd";
import { TodoPanelDivider } from "./TodoPanelDivider";
import { TodoList } from "./TodoList";
import { Save, MoreHoriz } from "@mui/icons-material";
import { PanelMenu } from "./PanelMenu";
import {
  Typography,
  Paper,
  styled,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";

interface TodoListProps {
  provided: DraggableProvided;
  panelData: PanelType;
  boardData: BoardType;
  setBoardData: React.Dispatch<React.SetStateAction<BoardType>>;
  activeList: string[];
  completedList: string[];
  newPanel: string;
  setNewPanel: React.Dispatch<React.SetStateAction<string>>;
}

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#35605A",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#35605A",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#35605A",
    },
    "&:hover fieldset": {
      borderColor: "#35605A",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#35605A",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "18px",
    fontWeight: "600",
  },
});

export const TodoMain: React.FC<TodoListProps> = ({
  provided,
  panelData,
  boardData,
  setBoardData,
  activeList,
  completedList,
  newPanel,
  setNewPanel,
}: TodoListProps) => {
  // Set up autoAnimation of ul element
  const parent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const [isEditPanelTitle, setIsEditPanelTitle] = useState(
    panelData.id === newPanel
  );

  const [panelTitle, setPanelTitle] = useState<string>(panelData.title);

  const [isReveal, setIsReveal] = useState<boolean>(
    getLocalStorage("isReveal", false)
  );

  const handleSavePanelTitle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!panelTitle.trim()) {
      alert("Enter a title");
      return;
    }

    setBoardData(prevState => ({
      ...prevState,
      panels: {
        ...prevState.panels,
        [panelData.id]: {
          ...panelData,
          title: panelTitle,
        },
      },
    }));

    // set panel edit state to false
    setIsEditPanelTitle(false);

    // clear the new panel state
    setNewPanel("");
  };

  const handleReveal: React.ChangeEventHandler<HTMLInputElement> = () => {
    setIsReveal(prevState => {
      setLocalStorage("isReveal", !prevState);
      return !prevState;
    });
  };

  const handleDeletePanel = (panelId: string) => {
    setBoardData(prevState => {
      // remove panel from board
      const newPanels = { ...prevState.panels };
      delete newPanels[panelId];

      return {
        ...prevState,
        panels: newPanels,
        panelOrder: prevState.panelOrder.filter(id => id !== panelId),
      };
    });
  };

  return (
    <Paper
      sx={{
        backgroundColor: "rgba(220, 220, 220, 0.6)",
        border: "1px solid rgba(175, 175, 175, 0.36)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
      className="flex flex-col"
      elevation={3}
    >
      {/* Panel header */}
      <div
        {...provided.dragHandleProps}
        className="flex items-center justify-between pl-3 pr-2 pt-2 rounded-t"
      >
        {!isEditPanelTitle ? (
          <Tooltip title="Double-click to edit" placement="right-start">
            <Typography
              className="cursor-custom-cursor"
              variant="body2"
              fontWeight={600}
              fontSize={18}
              onDoubleClick={() => setIsEditPanelTitle(true)}
            >
              {panelData.title}
            </Typography>
          </Tooltip>
        ) : (
          <form className="w-full" onSubmit={handleSavePanelTitle}>
            <StyledTextField
              autoFocus
              variant="standard"
              type="text"
              fullWidth
              value={panelTitle}
              onChange={e => setPanelTitle(e.target.value)}
              onFocus={e => e.target.select()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleSavePanelTitle}>
                      <Save
                        sx={{
                          fontSize: "20px",
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        )}
        <PanelMenu
          panelData={panelData}
          boardData={boardData}
          handleDelete={handleDeletePanel}
        />
      </div>

      {/* Panel body */}
      <div ref={parent} className="flex flex-col">
        {/* Render un-completed tasks */}

        <TodoList
          boardData={boardData}
          panelData={panelData}
          todoList={activeList}
          droppableId={"active"}
        />

        {/* Active - completed divider */}
        <TodoPanelDivider
          activeCount={activeList.length}
          completedCount={completedList.length}
          isReveal={isReveal}
          handleReveal={handleReveal}
        />

        {/* Render completed tasks */}
        {isReveal && (
          <TodoList
            boardData={boardData}
            panelData={panelData}
            todoList={completedList}
            droppableId={"completed"}
          />
        )}
      </div>
    </Paper>
  );
};
