export type NetworkLinkType = 'DARK_FIBER' | 'LEASED_LINE' | 'SATELLITE' | 'INTERNET';

export interface NetworkLink {
  id: string;
  sourceDcId: string;
  targetDcId: string;
  type: NetworkLinkType;
  bandwidthGbps: number;
  latencyMs: number;
  provider: string;
  status: string;
  redundancyLevel: number;
}

export interface NetworkMetric {
  id: string;
  linkId: string;
  timestamp: string;
  utilizationPercent: number;
  latencyMs: number;
  packetLossPercent: number;
  errorRate: number;
}
