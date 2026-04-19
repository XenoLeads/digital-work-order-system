"use client";

import { useActionState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { submitWorkOrder } from "@/actions";
import type { Asset } from "@/types";

export default function WorkOrderForm({ assets }: { assets: Asset[] }) {
  const [state, formAction, isPending] = useActionState(submitWorkOrder, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      formRef.current?.reset();
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

        <select className="bg-neutral-800 border-2 rounded-sm p-2" name="priority" id="priority" defaultValue="LOW">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="DOWNTIME">Downtime</option>
        </select>

        <textarea className="w-full border-2 rounded-sm p-2" placeholder="Issue Description..." name="issueDesc" id="issueDesc" required />

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
