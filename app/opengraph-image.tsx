import { ImageResponse } from "next/og"

import { SITE_NAME } from "@/lib/seo/config"

export const alt = `${SITE_NAME} — AI 프롬프트 마켓플레이스`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(145deg, #1c1628 0%, #2a1f45 45%, #6d4aec 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 1,
            opacity: 0.9,
          }}
        >
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            검증된 AI 프롬프트를 한곳에서
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.4,
              opacity: 0.85,
              maxWidth: 820,
            }}
          >
            이미지 · 일러스트 · 브랜딩 프롬프트 마켓플레이스
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
