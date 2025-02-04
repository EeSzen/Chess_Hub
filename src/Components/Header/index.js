import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import AppBar from "@mui/material/AppBar";

import { isUserLoggedIn, getUserName, isAdmin } from "../../utility/cookie_api";

import { useCookies } from "react-cookie";
import { toast } from "sonner";

const drawerWidth = 160;

function Header(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [cookies, removeCookie] = useCookies(["currentUser"]);
  const currentUserName = getUserName(cookies);

  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isHistoryPage = location.pathname === "/history";
  const isManagerPage = location.pathname === "/manager";
  const isLeaderboardPage = location.pathname === "/leaderboard";

  const handleLogOut = () => {
    // clear the cookies
    removeCookie("currentUser");
    // send toast message
    toast.message("You have logged out successfully!");
    // redirect the user back to login page
    navigate("/login");
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton disabled={isHomePage} onClick={() => navigate("/")}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            disabled={isHistoryPage}
            onClick={() => navigate("/history")}
          >
            <ListItemText primary="History" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            disabled={isLeaderboardPage}
            onClick={() => navigate("/leaderboard")}
          >
            <ListItemText primary="Leaderboard" />
          </ListItemButton>
        </ListItem>
        {isAdmin(cookies) ? (
          <ListItem disablePadding>
            <ListItemButton
              disabled={isManagerPage}
              onClick={() => navigate("/manage")}
            >
              <ListItemText primary="Manage" />
            </ListItemButton>
          </ListItem>
        ) : null}
      </List>
      <Divider />
      <List>
        {!isUserLoggedIn(cookies) ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                disabled={isSignupPage}
                onClick={() => navigate("/signup")}
              >
                <ListItemText primary="Signup" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                disabled={isLoginPage}
                onClick={() => navigate("/login")}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <Typography sx={{ display: "flex", alignItems: "center", mx: 2 }}>
              Current User: {currentUserName}
            </Typography>
            <ListItem disablePadding>
              <ListItemButton
                // disabled={isLoginPage}
                onClick={handleLogOut}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      > */}
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        {/* <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography> */}
      </Toolbar>
      {/* </AppBar> */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {/* <h1>hello</h1> */}
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(80% - ${drawerWidth}px)` },
        }}
      ></Box>
    </Box>
  );
}

export default Header;
