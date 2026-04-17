import { NextResponse } from "next/server"
import { getAllWorkOrders } from "@/lib/work-orders"

export async function GET() {
  const workOrders = await getAllWorkOrders()
  return NextResponse.json({ success: true, data: workOrders })
}