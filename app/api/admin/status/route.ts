import { isAdmin } from "@/lib/admin"

export async function GET() {
  return Response.json({ isAdmin: await isAdmin() })
}
