import { prisma } from "@/lib/prisma"
import type { WorkOrder } from "@/types"

export async function getAllWorkOrders() {
  const workOrders = await prisma.workOrder.findMany()
  return workOrders
}
export async function submitWorkOrder({ issueDesc, priority, assetId }: WorkOrder) {
  const workOrder = await prisma.workOrder.create({
    data: {
      issueDesc,
      priority,
      assetId
    }
  })
  return workOrder
}