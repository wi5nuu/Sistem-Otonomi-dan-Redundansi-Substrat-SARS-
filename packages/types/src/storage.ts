export type StorageTier = 'HOT' | 'WARM' | 'COLD' | 'ARCHIVE';

export interface StorageCluster {
  id: string;
  datacenterId: string;
  name: string;
  tier: StorageTier;
  totalTb: number;
  usedTb: number;
  replicationFactor: number;
  erasureCodingScheme: string;
  status: string;
  lastIntegrityCheckAt: string;
}

export interface StorageMetric {
  id: string;
  clusterId: string;
  timestamp: string;
  readIops: number;
  writeIops: number;
  readLatencyMs: number;
  writeLatencyMs: number;
  throughputMbps: number;
}
