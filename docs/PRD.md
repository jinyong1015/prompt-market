# [PRD] 프롬프트 스토어 "Prompt Market"

## 1. 서비스 컨셉 및 모델

- **컨셉:** 운영자가 미리 등록한 AI 프롬프트를 사용자가 탐색·장바구니·결제하고, 구매 후 프롬프트 본문을 열람·복사할 수 있는 디지털 상품 마켓플레이스.
- **현재 구현 형태:** Next.js App Router 기반 **클라이언트 데모(프로토타입)**. 백엔드/DB/실결제 없음. 상태(유저·장바구니·구매내역)는 React Context 인메모리로만 유지되며, 새로고침 시 초기화된다.
- **사용자 역할 (as-is):**
  - **사용자 (User):** 데모 로그인 후 프롬프트 탐색·장바구니·결제 시뮬레이션·프로필 수정·구매 내역 확인.
  - **관리자 / 판매자:** 화면·권한 미구현. 상품은 `lib/data.ts` 시드 데이터로 고정.
- **사용자 역할 (to-be):**
  - **관리자 (Admin):** 유일한 판매자. 관리자 화면에서 상품 CRUD.
  - **사용자 (User):** 실인증 가입 후 구매·프로필 관리.
- **기술 스택 (as-is):** Next.js 16.3 / React 19 / Tailwind CSS 4 / shadcn(Base UI) / sonner / lucide-react.
- **네이밍/라우팅 (as-is 기준 — 구현과 동일):**
  - 홈(목록 겸용): `/`
  - 프롬프트 상세: `/prompt/[id]`
  - 로그인: `/login`
  - 회원가입: `/signup`
  - 장바구니: `/cart`
  - 찜 내역: `/wishlist`
  - 구매 내역: `/my-page`
  - 프로필: `/profile`
- **라우팅 (to-be 후보):**
  - 목록 분리: `/prompts`
  - 관리자: `/admin/prompts`
  - 판매자 웨이팅 리스트: `/seller/waitlist`
  - 이용약관 `/terms`, 개인정보처리방침 `/privacy`

> 본 문서는 **as-is(현 구현)** 과 **to-be(목표)** 를 구분한다. as-is는 코드와 동기화된 사실만 기술한다.

---

## 2. 상세 화면 명세서 (Screen Specifications)

### 2.1. 헤더 (공통)

- **역할:** 전역 내비게이션, 로그인 상태, 장바구니 진입.
- **공통:** 로고(PromptMarket) 클릭 시 `/` 이동.
- **as-is:**
  - 검색 UI 없음.
  - **로그아웃 상태:** `[로그인]` → `/login`, `[회원가입]` → `/signup`.
  - **로그인 상태:**
    - 찜 아이콘 + 담긴 개수 뱃지 → `/wishlist`.
    - 장바구니 아이콘 + 담긴 개수 뱃지 → `/cart`.
    - 아바타/닉네임 드롭다운: `프로필 관리`(`/profile`), `찜 내역`(`/wishlist`), `구매 내역`(`/my-page`), `로그아웃`(토스트 후 `/`).
  - 로그아웃 시 장바구니·찜은 비움. 구매 내역은 세션 메모리에 남을 수 있음(새로고침 시 초기화).
- **to-be:**
  - Supabase Auth 연동.
  - 장바구니·찜 배지: DB 동기화.
  - (선택) 검색/모바일 메뉴.

---

### 2.2. 홈 페이지(`/`) — HOME-001

- **역할:** 판매 중 프롬프트 탐색 및 상세/장바구니 유도. (목록 전용 `/prompts` 없이 **홈이 전체 목록** 역할)
- **as-is:**
  - 헤드라인: `최신 프롬프트를 만나보세요`.
  - 시드 프롬프트 전체 그리드(`PromptCard`).
  - 카드 구성: 예시 이미지, 카테고리 배지, 모델명, 제목(말줄임), 가격(`N,NNN원`).
  - 버튼: `[상세보기]` → `/prompt/[id]`, `[장바구니 담기]` / 이미 담긴 경우 `[담기 (N)]`(수량 +1), 구매 시 `[구매완료]`.
  - 장바구니 담기 성공 토스트: `장바구니에 담았습니다` / 추가 담기 시 `수량을 추가했습니다`. 비로그인 시 `로그인이 필요합니다`(리다이렉트 없음).
  - 검색/필터/정렬/페이지네이션 없음.
