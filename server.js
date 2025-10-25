const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// 테스트 용으로 로컬 처리로 창 두 개 띄워서 확인
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // 사용자 접속 처리
  socket.on("join", ({ nickname, scene }) => {
    if (users.find((u) => u.nickname.trim().toLowerCase() === nickname.trim().toLowerCase())) {
      socket.emit("nicknameError", "이미 사용 중인 닉네임입니다.");
      return;
    }

    const user = {
      id: socket.id,
      nickname: nickname.trim(),
      scene: scene || "1F",
      x: Math.random() * 0.8,
      y: Math.random() * 0.8,
    };
    users.push(user);

    io.emit("updateUsers", users);
    io.emit("userJoined", { text: `${nickname}님이 접속하셨습니다.`, scene: "all", type: "system" });
  });

  // 캐릭터 이동 처리
  socket.on("move", ({ direction }) => {
    const user = users.find((u) => u.id === socket.id);
    if (user) {
      const speed = 0.05;
      if (direction === "left") user.x = Math.max(user.x - speed, 0);
      if (direction === "right") user.x = Math.min(user.x + speed, 1);
      if (direction === "up") user.y = Math.max(user.y - speed, 0);
      if (direction === "down") user.y = Math.min(user.y + speed, 1);
    }
    io.emit("updateUsers", users);
  });

  // 채팅 메시지 전송
  socket.on("sendMessage", ({ nickname, message, scene }) => {
    const chatMessage = {
      nickname,
      text: message,
      scene,
      type: "user",
    };
    io.emit("receiveMessage", chatMessage);
    io.emit("chatBubble", { id: socket.id, nickname, message, scene });
  });

  // 씬 업데이트
  socket.on("updateScene", ({ scene }) => {
    const user = users.find((u) => u.id === socket.id);
    if (user) {
      user.scene = scene;
    }
    io.emit("updateUsers", users);
  });

  // WebRTC 신호 처리
  socket.on("voiceOffer", (data) => {
    const targetUser = users.find((u) => u.nickname === data.targetNickname);
    if (targetUser) {
      io.to(targetUser.id).emit("voiceOffer", {
        offer: data.offer,
        from: data.from,
      });
    }
  });

  socket.on("voiceAnswer", (data) => {
    const targetUser = users.find((u) => u.nickname === data.targetNickname);
    if (targetUser) {
      io.to(targetUser.id).emit("voiceAnswer", {
        answer: data.answer,
        from: data.from,
      });
    }
  });

  socket.on("iceCandidate", (data) => {
    const targetUser = users.find((u) => u.nickname === data.targetNickname);
    if (targetUser) {
      io.to(targetUser.id).emit("iceCandidate", {
        candidate: data.candidate,
        from: data.from,
      });
    }
  });

  // 사용자 접속 종료 처리
  socket.on("disconnect", () => {
    const user = users.find((u) => u.id === socket.id);
    if (user) {
      users = users.filter((u) => u.id !== socket.id);
      io.emit("updateUsers", users);
      io.emit("userLeft", { text: `${user.nickname}님이 떠나셨습니다.`, scene: "all", type: "system" });
    }
  });
});

server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});