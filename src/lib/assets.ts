import { prisma } from "@/lib/prisma"
import { AssetStatus } from "@/types"

export async function getAllAssets() {
  const assets = await prisma.asset.findMany({
    where: {
      isActive: true
    }
  })
  return assets
}

export async function createNewAsset({ tag, location, status }: {
  tag: string,
  location: string,
  status: AssetStatus
}) {
  let asset;
  const savedAsset = await prisma.asset.findUnique({
    where: { assetTag: tag }
  })

  if (savedAsset === null) {
    asset = await prisma.asset.create({
      data: { assetTag: tag, location, status }
    })
  } else asset = await prisma.asset.update({
    data: { isActive: true, location },
    where: { id: savedAsset.id }
  })

  return asset
}

export async function deactivateAsset(id: string) {
  const asset = await prisma.asset.update({
    data: { isActive: false },
    where: { id }
  })

  return asset
}