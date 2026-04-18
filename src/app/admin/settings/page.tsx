"use client";

import { useState } from "react";
import { AssetStatus } from "@/types";
import toast, { Toaster } from "react-hot-toast";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL;

const Page = () => {
  const [assetTag, setAssetTag] = useState("");
  const [assetLocation, setAssetLocation] = useState("");
  const [assetStatus, setAssetStatus] = useState<AssetStatus>("OPERATIONAL");

  function createNewAsset() {
    const response = fetch(`${BACKEND_URL}/assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: assetTag, location: assetLocation, status: assetStatus }),
    }).then(async response => {
      const json = await response.json();
      if (!json.success) throw new Error(json.message);
      console.log(json);
    });
    toast.promise(response, {
      loading: "Creating...",
      success: `Created a new asset:\n${assetTag}.`,
      error: "Failed to create new asset.",
    });
    resetInputs();
  }

  function resetInputs() {
    setAssetTag("");
    setAssetLocation("");
    setAssetStatus("OPERATIONAL");
  }

  return (
    <div className="p-4">
      <div className="bg-neutral-800 w-full rounded-sm p-4">
        <h1 className="text-xl">Add Asset</h1>
        <hr />
        <div className="flex flex-col mt-4 gap-4">
          <input
            className="border-2 rounded-sm p-2"
            type="text"
            placeholder="Asset Tag"
            value={assetTag}
            onChange={e => setAssetTag(e.target.value)}
          />
          <input
            className="border-2 rounded-sm p-2"
            type="text"
            placeholder="Location"
            value={assetLocation}
            onChange={e => setAssetLocation(e.target.value)}
          />
          <select
            className="border-2 rounded-sm p-2 bg-neutral-800"
            value={assetStatus}
            onChange={e => setAssetStatus(e.target.value as AssetStatus)}
          >
            <option value="OPERATIONAL">Operational</option>
            <option value="DOWN">Down</option>
          </select>
          <button className="bg-neutral-700 rounded-sm py-2 cursor-pointer" onClick={createNewAsset}>
            Add
          </button>
        </div>
      </div>
      <Toaster
        toastOptions={{
          style: {
            background: "#1c1c1c",
            color: "#fff",
            border: "2px solid white",
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
    </div>
  );
};

export default Page;
