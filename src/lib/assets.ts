import { prisma } from "@/lib/prisma"

export async function getAllAssets() {
  const assets = await prisma.asset.findMany()
  return assets
}