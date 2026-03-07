# TODO_V3

`FEATURE_SPEC_V3.md` 기준 학습 확장 기능 체크리스트입니다.  
기준 버전은 v0.1 ~ v0.3 완료 상태이며, 목표 범위는 v0.4입니다.

## 1. 공통 준비

- [x] `src/types/quiz.ts`에 `DanStats` 타입 추가
- [x] `src/types/quiz.ts`에 `RecommendedDan` 타입 추가
- [x] `src/types/quiz.ts`에 `WrongNoteItem` 타입 추가
- [x] `src/types/quiz.ts`에 `BadgeId` 타입 추가
- [x] `src/types/quiz.ts`에 `Badge` 타입 추가
- [x] localStorage key 설계 반영
- [x] `gugu-wrong-note` key 사용 결정
- [x] `gugu-badges` key 사용 결정
- [x] 기존 `gugu-study-records`와의 역할 분리 점검

## 2. Phase 1: 오답노트 + 단별 통계 기반

### 2.1 오답노트 저장 구조

- [x] `src/lib/wrongNotes.ts` 추가
- [x] `loadWrongNotes()` 구현
- [x] `saveWrongNoteItem()` 구현
- [x] `markWrongNoteResolved()` 구현
- [x] `clearWrongNotes()` 필요 여부 결정
- [x] 동일 문제 식 기준 병합 규칙 구현
- [x] 오답 발생 시 `wrongCount + 1` 반영
- [x] 마지막 오답 값 저장
- [x] 마지막 오답 시각 저장
- [x] `isMastered = false` 초기화 규칙 반영
- [x] 오답노트 복습에서 정답 시 해결 처리 규칙 반영

### 2.2 오답노트와 기존 퀴즈 흐름 연결

- [x] `page.tsx` 오답 처리 시 오답노트 저장 연결
- [x] 오답노트 복습용 문제 세트 생성 유틸 설계
- [x] 기존 `buildRetryQuestions` 재사용 여부 결정
- [x] 오답노트 복습 세션 출처 상태 설계
- [x] 오답노트 복습 완료 시 해결 처리 연결

### 2.3 단별 성취도 계산

- [x] `src/lib/getDanStats.ts` 추가
- [x] `studyRecords` 기반 집계 규칙 정의
- [x] `wrongNotes` 보조 집계 반영 여부 결정
- [x] 2단~9단 전체 기본 카드 데이터 생성
- [x] 총 풀이 수 계산
- [x] 정답 수 계산
- [x] 오답 수 계산
- [x] 정답률 계산
- [x] 시간 초과 수 계산
- [x] 최고 streak 반영
- [x] 마지막 학습일 반영
- [x] 상태 라벨 분류 규칙 구현

## 3. Phase 2: 대시보드 + 추천

### 3.1 약점 단 추천

- [x] `src/lib/getRecommendedDans.ts` 추가
- [x] 낮은 accuracy 우선 반영
- [x] 오답노트 개수 반영
- [x] 최근 학습일 오래됨 반영
- [x] 추천 이유 라벨 생성
- [x] 1~3개 추천 결과 제한

### 3.2 대시보드 페이지

- [x] `src/app/dashboard/page.tsx` 추가
- [x] 대시보드 메타데이터 추가
- [x] 추천 영역 상단 배치
- [x] 단별 성취도 카드 목록 표시
- [x] 카드 상태 라벨 표시
- [x] 최근 학습일 표시
- [x] 정답률/풀이 수/오답 수 표시

### 3.3 홈 요약 영역

- [x] 홈(`/`) 하단에 추천 단 요약 추가
- [x] 홈에 약점 단 요약 1~2개 추가
- [x] 홈에 오답노트 남은 문제 수 표시
- [x] 홈에서 `/dashboard` 링크 제공
- [x] 추천 카드에서 바로 학습 시작 동선 설계

## 4. Phase 3: 오답노트 페이지

### 4.1 페이지 구성

- [x] `src/app/wrong-note/page.tsx` 추가
- [x] 오답노트 메타데이터 추가
- [x] 총 오답 문제 수 표시
- [x] 미해결 문제 수 표시
- [x] 전체/단별 필터 UI 추가
- [x] 해결 전/해결 완료 필터 추가

### 4.2 리스트 및 액션

- [x] 문제식 표시
- [x] 마지막 오답 표시
- [x] 오답 횟수 표시
- [x] 상태 라벨 표시
- [x] 단별 라벨 표시
- [x] 개별 다시 풀기 버튼 추가
- [x] 전체 복습 버튼 추가
- [x] 필터 기준 복습 버튼 추가
- [x] 해결 완료 항목 숨기기 처리

### 4.3 복습 동작

- [x] 선택 문제들로 새 문제 세트 구성
- [x] 기존 퀴즈 화면 재사용
- [x] 오답노트 복습 모드 상태 전달
- [x] 복습 중 정답 시 해결 처리
- [x] 해결 완료 후 리스트 반영

