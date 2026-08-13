export type Prompt = {
  id: string
  title: string
  price: number
  category: string
  model: string
  shortDescription: string
  description: string
  usage: string
  caution: string
  promptText: string
  images: string[]
}

export const prompts: Prompt[] = [
  {
    id: "cinematic-portrait",
    title: "시네마틱 인물 사진 프롬프트 — 골든아워 감성 포트레이트",
    price: 5000,
    category: "사진",
    model: "Midjourney v6",
    shortDescription: "영화 같은 골든아워 인물 사진을 만드는 프롬프트",
    description:
      "골든아워의 따뜻한 빛과 얕은 심도로 영화 스틸컷 같은 인물 사진을 생성합니다. 필름 그레인과 시네마틱 컬러 그레이딩이 자동으로 적용되어, 전문 사진작가의 결과물 같은 분위기를 손쉽게 재현할 수 있습니다.",
    usage: "인물 촬영 컨셉 기획, SNS 프로필, 브랜드 화보 무드보드 제작에 활용하세요.",
    caution: "실제 인물 사진 대체용이 아닌 컨셉/무드 참고용으로 사용하세요.",
    promptText:
      "cinematic portrait of {subject}, golden hour lighting, shallow depth of field, 85mm lens, film grain, warm color grading, moody atmosphere, professional photography, ultra detailed --ar 4:5 --style raw",
    images: [
      "/prompts/cinematic-portrait.png",
      "/prompts/cinematic-portrait-2.png",
      "/prompts/cinematic-portrait-3.png",
    ],
  },
  {
    id: "product-mockup",
    title: "이커머스 제품 목업 프롬프트 — 깔끔한 스튜디오 컷",
    price: 7000,
    category: "커머스",
    model: "DALL·E 3",
    shortDescription: "파스텔 배경의 미니멀 제품 사진을 생성",
    description:
      "부드러운 파스텔 스튜디오 배경 위에 제품을 올린 상업용 이커머스 사진을 생성합니다. 밝고 선명한 라이팅과 소프트 섀도우로 브랜드 상세페이지에 바로 활용 가능한 퀄리티를 제공합니다.",
    usage: "상세페이지 썸네일, 광고 소재, 브랜드 룩앤필 기획에 사용하세요.",
    caution: "실제 제품 형태와 다를 수 있으니 컨셉 시안 용도로 사용하세요.",
    promptText:
      "clean minimalist product photography of {product}, pastel studio background, soft shadows, bright crisp lighting, commercial e-commerce style, centered composition, high resolution --ar 1:1",
    images: [
      "/prompts/product-mockup.png",
      "/prompts/product-mockup-2.png",
      "/prompts/product-mockup-3.png",
    ],
  },
  {
    id: "fantasy-landscape",
    title: "판타지 배경 컨셉아트 프롬프트 — 떠 있는 섬과 노을",
    price: 6000,
    category: "일러스트",
    model: "Midjourney v6",
    shortDescription: "웅장한 판타지 세계 컨셉아트를 생성",
    description:
      "떠 있는 섬, 빛나는 폭포, 보랏빛 노을이 어우러진 웅장한 판타지 풍경을 생성합니다. 게임/웹툰 배경 컨셉아트로 활용하기 좋은 디테일과 색감을 담고 있습니다.",
    usage: "게임 배경, 웹소설 표지, 콘셉트 무드보드 제작에 활용하세요.",
    caution: "상업적 사용 시 결과물의 저작권 정책을 확인하세요.",
    promptText:
      "epic fantasy landscape, floating islands, glowing waterfalls, purple sunset sky, digital painting, concept art, highly detailed, vibrant colors, dramatic lighting --ar 16:9",
    images: [
      "/prompts/fantasy-landscape.png",
      "/prompts/fantasy-landscape-2.png",
      "/prompts/fantasy-landscape-3.png",
    ],
  },
  {
    id: "logo-design",
    title: "미니멀 로고 디자인 프롬프트 — 기하학 브랜드 마크",
    price: 8000,
    category: "브랜딩",
    model: "DALL·E 3",
    shortDescription: "모던한 기하학 로고 시안을 생성",
    description:
      "중립적인 배경 위에 모던 미니멀 기하학 로고 시안 세트를 생성합니다. 모노크롬 벡터 스타일로 브랜드 아이덴티티 초기 시안을 빠르게 탐색할 수 있습니다.",
    usage: "브랜드 로고 초기 아이디에이션, 무드보드 구성에 사용하세요.",
    caution: "최종 로고는 벡터 리터치가 필요할 수 있습니다.",
    promptText:
      "set of modern minimalist geometric logo designs for {brand}, monochrome, clean vector style, neutral background, professional branding, symmetric marks --ar 3:2",
    images: [
      "/prompts/logo-design.png",
      "/prompts/logo-design-2.png",
      "/prompts/logo-design-3.png",
    ],
  },
  {
    id: "anime-character",
    title: "애니메이션 캐릭터 일러스트 프롬프트 — 다이내믹 포즈",
    price: 6500,
    category: "일러스트",
    model: "Niji Journey",
    shortDescription: "생동감 있는 애니 캐릭터 일러스트를 생성",
    description:
      "화려한 색감과 셀 쉐이딩이 돋보이는 애니메이션 스타일 캐릭터 일러스트를 생성합니다. 다이내믹한 포즈와 디테일한 표현으로 오리지널 캐릭터 디자인에 적합합니다.",
    usage: "오리지널 캐릭터 디자인, 웹툰 캐릭터 시트, 팬아트에 활용하세요.",
    caution: "기존 IP 캐릭터를 그대로 재현하지 않도록 주의하세요.",
    promptText:
      "vibrant anime-style character illustration of {character}, colorful hair, detailed cel-shading, dynamic pose, japanese animation style, clean lineart, studio quality --ar 2:3 --niji 6",
    images: [
      "/prompts/anime-character.png",
      "/prompts/anime-character-2.png",
      "/prompts/anime-character-3.png",
    ],
  },
  {
    id: "interior-design",
    title: "인테리어 시각화 프롬프트 — 북유럽 스칸디 거실",
    price: 7500,
    category: "건축",
    model: "Midjourney v6",
    shortDescription: "따뜻한 스칸디나비아 인테리어를 생성",
    description:
      "따뜻한 우드톤과 부드러운 자연광이 어우러진 북유럽 스타일 거실 인테리어를 생성합니다. 미니멀한 가구와 식물 배치로 건축 시각화 및 인테리어 제안에 적합합니다.",
    usage: "인테리어 제안, 공간 무드보드, 부동산 스테이징 시안에 활용하세요.",
    caution: "실제 시공 도면이 아닌 시각화 참고용입니다.",
    promptText:
      "modern scandinavian living room interior, warm wood tones, soft natural light, minimalist furniture, plants, architectural visualization, cozy atmosphere, photorealistic --ar 16:9",
    images: [
      "/prompts/interior-design.png",
      "/prompts/interior-design-2.png",
      "/prompts/interior-design-3.png",
    ],
  },
]

export function getPrompt(id: string) {
  return prompts.find((p) => p.id === id)
}

export function formatPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`
}
