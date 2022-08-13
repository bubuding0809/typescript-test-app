import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface TodoTaskMenuProps {
  id: string;
  handleDelete: any;
}

export const TodoTaskMenu: React.FC<TodoTaskMenuProps> = ({
  id,
  handleDelete,
}: TodoTaskMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="options">
        <IconButton
          size="small"
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon
            sx={{
              fontSize: "20px",
            }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={e => handleDelete(e, id)}>Delete task</MenuItem>
        <MenuItem onClick={handleClose}>Remove from subtasks</MenuItem>
      </Menu>
    </div>
  );
};
