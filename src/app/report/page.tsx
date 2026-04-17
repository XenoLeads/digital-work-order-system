"use client";

import { useState, useEffect } from "react";
import type { Asset as AssetType, WorkOrderPriority as WorkOrderPriorityType } from "@/types";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL;

const Page = () => {
  const [assetTag, setAssetTag] = useState("");
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [workOrderPriority, setWorkOrderPriority] = useState<WorkOrderPriorityType>("LOW");
  const [workOrderIssueDesc, setWorkOrderIssueDesc] = useState("");

  useEffect(() => {
    async function fetchAndSetAssets() {
      const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_URL;
      const response = await fetch(`${API_ENDPOINT}/assets`);
      const json = await response.json();
      if (json.success) setAssets(json.data);
    }

    fetchAndSetAssets();
  }, []);

  async function handleWorkOrderSubmission() {
    const assetId = assets.find(asset => asset.assetTag === assetTag)?.id;
    if (!assetId) return;
    const response = await fetch(`${BACKEND_URL}/work-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId, priority: workOrderPriority, issueDesc: workOrderIssueDesc }),
    });
    const json = await response.json();
    if (json.success) clearInputs();
    console.log(json);
  }

  function clearInputs() {
    setWorkOrderPriority("LOW");
    setWorkOrderIssueDesc("");
    setAssetTag("");
  }

  return (
    <div className="text-white h-full w-full flex justify-center items-center">
      <div className="bg-neutral-800 h-8/10 w-8/10 rounded-sm border flex flex-col justify-stretch p-4 text-xl gap-4">
        <h1 className="text-2xl text-center">Work Order Details</h1>
        <hr />
        <input
          className="border-2 rounded-sm p-2"
          placeholder="Asset Name..."
          type="text"
          value={assetTag}
          onChange={e => setAssetTag(e.target.value)}
          name="query"
          id="query"
          list="query-options"
        />
        <datalist id="query-options">
          {assets.map(asset => (
            <option key={asset.id} value={asset.assetTag}>
              {asset.id}
            </option>
          ))}
        </datalist>
        <select
          className="bg-neutral-800 border-2 rounded-sm p-2"
          name="priority"
          id="priority"
          value={workOrderPriority}
          onChange={e => setWorkOrderPriority(e.target.value as WorkOrderPriorityType)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="DOWNTIME">Downtime</option>
        </select>
        <textarea
          className="w-full border-2 rounded-sm p-2"
          placeholder="Issue Description..."
          name="issueDesc"
          id="issueDesc"
          value={workOrderIssueDesc}
          onChange={e => setWorkOrderIssueDesc(e.target.value)}
        />
        <button className="bg-neutral-700 py-4 rounded-sm cursor-pointer border" onClick={handleWorkOrderSubmission}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Page;