- **to-be:**
  - DB 기반 최신/인기 정렬, `/prompts`로 전체 목록 분리 가능.
  - 검색·카테고리·정렬.

---

### 2.3. 프롬프트 상세(`/prompt/[id]`) — PROD-001

- **역할:** 상세 정보 확인 및 장바구니/바로구매/구매 후 본문 열람.
- **as-is:**
  - `[목록으로]` → `/`.
  - 제목, 가격, 카테고리/모델 배지.
  - 상세 설명 / 활용법 / 주의사항.
  - 이미지 갤러리(복수 이미지, 로드 실패 시 placeholder).
  - **미구매:**
    - 잠금 안내: `구매 시 프롬프트 전문을 확인하실 수 있습니다.`
    - `[장바구니 담기]` / 이미 담긴 경우 `[장바구니 담기 (N)]`(수량 +1), `[바로 구매하기]`(결제 다이얼로그).
  - **구매 완료:**
    - `구매 완료` 표시.
    - 안내 문구 + `promptText` 텍스트 박스 + `[복사]`(클립보드, 토스트).
  - 비로그인 액션 시 토스트 후 `/login` 이동.
  - 리뷰/평점/다운로드/조회수 UI 없음.
- **to-be:**
  - DB `purchases` 기준 접근 제어.
  - (선택) 파일 다운로드(서명 URL), 메타 지표.

---

### 2.4. 장바구니(`/cart`) — CART-001

- **역할:** 담은 상품 확인 및 결제 진입. 로그인 필수(없으면 `/login`).
- **as-is:**
  - **빈 장바구니:** `장바구니에 담긴 상품이 없습니다.` + `[쇼핑 계속하기]` → `/`.
  - **상품 있음:** 이미지·제목·단가·라인 합계, 수량 `−` / `+` 조절, `[삭제]`(X), 즉시 목록 갱신.
  - 동일 상품 재담기 시 수량 증가. 수량 1에서 `−` 시 해당 라인 삭제.
  - 결제 요약: `총 상품 금액`(단가×수량 합), `결제 예정 금액`.
  - 헤더 배지: 라인 수 아닌 **총 수량** 합계.
  - `[결제하기]` → 토스페이먼츠 **데모 시뮬레이션** 다이얼로그.
  - 쿠폰 없음.
- **to-be:**
  - 실 토스페이먼츠 결제창 + 서버 금액 검증(단가×수량).
  - 결제 성공 시 `purchases` 생성 후 `carts`에서 제거(트랜잭션). 본문 접근은 상품 id 기준 1회 구매로 충분.

---

### 2.5. 결제 다이얼로그 (공통)

- **as-is:**
  - 안내: `토스페이먼츠로 안전하게 결제를 진행합니다. (데모 시뮬레이션)`.
  - 약 1.4초 처리 후 `결제가 완료되었습니다` 모달.
  - `[구매 내역 보기]` → `/my-page`.
  - 성공 시 해당 상품을 구매 목록에 추가하고 장바구니에서 제거(인메모리).
- **to-be:** 실제 SDK/주문 ID/웹훅 승인. 클라이언트 금액 미신뢰.

---

### 2.6. 구매 내역(`/my-page`) — USER-002

- **역할:** 과거 구매 프롬프트 확인 및 상세 재진입. 로그인 필수.
- **as-is:**
  - 타이틀: `구매 내역`.
  - **비어 있음:** `아직 구매한 프롬프트가 없습니다.` + `[프롬프트 둘러보기]`.
  - **목록:** 구매일, 상품 이미지, 제목, `[내용 다시보기]` → `/prompt/[id]`(구매 완료 상태 화면).
  - 파일 다운로드 없음.
