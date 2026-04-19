import { NextResponse } from "next/server"
import { getAllWorkOrders, submitWorkOrder, updateWorkOrder } from "@/lib/work-orders"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
  }

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

export async function PUT(request: Request) {
  const { id, status } = await request.json()
  const updatedWorkOrder = await updateWorkOrder({ id, status })
  console.log(updatedWorkOrder)
  return NextResponse.json({ success: true, data: updatedWorkOrder })
}