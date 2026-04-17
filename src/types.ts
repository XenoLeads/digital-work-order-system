export type User = {
  id?: string;
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  createdAt?: string;
}

export type Asset = {
  id?: string;
  assetTag: string;
  location: string;
  status?: AssetStatus;
  workOrders?: WorkOrder[];
}

export type WorkOrder = {
  id?: string;
  issueDesc: string;
  priority: WorkOrderPriority;
  status?: WorkOrderStatus;
  reportedAt?: string;
  resolvedAt?: string;
  assetId: string;
  asset?: Asset;
}

export type UserRole = "ADMIN";

export type AssetStatus = "OPERATIONAL" | "DOWN";

export type WorkOrderPriority = "LOW" | "MEDIUM" | "HIGH" | "DOWNTIME";

export type WorkOrderStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";