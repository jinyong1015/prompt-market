# [PRD] 프롬프트 스토어 "Prompt Market"

> **문서 상태:** as-is는 2026-08-14 기준 코드와 동기화.  
> **as-is** = 현 클라이언트 데모(프로토타입) / **to-be** = 목표(Supabase·실결제·관리자 등).

---

## 1. 서비스 컨셉 및 모델

- **컨셉:** 운영자가 미리 등록한 AI 프롬프트를 사용자가 탐색·찜·장바구니·결제하고, 구매 후 본문 열람·복사·다운로드·리뷰할 수 있는 디지털 상품 마켓플레이스.
- **현재 구현 형태:** Next.js App Router 기반 **클라이언트 데모(프로토타입)**. 백엔드/DB/실결제 없음. 상태(유저·장바구니·찜·구매내역·리뷰)는 React Context(`lib/store.tsx`) 인메모리만 사용하며 **새로고침 시 초기화**. 테마·언어만 `localStorage`에 유지.
- **사용자 역할 (as-is):**
  - **사용자 (User):** 데모 로그인/회원가입 후 프롬프트 탐색·찜·장바구니·결제 시뮬레이션·프로필 수정·구매 내역(다운로드·리뷰).
  - **관리자 / 판매자:** 화면·권한 미구현. 상품은 `lib/data.ts` 시드 + `public/prompts/` 이미지로 고정. 표시 작성자명은 `PromptMarket`.
- **사용자 역할 (to-be):**
  - **관리자 (Admin):** 유일한 판매자. 관리자 화면에서 상품 CRUD.
  - **사용자 (User):** 실인증 가입 후 구매·프로필·찜·리뷰 관리.
- **기술 스택 (as-is):**
  - Next.js 16.3 / React 19 / Tailwind CSS 4 / shadcn(Base UI) / sonner / lucide-react
  - 테마: `next-themes` (`attribute="class"`, 기본 라이트, 시스템 테마 비사용)
  - 다국어: 클라이언트 `I18nProvider` (`lib/i18n.tsx`, ko/en). 상품 영문 카피 `lib/prompt-i18n.ts`
  - 본문: Inter (`font-sans`)
  - 제목·디스플레이: **유한킴벌리 푸른숲체** `YuhanKimberlyPureunsoop` (`font-display`, CDN woff2 300/500/700)
  - 전역 Provider: `components/providers.tsx` — ThemeProvider → I18nProvider → StoreProvider
- **네이밍/라우팅 (as-is — 구현과 동일):**

  | 경로 | 화면 |
  |------|------|
  | `/` | 홈(목록 겸용) |
  | `/prompt/[id]` | 프롬프트 상세 |
  | `/login` | 로그인 |
  | `/signup` | 회원가입 |
  | `/cart` | 장바구니 |
  | `/wishlist` | 찜 내역 |
  | `/my-page` | 구매 내역 |
  | `/profile` | 프로필 |

- **라우팅 (to-be 후보):** `/prompts`, `/admin/prompts`, `/seller/waitlist`, `/terms`, `/privacy`  
  (선택) `/my-page` → `/purchase-history` 통일 + 리다이렉트

---

## 2. 상세 화면 명세서 (Screen Specifications)

> 아래 화면 문구는 **한국어 기본값**. 헤더에서 English를 고르면 UI·카테고리·상품 제목/설명·가격 표기가 함께 바뀐다.

### 2.1. 헤더 (공통)

- **역할:** 전역 내비게이션, 테마·언어, 로그인 상태, 찜·장바구니 진입.
- **공통:** 로고(PromptMarket) 클릭 시 `/` 이동. 로고·브랜드명에 `font-display` 적용.
- **as-is:**
  - 검색 UI 없음.
  - **로그인 여부와 무관하게** 우측 앞에 `[언어]`·`[테마]` 토글 노출.
  - **테마:** 해/달 아이콘. 라이트 ↔ 다크. `next-themes` + `html.dark`. 저장 키 `prompt-market-theme`.
  - **언어:** 지구본 메뉴. 한국어 / English. 저장 키 `prompt-market-locale`. `<html lang>` 동기화.
  - **로그아웃 상태:** `[로그인]` → `/login`, `[회원가입]` → `/signup`.
  - **로그인 상태:**
    - 찜 아이콘 + 개수 뱃지 → `/wishlist`
    - 장바구니 아이콘 + 개수 뱃지 → `/cart`
    - 아바타/닉네임 드롭다운: `프로필 관리`(`/profile`), `찜 내역`(`/wishlist`), `구매 내역`(`/my-page`), `로그아웃`(토스트 후 `/`)
  - 로그아웃 시 **장바구니·찜 비움**. 구매·리뷰는 Context에 남을 수 있으나 **새로고침 시 전부 초기화**.
