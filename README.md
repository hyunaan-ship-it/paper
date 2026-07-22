# 💌 마음을 담은 롤링페이퍼 (Rolling Paper)

인사이동으로 새로운 보금자리로 떠나는 구성원을 위해 메시지를 작성하고, 관리자가 자유롭게 카드를 배치 및 관리할 수 있는 **실시간 롤링페이퍼 웹 애플리케이션**입니다.

![사진 찍는 귀여운 파스텔 고양이](./public/cat_photographer.png)

---

## 🌟 주요 기능
1. **일반 사용자 메시지 작성**:
   - 파스텔 배경 색상, 감성 폰트, 포인트 스티커 선택 및 **실시간 라이브 미리보기**.
   - 본인 작성 글 보호를 위한 **4자리 비밀번호(PIN)** 등록.
   - **내가 쓴 글 확인**: 타인 글은 비밀 유지되며 본인이 작성한 카드만 조회/수정/삭제 가능.

2. **관리자 모드 (`비밀번호: a12345x`)**:
   - **자유 드래그 앤 드롭 (Drag & Drop)**: 캔버스 위의 모든 카드를 원하는 위치로 이동.
   - **글자 크기, 카드 크기, 카드 회전 조절**: 개별 카드 클릭 시 조작 슬라이더 패널 노출.
   - **메시지 삭제 & 3열 그리드 자동 정렬**.
   - **고화질 전체 롤링페이퍼 이미지 다운로드 (PNG)**.

3. **Supabase 실시간 클라우드 DB 연동**:
   - 실시간(Realtime WebSockets) 지원으로 여러 사람이 동시에 접속해도 새 메시지 추가 및 관리자의 카드 이동이 접속 중인 모든 사람에게 실시간으로 브로드캐스트 동기화됩니다.

---

## 🚀 Supabase & Vercel 1분 배포 가이드

### 1단계: Supabase 데이터베이스 생성 (무료)
1. [Supabase 공식 홈페이지](https://supabase.com) 가입 후 새 프로젝트를 생성합니다.
2. 좌측 메뉴의 **SQL Editor**로 이동합니다.
3. 본 프로젝트의 `supabase_schema.sql` 파일 내용을 그대로 복사하여 붙여넣고 **[Run]** 버튼을 누릅니다.
4. **Project Settings -> API**로 이동하여 `URL`과 `anon public key` 값을 확인합니다.

### 2단계: GitHub 업로드 및 Vercel 배포 (무료)
1. GitHub 레포지토리 `https://github.com/hyunaan-ship-it/paper.git` 에 코드를 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인 후 **Import Project**로 해당 GitHub 레포지토리를 선택합니다.
3. **Environment Variables** 항목에 다음 2개의 값을 등록합니다:
   - `VITE_SUPABASE_URL`: (Supabase URL)
   - `VITE_SUPABASE_ANON_KEY`: (Supabase anon key)
4. **Deploy** 버튼을 누르면 나만의 롤링페이퍼 주소가 완성됩니다! 🎉

---

## 🔑 기본 설정 정보
- **관리자 암호**: `a12345x`
- **기본 수신자**: 김철수 팀장님 (상단 헤더 클릭 시 언제든 이름 수정 가능)
