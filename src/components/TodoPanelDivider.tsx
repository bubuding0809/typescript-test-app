import { Typography } from "@mui/material";
import { AntSwitch } from "./AntSwitch";

interface TodoPanelDividerProps {
  activeCount: number;
  completedCount: number;
  isReveal: boolean;
  handleReveal: React.ChangeEventHandler<HTMLInputElement>;
}

export const TodoPanelDivider: React.FC<TodoPanelDividerProps> = ({
  activeCount,
  completedCount,
  isReveal,
  handleReveal,
}: TodoPanelDividerProps) => {
  return (
    <div
      className={`
            bg-[#55605F] text-white h-10 p-4 flex justify-between items-center 
            ${!isReveal ? "rounded-b" : ""}
          `}
    >
      <Typography variant="body1">{`${completedCount} / ${
        activeCount + completedCount
      } completed`}</Typography>
      <AntSwitch onChange={handleReveal} checked={isReveal} />
    </div>
  );
};