- **to-be:** Supabase Auth, 장바구니·찜 DB 배지 동기화, (선택) 검색/모바일 메뉴.

---

### 2.2. 홈 페이지(`/`) — HOME-001

- **역할:** 판매 중 프롬프트 탐색 및 상세/장바구니 유도. (`/prompts` 없이 **홈이 전체 목록**)
- **as-is:**
  - 헤드라인: `최신 프롬프트를 만나보세요` (`font-display`).
  - 시드 프롬프트 **12개** 그리드(`PromptCard`). 상품별 **고유 커버 이미지**(`public/prompts/{id}.png`).
  - 카드: 이미지, 카테고리 배지, **찜(하트)** 토글, 모델명, 제목(로케일별), 가격(`5,000원` / `₩5,000`).
  - 버튼: `[상세보기]`, `[장바구니 담기]` / 비활성 `[장바구니에 있음]`(중복 불가 → 토스트 `이미 장바구니에 있습니다`), 구매 시 `[구매완료]`.
  - 비로그인 담기/찜: 토스트 `로그인이 필요합니다`(리다이렉트 없음).
  - 이미 구매한 상품 담기: 토스트 `이미 구매한 상품입니다`.
  - 검색/필터/정렬/페이지네이션 없음.
- **to-be:** DB 기반 목록·검색·카테고리·정렬, (선택) `/prompts` 분리.

---

### 2.3. 프롬프트 상세(`/prompt/[id]`) — PROD-001

- **역할:** 상세 확인, 찜·장바구니·바로구매, 구매 후 본문 열람·복사.
- **as-is:**
  - `[목록으로]` → `/`.
  - 제목 옆 **찜(하트)**, 가격, 카테고리/모델 배지.
  - 상세 설명 / 활용법 / 주의사항.
  - 이미지(현재 시드는 상품당 대표 1장; 로드 실패 시 placeholder).
  - **미구매:** 잠금 안내 + `[장바구니 담기]`/`[장바구니에 있음]` + `[바로 구매하기]`. 이미 구매한 상품 재구매 불가.
  - **구매 완료:** `구매 완료` + `promptText` + `[복사]`.
  - 비로그인 액션 시 토스트 후 `/login`.
  - 상세 화면 내 리뷰·다운로드 UI 없음(구매 내역에서 제공).
- **to-be:** DB `purchases` 접근 제어, (선택) 서명 URL 다운로드·메타 지표.

---

### 2.4. 장바구니(`/cart`) — CART-001

- **역할:** 담은 상품 확인 및 결제. 로그인 필수 → 없으면 `/login`.
- **as-is:**
  - 빈 장바구니: 안내 + `[쇼핑 계속하기]` → `/`.
  - 상품: 이미지·제목·가격·`[삭제]`.
  - **동일 id 중복 담기 불가**(수량 없음). 재담기 시 토스트 `이미 장바구니에 있습니다`.
  - 이미 구매한 상품은 담기·재구매 불가.
  - 결제 요약 → `[결제하기]` → 토스페이먼츠 **데모 시뮬레이션**.
  - 쿠폰 없음.
- **to-be:** 실 토스페이먼츠 + 서버 금액 검증, `purchases` insert + `carts` 삭제 트랜잭션, `unique(buyer_id, prompt_id)`.

---

### 2.5. 결제 다이얼로그 (공통)

- **as-is:**
  - 안내: `토스페이먼츠로 안전하게 결제를 진행합니다. (데모 시뮬레이션)`.
  - 약 1.4초 후 `결제가 완료되었습니다`.
  - `[구매 내역 보기]` → `/my-page`.
  - 성공 시 purchases 추가 + cart에서 제거(인메모리).
- **to-be:** 실제 SDK/주문 ID/웹훅. 클라이언트 금액 미신뢰.

---

### 2.6. 구매 내역(`/my-page`) — USER-002

