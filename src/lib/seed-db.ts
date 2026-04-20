"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

async function main() {
  const adminPassword = await bcrypt.hash("john@pass", 10)
  const userPassword = await bcrypt.hash("bob@pass", 10)
  const admin = await prisma.user.createMany({
    data: [{
      email: "user@admin.com",
      name: "john",
      password: adminPassword,
    }, {
      email: "user@user.com",
      name: "bob",
      password: userPassword,
      role: "USER"
    }]
  })

  console.log({ admin })
  const assetAndWorkOrder1 = await prisma.asset.create({
    data: {
      assetTag: "SRV-NY-001",
      location: "Data Center A - Rack 4",
      status: "DOWN",
      workOrders: {
        create: [
          {
            issueDesc: 'Overheating detected in primary power supply unit.',
            priority: 'DOWNTIME',
          },
        ]
      }
    }
  })
  const assetAndWorkOrder2 = await prisma.asset.create({
    data: {
      assetTag: "HVAC-FL2-04",
      location: "Second Floor - North Wing",
      workOrders: {
        create: [
          {
            issueDesc: 'Strange grinding noise reported during startup cycle.',
            priority: 'MEDIUM',
          },
        ]
      }
    }
  })
  const assetAndWorkOrder3 = await prisma.asset.create({
    data: {
      assetTag: "CNC-LATHE-09",
      location: "Main Workshop - Bay 3",
      workOrders: {
        create: [
          {
            issueDesc: 'External safety shield glass is cracked; needs replacement.',
            priority: 'LOW',
          },
        ]
      }
    }
  })
  console.log({ assetAndWorkOrder1, assetAndWorkOrder2, assetAndWorkOrder3 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
