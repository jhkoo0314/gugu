# TODO

## 목적

초기 버전(v0.1) 구현을 문서 기준에 맞춰 순서대로 진행한다.

- 범위: 시작 화면, 단 선택, 10문제 퀴즈, 즉시 채점, 결과 화면, 오답 다시 풀기, 모바일 대응
- 제외: 로그인, DB, 백엔드, 랭킹, 보호자 기능, 과한 애니메이션
- 패키지 매니저: `pnpm`

## 구현 원칙

- 상태는 `src/app/page.tsx` 한 곳에서 관리한다.
- 자식 컴포넌트는 표시와 이벤트 전달만 담당한다.
- 한 문제는 한 번만 채점한다.
- 다음 문제로 갈 때 `selectedAnswer`, `isAnswered`, `feedbackMessage`를 초기화한다.
- 오답 다시 풀기는 새 세션처럼 시작한다.
- 모바일 우선으로 구현한다.

## 1. 프로젝트 기본 세팅

- [x] `pnpm` 기준으로 Next.js App Router + TypeScript + Tailwind 프로젝트 상태 확인
- [x] 현재 폴더의 실제 코드 구조를 문서 권장 구조와 비교
- [x] 필요한 경우 `src/app`, `src/components`, `src/lib`, `src/types` 구조 정리
- [x] 전역 스타일 파일과 기본 레이아웃 진입점 확인

## 2. 타입 및 유틸리티 작성

- [x] `src/types/quiz.ts`에 `Screen`, `DanOption`, `Question`, `WrongAnswer` 정의
- [x] `src/lib/shuffleArray.ts` 작성
- [x] `src/lib/getRandomInt.ts` 작성
- [x] `src/lib/createQuestionId.ts` 작성
- [x] `src/lib/calculateAccuracy.ts` 작성
- [x] `src/lib/generateChoices.ts` 작성
- [x] `src/lib/generateQuestions.ts` 작성
- [x] `src/lib/buildRetryQuestions.ts` 작성

## 3. 최상위 상태 및 화면 전환 구현

- [x] `src/app/page.tsx`를 Client Component로 구성
- [x] 핵심 상태 정의
- [x] 파생값 계산
- [x] `handleSelectDan` 구현
- [x] `handleStartQuiz` 구현
- [x] `handleAnswerSelect` 구현
- [x] `handleNextQuestion` 구현
- [x] `handleRetryWrongAnswers` 구현
- [x] `handleGoHome` 구현
- [x] `screen` 상태로 `start`, `quiz`, `result` 화면 분기 렌더링

## 4. 시작 화면 구현

- [x] `src/components/StartScreen.tsx` 작성
- [x] 2단~9단, 전체 섞기 버튼 UI 구현
- [x] 선택 상태가 시각적으로 분명하게 보이도록 처리
- [x] 단 미선택 시 시작 버튼 비활성화
- [x] 제목과 짧은 안내 문구 반영

## 5. 문제 화면 구현

- [x] `src/components/QuizScreen.tsx` 작성
- [x] `src/components/QuestionCard.tsx` 작성
- [x] `src/components/ChoiceButton.tsx` 작성
- [x] `src/components/ProgressBar.tsx` 작성
- [x] `src/components/ScoreBoard.tsx` 작성
- [x] 문제 식을 가장 크게 보여주도록 배치
- [x] 보기 버튼 4개를 큰 세로형 터치 영역으로 구현
- [x] 답 선택 후 즉시 채점 및 피드백 표시
- [x] 채점 후 보기 버튼 비활성화
- [x] 채점 후에만 다음 문제 버튼 노출 또는 활성화

## 6. 결과 화면 구현

- [x] `src/components/ResultScreen.tsx` 작성
- [x] 총 문제 수, 정답 수, 오답 수, 정답률 표시
- [x] 오답 목록 표시
- [x] 오답이 있을 때만 다시 풀기 버튼 표시
- [x] 오답이 없으면 축하 문구 강조
- [x] 처음으로 버튼으로 전체 상태 초기화 연결

## 7. 디자인 시스템 반영

- [x] `src/app/globals.css` 또는 Tailwind 토큰에 주요 컬러 변수 반영
- [x] 크림 배경, 핑크/라벤더 포인트, 민트/옐로 보조색 적용
- [x] 카드형 UI, `rounded-3xl`, 부드러운 그림자 톤 적용
- [x] 큰 글씨, 큰 버튼, 넉넉한 여백 유지
- [x] 정답/오답 상태를 색상 외 텍스트와 형태 차이로도 구분

## 8. 반응형 및 사용성 보정

- [x] 모바일 기본 폭에서 카드와 버튼 가독성 확인
- [x] 태블릿/데스크톱에서 최대 폭 제한 유지
- [x] 터치 영역이 충분한지 확인
- [x] 텍스트 대비가 충분한지 확인
- [x] 장식 요소가 학습 흐름을 방해하지 않는지 확인

## 9. 검증

- [x] `pnpm` 기준 린트 또는 타입체크 실행
- [x] 수동 테스트 1: 단 미선택 시 시작 불가
- [x] 수동 테스트 2: 단 선택 후 시작 가능
- [x] 수동 테스트 3: 10문제 정상 출제
- [x] 수동 테스트 4: 답 선택 시 즉시 채점
- [x] 수동 테스트 5: 같은 문제에서 중복 채점 방지
- [x] 수동 테스트 6: 마지막 문제 후 결과 화면 이동
- [x] 수동 테스트 7: 오답 다시 풀기 정상 동작
- [x] 수동 테스트 8: 오답 0개일 때 축하 문구와 버튼 노출 상태 확인
- [x] 수동 테스트 9: 모바일 폭에서 버튼 터치성 확인

## 완료 기준

- [x] 시작, 퀴즈, 결과 화면 전환이 끊김 없이 동작한다.
- [x] 10문제 세션, 즉시 채점, 결과 계산이 정확하다.
- [x] 오답 다시 풀기가 새 세션처럼 동작한다.
- [x] 전체 톤이 밝고 예쁘고 깔끔한 문서 기준을 유지한다.
- [x] 문서 기준 금지 사항을 침범하지 않는다.