- **역할:** 구매 목록·통계·다운로드·리뷰. 로그인 필수.
- **as-is:**
  - **헤더:** `구매 내역` + 요약(`총 N개 프롬프트 · 결제 금액`) + `[전체 영수증 다운로드]`.
  - **통계 카드 3개:** 구매한 프롬프트 / 총 결제 금액(ko: `₩N만`, en: `₩Nk`) / 총 주문 수.
  - **툴바:** 검색(한·영 제목·카테고리·판매자), **상태** 드롭다운(전체 / 리뷰 작성 / 리뷰 미작성, ChevronDown), **정렬** 드롭다운(최신·오래된·가격↑↓, ChevronDown).
  - **전체 영수증:** 로케일에 맞는 텍스트 `.txt`(한국어 영수증 / English receipts).
  - **목록 카드:** 썸네일, 카테고리, 제목, `작성자: PromptMarket`, 구매일, 가격, `[다운로드]`·`[리뷰]`/`[리뷰 수정]`.
  - **다운로드 모달:** 상품 미리보기 → 확인 시 본문 `.txt` 저장.
  - **리뷰 모달:** 상품 미리보기, 별점(1~5, 호버), 내용 입력, 등록/수정(인메모리).
  - 빈 목록: `아직 구매한 프롬프트가 없습니다.` + `[프롬프트 둘러보기]`.
- **to-be:** DB 조인 목록, 서명 URL 다운로드, `reviews` 테이블 + RLS.

---

### 2.7. 프로필 관리(`/profile`) — USER-001

- **역할:** 닉네임·프로필 이미지 수정. 로그인 필수.
- **as-is:**
  - 원형 아바타, hover `[변경]` → 파일 업로드(`blob:` URL, 세션 한정).
  - 이메일 disabled. 닉네임 수정/저장/취소 + 토스트.
  - 판매자 탭 없음.
- **to-be:** Supabase Storage + `profiles`.

---

### 2.8. 로그인(`/login`)

- **as-is:**
  - 데모 로그인. 이메일 필수, 비밀번호 UI만(검증 없음).
  - 기본값 프리필. 성공 토스트 후 `/`.
  - 하단 `[회원가입]` → `/signup`.
  - 앱 초기 상태: **이미 로그인된 데모 유저**(`creator@promptmarket.io` / `프롬프트러버`).
- **to-be:** Supabase Auth, 비밀번호 검증·세션 유지.

---

### 2.9. 회원가입(`/signup`)

- **as-is:**
  - 닉네임·이메일·비밀번호(비밀번호 UI만, 저장·검증 없음).
  - 성공 시 Context 유저 설정 후 `/`. 토스트 `회원가입이 완료되었습니다`.
  - 하단 `[로그인]` → `/login`.
- **to-be:** Supabase Auth signUp + `profiles` 생성.

---

### 2.10. 찜 내역(`/wishlist`)

- **역할:** 찜한 프롬프트 목록. 로그인 필수.
- **as-is:**
  - 홈 카드·상세 하트로 토글(비로그인 시 토스트).
  - 빈 목록: `아직 찜한 프롬프트가 없습니다.`
  - 목록: 이미지·제목·가격, `[담기]`/`[담김]`, `[X]`(찜 해제).
  - 이미 장바구니/구매 시 담기 차단 + 토스트.
  - 로그아웃 시 찜 비움.
- **to-be:** DB `wishlists`(또는 유사) + RLS.

---

### 2.11. 미구현 화면 (to-be)

| 화면 | 경로(안) | 비고 |
|------|----------|------|
| 프롬프트 목록 분리 | `/prompts` | 현재 `/`가 목록 |
| 관리자 상품 관리 | `/admin/prompts` | 시드만 존재 |
| 판매자 웨이팅 리스트 | `/seller/waitlist` | 미구현 |
| 이용약관 / 개인정보 | `/terms`, `/privacy` | 미구현 |

---

### 2.12. 공통 UI/UX (as-is)