## 5. Phase 4: 배지 시스템

### 5.1 배지 저장 구조

- [x] `src/lib/badges.ts` 추가
- [x] `loadBadges()` 구현
- [x] `unlockBadge()` 구현
- [x] `evaluateBadges()` 구현
- [x] `gugu-badges` 저장 구조 반영
- [x] 중복 해금 방지 구현

### 5.2 배지 조건 구현

- [x] `first-start`
- [x] `first-session-complete`
- [x] `first-wrong-note-clear`
- [x] `dan-2-start`
- [x] `dan-master`
- [x] `all-dan-tried`
- [x] `perfect-score`
- [x] `five-streak`
- [x] `no-timeout-clear`
- [x] `three-day-streak`
- [x] `five-sessions`
- [x] `fifty-solved`

### 5.3 결과 화면 배지 표시

- [x] 새로 해금된 배지 배너 표시
- [x] 결과 화면에서 배지 강조 UI 추가
- [x] 배지 중복 노출 방지
- [x] 배지 획득일 표시 정책 결정

### 5.4 배지 목록 페이지

- [x] `src/app/badges/page.tsx` 추가
- [x] 전체 배지 목록 표시
- [x] 잠금/해금 상태 구분
- [x] 배지 설명 표시
- [x] 획득일 표시

## 6. 컴포넌트별 반영 포인트

### 6.1 `src/app/page.tsx`

- [x] 오답노트 저장 연결
- [x] 추천 기반 바로 시작 진입 설계
- [x] 오답노트 복습 세션 처리
- [x] 배지 평가 연결
- [x] 새 배지 상태 관리

### 6.2 `src/components/StartScreen.tsx`

- [x] 대시보드 링크 추가 여부 결정
- [x] 오답노트 링크 추가 여부 결정
- [x] 배지 링크 추가 여부 결정
- [x] 홈 요약 영역과 역할 분리 점검

### 6.3 `src/components/ResultScreen.tsx`

- [x] 신규 배지 배너 표시
- [x] 오답노트 저장 안내 또는 복습 동선 점검
- [x] 최근 기록과 배지 표시 우선순위 조정

### 6.4 신규 컴포넌트 후보

- [x] `DanStatsCard` 추가
- [x] `RecommendedDanCard` 추가
- [ ] `WrongNoteList` 추가
- [ ] `WrongNoteFilter` 추가
- [x] `BadgeCard` 추가
- [x] `RecentBadgeBanner` 추가

## 7. 유틸 및 데이터 검증

- [x] 통계 계산 유틸 테스트 전략 결정
- [x] 추천 계산 유틸 테스트 전략 결정
- [x] 오답노트 병합 규칙 점검
- [x] 배지 조건 중복 평가 점검
- [x] localStorage 파싱 실패 fallback 점검
- [x] key별 독립 저장 확인

## 8. 수동 테스트

### 8.1 단별 성취도

- [ ] 각 단의 풀이 수가 정확히 집계되는지
- [ ] 정답률이 올바르게 계산되는지
- [ ] 풀이가 없는 단은 `시작 전`으로 보이는지
- [ ] 상태 라벨이 기준에 맞게 표시되는지

### 8.2 약점 단 추천

- [ ] 정답률이 낮은 단이 추천되는지
- [ ] 오답노트가 많은 단이 추천 우선순위에 반영되는지
- [ ] 오래 연습하지 않은 단이 반영되는지
- [ ] 추천 버튼으로 바로 학습 시작되는지

### 8.3 오답노트

- [ ] 틀린 문제가 누적 저장되는지
- [ ] 같은 문제를 여러 번 틀리면 `wrongCount`가 증가하는지
- [ ] 복습 후 해결 완료 처리되는지
- [ ] 단별 필터가 정상 동작하는지
- [ ] 전체 복습과 필터 복습이 정상 시작되는지

### 8.4 배지 시스템

- [ ] 첫 세션 완료 시 첫 배지가 열리는지
- [ ] 100점 달성 시 퍼펙트 배지가 열리는지
- [ ] 5연속 정답 시 streak 배지가 열리는지
- [ ] 이미 해금한 배지가 중복 지급되지 않는지
- [ ] 배지 목록 페이지 상태가 저장 후 유지되는지

## 9. 완료 기준

- [x] 단별 성취도를 카드형으로 확인할 수 있다.
- [x] 약점 단을 1개 이상 자동 추천할 수 있다.
- [x] 오답노트에 누적 오답이 저장되고 다시 풀 수 있다.
- [x] 기본 배지 시스템이 동작하고 획득 상태가 저장된다.
- [ ] 기존 퀴즈 흐름(v0.1~v0.3)이 회귀 없이 유지된다.
