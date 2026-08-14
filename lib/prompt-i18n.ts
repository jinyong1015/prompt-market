import type { Prompt } from "@/lib/data"
import type { Locale } from "@/lib/i18n"

type PromptCopy = Pick<Prompt, "title" | "shortDescription" | "description" | "usage" | "caution">

const enPrompts: Record<string, PromptCopy> = {
  "cinematic-portrait": {
    title: "Cinematic Portrait Prompt — Golden Hour Mood",
    shortDescription: "Create film-like golden hour portraits",
    description:
      "Generate cinematic stills with warm golden-hour light and shallow depth of field. Film grain and color grading are built in for a professional look.",
    usage: "Use for portrait concepts, social profiles, and brand lookbooks.",
    caution: "For mood/reference only — not a substitute for real photography.",
  },
  "product-mockup": {
    title: "E-commerce Product Mockup — Clean Studio Shot",
    shortDescription: "Minimal product photos on pastel backdrops",
    description:
      "Commercial e-commerce shots of products on soft pastel studio backgrounds with crisp lighting and soft shadows.",
    usage: "Detail-page thumbnails, ads, and brand look-and-feel planning.",
    caution: "Treat as concept comps — real product shape may differ.",
  },
  "fantasy-landscape": {
    title: "Fantasy Concept Art — Floating Isles at Dusk",
    shortDescription: "Epic fantasy world concept art",
    description:
      "Grand fantasy landscapes with floating islands, glowing waterfalls, and purple sunset skies. Great for game and webtoon backgrounds.",
    usage: "Game backgrounds, novel covers, and concept mood boards.",
    caution: "Check the output license before commercial use.",
  },
  "logo-design": {
    title: "Minimal Logo Prompt — Geometric Brand Marks",
    shortDescription: "Modern geometric logo explorations",
    description:
      "Sets of modern minimalist geometric logos on a neutral background. Monochrome vector style for early brand identity exploration.",
    usage: "Logo ideation and branding mood boards.",
    caution: "Final marks usually need vector cleanup.",
  },
  "anime-character": {
    title: "Anime Character Illustration — Dynamic Pose",
    shortDescription: "Vibrant anime-style character art",
    description:
      "Colorful cel-shaded anime characters with dynamic poses. Ideal for original character design.",
    usage: "OC sheets, webtoon characters, and fan art (original only).",
    caution: "Do not recreate existing IP characters.",
  },
  "interior-design": {
    title: "Interior Visualization — Scandinavian Living Room",
    shortDescription: "Warm Scandi living-room interiors",
    description:
      "Nordic living rooms with warm wood, soft daylight, minimal furniture, and plants — suited to architectural viz.",
    usage: "Interior proposals, space mood boards, and staging comps.",
    caution: "Visualization only — not construction drawings.",
  },
  "food-styling": {
    title: "Food Styling Prompt — Cinematic Dessert Shot",
    shortDescription: "Appetizing dessert and food photography",
    description:
      "Cinematic food photos with soft window light and shallow depth of field. Great for cafe menus and social content.",
    usage: "Menu comps, delivery-app thumbnails, and food-brand SNS.",
    caution: "Concept/ad comps — not a replacement for real menu photos.",
  },
  "fashion-lookbook": {
    title: "Fashion Lookbook Prompt — Street Editorial",
    shortDescription: "Urban fashion editorial lookbook shots",
    description:
      "High-fashion lookbook images on city streets with natural posing and editorial lighting.",
    usage: "Brand lookbooks, campaign mood boards, and styling decks.",
    caution: "Do not recreate real models or brand logos without rights.",
  },
  "saas-landing": {
    title: "SaaS Landing UI Mockup — Dashboard Hero",
    shortDescription: "Modern SaaS landing and dashboard mockups",
    description:
      "Clean SaaS landing-page and dashboard UI mockups with card layouts and professional typography.",
    usage: "Landing comps, pitch decks, and product marketing.",
    caution: "Visual mockups only — on-screen text may be placeholder.",
  },
  "youtube-thumbnail": {
    title: "YouTube Thumbnail Prompt — High-Click Layout",
    shortDescription: "High-contrast YouTube thumbnail compositions",
    description:
      "Bold, high-contrast thumbnail layouts with space for large text. Fast A/B tests for click-through.",
    usage: "YouTube and short-form thumbnail comps.",
    caution: "Avoid using real celebrity likenesses.",
  },
  "watercolor-poster": {
    title: "Watercolor Poster Prompt — Soft Illustrated Poster",
    shortDescription: "Gentle watercolor-style posters",
    description:
      "Watercolor posters with pigment bleed and generous negative space. Fits events, cafe art, and seasonal campaigns.",
    usage: "Event posters, cafe art, and seasonal visuals.",
    caution: "Check resolution and color for print.",
  },
  "cafe-exterior": {
    title: "Cafe Exterior Visualization — Alley Brunch Cafe",
    shortDescription: "Cozy alley cafe storefronts",
    description:
      "Brick-and-wood brunch cafe exteriors on a quiet alley with warm afternoon light.",
    usage: "Exterior concepts, space branding, and launch decks.",
    caution: "Concept viz only — not permit or construction drawings.",
  },
}

export function localizePrompt(prompt: Prompt, locale: Locale): Prompt {
  if (locale !== "en") return prompt
  const copy = enPrompts[prompt.id]
  if (!copy) return prompt
  return { ...prompt, ...copy }
}