- **타이포:** 제목·디스플레이 `font-display`(푸른숲체), 본문 `font-sans`(Inter).
- **테마:** `:root` 라이트 / `.dark` 다크 토큰(`app/globals.css`). 토스트(sonner)는 `resolvedTheme`를 따름.
- **다국어:** `t("section.key")` 보간(`{count}` 등). 카테고리 `t("category.사진")` 등. 가격 `formatPrice(n, locale)`.
- **토스트:** 우측 하단, 약 1.8초(sonner). 문구도 로케일 따름.
- **로딩:** 인증 가드(`/cart`, `/profile`, `/my-page`, `/wishlist`) 리다이렉트 전 스켈레톤.
- **결제 중:** 다이얼로그 스피너(`결제 중...` / `Processing...`).
- **모달:** 결제·다운로드·리뷰(구매 내역). 모두 i18n.

### 2.13. 테마·다국어 상세 (as-is)

| 항목 | 구현 |
|------|------|
| 테마 토글 | `components/theme-toggle.tsx` |
| 언어 토글 | `components/locale-toggle.tsx` |
| UI 사전 | `lib/i18n.tsx` (`messages.ko` / `messages.en`) |
| 상품 영문 | `lib/prompt-i18n.ts` (`localizePrompt`) — 제목·설명·활용법·주의사항 |
| 유지 | 테마·언어만 `localStorage`. 장바구니·로그인 등은 새로고침 시 초기화 |
| 비번역 | 구매 후 `promptText`(상품 본문), 데모 닉네임 기본값 |

---

## 3. 데이터 모델

### 3.1. as-is (클라이언트)

#### Prompt (`lib/data.ts` 시드 **12개**, 이미지 `public/prompts/`)

| id | 카테고리 | 비고 |
|----|----------|------|
| `cinematic-portrait` | 사진 | |
| `product-mockup` | 커머스 | |
| `fantasy-landscape` | 일러스트 | |
| `logo-design` | 브랜딩 | |
| `anime-character` | 일러스트 | |
| `interior-design` | 건축 | |
| `food-styling` | 사진 | |
| `fashion-lookbook` | 사진 | |
| `saas-landing` | 브랜딩 | |
| `youtube-thumbnail` | 커머스 | |
| `watercolor-poster` | 일러스트 | |
| `cafe-exterior` | 건축 | |

| 필드 | 설명 |
|------|------|
| `id` | 문자열 슬러그 |
| `title` / `price` / `category` / `model` | 기본 메타(시드는 한국어). en일 때 `localizePrompt`로 제목·소개 치환 |
| `shortDescription` / `description` / `usage` / `caution` | 소개·상세(영문 카피 있음) |
| `promptText` | 구매 후 노출 본문(**로케일과 무관**, 한국어 시드) |
| `images` | `/prompts/{id}.png` 등 (상품당 고유 커버) |

#### User (Context)

- `email`, `nickname`, `avatar` (`string | null`)

#### Cart

- `string[]` (prompt id). **중복 불가**, 수량 없음. 이미 구매한 id 담기 불가.

#### Wishlist

- `string[]` (prompt id). 중복 불가. 로그아웃 시 비움.

#### Purchases

- `{ id: string; date: string }[]` (`YYYY-MM-DD`). **동일 id 재구매 불가**.

#### Reviews

- `Record<promptId, { rating: number; content: string; updatedAt: string }>`

#### 영속성

- **유저·장바구니·찜·구매·리뷰:** 없음. 새로고침 → 기본 로그인 유저 + 빈 장바구니/찜/구매/리뷰.
- **테마·언어:** `localStorage`에 유지 (`prompt-market-theme`, `prompt-market-locale`).

---

### 3.2. to-be (Supabase 기준 스키마)

> 실제 생성 시 RLS/인덱스/제약 포함 권장.

#### `profiles`

- `id` (uuid, PK, FK → `auth.users.id`), `nickname`, `avatar_url`, `updated_at`

#### `prompts`

- `id`, `created_at`, `title`, `description`, `prompt_text`, `price`, `image_urls`, `category`, `model`, `tags?`, `is_published`
- (optional) `rating`, `review_count`, `view_count`, `download_count`, `file_url`

#### `carts`

- `user_id`, `prompt_id`, `unique(user_id, prompt_id)`, 수량 필드 없음

#### `wishlists`

- `user_id`, `prompt_id`, `unique(user_id, prompt_id)`

#### `purchases`

- `buyer_id`, `prompt_id`, `payment_order_id` (unique), `unique(buyer_id, prompt_id)` 권장

#### `reviews`

- `buyer_id`, `prompt_id`, `rating`, `content`, `updated_at`, `unique(buyer_id, prompt_id)`

