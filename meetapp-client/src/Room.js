import React, { useState } from "react";
import Peer from "peerjs";
import jwtDecode from "jwt-decode";
import "./style.css";
import { Link } from "react-router-dom";
import Participants from "./Participants";
import Rating from "./Rating";
import { Button, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Room(props) {
  const { match, socket } = props;
  const roomId = match.params.id;
  const { token } = props;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  const sendMessage = (e) => {
    e.preventDefault();
    setMessage("");

    if (socket) {
      socket.emit("chat-message", {
        roomId,
        message,
      });
    }
  };

  let peer = null;

  React.useEffect(() => {
    if (token) {
      setUser(jwtDecode(token));
    }

    if (socket) {
      socket.emit("join-room", {
        roomId,
      });
    }

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 910;
    canvas.height = 600;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.moveTo(100, 100);
    // ctx.lineTo(200, 200);
    ctx.stroke();

    let x, y;
    let mouseDown = false;

    canvas.onmousedown = (e) => {
      ctx.moveTo(x, y);
      socket.emit("down", {
        roomId,
        data: { x, y },
      });
      mouseDown = true;
    };

    canvas.onmouseup = (e) => {
      mouseDown = false;
    };

    canvas.onmousemove = (e) => {
      x = e.offsetX;
      y = e.offsetY;

      if (mouseDown) {
        socket.emit("draw", {
          roomId,
          data: { x, y },
        });
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    if (socket) {
      socket.on("ondraw", ({ x, y }) => {
        ctx.lineTo(x, y);
        ctx.stroke();
      });

      socket.on("ondown", ({ x, y }) => {
        ctx.moveTo(x, y);
      });
    }

    return () => {
      if (socket) {
        socket.emit("leave-room", {
          roomId,
        });
      }
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (socket) {
      socket.on("new-message", ({ message, hateSpeech, userId, name }) => {
        const newMessages = [
          ...messages,
          { message, hateSpeech, userId, name },
        ];
        setMessages(newMessages);
      });
    }
    // eslint-disable-next-line
  }, [messages]);

  // if (!peer) {
  //   const token = localStorage.getItem('token');
  //   const user = jwtDecode(token);
  //   peer = new Peer(user.id, {
  //     host: '/',
  //     port: 3001,
  //   });
  // }

  // console.log(socket);

  return (
    <div className="room">
      <div className="whiteboard-container">
        <div className="whiteboard-main">
          <canvas id="canvas"></canvas>
        </div>
        <div className="whiteboard-settings">Whiteboard</div>
      </div>

      <div className="participants-rating">
        <div className="participants-container">
          <Participants socket={socket} />
        </div>

        <div className="ratings-container">
          <Rating socket={socket} roomId={roomId} />
        </div>
      </div>

      <div className="messages-container">
        <div className="messages">
          <h2 id="messages-heading">Messages</h2>
          <ul>
            {messages.map((message, index) => {
              if (message.hateSpeech) {
                if (message.userId == user.id) {
                  return (
                    <li key={index} className="sent hatespeech">
                      <p className="message-user">{message.name}</p>
                      <p className="hatespeech-text">
                        {
                          "🚫 This message has been deleted because it comes under hate speech."
                        }
                      </p>
                    </li>
                  );
                }
                return (
                  <li key={index} className="received hatespeech">
                    <p className="message-user">{message.name}</p>
                    <p className="hatespeech-text">
                      {
                        "🚫 This message has been deleted because it comes under hate speech."
                      }
                    </p>
                  </li>
                );
              }

              if (message.userId == user.id) {
                return (
                  <li key={index} className="sent">
                    <p className="message-user">{message.name}</p>
                    <p>{message.message}</p>
                  </li>
                );
              }
              return (
                <li key={index} className="received">
                  <p className="message-user">{message.name}</p>
                  <p>{message.message}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <form>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            label="Type your message"
            id="fullWidth"
            size="small"
          />
          <input
            type="submit"
            className="send-message"
            value="Send"
            onClick={sendMessage}
          />
        </form>
      </div>
    </div>
  );
}
