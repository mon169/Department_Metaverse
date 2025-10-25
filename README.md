# Department Metaverse  
**Cloud-Based Real-Time Web Platform for University Promotion**  

---

## 기술 스택 
- React.js  
- Node.js  
- Socket.IO  
- Firebase Realtime Database *(테스트용으로 따로 업로드하지 않음)*  
- WebSocket  

---

## 프로젝트 개요

**Department Metaverse**는 대학 학과 홍보와 학생 커뮤니티 활성화를 위해 개발한  
**네트워크 통신 과목의 프로젝트**로,  
**클라우드 기반을 목표로 한 실시간 웹 메타버스 플랫폼**을 목표로 제작되었습니다.  

브라우저만으로도 접속이 가능하며,  
**Canvas 기반 렌더링(“Canverse”)** 으로 사용자가 아바타를 통해 자유롭게 이동하고,  
실시간 채팅·공지·위치 기반 상호작용이 가능합니다.  

이 프로젝트는 **본인 소속 학과** 를 중심으로  
학과 구성원 간의 실시간 교류와 소속감 강화를 목적으로 제작하였습니다.

---

## 주요 기능 및 기여

- **실시간 동기화 (Real-Time Synchronization)**  
  Socket.IO를 이용해 사용자 위치와 아바타 상태를 실시간으로 동기화하는  
  클라이언트–서버 구조를 구현했습니다.

- **Firebase 및 클라우드 연동 (Firebase Integration / Cloud Integration)**  
  코드 기반을 확장하면 Firebase나 AWS 등의 클라우드를 활용해  
  사용자 로그인, 포인트, 채팅 로그, 위치 데이터를 실시간으로 관리할 수 있습니다.

- **상호작용 기능 (Interactive Features)**  
  - 같은 공간에 있는 사람끼리만 채팅 가능  
  - 전체 채팅 및 글로벌 공지 기능  
  - 캐릭터 이동 시 채팅 말풍선 표시  
  - 상대방의 움직임 및 위치 실시간 반영
  - 각 구역에 NPC 배치로 학과내의 정보 얻기 가능  
  - 원하는 공간에서 음성채팅 가능 -> 동아리 스터디 사용을 목적으로 제작
  등 다양한 인터랙션 기능을 설계하여  
  몰입감 있는 **웹 캠퍼스 환경**을 구현했습니다.

- **내결함성 있는 WebSocket 시스템 (Fault-Tolerant WebSocket System)**  
  네트워크 지연이나 끊김에도 안정적으로 복구되는  
  WebSocket 통신 구조로 구성했습니다.

- **디지털 캠퍼스 UX (Digital Campus UX Design)**  
  학교의 마스코트와 정체성을 강화하는 **시각적 맵과 UI/UX 디자인**을 구현했습니다.

---

## 시스템 아키텍처

plaintext
Frontend (React.js) [WebSocket (Socket.IO)] -> Backend (Node.js + Express) -> Database (본인은 Firebase 기반 사용)

![Department Metaverse Demo](https://github.com/mon169/Department_Metaverse/blob/main/public/img/학과메타버스.gif)




