import { useState, useEffect } from "react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import Avatar from "react-avatar";

const socket = io("http://localhost:3001");

function Chat({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Tell server user joined
    socket.emit("join_chat", username);

    // Receive messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Receive online users
    socket.on("users_list", (usersList) => {
      setUsers(usersList);
    });

    return () => {
      socket.off("receive_message");
      socket.off("users_list");
    };
  }, [username]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msg = {
      username,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msg);
    setMessage("");
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const filteredUsers = users.filter((user) =>
    user.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="sidebar">

        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search User"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <h3>🟢 Online Users</h3>

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={
              user.username === username
                ? "user-card active"
                : "user-card"
            }
          >
            <Avatar
              name={user.username}
              size="40"
              round={true}
            />

            <span>{user.username}</span>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="chat-section">

        <div className="chat-header">
          <Avatar
            name={username}
            size="40"
            round={true}
          />
          <span>{username}</span>
        </div>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.username === username
                  ? "message own"
                  : "message"
              }
            >
              <Avatar
                name={msg.username}
                size="35"
                round={true}
              />

              <div>
                <strong>{msg.username}</strong>
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">

          <button
            className="emoji-btn"
            onClick={() =>
              setShowEmoji(!showEmoji)
            }
          >
            😊
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>
            ➤
          </button>

        </div>

        {showEmoji && (
          <div className="emoji-picker">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default Chat;