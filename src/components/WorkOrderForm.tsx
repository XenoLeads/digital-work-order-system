"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { submitWorkOrder } from "@/actions";
import type { Asset } from "@/types";

type PriorityTag = {
  LOW: string;
  MEDIUM: string;
  HIGH: string;
  DOWNTIME: string;
};

const PRIORITY_TAG_STYLES: PriorityTag = {
  LOW: "bg-green-500/10 text-green-500 border border-green-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
  DOWNTIME: "bg-red-500/10 text-red-500 border border-red-500/20",
};

export default function WorkOrderForm({ assets }: { assets: Asset[] }) {
  const [dropdownValue, setDropdownValue] = useState("LOW");
  const [state, formAction, isPending] = useActionState(submitWorkOrder, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      formRef.current?.reset();
      setTimeout(() => setDropdownValue("LOW"), 0);
    } else if (state?.error) {
      toast.error(state.error as string);
    }
  }, [state]);

  return (
    <div className="text-white h-full w-full flex justify-center items-center">
      <form
        ref={formRef}
        action={formAction}
        className="bg-neutral-800 h-8/10 w-8/10 rounded-sm border flex flex-col justify-stretch p-4 text-xl gap-4"
      >
        <h1 className="text-2xl text-center">Work Order Details</h1>
        <hr />

        <input
          className="border-2 rounded-sm p-2"
          placeholder="Asset Name..."
          type="text"
          name="assetTag"
          id="assetTag"
          list="assetTagOptions"
          required
        />
        <datalist id="assetTagOptions">
          {assets.map(asset => (
            <option key={asset.id} value={asset.assetTag}>
              {asset.id}
            </option>
          ))}
        </datalist>

        <select
          value={dropdownValue}
          onChange={e => setDropdownValue(e.target.value)}
          className={`px-4 py-2 rounded-sm cursor-pointer ${PRIORITY_TAG_STYLES[dropdownValue as keyof PriorityTag]}`}
          name="priority"
          id="priority"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="DOWNTIME">Downtime</option>
        </select>

        <textarea className="w-full h-full border-2 rounded-sm p-2" placeholder="Issue Description..." name="issueDesc" id="issueDesc" required />

        <button type="submit" disabled={isPending} className="bg-neutral-700 py-4 rounded-sm cursor-pointer border disabled:opacity-50">
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>

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
}
