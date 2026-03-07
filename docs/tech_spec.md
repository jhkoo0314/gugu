````md
# TECH_SPEC.md

# 초등학생 구구단 연습장 기술 명세서
버전: v0.1  
기준 문서: PRD.md, AGENTS.md  
대상: 프론트엔드 개발자, AI 코딩 에이전트, 기획자  
기술 스택: Next.js(App Router) + React + TypeScript + Tailwind CSS  
패키지 매니저: pnpm

---

## 1. 문서 목적

이 문서는 초등학생용 구구단 연습 웹앱의 초기 버전을 구현하기 위한 기술 기준을 정의한다.

이 문서에서 다루는 범위는 아래와 같다.

- 프로젝트 구조
- 기술 스택
- 상태 설계
- 데이터 타입
- 핵심 로직
- 컴포넌트 구조
- UI 동작 규칙
- 예외 처리
- 테스트 기준
- 배포 기준

이 문서의 목표는 **AI 코딩 도구나 개발자가 바로 구현 가능한 수준으로 구조를 고정하는 것**이다.

---

## 2. 기술 목표

이 프로젝트의 기술 목표는 아래와 같다.

1. 구조가 단순해야 한다.
2. 상태 흐름이 명확해야 한다.
3. 초등학생용 UI에 맞게 인터랙션이 쉬워야 한다.
4. 중복 채점이나 상태 꼬임이 없어야 한다.
5. 불필요한 백엔드 없이 프론트 단독으로 동작해야 한다.
6. 모바일에서도 자연스럽게 사용할 수 있어야 한다.

---

## 3. 기술 스택

## 3.1 필수 스택
- Next.js 16+ (App Router)
- React 19+
- TypeScript
- Tailwind CSS
- pnpm

## 3.2 사용 원칙
- 클라이언트 상호작용이 핵심이므로 메인 페이지는 Client Component로 구현한다.
- 상태 관리는 `useState`를 기본으로 한다.
- 복잡한 전역 상태 라이브러리는 도입하지 않는다.
- 서버 액션, DB, API Route는 v0.1에서 사용하지 않는다.
- 애니메이션은 CSS/Tailwind 수준 또는 최소한의 프론트 구현만 허용한다.
- 의존성 설치, 스크립트 실행, 잠금 파일 관리는 `pnpm` 기준으로 수행한다.

## 3.3 도입하지 않는 것
- Redux
- Zustand
- React Query
- Supabase/Firebase
- Prisma/DB
- 인증(Auth) 라이브러리
- 복잡한 애니메이션 프레임워크

---

## 4. 시스템 개요

이 앱은 서버 저장 없이 브라우저 세션 안에서만 동작하는 단일 페이지형 학습 앱이다.

### 동작 개요
1. 사용자가 단을 선택한다.
2. 앱이 문제 배열을 생성한다.
3. 사용자가 한 문제씩 객관식으로 답한다.
4. 앱이 즉시 채점한다.
5. 모든 문제 종료 후 결과를 보여준다.
6. 틀린 문제만 다시 풀 수 있다.

### 시스템 특성
- 프론트엔드 단독 동작
- 메모리 기반 세션 상태
- 단일 페이지 내 화면 전환
- 상태 주도 UI 렌더링

---

## 5. 디렉토리 구조

권장 구조는 아래와 같다.

