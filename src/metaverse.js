 // 시작화면 닉네임 입력 처리
 const startScreen = document.getElementById("startScreen");
 const nicknameInput = document.getElementById("nicknameInput");
 const chatboxContainer = document.getElementById("chatboxContainer");
 const chatboxMessages = document.getElementById("chatboxMessages");
 const chatboxInput = document.getElementById("chatboxInput");

 let nickname = "";

 function enterMainScreen() {
     nickname = nicknameInput.value.trim();
     if (nickname) {
         startScreen.style.display = "none"; // 시작화면 숨기기
         chatboxContainer.style.display = "block"; // 채팅박스 표시
         gameLoop(); // 게임 루프 시작
     } else {
         alert("닉네임을 입력해주세요.");
     }
 }

 function sendMessage() {
     const message = chatboxInput.value.trim();
     if (message) {
         const newMessage = document.createElement("p");
         newMessage.textContent = `${nickname}: ${message}`;
         chatboxMessages.appendChild(newMessage);
         chatboxInput.value = "";
         chatboxMessages.scrollTop = chatboxMessages.scrollHeight; // 스크롤을 가장 아래로
     }
 }

 // 기존 Canvas 및 게임 관련 코드
 const canvas = document.getElementById("gameCanvas");
 const ctx = canvas.getContext("2d");
 const popup = document.getElementById("popup");
 const popupText = document.getElementById("popupText");
 const popupButton = document.getElementById("popupButton");

 // 배경 이미지 로드
 const backgroundImage = new Image();
 backgroundImage.src = '../assets/img/1F.png';

 // 아바타 이미지 로드
 const avatarImage = new Image();
 avatarImage.src = '../assets/img/남자캐릭터.png';

 // 마커 이미지 로드
 const markerImage1 = new Image();
 markerImage1.src = '../assets/img/조교님.png';
 const markerImage2 = new Image();
 markerImage2.src = '../assets/img/문.png';
 const markerImage3 = new Image();
 markerImage3.src = '../assets/img/엘리베이터.png';
 const markerImage4 = new Image();
 markerImage4.src = '../assets/img/과방지기.png';
 const markerImage5 = new Image();
 markerImage5.src = '../assets/img/게시판.png';
 const markerImage6 = new Image();
 markerImage6.src = '../assets/img/운동화.png';

 // 아바타 기본 설정
 const avatar = {
     xRatio: 0.1,
     yRatio: 0.1,
     widthRatio: 0.05,
     heightRatio: 0.15,
     speed: 0.08
 };

 // 마커 설정
 const marker1 = { xRatio: 0.16, yRatio: 0.35, widthRatio: 0.09, heightRatio: 0.18 };
 const marker2 = { xRatio: 0.8, yRatio: 0.67, widthRatio: 0.04, heightRatio: 0.09 };
 const marker3 = { xRatio: 0.05, yRatio: 0.7, widthRatio: 0.5, heightRatio: 0.39 };
 const marker4 = { xRatio: 0.37, yRatio: 0.73, widthRatio: 0.05, heightRatio: 0.15 };
 const marker5 = { xRatio: 0.06, yRatio: 0.62, widthRatio: 0.17, heightRatio: 0.15 };
 const marker6 = { xRatio: 0.28, yRatio: 0.6, widthRatio: 0.06, heightRatio: 0.11 };

 let currentScene = "main"; // 현재 화면 상태 ("main" 또는 "과방")

 function resizeCanvas() {
     canvas.width = canvas.parentElement.clientWidth;
     canvas.height = canvas.parentElement.clientHeight;

     avatar.width = canvas.width * avatar.widthRatio;
     avatar.height = canvas.height * avatar.heightRatio;
     avatar.x = canvas.width * avatar.xRatio;
     avatar.y = canvas.height * avatar.yRatio;
     avatar.speedValue = canvas.width * avatar.speed;

     marker1.width = canvas.width * marker1.widthRatio;
     marker1.height = canvas.height * marker1.heightRatio;
     marker1.x = canvas.width * marker1.xRatio;
     marker1.y = canvas.height * marker1.yRatio;

     marker2.width = canvas.width * marker2.widthRatio;
     marker2.height = canvas.height * marker2.heightRatio;
     marker2.x = canvas.width * marker2.xRatio;
     marker2.y = canvas.height * marker2.yRatio;

     marker3.width = canvas.width * marker3.widthRatio;
     marker3.height = canvas.height * marker3.heightRatio;
     marker3.x = canvas.width * marker3.xRatio;
     marker3.y = canvas.height * marker3.yRatio;

     marker4.width = canvas.width * marker4.widthRatio;
     marker4.height = canvas.height * marker4.heightRatio;
     marker4.x = canvas.width * marker4.xRatio;
     marker4.y = canvas.height * marker4.yRatio;

     marker5.width = canvas.width * marker5.widthRatio;
     marker5.height = canvas.height * marker5.heightRatio;
     marker5.x = canvas.width * marker5.xRatio;
     marker5.y = canvas.height * marker5.yRatio;

     marker6.width = canvas.width * marker6.widthRatio;
     marker6.height = canvas.height * marker6.heightRatio;
     marker6.x = canvas.width * marker6.xRatio;
     marker6.y = canvas.height * marker6.yRatio;
 }

 window.addEventListener("resize", resizeCanvas);
 resizeCanvas();

 // 배경 이미지 그리기 함수
 function drawBackground() {
     ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
 }

 // 아바타 그리기 함수
 function drawAvatar() {
     ctx.drawImage(avatarImage, avatar.x, avatar.y, avatar.width, avatar.height);
 }

 // 마커 그리기 함수들
 function drawMarker1() {
     ctx.drawImage(markerImage1, marker1.x, marker1.y, marker1.width, marker1.height);
     ctx.font = "16px Jua";
     ctx.fillStyle = "black";
     ctx.textAlign = "center";
     ctx.fillText("조교님", marker1.x + marker1.width / 2, marker1.y + 20);
 }

 function drawMarker2() {
     ctx.drawImage(markerImage2, marker2.x, marker2.y, marker2.width, marker2.height);
 }

 function drawMarker3() {
     ctx.drawImage(markerImage3, marker3.x, marker3.y, marker3.width, marker3.height);
 }

 function drawMarker4() {
     ctx.drawImage(markerImage4, marker4.x, marker4.y, marker4.width, marker4.height); 
     ctx.font = "16px Jua";
     ctx.fillStyle = "black";
     ctx.textAlign = "center";
     ctx.fillText("과방지기", marker4.x + marker4.width / 2, marker4.y - 7);
 }

 function drawMarker5() {
     ctx.drawImage(markerImage5, marker5.x, marker5.y, marker5.width, marker5.height);
 }

 function drawMarker6() {
     ctx.drawImage(markerImage6, marker6.x, marker6.y, marker6.width, marker6.height);
 }

 // 아바타와 마커의 거리 계산 함수
 function checkProximity() {
     const dx1 = avatar.x - marker1.x;
     const dy1 = avatar.y - marker1.y;
     const distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

     const dx2 = avatar.x - marker2.x;
     const dy2 = avatar.y - marker2.y;
     const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

     const dx3 = avatar.x - marker3.x;
     const dy3 = avatar.y - marker3.y;
     const distance3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

     const dx4 = avatar.x - marker4.x;
     const dy4 = avatar.y - marker4.y;
     const distance4 = Math.sqrt(dx4 * dx4 + dy4 * dy4);

     const dx5 = avatar.x - marker5.x;
     const dy5 = avatar.y - marker5.y;
     const distance5 = Math.sqrt(dx5 * dx5 + dy5 * dy5);

     const dx6 = avatar.x - marker6.x;
     const dy6 = avatar.y - marker6.y;
     const distance6 = Math.sqrt(dx6 * dx6 + dy6 * dy6);

     if (distance1 < 100 && currentScene === "main") {
         popupText.textContent = "* 과 사 공 지*";
         popupButton.textContent = "닫기";
         popup.style.display = "block";
     } else if (distance2 < 100 && currentScene === "main") {
         popupText.textContent = "과방에 입장하시겠습니까?";
         popupButton.textContent = "입장";
         popup.style.display = "block";
     } else if (distance3 < 100 && currentScene === "main") {
         popupText.textContent = "다른층으로 이동하시겠습니까?";
         popupButton.textContent = "입장";
         popup.style.display = "block";
     } else if (distance4 < 100 && currentScene === "과방") {
         popupText.textContent = "음성 스터디를 시작할까요?";
         popupButton.textContent = "시작";
         popup.style.display = "block";
     } else if (distance5 < 100 && currentScene === "과방") {
         popupText.textContent = "* 과 방 공 지 *";
         popupButton.textContent = "닫기";
         popup.style.display = "block";
     } else if (distance6 < 100 && currentScene === "과방") {
         popupText.textContent = "퇴장하시겠습니까?";
         popupButton.textContent = "퇴장";
         popup.style.display = "block";
     } else {
         popup.style.display = "none";
     }
 }

 function handlePopupAction() {
     const popupTextContent = popupText.textContent;

     if (popupTextContent === "* 과 사 공 지*") {
         closePopup();
     } else if (popupTextContent === "과방에 입장하시겠습니까?") {
         currentScene = "과방"; // 화면 상태를 "과방"으로 변경
         backgroundImage.src = '../assets/img/과방.png'; // 과방 배경 이미지로 변경
         closePopup();
     } else if (popupTextContent === "다른층으로 이동하시겠습니까?") {
         backgroundImage.src = '../assets/img/다른층.png'; // 다른 층 배경 이미지로 변경
         closePopup();
     } else if (popupTextContent === "퇴장하시겠습니까?") {
         currentScene = "main"; // 화면 상태를 "main"으로 변경
         backgroundImage.src = '../assets/img/1F.png'; // 1층 배경 이미지로 변경
         closePopup();
     } else if (popupTextContent === "* 과 방 공 지*") {
         closePopup();
     } else if (popupTextContent === "음성 스터디를 시작하시겠어요?") {
         closePopup();
     }
 }

 function closePopup() {
     popup.style.display = 'none';
 }

 document.addEventListener('keydown', (e) => {
     if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
         moveAvatar(e.key.replace('Arrow', '').toLowerCase());
         e.preventDefault();
     }
 });

 function moveAvatar(direction) {
     switch (direction) {
         case 'left':
             avatar.x -= avatar.speedValue;
             break;
         case 'right':
             avatar.x += avatar.speedValue;
             break;
         case 'up':
             avatar.y -= avatar.speedValue;
             break;
         case 'down':
             avatar.y += avatar.speedValue;
             break;
     }
     avatar.x = Math.max(0, Math.min(canvas.width - avatar.width, avatar.x));
     avatar.y = Math.max(0, Math.min(canvas.height - avatar.height, avatar.y));
     checkProximity();
 }

 function gameLoop() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     drawBackground();
     
     if (currentScene === "main") {
         drawMarker1();
         drawMarker2();
         drawMarker3();
     } else if (currentScene === "과방") {
         drawMarker4();
         drawMarker5();
         drawMarker6();
     }

     drawAvatar();
     requestAnimationFrame(gameLoop);
 }