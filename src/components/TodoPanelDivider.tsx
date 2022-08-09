import { Typography } from "@mui/material";
import { AntSwitch } from "./AntSwitch";

interface TodoPanelDividerProps {
  isReveal: boolean;
  handleReveal: React.ChangeEventHandler<HTMLInputElement>;
}

export const TodoPanelDivider: React.FC<TodoPanelDividerProps> = ({
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
      <Typography variant="body1">Completed</Typography>
      <AntSwitch onChange={handleReveal} checked={isReveal} />
    </div>
  );
};
