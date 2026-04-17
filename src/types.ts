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
  asset: Asset;
}

enum UserRole {
  admin = "ADMIN",
}

enum AssetStatus {
  operational = "OPERATIONAL",
  down = "DOWN"
}

enum WorkOrderPriority {
  low = "LOW",
  medium = "MEDIUM",
  high = "HIGH",
  downtime = "DOWNTIME"
}

enum WorkOrderStatus {
  pending = "PENDING",
  in_progress = "IN_PROGRESS",
  resolved = "RESOLVED"
}