import { useState } from "react";
import Chat from "./Chat";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const joinChat = () => {
    if (username.trim()) {
      setJoined(true);
    }
  };

  if (!joined) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Chat App</h1>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <button onClick={joinChat}>
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return <Chat username={username} />;
}

export default App;