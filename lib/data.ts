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
    images: ["/prompts/cinematic-portrait.png"],
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
    images: ["/prompts/product-mockup.png"],
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
    images: ["/prompts/fantasy-landscape.png"],
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
    images: ["/prompts/logo-design.png"],
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
    images: ["/prompts/anime-character.png"],
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
    images: ["/prompts/interior-design.png"],
  },
  {
    id: "food-styling",
    title: "푸드 스타일링 프롬프트 — 시네마틱 디저트 컷",
    price: 5500,
    category: "사진",
    model: "Midjourney v6",
    shortDescription: "매력적인 디저트·음식 사진을 생성",
    description:
      "소프트 라이팅과 얕은 심도로 식욕을 자극하는 시네마틱 푸드 사진을 생성합니다. 카페 메뉴판, 배달앱 썸네일, SNS 콘텐츠용 비주얼을 빠르게 만들 수 있습니다.",
    usage: "카페 메뉴 시안, 배달앱 썸네일, 푸드 브랜드 SNS 콘텐츠에 활용하세요.",
    caution: "실제 메뉴 사진 대체가 아닌 컨셉/광고 시안용으로 사용하세요.",
    promptText:
      "cinematic food photography of {dessert}, soft natural window light, shallow depth of field, elegant plating, warm tones, appetizing, commercial food styling, ultra detailed --ar 4:5 --style raw",
    images: [
      "/prompts/food-styling.png",
    ],
  },
  {
    id: "fashion-lookbook",
    title: "패션 룩북 프롬프트 — 스트릿 에디토리얼",
    price: 9000,
    category: "사진",
    model: "Flux Pro",
    shortDescription: "도시 배경의 패션 에디토리얼 컷을 생성",
    description:
      "도시 스트릿을 배경으로 한 하이엔드 패션 룩북 이미지를 생성합니다. 자연스러운 포즈와 에디토리얼 라이팅으로 브랜드 룩북·광고 무드보드에 적합합니다.",
    usage: "패션 브랜드 룩북, 캠페인 무드보드, 스타일링 제안서에 활용하세요.",
    caution: "실존 모델·브랜드 로고를 무단으로 재현하지 마세요.",
    promptText:
      "high fashion editorial lookbook of {outfit}, urban street background, natural posing, soft daylight, magazine cover quality, full body, stylish composition --ar 3:4",
    images: [
      "/prompts/fashion-lookbook.png",
    ],
  },
  {
    id: "saas-landing",
    title: "SaaS 랜딩 UI 목업 프롬프트 — 대시보드 히어로",
    price: 8500,
    category: "브랜딩",
    model: "DALL·E 3",
    shortDescription: "모던 SaaS 랜딩·대시보드 목업을 생성",
    description:
      "깔끔한 타이포와 카드형 레이아웃이 돋보이는 SaaS 제품 랜딩 페이지·대시보드 UI 목업을 생성합니다. 스타트업 피치덱과 프로덕트 시안 작업에 바로 쓸 수 있습니다.",
    usage: "랜딩 시안, 피치덱, 프로덕트 마케팅 소재에 사용하세요.",
    caution: "실제 UI 코드가 아닌 비주얼 목업입니다. 텍스트는 샘플일 수 있습니다.",
    promptText:
      "modern SaaS landing page UI mockup for {product}, clean dashboard hero, soft gradients, card layout, professional typography, light theme, high fidelity web design --ar 16:9",
    images: [
      "/prompts/saas-landing.png",
    ],
  },
  {
    id: "youtube-thumbnail",
    title: "유튜브 썸네일 프롬프트 — 클릭을 부르는 구성",
    price: 4500,
    category: "커머스",
    model: "Flux Pro",
    shortDescription: "시선 강탈형 유튜브 썸네일을 생성",
    description:
      "고대비 색감, 큰 표정, 굵은 텍스트 영역이 강조된 유튜브 썸네일 스타일 이미지를 생성합니다. 클릭률을 높이는 구도와 색 조합을 빠르게 테스트할 수 있습니다.",
    usage: "유튜브·숏폼 썸네일 시안, 콘텐츠 브랜딩에 활용하세요.",
    caution: "실제 인물·유명인의 초상권을 침해하지 않도록 주의하세요.",
    promptText:
      "eye-catching YouTube thumbnail of {topic}, high contrast colors, expressive face, bold composition, space for large text, dramatic lighting, clickbait style but clean --ar 16:9",
    images: [
      "/prompts/youtube-thumbnail.png",
    ],
  },
  {
    id: "watercolor-poster",
    title: "수채화 포스터 프롬프트 — 감성 일러스트 포스터",
    price: 6000,
    category: "일러스트",
    model: "Midjourney v6",
    shortDescription: "부드러운 수채화 감성 포스터를 생성",
    description:
      "물감 번짐과 여백이 아름다운 수채화 스타일 포스터 일러스트를 생성합니다. 전시 포스터, 카페 벽면 아트, 시즌 이벤트 비주얼에 잘 어울립니다.",
    usage: "이벤트 포스터, 카페 아트, 시즌 캠페인 비주얼에 활용하세요.",
    caution: "인쇄용으로 쓸 경우 해상도와 색상 보정을 별도로 확인하세요.",
    promptText:
      "watercolor poster illustration of {theme}, soft pigment bleed, elegant negative space, pastel palette, artistic poster design, hand-painted feel, high detail --ar 2:3",
    images: [
      "/prompts/watercolor-poster.png",
    ],
  },
  {
    id: "cafe-exterior",
    title: "카페 외관 시각화 프롬프트 — 골목 브런치 카페",
    price: 7000,
    category: "건축",
    model: "Midjourney v6",
    shortDescription: "아늑한 골목 카페 외관을 생성",
    description:
      "벽돌과 나무 간판이 어우러진 골목길 브런치 카페 외관 시각화를 생성합니다. 인테리어·외장 컨셉 제안과 브랜드 공간 무드보드에 적합합니다.",
    usage: "카페 외장 컨셉, 공간 브랜딩 무드보드, 창업 제안서에 활용하세요.",
    caution: "실제 건축 허가·시공 도면이 아닌 컨셉 시각화입니다.",
    promptText:
      "cozy brunch cafe exterior on a quiet alley, brick facade, wooden signage, warm afternoon light, plants by the entrance, architectural visualization, photorealistic --ar 16:9",
    images: [
      "/prompts/cafe-exterior.png",
    ],
  },
]

export function getPrompt(id: string) {
  return prompts.find((p) => p.id === id)
}

export function formatPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`
}
