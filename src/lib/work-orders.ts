import { WorkOrderPriority, WorkOrderStatus } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"
import type { WorkOrder } from "@/types"
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_DASHBOARD_URL = process.env.ADMIN_DASHBOARD_URL

const PRIORITY_TEXT_COLORS = {
  LOW: "#57bb8a",
  MEDIUM: "#f5ce62",
  HIGH: "#e9a268",
  DOWNTIME: "#d93526"
}

function getEmailSubject(priority: WorkOrderPriority, assetTag: string) {
  switch (priority) {
    case "LOW": {
      return `[LOW] Routine Maintenance | #${assetTag}`
    }
    case "MEDIUM": {
      return `[MEDIUM] Operational Issue | #${assetTag}`
    }
    case "HIGH": {
      return `[URGENT] Immediate Repair Needed | #${assetTag}`
    }
    case "DOWNTIME": {
      return `[CRITICAL] LINE DOWN | #${assetTag}`
    }
  }
}

export async function getAllWorkOrders() {
  const workOrders = await prisma.workOrder.findMany({
    include: {
      asset: true
    },
    orderBy: {
      priority: "desc",
    }
  },)

  workOrders.sort((a, b) => {
    if (a.status === "RESOLVED" && b.status !== "RESOLVED") return 1
    if (a.status !== "RESOLVED" && b.status === "RESOLVED") return -1
    return 0
  })

  return workOrders
}

export async function submitWorkOrder({ issueDesc, priority, assetId }: WorkOrder) {
  const workOrder = await prisma.workOrder.create({
    data: {
      issueDesc,
      priority,
      assetId
    },
    include: { asset: true }
  })
  if (workOrder.priority === "DOWNTIME") await prisma.asset.update({
    data: { status: "DOWN" },
    where: { id: workOrder.assetId }
  })

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111;">New Work Order Submitted</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Asset Tag:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${workOrder.asset.assetTag}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Location:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${workOrder.asset.location}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Priority:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong style="color: ${PRIORITY_TEXT_COLORS[workOrder.priority]}; font-weight: bold;">
              ${workOrder.priority}
            </strong>
          </td>
        </tr>
      </table>

      <h3 style="margin-top: 30px;">Issue Description:</h3>
      <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #9ca3af; border-radius: 4px;">
        <p style="margin: 0;">${workOrder.issueDesc}</p>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
        <a href="${ADMIN_DASHBOARD_URL}" 
           style="background-color: #1c1c1c; color: #ffffff; border: 2px solid white; border-radius: 16px; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
           View Admin Dashboard
        </a>
      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: 'Work Order Alert <onboarding@resend.dev>',
    to: 'xeno.inquire@gmail.com',
    subject: getEmailSubject(workOrder.priority, workOrder.asset.assetTag),
    html: emailHtml
  });

  if (error) throw error

  return workOrder
}

export async function updateWorkOrder({ id, status }: { id: string, status: string }) {
  const updatedWorkOrder = await prisma.workOrder.update({
    data: {
      status: status as WorkOrderStatus, resolvedAt: status === "RESOLVED" ? new Date().toISOString() : null
    },
    where: { id }
  })
  if (updatedWorkOrder.priority as string === "DOWNTIME") {
    const unresolvedCriticalWorkOrders = await prisma.workOrder.findMany({
      where: { priority: "DOWNTIME", status: { not: "RESOLVED" }, assetId: updatedWorkOrder.assetId }
    })
    await prisma.asset.update({
      data: { status: unresolvedCriticalWorkOrders.length === 0 ? "OPERATIONAL" : "DOWN" }, where: { id: updatedWorkOrder.assetId }
    })
  }

  return updatedWorkOrder
}