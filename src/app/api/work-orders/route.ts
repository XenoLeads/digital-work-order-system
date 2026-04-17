import { NextResponse } from "next/server"
import { getAllWorkOrders, submitWorkOrder } from "@/lib/work-orders"

export async function GET() {
  const workOrders = await getAllWorkOrders()
  return NextResponse.json({ success: true, data: workOrders })
}

export async function POST(request: Request) {
  const body = await request.json()
  const requiredProperties = ["issueDesc", "priority", "assetId"]
  if (!requiredProperties.every(property => property in body)) return NextResponse.json({ success: false, message: "Some fields are missing" })
  const { issueDesc, priority, assetId } = body
  const workOrders = await submitWorkOrder({ issueDesc, priority, assetId })
  return NextResponse.json({ success: true, data: workOrders })
}