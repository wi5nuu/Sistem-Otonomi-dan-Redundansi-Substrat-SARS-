export type NodeArchitecture = 'X86_64' | 'ARM64' | 'RISC_V';
export type NodeStatus = 'ACTIVE' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE';

export interface ComputeNode {
  id: string;
  datacenterId: string;
  hostname: string;
  ipAddress: string;
  architecture: NodeArchitecture;
  vendor: string;
  model: string;
  cpuCores: number;
  ramGb: number;
  status: NodeStatus;
  lastHeartbeatAt: string;
  uptimeSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface NodeMetric {
  id: string;
  nodeId: string;
  timestamp: string;
  cpuPercent: number;
  ramPercent: number;
  networkInMbps: number;
  networkOutMbps: number;
  temperatureCelsius: number;
  powerWatts: number;
}
