import React, { useEffect, useState } from "react";

export default function Rating({ socket, roomId }) {
  const [avgRating, setAvgRating] = useState(1);

  const handleRating = (event) => {
    const rating = event.target.value;
    if (socket) {
      socket.emit("rate-room", { roomId, rating });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("new-ratings", ({ avgRating }) => {
        setAvgRating(avgRating);
      });
    }
  }, [avgRating]);

  const ratingEmoji = {
    0: "👎",
    1: "🤔",
    2: "😀",
  };

  return (
    <div>
      <h2>Sentiments</h2>
      <p>Current Sentiment</p>
      <p className="current-sentiment">{ratingEmoji[Math.floor(avgRating)]}</p>
      <p className="rate-text">Rate the Room</p>
      <form>
        <input
          type="radio"
          name="rating"
          value="0"
          id="bad"
          onChange={handleRating}
        ></input>
        <label for="bad">👎</label>
        <input
          type="radio"
          name="rating"
          value="1"
          id="average"
          onChange={handleRating}
        ></input>
        <label for="average">🤔</label>
        <input
          type="radio"
          name="rating"
          value="2"
          id="good"
          onChange={handleRating}
        ></input>
        <label for="good">😃</label>
      </form>
    </div>
  );
}
