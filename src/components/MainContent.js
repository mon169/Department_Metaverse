import React, { useEffect, useRef, useState } from "react";
import Chatbox from "./Chatbox";
import VoiceChat from "./Voicechat";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function MainContent() {
  const canvasRef = useRef(null);
  const startScreenRef = useRef(null);
  const chatboxContainerRef = useRef(null);
  const popupRef = useRef(null);
  const popupTextRef = useRef(null);
  const popupButtonRef = useRef(null);
  const [nickname, setNickname] = useState("");
  const [currentScene, setCurrentScene] = useState("1F");
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({ text: "", action: "" });
  const [avatars, setAvatars] = useState([]);
  const [chatBubbles, setChatBubbles] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [floorPopupVisible, setFloorPopupVisible] = useState(false);

  useEffect(() => {
    socket.on("nicknameError", (message) => {
      alert(message);
      setNickname("");
    });

    return () => {
      socket.off("nicknameError");
    };
  }, []);

  useEffect(() => {
    if (isJoined) {
      socket.on("updateUsers", (users) => {
        setAvatars(users);
      });

      socket.on("userJoined", (message) => {
        alert(message.text);
      });

      socket.on("userLeft", (message) => {
        alert(message.text);
      });

      socket.on("chatBubble", (bubble) => {
        setChatBubbles((prev) => [
          ...prev.filter((b) => b.nickname !== bubble.nickname),
          bubble,
        ]);

        setTimeout(() => {
          setChatBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
        }, 5000);
      });
    }

    return () => {
      socket.off("updateUsers");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("chatBubble");
    };
  }, [isJoined]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;

    if (!canvas || !ctx) {
      console.log("Canvas or context not initialized");
      return;
    }

    const backgroundImages = {
      "1F": "/img/1F.png",
      "3F": "/img/3F.png",
      "4F": "/img/4F.png",
      "5F": "/img/5F.png",
      "과방": "/img/과방.png",
      "스터디룸": "/img/스터디룸.png",
    };

    const backgroundImage = new Image();
    backgroundImage.src = backgroundImages[currentScene] || backgroundImages["1F"];

    const avatarImage = new Image();
    avatarImage.src = "/img/남자캐릭터.png";

    const markerImages = {};
    const markers = [
      { imageSrc: "/img/조교님.png", xRatio: 0.16, yRatio: 0.35, widthRatio: 0.09, heightRatio: 0.18, text: "* 과 사 공 지*\n 특강\n 제목: 원자력 보안 특강\n 날짜: 12월 16일 월요일 19:30\n 설명: 국립대육성사업의 일환으로 원자력 보안 특강을 진행합니다. 연구원님 연사로 특강을 진행하니 많은 참여 바랍니다.\n 장소: 공과대학 5호관 507호\n 일반\n 제목: 학과 참여 장학금 신청 안내\n 날짜: 12월 27일 금요일 ~ 1월 3일 금요일\n 설명: 2024학년도 국립대학육성사업 JBNU 실무역량 교육프로그램의 일환으로 우수 참여 학생을 대상으로 장학금을 지급하고자 하니 많은 참여 바랍니다.\n 방법: 학과사무실 방법 또는 학과 홈페이지-온라인 신청 접수\n", scene: "1F", action: "close" },
      { imageSrc: "/img/문.png", xRatio: 0.8, yRatio: 0.67, widthRatio: 0.04, heightRatio: 0.09, text: "과방에 입장하시겠습니까?", scene: "1F", action: "enterRoom" },
      { imageSrc: "/img/엘리베이터.png", xRatio: 0.05, yRatio: 0.7, widthRatio: 0.5, heightRatio: 0.39, text: "다른층으로 이동하시겠습니까?", scene: "1F", action: "moveFloor" },
      { imageSrc: "/img/엘리베이터.png", xRatio: 0.05, yRatio: 0.7, widthRatio: 0.5, heightRatio: 0.39, text: "다른층으로 이동하시겠습니까?", scene: "3F", action: "moveFloor" },
      { imageSrc: "/img/엘리베이터.png", xRatio: 0.05, yRatio: 0.7, widthRatio: 0.5, heightRatio: 0.39, text: "다른층으로 이동하시겠습니까?", scene: "4F", action: "moveFloor" },
      { imageSrc: "/img/엘리베이터.png", xRatio: 0.08, yRatio: 0.65, widthRatio: 0.45, heightRatio: 0.35, text: "다른층으로 이동하시겠습니까?", scene: "5F", action: "moveFloor" },
      { imageSrc: "/img/과방지기.png", xRatio: 0.37, yRatio: 0.73, widthRatio: 0.05, heightRatio: 0.15, text: "음성 스터디를 시작할까요?", scene: "과방", action: "startStudy" },
      { imageSrc: "/img/게시판.png", xRatio: 0.06, yRatio: 0.62, widthRatio: 0.17, heightRatio: 0.15, text: "* 과 방 공 지 *\n 스터디\n 스터디명: 운영체제 스터디\n 스터디 시작일: 12월 1일\n 스터디 종료일: 미정\n 설명: 운영체제 수업을 들은 재학생 중, 매주 수요일 공부한 내용에 대해 발표하고 의견을 나누기 위한 스터디\n 모집 인원: 최대 10명\n", scene: "과방", action: "close" },
      { imageSrc: "/img/운동화.png", xRatio: 0.28, yRatio: 0.6, widthRatio: 0.06, heightRatio: 0.11, text: "퇴장하시겠습니까?", scene: "과방", action: "exitRoom" },
      { imageSrc: "/img/신발2.png", xRatio: 0.28, yRatio: 0.6, widthRatio: 0.06, heightRatio: 0.11, text: "퇴장하시겠습니까?", scene: "스터디룸", action: "exitStudyRoom" },
      
      { imageSrc: "/img/교수님.png", xRatio: 0.579, yRatio: 0.3, widthRatio: 0.053, heightRatio: 0.18, text: "조재혁 교수님\n 연구분야 : 인공지능(optimization, semi-supervised, unsupervised learning, meta learning, deep learning 등), 지능형 IoT 및 센서 플랫폼, 빅데이터(환경보건 등)\n 전화번호 : 063-270-4771\n 이메일 : chojh@jbnu.ac.kr", scene: "3F", action: "close" },
      { imageSrc: "/img/교수님.png", xRatio: 0.579, yRatio: 0.5, widthRatio: 0.053, heightRatio: 0.18, text: "최선오 교수님\n 연구분야 : 지능형 보안, 인공지능기반 정보보호기술연구, 데이터보안, 네트워크보안\n 전화번호 : 063-270-4784\n 이메일 : suno7@jbnu.ac.kr", scene: "3F", action: "close" },
      { imageSrc: "/img/동방지기.png", xRatio: 0.4, yRatio: 0.2, widthRatio: 0.053, heightRatio: 0.18, text: "AMPM\n 행사\n 제목: 졸업생 멘토링\n 날짜: 12월 2일 월요일 17:00\n 설명: 소프트웨어공학과에서 주최하는 졸업생 멘토링 특강입니다.\n 장소: 공과대학 5호관 507호", scene: "3F", action: "close" },
      { imageSrc: "/img/교수님.png", xRatio: 0.579, yRatio: 0.4, widthRatio: 0.053, heightRatio: 0.18, text: "류덕산 교수님\n 연구분야 : 소프트웨어 공학(Software Analytics based on AI, Software Defect Prediction, Software Reliability Engineering, Autonomous Systems)\n 전화번호 : 063-270-4805\n 이메일 : duksan.ryu@jbnu.ac.kr", scene: "4F", action: "close" },
      {
        "imageSrc": "/img/학생회장.png",
        "xRatio": 0.42,
        "yRatio": 0.07,
        "widthRatio": 0.053,
        "heightRatio": 0.18,
        "text": "행사\n제목: SE-day\n날짜: 12월 7일 토요일 14:00\n설명: 소프트웨어공학과 학우분들이 함께 개발한 소프트웨어를 선보이는 자리로, 다양한 정보를 공유하고 지식을 나눌 수 있는 소통의장입니다.\n장소: 전북대학교 진수당 1층 77주년 기념홀\n\n대여사업\n종류: 전공 교재\n대여물품명: 네트워크개론 3판\n수량: 2",
        "scene": "5F",
        "action": "close"
      },
      { imageSrc: "/img/교수님.png", xRatio: 0.39, yRatio: 0.34, widthRatio: 0.053, heightRatio: 0.18, text: "김순태 교수님\n 연구분야 : 소프트웨어공학(Software Architecture,Software Comprehension, Mining Software Repository), 블록체인 플랫폼 연구(SmartContract Mining/Validation), 인공지능(Machine Learning/DeepLearning)\n 전화번호 : 063-270-4788\n 이메일 : stkim@jbnu.ac.kr", scene: "5F", action: "close" },
      { imageSrc: "/img/교수님.png", xRatio: 0.39, yRatio: 0.5, widthRatio: 0.053, heightRatio: 0.18, text: "유철중 교수님\n 연구분야 : 소프트웨어공학(Software Quality: Software Testing, Software Complexity & Mesurement, Software Develpment Methology), 빅데이터분석, 스마트팜\n 전화번호 : 063-270-3383\n 이메일 : cjyoo@jbnu.ac.kr", scene: "5F", action: "close" },
      { imageSrc: "/img/교수님.png", xRatio: 0.587, yRatio: 0.3, widthRatio: 0.053, heightRatio: 0.18, text: "이지현 교수님\n 전화번호 : 063-270-4860\n 이메일 : jihyun30@jbnu.ac.kr", scene: "5F", action: "close" },
      { imageSrc: "/img/교수님.png", xRatio: 0.587, yRatio: 0.48, widthRatio: 0.053, heightRatio: 0.18, text: "노혜민 교수님\n 연구분야: 소프트웨어 공학\n 전화번호 : 063-270-3613\n 이메일 : hmino@jbnu.ac.kr", scene: "5F", action: "close" },
    ];

    markers.forEach((marker) => {
      const img = new Image();
      img.src = marker.imageSrc;
      markerImages[marker.imageSrc] = img;
    });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;
      startScreenRef.current.style.width = `${canvas.width}px`;
      startScreenRef.current.style.height = `${canvas.height}px`;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const calculateDistance = (x1, y1, x2, y2) => {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    const checkProximityToMarkers = () => {
      let withinRange = false;

      avatars
        .filter((user) => user.nickname === nickname && user.scene === currentScene)
        .forEach((user) => {
          const userX = canvas.width * user.x;
          const userY = canvas.height * user.y;

          markers
            .filter((marker) => marker.scene === currentScene)
            .forEach((marker) => {
              const markerX = canvas.width * marker.xRatio;
              const markerY = canvas.height * marker.yRatio;
              const distance = calculateDistance(userX, userY, markerX, markerY);

              if (distance <= 100) {
                if (marker.action === "moveFloor") {
                  setFloorPopupVisible(true);
                } else {
                  setPopupContent({ text: marker.text, action: marker.action });
                  setPopupVisible(true);
                }
                withinRange = true;
              }
            });
        });

      if (!withinRange) {
        setPopupVisible(false);
        setFloorPopupVisible(false);
      }
    };

    const moveAvatar = (direction) => {
      socket.emit("move", { direction });
      checkProximityToMarkers();
    };

    const handleKeyDown = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        moveAvatar(e.key.replace("Arrow", "").toLowerCase());
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      markers
        .filter((marker) => marker.scene === currentScene)
        .forEach((marker) => {
          const markerImage = markerImages[marker.imageSrc];
          const x = canvas.width * marker.xRatio;
          const y = canvas.height * marker.yRatio;
          const width = canvas.width * marker.widthRatio;
          const height = canvas.height * marker.heightRatio;
          ctx.drawImage(markerImage, x, y, width, height);
          // 마커 위에 텍스트 추가
      ctx.fillStyle = "#2E2E2E"; // 텍스트 색상
      ctx.font = "14px Jua"; // 텍스트 폰트 및 크기
      ctx.textAlign = "center"; // 텍스트 중앙 정렬
        
  ctx.fillText(
     marker.imageSrc.includes("교수님") ?
       (marker.xRatio === 0.579 && marker.yRatio === 0.3 ? "조재혁 교수님" :
        marker.xRatio === 0.579 && marker.yRatio === 0.5 ? "최선오 교수님" :
        marker.xRatio === 0.6 && marker.yRatio === 0.4 ? "류덕산 교수님" :
        marker.xRatio === 0.39 && marker.yRatio === 0.34 ? "김순태 교수님" :
        marker.xRatio === 0.39 && marker.yRatio === 0.5 ? "유철중 교수님" :
        marker.xRatio === 0.587 && marker.yRatio === 0.3 ? "이지현 교수님" :
        marker.xRatio === 0.587 && marker.yRatio === 0.48 ? "노혜민 교수님" : "교수님") :
     marker.imageSrc.includes("조교님") ?
       (marker.xRatio === 0.16 && marker.yRatio === 0.35 ? "조교님" : "조교님") :
     marker.imageSrc.includes("학생회장") ?
       (marker.xRatio === 0.42 && marker.yRatio === 0.07 ? "학생회장" : "학생회장") :
     marker.imageSrc.includes("과방지기") ?
       (marker.xRatio === 0.4 && marker.yRatio === 0.2 ? "과방지기" : "과방지기") :
     marker.imageSrc.includes("동방지기") ?
       (marker.xRatio === 0.4 && marker.yRatio === 0.2 ? "동방지기" : "동방지기") :
     "",
     x + width / 2, // 텍스트 x 좌표 (마커 중앙)
     y - 10 // 텍스트 y 좌표 (마커 위)
   );
        });

        avatars
  .filter((user) => user.scene === currentScene)
  .forEach((user) => {
    const userX = canvas.width * user.x;
    const userY = canvas.height * user.y;

    // 아바타 크기를 반응형으로 설정
    const avatarWidth = canvas.width * 0.048; // 캔버스 너비의 5% 크기
    const avatarHeight = canvas.height * 0.165; // 캔버스 높이의 10% 크기

    ctx.drawImage(avatarImage, userX, userY, avatarWidth, avatarHeight);

    // 닉네임 표시
    ctx.fillStyle = "black";
    ctx.font = `${Math.max(12, Math.min(canvas.width, canvas.height) * 0.02)}px 'Jua'`; // 글씨 크기를 12px 이상으로 설정
    ctx.textAlign = "center"; // 중앙 정렬
    ctx.textBaseline = "top"; // 텍스트 기준선 위쪽으로 설정
    ctx.fillText(user.nickname, userX + avatarWidth / 2, userY - 20); // 아바타 위에 닉네임 표시

    
          
    // 말풍선 표시
    const bubble = chatBubbles.find((b) => b.nickname === user.nickname);
    if (bubble) {
      const bubbleWidth = ctx.measureText(bubble.message).width + 20;
      const bubbleHeight = 30;

      // 말풍선 위치를 닉네임 바로 위로 설정
      const bubbleX = userX + avatarWidth / 2;
      const bubbleY = userY - avatarHeight + 60;

      ctx.beginPath();
      ctx.moveTo(bubbleX - bubbleWidth / 2, bubbleY - bubbleHeight);
      ctx.lineTo(bubbleX + bubbleWidth / 2, bubbleY - bubbleHeight);
      ctx.lineTo(bubbleX + bubbleWidth / 2, bubbleY);
      ctx.lineTo(bubbleX + 10, bubbleY);
      ctx.lineTo(bubbleX, bubbleY + 15);
      ctx.lineTo(bubbleX - 10, bubbleY);
      ctx.lineTo(bubbleX - bubbleWidth / 2, bubbleY);
      ctx.closePath();

      // 말풍선 색상 설정
      ctx.fillStyle =
        (currentScene === "스터디룸" || currentScene === "과방") && bubble.scene === "all"
          ? "white" // 스터디룸 및 과방에서 전체 채팅
          : currentScene === "스터디룸"
          ? "#ADD8E6" // 스터디룸에서 개인 채팅
          : currentScene === "과방"
          ? "yellow" // 과방에서 개인 채팅
          : "white"; // 기본값
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 말풍선 텍스트 표시
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black";
      ctx.font = `${Math.max(12, Math.min(canvas.width, canvas.height) * 0.018)}px 'Jua'`; // 폰트를 Jua로 변경
      ctx.fillText(bubble.message, bubbleX, bubbleY - bubbleHeight / 2);
    }
        });

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentScene, showStartScreen, avatars, chatBubbles, nickname]);

  const handlePopupAction = () => {
    switch (popupContent.action) {
      case "close":
        setPopupVisible(false);
        break;
      case "enterRoom":
        setCurrentScene("과방");
        socket.emit("updateScene", { scene: "과방" });
        setPopupVisible(false);
        break;
      case "exitRoom":
        setCurrentScene("1F");
        socket.emit("updateScene", { scene: "1F" });
        setPopupVisible(false);
        break;
      case "startStudy":
        setPopupVisible(false);
        setCurrentScene("스터디룸");
        socket.emit("updateScene", { scene: "스터디룸" });
        break;
      case "exitStudyRoom": // 새로운 액션 처리
        setPopupVisible(false);
        setCurrentScene("과방");
        socket.emit("updateScene", { scene: "과방" });
        setPopupVisible(false);
        break;
      default:
        break;
    }
  };

  const handleFloorChange = (floor) => {
    setCurrentScene(floor);
    socket.emit("updateScene", { scene: floor });
    setFloorPopupVisible(false);
  };

  return (
    <section className="page-section bg-primary text-white mb-0">
      <div className="canvas-container">
        <div className="start-screen" ref={startScreenRef}>
          <input
            type="text"
            placeholder="닉네임을 입력하세요"
            onChange={(e) => setNickname(e.target.value)}
          />
          <button
            onClick={() => {
              if (nickname.trim() && !isJoined) {
                socket.emit("join", { nickname, scene: "1F" });
                setIsJoined(true);
                setShowStartScreen(false);
                startScreenRef.current.style.display = "none";
                chatboxContainerRef.current.style.display = "block";
              } else if (!nickname.trim()) {
                alert("닉네임을 입력해주세요.");
              }
            }}
          >
            입장
          </button>
        </div>
        <canvas ref={canvasRef}></canvas>
        <div className="chatbox-container" ref={chatboxContainerRef} style={{ display: "none" }}>
          <Chatbox nickname={nickname} currentScene={currentScene} />
        </div>
        {popupVisible && (
  <div className="popup" ref={popupRef}>
    <p ref={popupTextRef}>
      {popupContent.text.split("\n").map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </p>
    <button ref={popupButtonRef} onClick={handlePopupAction}>
      확인
    </button>
  </div>
)}
        {floorPopupVisible && (
          <div className="popup" ref={popupRef}>
            <p>어느 층으로 이동하시겠습니까?</p>
            {currentScene !== "1F" && <button onClick={() => handleFloorChange("1F")}>1층</button>}
            {currentScene !== "3F" && <button onClick={() => handleFloorChange("3F")}>3층</button>}
            {currentScene !== "4F" && <button onClick={() => handleFloorChange("4F")}>4층</button>}
            {currentScene !== "5F" && <button onClick={() => handleFloorChange("5F")}>5층</button>}
          </div>
        )}
        {currentScene === "스터디룸" && <VoiceChat nickname={nickname} targetNickname="과방지기" />}
      </div>
    </section>
  );
}

export default MainContent;