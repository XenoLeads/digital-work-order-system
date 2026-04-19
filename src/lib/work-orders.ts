import { WorkOrderStatus } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"
import type { WorkOrder } from "@/types"

export async function getAllWorkOrders() {
  const workOrders = await prisma.workOrder.findMany({
    include: {
      asset: true
    }
  })
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
  if (workOrder.priority === "DOWNTIME") await prisma.asset.update({
    data: { status: "DOWN" },
    where: { id: workOrder.assetId }
  })
  return workOrder
}

export async function updateWorkOrder({ id, status }: { id: string, status: string }) {
  let updatedWorkOrder;
  if (status === "RESOLVED") {
    updatedWorkOrder = await prisma.workOrder.update({
      data: {
        status: status as WorkOrderStatus, resolvedAt: new Date().toISOString(), asset: {
          update: {
            status: "OPERATIONAL"
          }
        }
      },
      where: { id: id }
    })
  } else {
    updatedWorkOrder = await prisma.workOrder.update({
      data: { status: status as WorkOrderStatus },
      where: { id: id }
    })
  }

  return updatedWorkOrder
}