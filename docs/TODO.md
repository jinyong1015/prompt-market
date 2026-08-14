# Prompt Market TODO

PRD(`docs/PRD.md`)와 현재 코드 기준.  
**as-is** = 클라이언트 데모(인메모리), **to-be** = Supabase·실결제·관리자 등 목표.

---

## 완료된 작업 (as-is 프로토타입)

### 기반

- [x] Next.js App Router + React + Tailwind + shadcn + sonner 구성
- [x] 시드 상품 데이터 (`lib/data.ts`, 6개)
- [x] 전역 상태 Context (`lib/store.tsx`: 유저·장바구니·구매내역, 새로고침 시 초기화)

### 화면·플로우

- [x] 공통 헤더: 로고, 로그인·회원가입 / 찜·장바구니 배지, 프로필 드롭다운·로그아웃
- [x] 홈 목록 (`/`) — PromptCard 그리드, 찜·담기/상세/구매완료 상태
- [x] 프롬프트 상세 (`/prompt/[id]`) — 설명·갤러리·찜·미구매 잠금·구매 후 본문·복사
- [x] 데모 로그인 (`/login`) — 이메일만 사용, 비밀번호 미검증
- [x] 데모 회원가입 (`/signup`) — 닉네임·이메일·비밀번호(UI만), 가입 후 즉시 로그인
- [x] 찜하기 / 찜 내역 (`/wishlist`) — 카드·상세 하트, 목록·해제·장바구니 담기
- [x] 장바구니 (`/cart`) — 담기(수량 증가)/수량 조절/삭제/합계, 로그인 가드
- [x] 결제 다이얼로그 — 토스페이먼츠 **시뮬레이션** (`setTimeout`)
- [x] 구매 내역 (`/my-page`) — 목록·상세 재진입
- [x] 프로필 (`/profile`) — 닉네임 수정, 아바타 blob URL(세션 한정)
- [x] 토스트·인증 가드 스켈레톤·결제 중 스피너

---

## 앞으로 할 작업 (to-be)

### 1. 인프라·데이터

- [ ] Supabase 프로젝트·환경변수 연동
- [ ] 스키마 생성: `profiles`, `prompts`, `carts`, `purchases` (+ RLS·인덱스)
- [ ] 회원가입 시 `profiles` 자동 생성 트리거
- [ ] (선택) `seller_waitlist` 테이블
- [ ] 시드 상품을 DB `prompts`로 이전 (`lib/data.ts` 의존 제거)

### 2. 인증·프로필

- [ ] Supabase Auth (로그인·로그아웃·세션 유지)
- [ ] 회원가입·비밀번호 검증
- [ ] 데모 기본 로그인 상태 제거
- [ ] 프로필 DB 반영 (`profiles`)
- [ ] 아바타 Supabase Storage 업로드

### 3. 장바구니·구매·결제

- [ ] 장바구니 DB(`carts`) 동기화 + 헤더 배지 연동
- [ ] 찜 DB(`wishlists` 또는 유사) 동기화
- [ ] 구매내역·본문 접근을 `purchases` 기준으로 제어
- [ ] 토스페이먼츠 실결제 SDK·주문 ID
- [ ] 서버 금액 검증 + 웹훅 승인
- [ ] 결제 성공 트랜잭션: `purchases` insert + `carts` 삭제(멱등)

### 4. 상품·탐색

- [ ] 홈/목록을 DB 기반 조회로 전환 (최신·인기 정렬)
- [ ] (선택) `/prompts` 목록 분리
- [ ] 검색·카테고리·정렬
- [ ] (선택) 페이지네이션
- [ ] (선택) 리뷰·평점·조회수·파일 다운로드(서명 URL)

### 5. 관리자·판매자·약관

- [ ] 관리자 상품 CRUD (`/admin/prompts`) — 운영자만 쓰기
- [ ] 판매자 웨이팅 리스트 (`/seller/waitlist`)
- [ ] 이용약관 `/terms`, 개인정보처리방침 `/privacy`

### 6. 기타 (선택)

- [ ] `/my-page` → `/purchase-history` 통일 + 리다이렉트
- [ ] 모바일 메뉴
- [ ] README·기술 문서(SSR/캐시/웹훅 보안 등) 정리
