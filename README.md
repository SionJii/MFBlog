# MFBlog

개인 블로그 프로젝트입니다. React와 Firebase를 사용하여 구현되었으며, GitHub Pages를 통해 배포됩니다.

## 주요 기능

- 🔐 Firebase Authentication을 통한 사용자 인증
- 📝 마크다운 에디터를 활용한 포스트 작성
- 🏷️ 카테고리별 포스트 분류
- 🔍 포스트 검색 기능
- 📱 반응형 디자인

## 기술 스택

- React 18
- TypeScript
- Firebase (Authentication, Firestore)
- Tailwind CSS
- React Router
- MDEditor

## 시작하기

### 필수 조건

- Node.js 16.0.0 이상
- npm 또는 yarn
- Firebase 프로젝트

### 설치

1. 저장소 클론
```bash
git clone https://github.com/jww01/MFBlog.git
cd MFBlog
```

2. 의존성 설치
```bash
npm install
```

3. Firebase 설정
- Firebase 콘솔에서 새 프로젝트 생성
- Authentication과 Firestore 설정
- `.env` 파일 생성 후 Firebase 설정 정보 입력

4. 개발 서버 실행
```bash
npm run dev
```

## 배포

GitHub Pages를 통한 배포:

```bash
npm run deploy
```

배포된 사이트: [https://jww01.github.io/MFBlog](https://jww01.github.io/MFBlog)

## 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── firebase/      # Firebase 관련 설정 및 함수
├── types/         # TypeScript 타입 정의
├── constants/     # 상수 정의
└── utils/         # 유틸리티 함수
```

## 라이선스

MIT License
