"use client";

import { useState } from "react";
import type { WorkOrder } from "@/types";
import { WorkOrderStatus } from "@/generated/prisma/enums";
type StatusDropDownOptions = {
  PENDING: string;
  IN_PROGRESS: string;
  RESOLVED: string;
};
const STATUS_DROPDOWN_STYLES: StatusDropDownOptions = {
  PENDING: "bg-amber-600 hover:bg-amber-700 text-white border-amber-700 border",
  IN_PROGRESS: "bg-lime-700 hover:bg-lime-800 text-white border-lime-700 border",
  RESOLVED: "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800 border",
};

const PriorityDropdown = ({
  row,
  changeWorkOrderStatus,
}: {
  row: WorkOrder;
  changeWorkOrderStatus: (params: { workOrderId: string; newStatus: string; priority: string }) => void;
}) => {
  const [dropdownValue, setDropdownValue] = useState(row.status);

  console.log(dropdownValue, STATUS_DROPDOWN_STYLES[dropdownValue!]);
  return (
    <select
      value={dropdownValue}
      onChange={e => {
        changeWorkOrderStatus({ workOrderId: row.id as string, newStatus: e.target.value, priority: row.priority });
        setDropdownValue(e.target.value as WorkOrderStatus);
      }}
      className={`px-4 py-2 rounded-sm cursor-pointer ${STATUS_DROPDOWN_STYLES[dropdownValue!]}`}
    >
      <option value="PENDING">Pending</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="RESOLVED">Resolved</option>
    </select>
  );
};

export default PriorityDropdown;
