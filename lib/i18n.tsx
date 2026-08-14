"use client"

import * as React from "react"

export type Locale = "ko" | "en"

const STORAGE_KEY = "prompt-market-locale"

export const messages = {
  ko: {
    header: {
      login: "로그인",
      signup: "회원가입",
      wishlist: "찜 내역",
      cart: "장바구니",
      profile: "프로필 관리",
      purchases: "구매 내역",
      logout: "로그아웃",
      userMenu: "사용자 메뉴",
      wishlistAria: "찜 내역, {count}개",
      cartAria: "장바구니, {count}개 담김",
      themeLight: "라이트 모드",
      themeDark: "다크 모드",
      language: "언어",
      korean: "한국어",
      english: "English",
    },
    toast: {
      loggedOut: "로그아웃되었습니다",
      loginRequired: "로그인이 필요합니다",
      alreadyPurchased: "이미 구매한 상품입니다",
      alreadyInCart: "이미 장바구니에 있습니다",
      addedToCart: "장바구니에 담았습니다",
      wishlistAdded: "찜 목록에 추가했습니다",
      wishlistRemoved: "찜을 해제했습니다",
      copied: "프롬프트를 복사했습니다",
      loggedIn: "로그인되었습니다",
      signedUp: "회원가입이 완료되었습니다",
      emailRequired: "이메일을 입력해주세요",
      nicknameRequired: "닉네임을 입력해주세요",
      passwordRequired: "비밀번호를 입력해주세요",
      profileSaved: "프로필이 저장되었습니다",
      avatarChanged: "프로필 이미지가 변경되었습니다",
      cartRemoved: "장바구니에서 삭제했습니다",
      downloaded: "프롬프트를 다운로드했습니다",
      reviewSaved: "리뷰를 저장했습니다",
      ratingRequired: "별점을 선택해주세요",
      reviewContentRequired: "리뷰 내용을 입력해주세요",
      receiptsDownloaded: "전체 영수증을 다운로드했습니다",
    },
    home: {
      badge: "검증된 AI 프롬프트 마켓플레이스",
      title: "최신 프롬프트를 만나보세요",
      subtitle:
        "이미지, 일러스트, 브랜딩까지 — 바로 쓸 수 있는 고품질 AI 프롬프트를 둘러보고 장바구니에 담아보세요.",
      allPrompts: "전체 프롬프트",
      count: "{count}개",
    },
    card: {
      purchased: "구매완료",
      details: "상세보기",
      addToCart: "장바구니 담기",
      inCart: "장바구니에 있음",
      wishlistAdd: "찜하기",
      wishlistRemove: "찜 해제",
      imageAlt: "{title} 결과물 예시",
    },
    detail: {
      back: "목록으로",
      description: "상세 설명",
      usage: "활용법",
      caution: "주의사항",
      buyNow: "바로 구매하기",
      lockedTitle: "프롬프트 전문이 잠겨 있어요",
      lockedDesc: "구매 시 프롬프트 전문을 확인하실 수 있습니다.",
      purchased: "구매 완료",
      purchasedThanks: "구매해주셔서 감사합니다. 프롬프트 내용은 다음과 같습니다.",
      copy: "복사",
      viewImage: "이미지 {n} 보기",
    },
    cart: {
      title: "장바구니",
      count: "{count}개의 프롬프트",
      emptyTitle: "장바구니가 비어 있어요",
      emptyDesc: "장바구니에 담긴 상품이 없습니다.",
      continue: "쇼핑 계속하기",
      summary: "결제 요약",
      subtotal: "총 상품 금액",
      due: "결제 예정 금액",
      checkout: "결제하기",
      remove: "장바구니에서 삭제",
    },
    checkout: {
      title: "결제하기",
      desc: "토스페이먼츠로 안전하게 결제를 진행합니다. (데모 시뮬레이션)",
      due: "결제 예정 금액",
      paying: "결제 중...",
      pay: "{amount} 결제하기",
      done: "결제가 완료되었습니다",
      doneDesc: "구매하신 프롬프트는 구매 내역에서 확인할 수 있습니다.",
      viewPurchases: "구매 내역 보기",
      close: "닫기",
    },
    login: {
      title: "다시 오신 걸 환영해요",
      subtitle: "Prompt Market 계정으로 로그인하세요",
      cardTitle: "로그인",
      cardDesc: "데모용 계정 정보가 미리 입력되어 있습니다.",
      email: "이메일",
      password: "비밀번호",
      submit: "로그인",
      noAccount: "계정이 없으신가요?",
      goSignup: "회원가입",
    },
    signup: {
      title: "계정을 만들어 보세요",
      subtitle: "Prompt Market에 가입하고 프롬프트를 만나보세요",
      cardTitle: "회원가입",
      cardDesc: "데모용입니다. 비밀번호는 저장·검증되지 않습니다.",
      nickname: "닉네임",
      nicknamePlaceholder: "프롬프트러버",
      email: "이메일",
      password: "비밀번호",
      submit: "가입하기",
      hasAccount: "이미 계정이 있으신가요?",
      goLogin: "로그인",
    },
    profile: {
      title: "프로필 관리",
      subtitle: "닉네임과 프로필 이미지를 수정하세요.",
      change: "변경",
      changeAria: "프로필 이미지 변경",
      basic: "기본 정보",
      email: "이메일",
      nickname: "닉네임",
      save: "저장",
      cancel: "취소",
      edit: "수정",
    },
    wishlist: {
      title: "찜 내역",
      count: "{count}개의 프롬프트를 찜했어요.",
      emptyTitle: "찜 내역",
      emptyDesc: "아직 찜한 프롬프트가 없습니다.",
      browse: "프롬프트 둘러보기",
      add: "담기",
      added: "담김",
      remove: "찜 해제",
    },
    purchases: {
      title: "구매 내역",
      summary: "총 {count}개 프롬프트 · {amount} 결제",
      downloadAll: "전체 영수증 다운로드",
      statPrompts: "구매한 프롬프트",
      statPaid: "총 결제 금액",
      statOrders: "총 주문 수",
      searchPlaceholder: "프롬프트 제목이나 판매자로 검색...",
      searchAria: "구매 내역 검색",
      status: "상태",
      statusAll: "전체",
      statusReviewed: "리뷰 작성",
      statusUnreviewed: "리뷰 미작성",
      sort: "정렬",
      sortNewest: "최신순",
      sortOldest: "오래된순",
      sortPriceDesc: "가격 높은순",
      sortPriceAsc: "가격 낮은순",
      noMatch: "검색 조건에 맞는 구매 내역이 없습니다.",
      emptyTitle: "구매 내역",
      emptyDesc: "아직 구매한 프롬프트가 없습니다.",
      browse: "프롬프트 둘러보기",
      author: "작성자: {name}",
      boughtOn: "{date} 구매",
      download: "다운로드",
      review: "리뷰",
      reviewEdit: "리뷰 수정",
      downloadTitle: "프롬프트 다운로드",
      downloadDesc: "구매하신 프롬프트 본문을 .txt 파일로 저장합니다.",
      cancel: "취소",
      reviewWrite: "리뷰 작성",
      reviewHint: "구매 경험과 활용 팁을 공유해 주세요.",
      rating: "별점",
      ratingPick: "선택해주세요",
      content: "리뷰 내용",
      contentPlaceholder: "사용 후기나 팁을 적어주세요",
      submit: "리뷰 등록",
      update: "리뷰 수정",
      ratingValue: "{n}점",
    },
    common: {
      loading: "로딩 중",
    },
    category: {
      사진: "사진",
      커머스: "커머스",
      일러스트: "일러스트",
      브랜딩: "브랜딩",
      건축: "건축",
    },
  },
  en: {
    header: {
      login: "Log in",
      signup: "Sign up",
      wishlist: "Wishlist",
      cart: "Cart",
      profile: "Profile",
      purchases: "Purchases",
      logout: "Log out",
      userMenu: "User menu",
      wishlistAria: "Wishlist, {count} items",
      cartAria: "Cart, {count} items",
      themeLight: "Light mode",
      themeDark: "Dark mode",
      language: "Language",
      korean: "한국어",
      english: "English",
    },
    toast: {
      loggedOut: "You have been logged out",
      loginRequired: "Please log in",
      alreadyPurchased: "You already own this prompt",
      alreadyInCart: "Already in your cart",
      addedToCart: "Added to cart",
      wishlistAdded: "Added to wishlist",
      wishlistRemoved: "Removed from wishlist",
      copied: "Prompt copied",
      loggedIn: "Logged in",
      signedUp: "Account created",
      emailRequired: "Please enter your email",
      nicknameRequired: "Please enter a nickname",
      passwordRequired: "Please enter a password",
      profileSaved: "Profile saved",
      avatarChanged: "Profile photo updated",
      cartRemoved: "Removed from cart",
      downloaded: "Prompt downloaded",
      reviewSaved: "Review saved",
      ratingRequired: "Please choose a rating",
      reviewContentRequired: "Please write a review",
      receiptsDownloaded: "Receipts downloaded",
    },
    home: {
      badge: "Curated AI prompt marketplace",
      title: "Discover the latest prompts",
      subtitle:
        "From images and illustration to branding — browse ready-to-use AI prompts and add them to your cart.",
      allPrompts: "All prompts",
      count: "{count}",
    },
    card: {
      purchased: "Purchased",
      details: "Details",
      addToCart: "Add to cart",
      inCart: "In cart",
      wishlistAdd: "Add to wishlist",
      wishlistRemove: "Remove from wishlist",
      imageAlt: "Sample result for {title}",
    },
    detail: {
      back: "Back to list",
      description: "Description",
      usage: "How to use",
      caution: "Notes",
      buyNow: "Buy now",
      lockedTitle: "Full prompt is locked",
      lockedDesc: "Purchase to view the complete prompt.",
      purchased: "Purchased",
      purchasedThanks: "Thanks for your purchase. Here is the prompt:",
      copy: "Copy",
      viewImage: "View image {n}",
    },
    cart: {
      title: "Cart",
      count: "{count} prompts",
      emptyTitle: "Your cart is empty",
      emptyDesc: "You have not added any prompts yet.",
      continue: "Continue shopping",
      summary: "Order summary",
      subtotal: "Subtotal",
      due: "Amount due",
      checkout: "Checkout",
      remove: "Remove from cart",
    },
    checkout: {
      title: "Checkout",
      desc: "Pay securely with Toss Payments. (Demo simulation)",
      due: "Amount due",
      paying: "Processing...",
      pay: "Pay {amount}",
      done: "Payment complete",
      doneDesc: "You can view your prompts in purchase history.",
      viewPurchases: "View purchases",
      close: "Close",
    },
    login: {
      title: "Welcome back",
      subtitle: "Log in to your Prompt Market account",
      cardTitle: "Log in",
      cardDesc: "Demo credentials are pre-filled.",
      email: "Email",
      password: "Password",
      submit: "Log in",
      noAccount: "Don't have an account?",
      goSignup: "Sign up",
    },
    signup: {
      title: "Create an account",
      subtitle: "Join Prompt Market and start exploring prompts",
      cardTitle: "Sign up",
      cardDesc: "This is a demo. Passwords are not stored or validated.",
      nickname: "Nickname",
      nicknamePlaceholder: "PromptLover",
      email: "Email",
      password: "Password",
      submit: "Create account",
      hasAccount: "Already have an account?",
      goLogin: "Log in",
    },
    profile: {
      title: "Profile",
      subtitle: "Update your nickname and photo.",
      change: "Change",
      changeAria: "Change profile photo",
      basic: "Account",
      email: "Email",
      nickname: "Nickname",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
    },
    wishlist: {
      title: "Wishlist",
      count: "{count} saved prompts",
      emptyTitle: "Wishlist",
      emptyDesc: "You have not saved any prompts yet.",
      browse: "Browse prompts",
      add: "Add",
      added: "Added",
      remove: "Remove from wishlist",
    },
    purchases: {
      title: "Purchases",
      summary: "{count} prompts · {amount} paid",
      downloadAll: "Download all receipts",
      statPrompts: "Prompts purchased",
      statPaid: "Total spent",
      statOrders: "Orders",
      searchPlaceholder: "Search by title or seller...",
      searchAria: "Search purchases",
      status: "Status",
      statusAll: "All",
      statusReviewed: "Reviewed",
      statusUnreviewed: "Not reviewed",
      sort: "Sort",
      sortNewest: "Newest",
      sortOldest: "Oldest",
      sortPriceDesc: "Price: high to low",
      sortPriceAsc: "Price: low to high",
      noMatch: "No purchases match your filters.",
      emptyTitle: "Purchases",
      emptyDesc: "You have not purchased any prompts yet.",
      browse: "Browse prompts",
      author: "Author: {name}",
      boughtOn: "Purchased {date}",
      download: "Download",
      review: "Review",
      reviewEdit: "Edit review",
      downloadTitle: "Download prompt",
      downloadDesc: "Save the prompt text as a .txt file.",
      cancel: "Cancel",
      reviewWrite: "Write a review",
      reviewHint: "Share how you used this prompt.",
      rating: "Rating",
      ratingPick: "Choose a rating",
      content: "Review",
      contentPlaceholder: "Write your feedback or tips",
      submit: "Submit review",
      update: "Update review",
      ratingValue: "{n} stars",
    },
    common: {
      loading: "Loading",
    },
    category: {
      사진: "Photo",
      커머스: "Commerce",
      일러스트: "Illustration",
      브랜딩: "Branding",
      건축: "Architecture",
    },
  },
} as const

type Messages = (typeof messages)["ko"]

function getByPath(obj: unknown, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
  return typeof value === "string" ? value : undefined
}

export function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`))
}

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = React.createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("ko")

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "ko" || stored === "en") setLocaleState(stored)
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const t = React.useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const raw = getByPath(messages[locale], key) ?? getByPath(messages.ko, key) ?? key
      return interpolate(raw, vars)
    },
    [locale],
  )

  const value = React.useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = React.useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

export function formatPrice(price: number, locale: Locale = "ko") {
  if (locale === "en") return `₩${price.toLocaleString("en-US")}`
  return `${price.toLocaleString("ko-KR")}원`
}

export function formatCompactWon(amount: number, locale: Locale = "ko") {
  if (locale === "en") {
    if (amount >= 1000) return `₩${Math.round(amount / 1000)}k`
    return formatPrice(amount, locale)
  }
  if (amount >= 10_000) {
    const man = amount / 10_000
    const label = Number.isInteger(man) ? String(man) : man.toFixed(1).replace(/\.0$/, "")
    return `₩${label}만`
  }
  return formatPrice(amount, locale)
}

export type { Messages }
