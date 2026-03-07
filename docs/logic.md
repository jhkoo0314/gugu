## 상태/로직 명세서 v0.1

**프로젝트명:** 초등학생 구구단 연습장
**기준 기술:** Next.js + React + Tailwind CSS
**목표:** 구현 중 상태 꼬임 없이, 한 번에 개발 가능한 수준으로 상태와 함수 책임을 정의

---

# 1. 문서 목적

이 문서는 구구단 연습장의 **상태 구조**, **상태 전이**, **핵심 함수**, **예외 처리 규칙**을 정의합니다.

이 문서를 기준으로 하면:

* 어떤 상태가 필요한지 명확해지고
* 어떤 함수가 어떤 역할을 하는지 정리되며
* 화면 전환과 점수 처리 로직이 흔들리지 않게 됩니다

---

# 2. 상태 관리 원칙

초기 버전에서는 전역 상태 라이브러리를 쓰지 않습니다.
모든 핵심 상태는 `app/page.tsx`에 둡니다.

원칙은 아래와 같습니다.

1. **상태는 한 곳에서 관리**

   * 최상위 페이지에서 전체 상태 관리

2. **자식 컴포넌트는 표시와 이벤트 전달 중심**

   * 화면 출력
   * 클릭 이벤트 전달
   * 자체적으로 핵심 데이터 보관하지 않음

3. **문제 데이터와 결과 데이터는 분리**

   * 출제된 문제 배열
   * 오답 기록 배열
   * 현재 풀이 상태를 섞지 않음

4. **한 문제는 한 번만 채점**

   * 이미 답한 문제는 재채점 금지

---

# 3. 상태 목록 정의

## 3-1. 화면 상태

```ts
type Screen = 'start' | 'quiz' | 'result';
```

### 설명

현재 어떤 화면을 보여줄지 결정합니다.

### 값

* `start`: 시작 화면
* `quiz`: 문제 풀이 화면
* `result`: 결과 화면

---

## 3-2. 단 선택 상태

```ts
type DanOption = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'all';
```

```ts
selectedDan: DanOption | null;
```

### 설명

사용자가 선택한 구구단 범위입니다.

### 초기값

```ts
null
```

### 규칙

* 시작하기 전에는 반드시 값이 있어야 함
* `null`이면 시작 불가
* `'all'`은 전체 단 랜덤 출제 의미

---

## 3-3. 문제 타입

```ts
type Question = {
  id: string;
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
  choices: number[];
};
```

### 필드 설명

* `id`: 문제 고유값
* `multiplicand`: 앞 숫자
* `multiplier`: 뒤 숫자
* `correctAnswer`: 정답
* `choices`: 객관식 보기 4개

---

## 3-4. 출제 문제 상태

```ts
questions: Question[];
```

### 설명

현재 세션에서 풀 문제 목록입니다.

### 초기값

```ts
[]
```

### 규칙

* 시작 시 새로 생성
* 오답 다시 풀기 시 새 문제 배열로 교체
* 문제 풀이 중에는 순서 고정

---

## 3-5. 현재 문제 인덱스

```ts
currentIndex: number;
```

### 설명

현재 몇 번째 문제를 푸는지 나타냅니다.

### 초기값

```ts
0
```

### 규칙

* `questions[currentIndex]`가 현재 문제
* 다음 문제로 갈 때 `+1`
* 마지막 문제 다음으로는 증가시키지 않고 결과 화면으로 이동

---

## 3-6. 점수 상태

```ts
score: number;
```

### 설명

현재 세션에서 맞힌 문제 수입니다.

### 초기값

```ts
0
```

### 규칙

* 정답일 때만 1 증가
* 한 문제에서 중복 증가 금지

---

## 3-7. 오답 기록 타입

```ts
type WrongAnswer = {
  questionId: string;
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
  userAnswer: number;
};
```

---

## 3-8. 오답 기록 상태

```ts
wrongAnswers: WrongAnswer[];
```

### 설명

틀린 문제만 저장하는 배열입니다.

### 초기값

```ts
[]
```

### 규칙

* 오답 선택 시 즉시 추가
* 중복 기록 금지
* 같은 문제를 두 번 채점하지 않으므로 사실상 중복 없음

---

## 3-9. 현재 선택한 답

```ts
selectedAnswer: number | null;
```

### 설명

현재 문제에서 사용자가 누른 보기를 저장합니다.

### 초기값

```ts
null
```

### 규칙

* 답 선택 전: `null`
* 답 선택 후: 선택한 숫자
* 다음 문제로 넘어가면 다시 `null`

---

## 3-10. 채점 완료 여부

```ts
isAnswered: boolean;
```

### 설명

현재 문제를 이미 채점했는지 나타냅니다.

### 초기값

