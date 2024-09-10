import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import userAuthStore from "../../store/userAuthStore/userAuthStore";
import LogoutIcon from "@mui/icons-material/Logout";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function ButtonAppBar() {
  const user = userAuthStore((state) => state.user);
  const logout = userAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  let menuItems = [];
  if (user === "Employer") {
    menuItems = [
      { text: "Interviews Scheduled", route: "/company/all-interviews" },
    ];
  } else if (user === "JobSeeker") {
    menuItems = [
      { text: "Interviews Scheduled", route: "/candidate/all-interviews" },
    ];
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((menuItem, index) => (
          <ListItem button key={index} component={Link} to={menuItem.route}>
            <ListItemText primary={menuItem.text} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <LogoutIcon />
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Assessment Module
          </Typography>
          <div>
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
              {list()}
            </Drawer>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
