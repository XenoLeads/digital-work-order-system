import { NextResponse } from "next/server";
import { getAllAssets } from "@/lib/assets"

export async function GET() {
  const assets = await getAllAssets()
  return NextResponse.json({ success: true, data: assets })
}