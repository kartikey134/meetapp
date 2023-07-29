import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Room from "./Room";
import "./style.css";

function App() {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setupSocket = () => {
    const token = localStorage.getItem("token");

    if (token && !socketRef.current) {
      socketRef.current = io(`${process.env.REACT_APP_BACKEND_BASEURL}`, {
        query: {
          token: localStorage.getItem("token"),
        },
      });

      socketRef.current.on("disconnect", () => {
        console.log("Client disconnected");
      });

      socketRef.current.on("connect", () => {
        setSocket(socketRef.current);
        console.log("Client connected");
      });
    }
  };

  useEffect(() => {
    const token = setToken(localStorage.getItem("token"));
    if (token) {
      setIsAuthenticated(true);
    }
    setupSocket();
    // eslint-disable-next-line
  }, []);

  if (!socketRef.current) {
    setupSocket();
  }

  return (
    <Router>
      <div className="App">
        <Navbar token={token} setToken={setToken} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route
            path="/login"
            component={(props) => {
              return <Login {...props} token={token} setToken={setToken} />;
            }}
          />
          <Route
            path="/signup"
            component={(props) => {
              return <Signup {...props} token={token} />;
            }}
          />
          <Route
            path="/dashboard"
            component={(props) => {
              return <Dashboard {...props} token={token} setToken={setToken} />;
            }}
          />
          <Route
            path="/room/:id"
            component={(props) => {
              return (
                <Room {...props} token={token} socket={socketRef.current} />
              );
            }}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
