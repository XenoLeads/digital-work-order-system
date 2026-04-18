import { NextResponse } from "next/server";
import { getAllAssets, createNewAsset } from "@/lib/assets"

const requiredInputs = [
  "tag", "location", "status"
]

export async function GET() {
  const assets = await getAllAssets()
  return NextResponse.json({ success: true, data: assets })
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!requiredInputs.every(input => input in body)) NextResponse.json({ success: false, message: "Missing fields" })
  const { tag, location, status } = body
  const newAsset = await createNewAsset({ tag, location, status })
  return NextResponse.json({ success: true, data: newAsset })
}