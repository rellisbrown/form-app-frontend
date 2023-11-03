import * as React from "react";
import styled from "@emotion/styled";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import HeightIcon from "@mui/icons-material/Height";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
/* import Fab from "@mui/material/Fab"; */
/* import AddIcon from "@mui/icons-material/Add"; */
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

interface ArrowIconProps {
  orientation?: string;
}

const StyledDoubleArrowIcon = styled(HeightIcon)<ArrowIconProps>`
  transform: ${(props) =>
    `rotate(${props.orientation === "vertical" ? 0 : 90}deg)`};
`;

/* const StyledAddFab = styled(Fab)`
  margin: 0px 10px auto auto;
`; */

const StyledAddIconButton = styled(IconButton)`
  margin: 0px 0px auto auto;
  padding: 4px;
`;

interface Props {
  handleSelection: (value: any) => void;
}

const AddMenu: React.FC<Props> = ({ handleSelection }) => {
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
      <StyledAddIconButton
        color="primary"
        aria-label="add"
        size="large"
        onClick={handleClick}
      >
        <AddCircleOutlinedIcon fontSize="inherit" />
      </StyledAddIconButton>
      <Menu
        id="add-menu"
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
          <MenuItem key="Control" onClick={() => handleMenuClick("Control")}>
            <ListItemIcon>
              <DescriptionOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Control</ListItemText>
          </MenuItem>
          <Divider key="divider" />
          <MenuItem
            key="VerticalLayout"
            onClick={() => handleMenuClick("VerticalLayout")}
          >
            <ListItemIcon>
              <StyledDoubleArrowIcon fontSize="small" orientation="vertical" />
            </ListItemIcon>
            <ListItemText>Vertical Layout</ListItemText>
          </MenuItem>
          <MenuItem
            key="HorizontalLayout"
            onClick={() => handleMenuClick("HorizontalLayout")}
          >
            <ListItemIcon>
              <StyledDoubleArrowIcon
                fontSize="small"
                orientation="horizontal"
              />
            </ListItemIcon>
            <ListItemText>Horizontal Layout</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default AddMenu;