```ts
false
```

### 규칙

* 답 선택 전: `false`
* 답 선택 직후: `true`
* 다음 문제 시작 시 다시 `false`

### 중요

이 값이 `true`이면:

* 보기 버튼 비활성화
* 점수 재계산 금지
* 오답 중복 저장 금지

---

## 3-11. 피드백 메시지

```ts
feedbackMessage: string;
```

### 설명

정답/오답 결과 문구입니다.

### 초기값

```ts
''
```

### 예시 값

* `정답이에요!`
* `잘했어요!`
* `괜찮아요, 다시 해봐요! 정답은 24예요.`

---

## 3-12. 재도전 모드 여부

```ts
isRetryMode: boolean;
```

### 설명

현재 세션이 일반 문제 풀이인지, 오답 다시 풀기인지 구분합니다.

### 초기값

```ts
false
```

### 규칙

* 일반 시작 시 `false`
* 오답 다시 풀기 시작 시 `true`

---

# 4. 상태 초기값 예시

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

---

# 5. 파생값 정의

파생값은 상태로 따로 저장하지 않고 계산해서 사용합니다.

## 5-1. 현재 문제

```ts
const currentQuestion = questions[currentIndex] ?? null;
```

---

## 5-2. 전체 문제 수

```ts
const totalQuestions = questions.length;
```

---

## 5-3. 오답 수

```ts
const wrongCount = wrongAnswers.length;
```

---

## 5-4. 정답률

```ts
const accuracy =
  totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
```

---

## 5-5. 마지막 문제 여부

```ts
const isLastQuestion = currentIndex === totalQuestions - 1;
```

---

# 6. 핵심 함수 명세

---

## 6-1. `handleSelectDan`

```ts
function handleSelectDan(dan: DanOption): void
```

### 역할

시작 화면에서 연습할 단을 선택합니다.

### 입력

* `dan`: 2~9 또는 `'all'`

### 처리

* `selectedDan` 변경

### 부작용

* 없음

### 예외

* 없음

---

## 6-2. `generateQuestions`

```ts
function generateQuestions(dan: DanOption, count: number): Question[]
```

### 역할

선택한 단 기준으로 문제 배열을 생성합니다.

### 입력

* `dan`: 선택 단
* `count`: 만들 문제 수, 기본 10

### 출력

* `Question[]`

### 처리 규칙

* `2~9단`이면 해당 단만 출제
* `'all'`이면 2~9단 랜덤 출제
* `multiplier`는 1~9
* 정답 계산
* 각 문제별 보기 4개 생성
* 보기 순서 섞기

### 중요 규칙

* 같은 세션에서 동일 문제가 너무 많이 반복되지 않도록 가능하면 중복 최소화
* 문제 수가 후보 수보다 많으면 중복 허용 가능
* 초기 버전에서는 완전 랜덤보다 “적당한 중복 방지” 정도면 충분

---

## 6-3. `generateChoices`

```ts
function generateChoices(correctAnswer: number): number[]
```

### 역할

정답 포함 객관식 4개 보기를 생성합니다.

### 입력

* `correctAnswer`

### 출력

* 보기 숫자 배열 4개

### 처리 규칙

* 정답 1개 반드시 포함
* 오답 3개는 중복 금지
* 오답은 양수여야 함
* 너무 비현실적인 값 금지
* 최종 배열은 랜덤 순서

### 예시

정답이 `24`면:

* `[20, 24, 28, 18]`
* `[24, 21, 27, 30]`

---

## 6-4. `handleStartQuiz`

```ts
function handleStartQuiz(): void
```

### 역할

선택한 단으로 새 게임을 시작합니다.

### 사전 조건

* `selectedDan !== null`

### 처리

1. 문제 생성
2. `questions` 저장
3. `currentIndex = 0`
4. `score = 0`
5. `wrongAnswers = []`
6. `selectedAnswer = null`
7. `isAnswered = false`
8. `feedbackMessage = ''`
9. `isRetryMode = false`
10. `screen = 'quiz'`

### 예외 처리

* `selectedDan === null`이면 함수 종료
* 필요하면 시작 버튼 자체를 비활성화

---

## 6-5. `handleAnswerSelect`

```ts
function handleAnswerSelect(answer: number): void
```

### 역할

현재 문제에서 사용자가 고른 답을 채점합니다.

### 사전 조건

* `currentQuestion !== null`
* `isAnswered === false`

### 처리 순서

1. `selectedAnswer = answer`
2. `isAnswered = true`
3. 정답 여부 비교
4. 정답이면:

   * `score += 1`
   * `feedbackMessage = 긍정 문구`
5. 오답이면:

   * `wrongAnswers`에 기록 추가
   * `feedbackMessage = 오답 안내 문구`