```txt
src/
  app/
    globals.css
    layout.tsx
    page.tsx

  components/
    StartScreen.tsx
    QuizScreen.tsx
    ResultScreen.tsx
    QuestionCard.tsx
    ChoiceButton.tsx
    ProgressBar.tsx
    ScoreBoard.tsx

  lib/
    generateQuestions.ts
    generateChoices.ts
    buildRetryQuestions.ts
    shuffleArray.ts
    getRandomInt.ts
    calculateAccuracy.ts
    createQuestionId.ts

  types/
    quiz.ts
````

### 구조 원칙

* `app/page.tsx`: 최상위 상태 + 화면 전환
* `components/`: 표시용 UI 컴포넌트
* `lib/`: 순수 함수, 문제 생성/계산 로직
* `types/`: 공통 타입 정의

---

## 6. 렌더링 전략

## 6.1 페이지 전략

초기 버전은 `/` 단일 라우트만 사용한다.

### 이유

* 구조가 단순하다.
* 상태 전달이 쉽다.
* 초보 구현에 적합하다.
* 라우팅 복잡도를 줄일 수 있다.

## 6.2 화면 전환 방식

화면은 URL 라우팅이 아니라 `screen` 상태값으로 전환한다.

허용 상태:

* `start`
* `quiz`
* `result`

예시:

```ts
type Screen = 'start' | 'quiz' | 'result';
```

---

## 7. 타입 설계

공통 타입은 `src/types/quiz.ts`에 정의한다.

```ts
export type Screen = 'start' | 'quiz' | 'result';

export type DanOption = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'all';

export type Question = {
  id: string;
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
  choices: number[];
};

