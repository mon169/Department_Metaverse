import React, { useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function VoiceChat({ nickname, targetNickname }) {
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const peerConnection = useRef(null);
  const [isCallActive, setIsCallActive] = useState(false); // 음성 채팅 상태 관리

  const startCall = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { candidate: event.candidate, targetNickname });
      }
    };

    pc.ontrack = (event) => {
      if (remoteStream.current) {
        remoteStream.current.srcObject = event.streams[0];
      }
    };

    localStream.current.getTracks().forEach((track) => pc.addTrack(track, localStream.current));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("voiceOffer", { offer, from: nickname, targetNickname });

    peerConnection.current = pc;
    setIsCallActive(true); // 음성 채팅 활성화 상태로 변경
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    setIsCallActive(false); // 음성 채팅 비활성화 상태로 변경
  };

  const handleAnswer = async (data) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  const handleCandidate = (data) => {
    peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
  };

  socket.on("voiceAnswer", handleAnswer);
  socket.on("iceCandidate", handleCandidate);

  return (
    <div>
      <audio ref={remoteStream} autoPlay />
      <button
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={isCallActive ? endCall : startCall} // 상태에 따라 호출
      >
        {isCallActive ? "음성 채팅 종료" : "음성 채팅 시작"} {/* 버튼 텍스트 변경 */}
      </button>
    </div>
  );
}

export default VoiceChat;