### 정답 판정

```ts
answer === currentQuestion.correctAnswer
```

### 예외 처리

* 이미 답한 문제면 아무것도 하지 않음
* 현재 문제가 없으면 아무것도 하지 않음

### 중요 규칙

이 함수는 **한 문제당 한 번만 실행되어야 함**

---

## 6-6. `handleNextQuestion`

```ts
function handleNextQuestion(): void
```

### 역할

다음 문제로 이동하거나 결과 화면으로 이동합니다.

### 사전 조건

* `isAnswered === true`

### 처리 분기

#### 마지막 문제가 아닌 경우

1. `currentIndex += 1`
2. `selectedAnswer = null`
3. `isAnswered = false`
4. `feedbackMessage = ''`

#### 마지막 문제인 경우

1. `screen = 'result'`

### 예외 처리

* 아직 답하지 않았으면 이동 불가

---

## 6-7. `handleRetryWrongAnswers`

```ts
function handleRetryWrongAnswers(): void
```

### 역할

틀린 문제만 다시 풀기 세션을 시작합니다.

### 사전 조건

* `wrongAnswers.length > 0`

### 처리

1. `wrongAnswers`를 기반으로 새 문제 배열 생성
2. `questions` 교체
3. `currentIndex = 0`
4. `score = 0`
5. `selectedAnswer = null`
6. `isAnswered = false`
7. `feedbackMessage = ''`
8. `isRetryMode = true`
9. `wrongAnswers = []`
10. `screen = 'quiz'`

### 왜 `wrongAnswers`를 비우는가

새 재도전 세션에서는 다시 틀린 것만 새로 기록하기 위해서입니다.

### 대안

기존 오답 이력을 유지하고 싶으면 별도 히스토리 상태를 둬야 하지만 v0.1에서는 불필요합니다.

---

## 6-8. `buildRetryQuestions`

```ts
function buildRetryQuestions(wrongAnswers: WrongAnswer[]): Question[]
```

### 역할

오답 기록을 다시 문제 형태로 바꿉니다.

### 입력

* `WrongAnswer[]`

### 출력

* `Question[]`

### 처리

* 각 오답을 원래 식으로 복원
* 정답 유지
* 보기 4개 다시 생성

### 예시

오답 기록:

```ts
{
  multiplicand: 3,
  multiplier: 7,
  correctAnswer: 21,
  userAnswer: 18
}
```

재생성 문제:

```ts
{
  id: 'retry-3x7',
  multiplicand: 3,
  multiplier: 7,
  correctAnswer: 21,
  choices: [...]
}
```

---

## 6-9. `handleGoHome`

```ts
function handleGoHome(): void
```

### 역할

모든 세션 상태를 초기화하고 시작 화면으로 돌아갑니다.

### 처리

1. `screen = 'start'`
2. `selectedDan = null`
3. `questions = []`
4. `currentIndex = 0`
5. `score = 0`
6. `wrongAnswers = []`
7. `selectedAnswer = null`
8. `isAnswered = false`
9. `feedbackMessage = ''`
10. `isRetryMode = false`

---

## 6-10. `resetCurrentQuestionState`

```ts
function resetCurrentQuestionState(): void
```

### 역할

문제 하나가 바뀔 때 필요한 현재 문제 관련 상태만 초기화합니다.

### 처리

* `selectedAnswer = null`
* `isAnswered = false`
* `feedbackMessage = ''`

### 사용 위치

* 새 게임 시작 직전
* 다음 문제 이동 시

---

# 7. 상태 전이 명세

---

## 7-1. 앱 시작 시

초기 상태:

* `screen = 'start'`
* 나머지 상태는 초기값

---

## 7-2. 단 선택 시

이전:

* `selectedDan = null` 또는 기존 값

이후:

* `selectedDan = 선택한 값`

---

## 7-3. 시작 버튼 클릭 시

조건:

* `selectedDan !== null`

전이:

* `start` → `quiz`

---

## 7-4. 답 선택 시

조건:

* 현재 문제 존재
* 아직 답하지 않음

전이:

* `selectedAnswer = 값`
* `isAnswered = true`
* `score` 또는 `wrongAnswers` 변경
* `feedbackMessage` 설정

---

## 7-5. 다음 문제 클릭 시

조건:

* `isAnswered = true`

전이:

* 마지막 문제 아니면:

  * `currentIndex + 1`
  * 현재 문제 관련 상태 초기화
* 마지막 문제면:

  * `quiz` → `result`

---

## 7-6. 오답 다시 풀기 클릭 시

조건:

* `wrongAnswers.length > 0`

전이:

* `result` → `quiz`
* 새 문제 배열은 오답 기반

---

## 7-7. 처음으로 클릭 시

전이:

* 어느 상태에서든 전체 초기화 후 `start`

---

# 8. 이벤트-상태 매핑 표

| 이벤트      | 조건                        | 변경 상태                                                                        |
| -------- | ------------------------- | ---------------------------------------------------------------------------- |
| 단 선택     | 항상 가능                     | `selectedDan`                                                                |
| 시작하기     | `selectedDan !== null`    | `questions`, `screen`, `score`, `wrongAnswers`, `currentIndex` 등             |
| 답 선택     | `!isAnswered`             | `selectedAnswer`, `isAnswered`, `score` 또는 `wrongAnswers`, `feedbackMessage` |
| 다음 문제    | `isAnswered`              | `currentIndex` 또는 `screen`                                                   |
| 오답 다시 풀기 | `wrongAnswers.length > 0` | `questions`, `screen`, `score`, `wrongAnswers`, `isRetryMode`                |
| 처음으로     | 항상 가능                     | 전체 초기화                                                                       |

---

# 9. 예외 처리 규칙

## 9-1. 단을 선택하지 않았는데 시작 버튼 클릭

### 처리 방식

* 함수 실행 안 함
* 또는 버튼 비활성화

### 권장

버튼 비활성화가 가장 좋음

---

## 9-2. 답을 두 번 누르는 경우

### 처리 방식

* `isAnswered === true`이면 무시

---

## 9-3. 현재 문제가 없는데 답 선택

### 처리 방식

* 함수 종료
* 에러 발생시키지 않음

---

## 9-4. 마지막 문제 이후 인덱스 초과

### 처리 방식

* 인덱스 증가 대신 결과 화면 이동

---

## 9-5. 오답이 없는데 오답 다시 풀기 클릭

### 처리 방식

* 버튼 숨김 또는 비활성화

---

# 10. UI 제어 규칙

## 시작 화면

* 단 선택 전: 시작 버튼 비활성화
* 단 선택 후: 시작 버튼 활성화

## 문제 화면

* 답 선택 전:

  * 보기 버튼 활성화
  * 다음 문제 버튼 비활성화 또는 숨김

* 답 선택 후:

  * 보기 버튼 비활성화
  * 다음 문제 버튼 활성화

## 결과 화면

* 오답 없으면:

  * 오답 다시 풀기 버튼 숨김
  * “모두 맞았어요!” 문구 표시

---

# 11. 추천 유틸 함수 목록

## 배열 섞기

```ts
function shuffleArray<T>(array: T[]): T[]
```

## 랜덤 정수

```ts
function getRandomInt(min: number, max: number): number
```

## 문제 ID 생성

```ts
function createQuestionId(multiplicand: number, multiplier: number): string
```

## 정답률 계산

```ts
function calculateAccuracy(score: number, total: number): number
```

---

# 12. 파일 분리 기준

## `types/quiz.ts`

* `Screen`
* `DanOption`
* `Question`
* `WrongAnswer`

## `lib/generateQuestions.ts`

* `generateQuestions`
* `buildRetryQuestions`

## `lib/generateChoices.ts`

* `generateChoices`

## `lib/shuffleArray.ts`

* `shuffleArray`

## `app/page.tsx`

* 상태 선언
* 이벤트 핸들러
* 화면 전환 제어

---

# 13. 구현 우선순위

## 1순위

* 상태 선언
* `handleSelectDan`
* `handleStartQuiz`
* `handleAnswerSelect`
* `handleNextQuestion`
* `handleGoHome`

## 2순위

* `generateQuestions`
* `generateChoices`

## 3순위

* `handleRetryWrongAnswers`
* `buildRetryQuestions`

---

# 14. 개발자가 바로 이해해야 할 핵심 규칙

이 프로젝트에서 가장 중요한 규칙은 4개입니다.

1. **문제 채점은 한 번만 한다**
2. **상태는 `page.tsx`에서만 관리한다**
3. **다음 문제로 갈 때 현재 문제 상태를 초기화한다**
4. **오답 다시 풀기는 새 세션처럼 시작한다**

---

# 15. 간단한 상태 흐름 예시

## 예시: 3단 시작 후 첫 문제 오답

초기:

* `screen = start`
* `selectedDan = null`

단 선택:

* `selectedDan = 3`

시작:

* `questions = 10개 생성`
* `screen = quiz`
* `currentIndex = 0`

첫 문제에서 `18` 선택:

* `selectedAnswer = 18`
* `isAnswered = true`
* 정답이 아니라면 `wrongAnswers`에 추가
* `feedbackMessage = "괜찮아요, 다시 해봐요! 정답은 21예요."`

다음 문제:

* `currentIndex = 1`
* `selectedAnswer = null`
* `isAnswered = false`
* `feedbackMessage = ''`

---


