import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { Redirect, useHistory } from "react-router";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Alert, TextField } from "@mui/material";
import jwtDecode from "jwt-decode";

export default function Dashboard({ token }) {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState(null);
  const [name, setName] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASEURL}/room/add`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setStatus(response.data.message);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const handleRemove = (id) => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASEURL}/room/remove`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setStatus(response.data.message);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const handleEnterRoom = (id) => {
    history.push(`/room/${id}`);
  };

  useEffect(() => {
    if (token) {
      setLoggedInUser(jwtDecode(token));
    }

    axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/room/`).then((response) => {
      setRooms(response.data.rooms);

      setLoading(false);
    });
  }, []);

  return (
    <div className="room-list">
      <Card
        sx={{ width: 345 }}
        style={{ margin: ".4rem", backgroundColor: "#c2d4f2" }}
      >
        <CardMedia
          component="img"
          height="140"
          image={`https://picsum.photos/300/200`}
          alt="image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Join Room
          </Typography>
          <TextField
            size="small"
            required
            fullWidth
            name="id"
            label="Room ID"
            type="text"
            id="id"
            onChange={(e) => setRoomId(e.target.value)}
          />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleEnterRoom(roomId)}
          >
            Join
          </Button>
        </CardActions>
      </Card>
      <Card
        sx={{ width: 345 }}
        style={{ margin: ".4rem", backgroundColor: "#c2d4f2" }}
      >
        <CardMedia
          component="img"
          height="140"
          image={`https://picsum.photos/300/200`}
          alt="image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Create or Delete Room
          </Typography>
          {status && <Alert severity="info">{status}</Alert>}
          <TextField
            size="small"
            required
            fullWidth
            name="name"
            label="Room Name or ID"
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
          />
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </CardActions>
      </Card>
      {rooms.map((room) => {
        return (
          <Card key={room._id} sx={{ width: 345 }} style={{ margin: ".4rem" }}>
            <CardMedia
              component="img"
              height="140"
              image={`https://picsum.photos/300/200`}
              alt="image"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Name: {room.name}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                ID: {room._id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`Created by: ${room.createdBy.name}`}
              </Typography>
            </CardContent>
            <CardActions>
              <NavLink to={`/room/${room._id}`}>
                <Button size="small" variant="outlined">
                  Join
                </Button>
              </NavLink>
              {loggedInUser.id === room.createdBy._id ? (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => handleRemove(room._id)}
                >
                  Delete
                </Button>
              ) : null}
            </CardActions>
          </Card>
        );
      })}
    </div>
  );
}