- **to-be:**
  - DB 조인 목록(가격/결제수단 등 확장 가능).
  - (선택) 본문 열람·파일 다운로드.

---

### 2.7. 프로필 관리(`/profile`) — USER-001

- **역할:** 닉네임·프로필 이미지 수정. 로그인 필수.
- **as-is:**
  - 타이틀: `프로필 관리`.
  - 원형 아바타, hover 시 `[변경]` → 파일 업로드(브라우저 `blob:` URL, 세션 한정).
  - 이메일: disabled 표시.
  - 닉네임: 읽기 모드(`[수정]`) / 수정 모드(`[저장]`·`[취소]`) + 토스트.
  - 판매자 통계/내 프롬프트 탭 없음(구매자 전용).
- **to-be:**
  - Supabase Storage 아바타 업로드, `profiles` 테이블 반영.

---

### 2.8. 로그인(`/login`)

- **as-is:**
  - 데모 로그인. 이메일 필수, 비밀번호는 UI만 있고 **검증하지 않음**.
  - 기본 입력값 프리필. 성공 토스트 `로그인되었습니다` 후 `/`.
  - 하단 링크: `회원가입` → `/signup`.
  - 앱 초기 상태는 **이미 로그인된 데모 유저**(`creator@promptmarket.io` / `프롬프트러버`)로 시작.
- **to-be:**
  - 실인증(Supabase Auth), 회원가입·비밀번호 검증·세션 유지.

---

### 2.8.1. 회원가입(`/signup`)

- **as-is:**
  - 데모 가입. 닉네임·이메일·비밀번호 입력(비밀번호는 UI만, 저장·검증 없음).
  - 성공 시 Context에 유저 설정 후 `/` 이동. 토스트 `회원가입이 완료되었습니다`.
  - 하단 링크: `로그인` → `/login`.
- **to-be:** Supabase Auth signUp + `profiles` 생성.

---

### 2.8.2. 찜 내역(`/wishlist`)

- **역할:** 찜한 프롬프트 목록. 로그인 필수.
- **as-is:**
  - 카드·상세의 하트 버튼으로 찜 토글(비로그인 시 토스트).
  - 빈 목록: `아직 찜한 프롬프트가 없습니다.`
  - 목록: 이미지·제목·가격, `[담기]`(장바구니), `[X]`(찜 해제).
  - 로그아웃 시 찜 목록 비움(인메모리).
- **to-be:** DB 찜 테이블 + RLS.

---

### 2.9. 미구현 화면 (to-be)

| 화면 | 경로(안) | 비고 |
|------|----------|------|
| 프롬프트 목록 분리 | `/prompts` | 현재는 `/`가 목록 |
| 관리자 상품 관리 | `/admin/prompts` | 시드 데이터만 존재 |
| 판매자 웨이팅 리스트 | `/seller/waitlist` | 미구현 |
| 이용약관 / 개인정보 | `/terms`, `/privacy` | 미구현 |

---

### 2.10. 공통 UI/UX (as-is)

- **토스트:** 화면 우측 하단, 약 1.8초(sonner). 장바구니 담기, 프로필 저장, 로그인/로그아웃, 복사 등.
- **로딩:** 인증 가드 페이지(`/cart`, `/profile`, `/my-page`)에서 리다이렉트 전 스켈레톤 표시.
- **결제 중:** 다이얼로그 내 스피너(`결제 중...`).

---

## 3. 데이터 모델

### 3.1. as-is (클라이언트)

#### Prompt (`lib/data.ts` 시드, 현재 6개)

| 필드 | 설명 |
|------|------|
| `id` | 문자열 슬러그 (예: `cinematic-portrait`) |
| `title` | 제목 |
| `price` | 정수(원) |
| `category` | 사진 / 커머스 / 일러스트 / 브랜딩 / 건축 |
| `model` | 생성 모델명 (예: Midjourney v6) |
| `shortDescription` | 짧은 소개 |
| `description` / `usage` / `caution` | 상세·활용·주의 |
| `promptText` | 구매 후 노출 본문 |
| `images` | 예시 이미지 경로 배열 |

