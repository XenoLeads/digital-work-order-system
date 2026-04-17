import { prisma } from "@/lib/prisma"

export async function getAllWorkOrders() {
  const workOrders = await prisma.workOrder.findMany()
  return workOrders
}