// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [notifications, setNotifications] = useState([]);
  const posts = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    text: `Post #${i + 1}`,
  }));

  useEffect(() => {
    // Request permission for web notifications
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Listen for notifications from the server
    socket.on("notification", (message) => {
      const notificationData = JSON.parse(message);

      // Show a native web notification
      if (Notification.permission === "granted") {
        new Notification("New Like", {
          body: notificationData.text,
          icon: "/like-icon.png", // Add an icon path if available
        });
      }

      // Update the notification log
      setNotifications((prev) => [...prev, notificationData.text]);
    });

    return () => socket.off("notification");
  }, []);

  // Function to like a post
  const handleLike = async (postId) => {
    const userId = "user123"; // Example user ID
    await axios.post("http://localhost:4000/like", { postId, userId });
  };

  return (
    <div>
      <h1>Post Likes Notification System</h1>

      <div>
        <h2>Posts:</h2>
        {posts.map((post) => (
          <div key={post.id}>
            <p>{post.text}</p>
            <button onClick={() => handleLike(post.id)}>Like</button>
          </div>
        ))}
      </div>

      <div>
        <h2>Notification Log:</h2>
        <ul>
          {notifications.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