export type WrongAnswer = {
  questionId: string;
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
  userAnswer: number;
};
```

### 타입 원칙

* `any` 사용 금지
* 숫자 입력과 UI 상태를 명확히 구분
* 공통 타입은 컴포넌트 내부에 중복 선언하지 않는다

---

## 8. 상태 설계

핵심 상태는 모두 `src/app/page.tsx`에 둔다.

```ts
const [screen, setScreen] = useState<Screen>('start');
const [selectedDan, setSelectedDan] = useState<DanOption | null>(null);
const [questions, setQuestions] = useState<Question[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [score, setScore] = useState(0);
const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
const [isAnswered, setIsAnswered] = useState(false);
const [feedbackMessage, setFeedbackMessage] = useState('');
const [isRetryMode, setIsRetryMode] = useState(false);
```

## 8.1 상태 책임

* `screen`: 현재 화면 제어
* `selectedDan`: 선택 단 관리
* `questions`: 현재 세션 문제 배열
* `currentIndex`: 현재 문제 위치
* `score`: 정답 수
* `wrongAnswers`: 오답 기록
* `selectedAnswer`: 현재 문제 선택값
* `isAnswered`: 현재 문제 채점 완료 여부
* `feedbackMessage`: 정답/오답 문구
* `isRetryMode`: 오답 복습 세션 여부

## 8.2 파생값

아래 값은 별도 상태로 저장하지 않고 계산한다.

```ts
const currentQuestion = questions[currentIndex] ?? null;
const totalQuestions = questions.length;
const wrongCount = wrongAnswers.length;
const accuracy = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
const isLastQuestion = currentIndex === totalQuestions - 1;
```

### 원칙

* 계산 가능한 값은 state로 중복 저장하지 않는다.
* 한 소스에서만 진실값을 관리한다.

---

## 9. 상태 전이 규칙

## 9.1 시작 상태

* `screen = 'start'`
* `selectedDan = null`
* 나머지는 초기값

## 9.2 시작 버튼 클릭

조건:

* `selectedDan !== null`

처리:

* 문제 배열 생성
* 점수/오답/현재 문제 상태 초기화
* `screen = 'quiz'`

## 9.3 답 선택

조건:

* 현재 문제 존재
* `isAnswered === false`

처리:

* `selectedAnswer` 저장
* 채점
* `score` 또는 `wrongAnswers` 갱신
* `isAnswered = true`
* 피드백 표시

## 9.4 다음 문제

조건:

* `isAnswered === true`

처리:

* 마지막 문제가 아니면 `currentIndex + 1`
* 마지막 문제면 `screen = 'result'`
* 현재 문제 상태 초기화

## 9.5 오답 다시 풀기

조건:

* `wrongAnswers.length > 0`

처리:

* 오답 기반 문제 배열 생성
* 새 세션처럼 상태 초기화
* `screen = 'quiz'`
* `isRetryMode = true`

## 9.6 처음으로

처리:

* 모든 상태 초기화
* `screen = 'start'`

---

## 10. 핵심 로직 설계

## 10.1 단 선택 로직

```ts
function handleSelectDan(dan: DanOption): void
```

역할:

* 사용자가 선택한 단을 상태에 저장

규칙:

* 하나만 선택 가능
* 선택 상태는 UI에 즉시 반영

---

## 10.2 문제 생성 로직

```ts
function generateQuestions(dan: DanOption, count: number): Question[]
```

역할:

* 선택한 단 조건에 따라 문제 배열 생성

처리 규칙:

* 특정 단이면 해당 단 고정
* `'all'`이면 2~9단 랜덤 선택
* `multiplier`는 1~9
* `correctAnswer = multiplicand * multiplier`
* `choices`는 `generateChoices(correctAnswer)`로 생성
* 결과는 문제 배열로 반환

추가 규칙:

* 가능하면 중복 최소화
* v0.1에서는 완전 비중복이 아니어도 허용
* 기본 문제 수는 10

---

## 10.3 보기 생성 로직

```ts
function generateChoices(correctAnswer: number): number[]
```

역할:

* 정답 포함 4개의 객관식 보기 생성

요구사항:

* 정답 1개 포함
* 오답 3개는 중복 금지
* 음수 금지
* 지나치게 비현실적인 값 금지
* 배열 순서는 랜덤

권장 방식:

* 정답 주변 수 생성
* 예: `correct ± 1, 2, 4, 6`
* 0 이하 제외
* Set으로 중복 제거
* 4개 구성 후 섞기

예시:

* 정답 `24`
* 보기 `[20, 24, 28, 18]`

---

## 10.4 채점 로직

```ts
function handleAnswerSelect(answer: number): void
```

역할:

* 현재 문제 답을 채점하고 상태 반영

처리 순서:

1. 이미 채점된 문제인지 확인
2. 현재 문제 존재 확인
3. 선택값 저장
4. 정답 여부 비교
5. 정답이면 `score + 1`
6. 오답이면 `wrongAnswers`에 기록
7. 피드백 문구 갱신
8. `isAnswered = true`

중요 규칙:

* 한 문제는 한 번만 채점
* 중복 클릭 무시
* 채점 후 보기 버튼 비활성화

---

## 10.5 다음 문제 이동 로직

```ts
function handleNextQuestion(): void
```

역할:

* 다음 문제로 이동하거나 결과 화면으로 전환

처리:

* 아직 답하지 않았으면 아무것도 하지 않음
* 마지막 문제가 아니면 인덱스 증가
* 마지막 문제면 결과 화면 이동
* 현재 문제 관련 상태 초기화

현재 문제 상태 초기화 항목:

* `selectedAnswer = null`
* `isAnswered = false`
* `feedbackMessage = ''`

---

## 10.6 오답 다시 풀기 로직

```ts
function handleRetryWrongAnswers(): void
```

역할:

* 오답 기록을 다시 문제 배열로 만들어 재시작

처리:

* `wrongAnswers` 기반으로 새 문제 배열 생성
* `questions` 재설정
* `currentIndex = 0`
* `score = 0`
* `selectedAnswer = null`
* `isAnswered = false`
* `feedbackMessage = ''`
* `isRetryMode = true`
* `wrongAnswers = []`
* `screen = 'quiz'`

---

## 10.7 오답 재구성 로직

```ts
function buildRetryQuestions(wrongAnswers: WrongAnswer[]): Question[]
```

역할:

* 오답 기록을 다시 `Question[]`으로 변환

처리:

* 원래 곱셈 식을 복원
* 정답 유지
* 새 보기 배열 생성
* 새 id 부여

---

## 10.8 홈 초기화 로직

```ts
function handleGoHome(): void
```

역할:

* 모든 상태를 초기화하고 시작 화면으로 복귀

---

## 11. 유틸 함수 명세

## 11.1 `shuffleArray`

```ts
function shuffleArray<T>(array: T[]): T[]
```

역할:

* 배열 랜덤 정렬
* 원본 배열을 직접 수정하지 않고 복사본 반환 권장

## 11.2 `getRandomInt`

```ts
function getRandomInt(min: number, max: number): number
```

역할:

* 범위 내 랜덤 정수 반환

## 11.3 `createQuestionId`

```ts
function createQuestionId(multiplicand: number, multiplier: number): string
```

역할:

* 문제 고유 id 생성

예:

```ts
`${multiplicand}x${multiplier}-${crypto.randomUUID()}`
```

v0.1에서는 단순 문자열 조합도 가능

## 11.4 `calculateAccuracy`

```ts
function calculateAccuracy(score: number, total: number): number
```

역할:

* 정답률 계산
* `0` 나누기 방지

---

## 12. 컴포넌트 설계

## 12.1 `page.tsx`

역할:

* 전체 상태 소유
* 이벤트 핸들러 정의
* 화면 분기 렌더링

구조 예시:

```tsx
if (screen === 'start') return <StartScreen ... />;
if (screen === 'quiz') return <QuizScreen ... />;
return <ResultScreen ... />;
```

---

## 12.2 `StartScreen`

역할:

* 단 선택 UI
* 시작 버튼 UI

props 예시:

```ts
type StartScreenProps = {
  selectedDan: DanOption | null;
  onSelectDan: (dan: DanOption) => void;
  onStart: () => void;
};
```

UI 요구:

* 타이틀
* 서브 문구
* 단 선택 버튼
* 시작 버튼

---

## 12.3 `QuizScreen`

역할:

* 진행 상태 표시
* 문제 표시
* 보기 표시
* 피드백 표시
* 다음 문제 버튼 표시

props 예시:

```ts
type QuizScreenProps = {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  wrongCount: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
  feedbackMessage: string;
  onAnswerSelect: (answer: number) => void;
  onNext: () => void;
};
```

---

## 12.4 `ResultScreen`

역할:

* 결과 요약 표시
* 오답 목록 출력
* 오답 다시 풀기
* 처음으로 이동

props 예시:

```ts
type ResultScreenProps = {
  score: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
  onRetryWrongAnswers: () => void;
  onGoHome: () => void;
};
```

---

## 12.5 `QuestionCard`

역할:

* 현재 문제 텍스트 표시

입력:

* `questionText`

---

## 12.6 `ChoiceButton`

역할:

* 보기 버튼 1개 렌더링
* 상태별 스타일 표시

입력 예시:

```ts
type ChoiceButtonProps = {
  value: number;
  disabled: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  onClick: () => void;
};
```

---

## 12.7 `ProgressBar`

역할:

* 진행률 시각화

입력:

* `current`
* `total`

---

## 12.8 `ScoreBoard`

역할:

* 현재 정답/오답/정답률 요약

입력:

* `correctCount`
* `wrongCount`
* `accuracy`

---

## 13. UI 동작 규칙

## 13.1 시작 화면

* 단 미선택 시 시작 버튼 비활성화
* 단 선택 시 버튼 강조
* 시작 버튼은 가장 강조된 액션

## 13.2 문제 화면

* 보기 버튼은 처음엔 활성화
* 답 선택 후 모든 보기 버튼 비활성화
* 채점 후 다음 문제 버튼 활성화
* 문제 문구는 가장 크게 표시

## 13.3 결과 화면

* 오답이 있으면 다시 풀기 버튼 노출
* 오답이 없으면 축하 문구 강화
* 처음으로 버튼은 항상 노출

---

## 14. 스타일 구현 가이드

## 14.1 디자인 방향

* 밝고 예쁜 학습 놀이터
* 딸기우유 핑크 + 라벤더 + 크림
* 둥근 카드 + 부드러운 그림자
* 귀엽지만 산만하지 않게

## 14.2 Tailwind 구현 원칙

권장 톤:

* `rounded-3xl`
* `shadow-lg`
* `max-w-md` 또는 `max-w-lg`
* 여백 넉넉한 `px-6 py-6`
* 버튼은 `min-h` 충분히 확보

## 14.3 권장 레이아웃

* 전체 화면 `min-h-screen`
* 중앙 정렬
* 모바일 우선
* 카드형 메인 컨테이너

---

## 15. 접근성/사용성 기술 기준

* 버튼 터치 영역 충분히 확보
* 색상만으로 정답/오답 구분하지 않음
* 텍스트 라벨도 함께 제공
* 작은 텍스트 금지
* 대비 부족한 연한 텍스트 금지
* 포커스 상태가 필요하면 기본 outline 유지 또는 대체 스타일 제공

---

## 16. 예외 처리 기술 기준

## 16.1 단을 선택하지 않고 시작

* 버튼 비활성화
* 함수 내부에서도 방어 처리

## 16.2 중복 클릭

* `isAnswered === true`면 무시

## 16.3 현재 문제가 없을 때 답 선택

* 함수 즉시 종료

## 16.4 마지막 문제 처리

* 인덱스를 무리하게 증가시키지 않고 결과 화면 전환

## 16.5 오답 0개일 때 다시 풀기

* 버튼 미노출 또는 비활성화

---

## 17. 성능 기준

이 프로젝트는 매우 작은 규모이므로 고급 최적화는 불필요하다.

원칙:

* 과도한 memoization 금지
* 단순 렌더링 유지
* 필요한 경우에만 `useMemo` 도입
* 문제 수가 매우 작으므로 일반 배열 연산 허용

---

## 18. 테스트 기준

## 18.1 수동 테스트 필수 시나리오

1. 시작 화면에서 단 선택 전 버튼이 비활성화되는지
2. 단 선택 후 시작이 되는지
3. 10문제가 정상 출제되는지
4. 답 선택 시 즉시 채점되는지
5. 같은 문제에서 두 번 점수 반영되지 않는지
6. 다음 문제로 정상 이동하는지
7. 마지막 문제 뒤 결과 화면으로 가는지
8. 오답 목록이 정확히 나오는지
9. 오답 다시 풀기가 정상 동작하는지
10. 모바일에서 버튼이 잘 눌리는지

## 18.2 권장 단위 테스트 대상

추후 테스트를 붙인다면 우선순위는 아래와 같다.

* `generateChoices`
* `generateQuestions`
* `buildRetryQuestions`
* `calculateAccuracy`

---

## 19. 개발 순서

권장 구현 순서는 아래와 같다.

1. `types/quiz.ts` 작성
2. `lib/shuffleArray.ts`, `lib/getRandomInt.ts` 작성
3. `lib/generateChoices.ts` 작성
4. `lib/generateQuestions.ts` 작성
5. `app/page.tsx` 상태/핸들러 구현
6. `StartScreen` 구현
7. `QuizScreen` 구현
8. `ResultScreen` 구현
9. 오답 다시 풀기 연결
10. 디자인 디테일 조정
11. 모바일 점검

---

## 20. 완료 기준

기술 구현 완료는 아래 조건을 만족할 때로 정의한다.

* 페이지가 에러 없이 렌더링된다.
* 시작/퀴즈/결과 화면 전환이 정상 동작한다.
* 문제 생성 로직이 안정적으로 동작한다.
* 중복 채점이 발생하지 않는다.
* 결과 계산이 정확하다.
* 오답 다시 풀기 흐름이 정상 작동한다.
* 모바일 기본 사용성이 확보된다.
* 코드 구조가 AGENTS.md 원칙을 위반하지 않는다.

---

## 21. 향후 확장 포인트

v0.1에서는 구현하지 않지만 구조상 고려 가능한 확장:

* 직접 입력 모드
* 타이머 모드
* 난이도 설정
* 학습 기록 저장
* 사용자 프로필
* 보호자용 리포트
* 효과음/배지 시스템

확장 원칙:

* 현재 상태 구조를 최대한 단순하게 유지
* 서버 저장은 별도 단계에서만 도입
* v0.1 흐름을 깨는 구조 변경 금지

---

## 22. 최종 구현 원칙

이 프로젝트는 다음 원칙으로 구현한다.

1. 라우팅보다 상태 전환을 우선한다.
2. UI보다 먼저 상태 일관성을 보장한다.
3. 예쁜 디자인보다 먼저 누르기 쉽고 읽기 쉬운 UI를 만든다.
4. 복잡한 기술보다 안정적인 흐름을 우선한다.
5. 초등학생이 혼자 써도 막히지 않는 경험을 목표로 한다.

```

```
