import * as React from "react";
import styled from "@emotion/styled";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";

const StyledMoreIconButton = styled(IconButton)`
  margin: 0px 0px auto 0px;
  padding: 4px;
`;

interface Props {
  handleSelection: (value: any) => void;
  deleteDisabled?: boolean;
  upDisabled?: boolean;
  downDisabled?: boolean;
}

const MoreMenu: React.FC<Props> = ({
  handleSelection,
  deleteDisabled,
  upDisabled,
  downDisabled,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (value: string) => {
    handleSelection(value);
    handleClose();
  };

  return (
    <>
      <StyledMoreIconButton
        color="inherit"
        aria-label="add"
        size="large"
        onClick={handleClick}
      >
        <MoreVertIcon fontSize="inherit" />
      </StyledMoreIconButton>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "add-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={Fade}
        sx={{ transform: "translateY(10px)" }}
      >
        <MenuList sx={{ padding: "0px" }}>
          <MenuItem
            disabled={deleteDisabled}
            onClick={() => handleMenuClick("delete")}
          >
            <ListItemIcon>
              <DeleteOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick("edit")}>
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem disabled={upDisabled} onClick={() => handleMenuClick("up")}>
            <ListItemIcon>
              <ArrowUpwardOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Shift Up</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={downDisabled}
            onClick={() => handleMenuClick("down")}
          >
            <ListItemIcon>
              <ArrowDownwardOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Shift Down</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default MoreMenu;
