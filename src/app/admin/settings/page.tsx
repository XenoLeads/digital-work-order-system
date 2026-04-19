"use client";

import { useState, useEffect } from "react";
import { Asset, AssetStatus } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import Table, { ColumnDef } from "@/app/admin/components/Table";

type StatusTag = {
  OPERATIONAL: string;
  DOWN: string;
};

const STATUS_TAG_STYLES: StatusTag = {
  OPERATIONAL: "bg-green-500/10 text-green-500 border border-green-500/20",
  DOWN: "bg-red-500/10 text-red-500 border border-red-500/20",
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL;

function capitalizeString(string: string) {
  return string
    .split("_")
    .map(str => str[0] + str.slice(1).toLowerCase())
    .join(" ");
}

const Page = () => {
  const [assetTag, setAssetTag] = useState("");
  const [assetLocation, setAssetLocation] = useState("");
  const [assetStatus, setAssetStatus] = useState<AssetStatus>("OPERATIONAL");
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    async function getAndSetAssets() {
      const response = await fetch(`${BACKEND_URL}/assets`);
      const json = await response.json();
      if (json.success) setAssets(json.data);
    }
    getAndSetAssets();
  }, []);

  function createNewAsset() {
    const response = fetch(`${BACKEND_URL}/assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: assetTag, location: assetLocation, status: assetStatus }),
    }).then(async response => {
      const json = await response.json();
      if (!json.success) throw new Error(json.message);
      setAssets(prev => [...prev, json.data]);
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

  function deleteAsset(id: string, tag: string) {
    const confirmation = confirm(`Are you sure?\nThe following asset will be deleted:\n${tag}`);
    if (!confirmation) return;
    const responsePromise = fetch(`${BACKEND_URL}/assets/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(async response => {
      const json = await response.json();
      if (!json.success) throw new Error(json.message);
      setAssets(prev => prev.filter(asset => asset.id !== json.data.id));
      console.log(json);
    });
    toast.promise(responsePromise, {
      loading: "Deleting...",
      success: `Asset Deleted:\n${tag}.`,
      error: "Failed to delete the asset.",
    });
  }

  const columns: ColumnDef<Asset>[] = [
    { header: "Tag", key: "assetTag" },
    { header: "Location", key: "location" },
    {
      header: "Status",
      render: row => <div className={`text-center rounded-sm py-2 ${STATUS_TAG_STYLES[row.status!]}`}>{capitalizeString(row.status as string)}</div>,
    },
    {
      header: "Action",
      render: row => (
        <button
          onClick={() => deleteAsset(row.id as string, row.assetTag)}
          className="bg-red-800 hover:bg-red-900 px-4 py-2 rounded-sm cursor-pointer"
        >
          Remove
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="p-4 h-max">
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
      <div className="p-4">
        <Table columns={columns} data={assets} />
      </div>
    </div>
  );
};

export default Page;
