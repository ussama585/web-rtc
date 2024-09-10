import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userAuthStore from "../../store/userAuthStore/userAuthStore";
import LogoutIcon from "@mui/icons-material/Logout";
const drawerWidth = 240;

export default function SideBar() {
  const user = userAuthStore((state) => state.user);
  const logout = userAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // Define menu items based on user role
  let menuItems = [];
  if (user === "Employer") {
    menuItems = [
      { text: "Job Posts", route: "/job-posts" },
      { text: "Assessments", route: "/assessments" },
      { text: "Create Assessment", route: "/create-assessment" },
    ];
  } else if (user === "JobSeeker") {
    menuItems = [
      { text: "Search Jobs", route: "/search-jobs" },
      { text: "Saved Jobs", route: "/saved-jobs" },
      { text: "Applied Jobs", route: "/applied-jobs" },
    ];
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {user} Logged In
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((obj, index) => (
            <ListItem key={index} disablePadding>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <Link
                to={obj.route}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  margin: 8,
                }}
              >
                <ListItemText primary={obj.text} />
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
