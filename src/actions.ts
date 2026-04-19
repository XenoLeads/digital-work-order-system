'use server';

import type { Asset } from "@/types";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL;

export async function submitWorkOrder(prevState: unknown, formData: FormData) {
  const assetTag = formData.get("assetTag")
  const priority = formData.get("priority")
  const issueDesc = formData.get("issueDesc")

  console.log(assetTag,
    priority,
    issueDesc)
  if (!assetTag || !priority || !issueDesc) {
    return { error: 'Missing fields.' };
  }

  try {
    const assetsResponse = await fetch(`${BACKEND_URL}/assets`);
    const assetsJson = await assetsResponse.json();
    const storedAsset = assetsJson.data.find((asset: Asset) => asset.assetTag === assetTag)
    console.log(storedAsset)
    if (!storedAsset) return { error: "Couldn't find asset" }

    fetch(`${BACKEND_URL}/work-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId: storedAsset.id, priority, issueDesc }),
    }).then(async response => {
      const json = await response.json();
      if (!json.success) return { error: "Couldn't post the work order" };
      console.log(json);
    });

    return { success: 'Work Order Submitted!' };
  } catch (error) {
    return { error: error };
  }
}