import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function Chatbox({ nickname, currentScene }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [targetScene, setTargetScene] = useState(currentScene);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      if (
        message.scene === "all" || 
        message.scene === currentScene
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('userJoined', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('userLeft', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [currentScene]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { nickname, message, scene: targetScene });
      setMessage('');
    }
  };

  const getMessageStyle = (msg) => {
    if (msg.type === "system") {
      return { color: "gray", fontStyle: "italic" };
    }
    if (msg.scene === "과방") {
      return { color: "yellow" };
    }
    if (msg.scene === "스터디룸") {
      return { color: "#ADD8E6" };
    }
    return { color: "white" };
  };

  const formatMessage = (msg) => {
    const sceneTag = msg.scene === "all" ? "[전체]" : `[${msg.scene}]`;
    return `${sceneTag} ${msg.nickname ? msg.nickname + ' : ' : ''}${msg.text}`;
  };

  return (
    <div>
      <div style={{ height: "200px", overflowY: "scroll", border: "1px solid gray" }}>
        {messages.map((msg, index) => (
          <p key={index} style={getMessageStyle(msg)}>
            {formatMessage(msg)}
          </p>
        ))}
      </div>
      <select
        value={targetScene}
        onChange={(e) => setTargetScene(e.target.value)}
        style={{ marginBottom: "10px" }}
      >
        <option value="all">전체</option>
        <option value={currentScene}>현재 장소 ({currentScene})</option>
      </select>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

export default Chatbox;