#### `seller_waitlist` (to-be)

- `name`, `email`, `portfolio_url`, `categories`, `message`, `processed`

#### RLS 권장

- `profiles` / `carts` / `wishlists` / `reviews`: 본인만
- `purchases`: 본인 조회, 운영자 전체
- `prompts`: 공개 읽기, 쓰기는 운영자만
- 회원가입 시 `profiles` 자동 생성 트리거

---

## 4. 핵심 로직 구현 노트

### as-is

- **장바구니:** `addToCart`는 중복·기구매 시 `false`. UI에서 토스트 `이미 장바구니에 있습니다` / `이미 구매한 상품입니다`.
- **구매:** 상품당 1회. checkout 시 purchases에 없는 id만 추가 후 cart 제거.
- **찜:** `toggleWishlist`. 로그인 필수.
- **결제:** `setTimeout` 데모. Toss SDK/웹훅/서버 검증 없음.
- **마스킹:** `isPurchased(id)`일 때만 `promptText` 노출(상세).
- **다운로드/리뷰:** 구매 내역 전용. 다운로드는 Blob `.txt`, 리뷰는 Context `saveReview`.
- **인증:** `login(email)` / `signup({ email, nickname })` / `logout()`. 비밀번호·서버 세션 없음.
- **테마:** `setTheme("light" | "dark")`. `html`에 `.dark` 부여. 시스템 테마 미사용.
- **i18n:** `useI18n().t` / `locale`. 상품은 `localizePrompt(prompt, locale)`. 가격·compact 금액은 locale별 포맷.

### to-be

- 서버 carts 합산 → 주문 → 웹훅 승인 → purchases insert + carts 삭제(멱등).
- purchases 기준 본문/파일 공개, 다운로드 서명 URL.
- Supabase Auth + profiles / wishlists / reviews.

---

## 5. as-is / to-be 요약

| 영역 | as-is | to-be |
|------|--------|--------|
| 상품 | 시드 12개 + 고유 이미지 | Supabase `prompts` |
| 인증 | 데모 로그인/회원가입, 기본 로그인 | Supabase Auth |
| 찜 | 인메모리 + `/wishlist` | DB + RLS |
| 장바구니/구매 | 인메모리, 중복·재구매 불가 | DB + RLS |
| 결제 | Toss 시뮬레이션 | 실결제 + 웹훅 |
| 구매 후 | 상세 복사 + 내역 다운로드/리뷰 모달 | 서명 URL + `reviews` |
| 타이포 | 푸른숲체(제목) + Inter(본문) | (유지 가능) |
| 테마 | 라이트/다크 토글 (`next-themes`, `localStorage`) | (유지, 선택) 시스템 테마 |
| 언어 | 한국어/영어 UI + 상품 카피 (`localStorage`) | (선택) 라우트 locale / next-intl |
| 목록 | `/` 한 페이지 | (선택) `/prompts` |
| 관리자/웨이팅/약관 | 없음 | 추가 |
| 영속성 | 테마·언어만 유지. 그 외 새로고침 초기화 | DB + Storage |

---

## 6. 변경 이력 (요약)

| 일자 | 내용 |
|------|------|
| 2026-08 | 프로토타입 초기: 목록·상세·장바구니·결제 시뮬·프로필·구매내역 |
| 2026-08 | 회원가입(`/signup`), 찜(하트·`/wishlist`), 헤더 로그아웃 시 로그인+회원가입 |
| 2026-08 | 장바구니 중복 불가·상품 1회 구매, 구매내역 다운로드·리뷰 |
| 2026-08 | 구매내역 UI: 통계·검색·필터/정렬 드롭다운(화살표)·다운로드/리뷰 모달 |
| 2026-08 | 시드 12개 + 상품별 고유 이미지 |
| 2026-08-14 | 제목 폰트: 유한킴벌리 푸른숲체(`YuhanKimberlyPureunsoop`) |
| 2026-08-14 | 라이트/다크 테마(`next-themes`, `prompt-market-theme`) |
| 2026-08-14 | 한국어/영어 i18n(UI·상품 카피·가격·영수증, `prompt-market-locale`) |

> 기술 상세(SSR/캐시/에러 처리/웹훅 보안 등)는 별도 기술 문서에서 다룬다.
