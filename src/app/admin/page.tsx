"use client";

import toast, { Toaster } from "react-hot-toast";
import MetricCard from "./components/MetricCard";
import { useState, useEffect } from "react";
import type { WorkOrder } from "@/types";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL;

const WORK_ORDER_PRIORITY = {
  LOW: 4,
  MEDIUM: 3,
  HIGH: 2,
  DOWNTIME: 1,
} as const;

function normalizeWorkOrderStatusString(string: string) {
  return string
    .split("_")
    .map(str => str[0] + str.slice(1).toLowerCase())
    .join(" ");
}

function formatWorkOrders(workOrders: WorkOrder[]) {
  let totalPending: number = 0;
  let totalCritialDowntime: number = 0;
  let totalResolvedToday: number = 0;

  workOrders.forEach(workOrder => {
    if (workOrder.status === "PENDING") totalPending++;
    if (workOrder.priority === "DOWNTIME") totalCritialDowntime++;
    if (workOrder.resolvedAt && new Date(workOrder.resolvedAt).toDateString() === new Date().toDateString()) totalResolvedToday++;
  });

  return { totalPending, totalCritialDowntime, totalResolvedToday };
}

const Page = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [workOrderMetrices, setWorkOrderMetrices] = useState({
    totalPending: 0,
    totalCritialDowntime: 0,
    totalResolvedToday: 0,
  });

  useEffect(() => {
    async function getAndSetWorkOrders() {
      const response = await fetch(`${BACKEND_URL}/work-orders`);
      const json = await response.json();
      if (json.success) {
        setWorkOrders(json.data);
        setWorkOrderMetrices(formatWorkOrders(json.data));
      }
    }

    getAndSetWorkOrders();
  }, []);

  function changeWorkOrderStatus({ workOrderId, newStatus }: { workOrderId: string; newStatus: string }) {
    const response = fetch(`${BACKEND_URL}/work-orders`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: workOrderId, status: newStatus }),
    }).then(async response => {
      const json = await response.json();
      if (!json.success) throw new Error("Couldn't change the status.");
      console.log(json);
    });

    toast.promise(response, {
      loading: "Changing status...",
      success: `Work order status changed to\n${normalizeWorkOrderStatusString(newStatus)}!`,
      error: "Couldn't change the status.",
    });
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-around items-center w-full gap-4 p-4 pb-0 flex-1">
        <MetricCard label="Total Pending" value={workOrderMetrices.totalPending} />
        <MetricCard label="Critical Downtime Alerts" value={workOrderMetrices.totalCritialDowntime} />
        <MetricCard label="Resolved Today" value={workOrderMetrices.totalResolvedToday} />
      </div>
      <div className="p-4 pt-0 h-[80%] flex-none overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border border-slate-300 p-2">Asset Tag</th>
              <th className="border border-slate-300 p-2">Description</th>
              <th className="border border-slate-300 p-2">Priority</th>
              <th className="border border-slate-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {(workOrders as WorkOrder[])
              .sort((a, b) => {
                if (a.status === "RESOLVED" && b.status !== "RESOLVED") return 1;
                if (a.status !== "RESOLVED" && b.status === "RESOLVED") return -1;
                return WORK_ORDER_PRIORITY[a.priority!] - WORK_ORDER_PRIORITY[b.priority!];
              })
              .map((workOrder: WorkOrder) => {
                return (
                  <tr key={workOrder.id}>
                    <td className="border border-slate-300 p-2">{workOrder.asset?.assetTag}</td>
                    <td className="border border-slate-300 p-2">{workOrder.issueDesc}</td>
                    <td className="border border-slate-300 p-2">{workOrder.priority}</td>
                    <td className="border border-slate-300 h-4">
                      <select
                        className="bg-neutral-800 w-full h-full cursor-pointer"
                        name="status"
                        defaultValue={workOrder.status}
                        onChange={e => changeWorkOrderStatus({ workOrderId: workOrder.id!, newStatus: e.target.value })}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
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
