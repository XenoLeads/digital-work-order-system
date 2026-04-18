import { prisma } from "@/lib/prisma"
import { AssetStatus } from "@/types"

export async function getAllAssets() {
  const assets = await prisma.asset.findMany()
  return assets
}

export async function createNewAsset({ tag, location, status }: {
  tag: string,
  location: string,
  status: AssetStatus
}) {
  const asset = await prisma.asset.create({
    data: { assetTag: tag, location, status }
  })
  return asset
}