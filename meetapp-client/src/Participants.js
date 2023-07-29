import React, { useEffect, useState } from "react";

import Avatar from "@mui/material/Avatar";

export default function Participants({ socket }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("new-participant", ({ participantsList }) => {
        setParticipants(participantsList);
      });

      socket.on("participant-left", ({ participantsList }) => {
        setParticipants(participantsList);
      });
    }
  }, [participants]);

  return (
    <div>
      <h2>Participants</h2>
      <div className="participants-list">
        {participants.map((participant) => (
          <div>
            <Avatar>{participant.name[0]}</Avatar>
            <p>{participant.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
