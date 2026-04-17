"use client";

import { useState, useEffect } from "react";
import type { Asset } from "@/types";

const Page = () => {
  const [query, setQuery] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);

  // Todo:
  // 1. Capture the inputs
  // 2. Send a post request to add a new work order

  useEffect(() => {
    async function fetchAndSetAssets() {
      const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_URL;
      const response = await fetch(`${API_ENDPOINT}/assets`);
      const json = await response.json();
      if (json.success) setAssets(json.data);
    }

    fetchAndSetAssets();
  }, []);

  return (
    <div className="text-white h-full w-full flex justify-center items-center">
      <div className="bg-neutral-800 h-8/10 w-8/10 rounded-sm border flex flex-col justify-stretch p-4 text-xl gap-4">
        <h1 className="text-2xl text-center">Work Order Details</h1>
        <hr />
        <input
          className="border-2 rounded-sm p-2"
          placeholder="Asset Name..."
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
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
        <select className="bg-neutral-800 border-2 rounded-sm p-2" name="priority" id="priority">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="DOWNTIME">Downtime</option>
        </select>
        <textarea className="w-full border-2 rounded-sm p-2" placeholder="Issue Description..." name="issueDesc" id="issueDesc"></textarea>
        <button className="bg-neutral-700 py-4 rounded-sm cursor-pointer border">Submit</button>
      </div>
    </div>
  );
};

export default Page;
