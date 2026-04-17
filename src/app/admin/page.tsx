"use client";
import MetricCard from "./components/MetricCard";
import { useState, useEffect } from "react";
import type { WorkOrder } from "@/types";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL;

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
  return (
    <div className="h-full">
      <div className="flex justify-around items-center w-full gap-4 p-4 h-20">
        <MetricCard label="Total Pending" value={workOrderMetrices.totalPending} />
        <MetricCard label="Critical Downtime Alerts" value={workOrderMetrices.totalCritialDowntime} />
        <MetricCard label="Resolved Today" value={workOrderMetrices.totalResolvedToday} />
      </div>
    </div>
  );
};

export default Page;
