import "server-only"

import crypto from "node:crypto"

const CHECKOUT_TOKEN_TTL_MS = 1000 * 60 * 30

type CheckoutTokenPayload = {
  userId: string
  promptIds: string[]
  amount: number
  orderId: string
  issuedAt: number
}

function encodePayload(payload: CheckoutTokenPayload) {
  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url")
}

function signPayload(encodedPayload: string) {
  return crypto
    .createHmac("sha256", getTossSecretKey())
    .update(encodedPayload)
    .digest("base64url")
}

export function getTossClientKey() {
  const key = process.env["NEXT_PUBLIC_TOSS_CLIENT_KEY"]
  if (!key) throw new Error("Missing NEXT_PUBLIC_TOSS_CLIENT_KEY")
  return key
}

export function getTossSecretKey() {
  const key = process.env["TOSS_SECRET_KEY"]
  if (!key) throw new Error("Missing TOSS_SECRET_KEY")
  return key
}

export function createOrderId() {
  return `order_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`
}

export function createCheckoutToken(payload: CheckoutTokenPayload) {
  const encoded = encodePayload(payload)
  const signature = signPayload(encoded)
  return `${encoded}.${signature}`
}

export function verifyCheckoutToken(token: string): CheckoutTokenPayload | null {
  const [encoded, signature] = token.split(".")
  if (!encoded || !signature) return null

  const expected = signPayload(encoded)
  if (signature !== expected) return null

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as CheckoutTokenPayload
  if (!payload.userId || !Array.isArray(payload.promptIds) || !payload.orderId) return null
  if (Date.now() - payload.issuedAt > CHECKOUT_TOKEN_TTL_MS) return null

  return payload
}