#### User (Context)

- `email`, `nickname`, `avatar` (`string | null`)

#### Cart

- `{ id: string; quantity: number }[]`. 동일 id는 한 라인, 담기 시 `quantity` 증가. 최소 수량 1(1 미만이면 라인 제거).

#### Wishlist

- `string[]` (prompt id). 중복 불가. 로그아웃 시 비움.

#### Purchases

- `{ id: string; date: string }[]` (`date` = `YYYY-MM-DD`)

#### 영속성

- 없음. 새로고침 시 기본 로그인 유저 + 빈 장바구니/구매내역.

---

### 3.2. to-be (Supabase 기준 스키마)

> 실제 생성 시 RLS/인덱스/제약 포함 권장.

#### `profiles`

- `id` (uuid, PK, FK → `auth.users.id`)
- `nickname` (text)
- `avatar_url` (text, nullable)
- `updated_at` (timestamptz)

#### `prompts`

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `title`, `description`, `prompt_text` (text)
- `price` (integer)
- `image_urls` (text[])
- `category` / `model` (text) — as-is 필드와 정합
- `tags` (text[], optional)
- `is_published` (boolean, default true)
- (optional) `rating`, `review_count`, `view_count`, `download_count`, `file_url`

#### `carts`

- `id`, `created_at`, `user_id`, `prompt_id`, `quantity` (integer, default 1)
- `unique(user_id, prompt_id)` — 라인 단위 유일, 수량은 `quantity`로 표현

#### `purchases`

- `id`, `created_at`, `buyer_id`, `prompt_id`
- `payment_order_id` (text, unique) — 토스 주문 ID

#### `seller_waitlist` (to-be)

- `name`, `email`, `portfolio_url`, `categories`, `message`, `processed`

#### RLS 권장

- `profiles` / `carts`: 본인만
- `purchases`: 본인 조회, 운영자 전체
- `prompts`: 공개 읽기, 쓰기는 운영자만
- 회원가입 시 `profiles` 자동 생성 트리거

---

## 4. 핵심 로직 구현 노트

### as-is

- **장바구니:** 동일 id 재담기 시 수량 증가. `setCartQuantity`로 조절. 결제(시뮬레이션) 성공 시 해당 id를 purchases에 추가하고 cart에서 제거(수량과 무관하게 본문 unlock 1회).
- **결제:** 클라이언트 `setTimeout` 데모. Toss SDK/웹훅/서버 금액 검증 없음.
- **마스킹:** `isPurchased(id)`가 true일 때만 `promptText` 노출.
- **인증:** Context `login(email)` / `signup({ email, nickname })` / `logout()`. 비밀번호·서버 세션 없음.
- **찜:** Context `wishlist` + `toggleWishlist`. 로그인 필수.

### to-be

- **장바구니/결제:** 서버에서 carts 합산 → 주문 생성 → 웹훅 승인 후 purchases insert + carts 삭제(트랜잭션·멱등).
- **접근 제어:** purchases 기준 본문/파일 공개. 다운로드는 서명 URL.
- **인증:** Supabase Auth + `profiles`.
- **라우팅:** as-is의 `/my-page`를 유지하거나, 마이그레이션 시 `/purchase-history`로 통일 후 리다이렉트 제공.

---

## 5. as-is / to-be 요약

| 영역 | as-is | to-be |
|------|--------|--------|
| 상품 소스 | `lib/data.ts` 시드 6개 | Supabase `prompts` |
| 인증 | 데모 로그인, 기본 로그인 상태 | Supabase Auth + 회원가입 |
| 장바구니/구매 | 인메모리 Context | DB + RLS |
| 결제 | Toss 시뮬레이션 모달 | 실결제 + 웹훅 |
| 목록 | `/` 한 페이지 | (선택) `/prompts` 분리 |
| 관리자/웨이팅/약관 | 없음 | 추가 |
| 영속성 | 없음 | DB + 스토리지 |

> 기술 상세(SSR/캐시/에러 처리/웹훅 보안 등)는 별도 기술 문서에서 다룬다.
