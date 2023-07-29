import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "./style.css";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

export default function Navbar({ token, setToken }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.clear("token");
    setToken(null);
  };

  let user = null;

  if (token) {
    user = jwtDecode(token);
    if (!loggedIn && user) {
      setLoggedIn(true);
    }
  }

  return (
    // <div id="navbar">
    //   <h1>Digital Tutor</h1>
    //   <div>
    //     {loggedIn && (
    //       <Link to="/login" onClick={handleLogout}>
    //         Logout
    //       </Link>
    //     )}
    //     {!loggedIn && (
    //       <div>
    //         <Link to="/login">Login</Link>
    //         <Link to="/signup">Signup</Link>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <Box sx={{ flexGrow: 1 }} className="navbar">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DIGITAL TUTOR
          </Typography>
          {loggedIn && (
            <div>
              <NavLink to="/">
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginRight: "20px" }}
                >
                  Home
                </Button>
              </NavLink>
              <NavLink to="/dashboard">
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginRight: "20px" }}
                >
                  Dashboard
                </Button>
              </NavLink>
            </div>
          )}
          {!loggedIn && (
            <div style={{ margin: "0 20px" }}>
              <NavLink to={`/login`}>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginRight: "10px" }}
                >
                  Login
                </Button>
              </NavLink>
              <NavLink to={`/signup`}>
                <Button color="success" variant="contained">
                  Signup
                </Button>
              </NavLink>
            </div>
          )}
          {loggedIn && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                style={{ marginRight: "20px" }}
                sx={{ bgcolor: "purple" }}
              >
                {user.name[0]}
              </Avatar>
              <NavLink to={`/login`} onClick={handleLogout}>
                <Button color="error" variant="contained">
                  Logout
                </Button>
              </NavLink>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
