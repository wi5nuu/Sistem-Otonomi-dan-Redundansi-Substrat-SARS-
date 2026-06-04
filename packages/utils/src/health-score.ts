interface LayerHealthInput {
  cpuPercent: number;
  ramPercent: number;
  nodeStatuses: { status: string }[];
  uptimeSeconds: number;
  temperatureCelsius: number;
}

export function calculateComputeHealth(input: LayerHealthInput): number {
  const cpuScore = Math.max(0, 100 - input.cpuPercent);
  const ramScore = Math.max(0, 100 - input.ramPercent);
  const nodeRatio = input.nodeStatuses.filter((n) => n.status === 'ACTIVE').length / Math.max(1, input.nodeStatuses.length);
  const nodeScore = nodeRatio * 100;
  const tempScore = input.temperatureCelsius < 80 ? 100 : Math.max(0, 100 - (input.temperatureCelsius - 80) * 2);
  const uptimeScore = Math.min(100, (input.uptimeSeconds / 86400) * 10);
  return Math.round((cpuScore + ramScore + nodeScore + tempScore + uptimeScore) / 5);
}

interface StorageHealthInput {
  usedRatio: number;
  clusters: { status: string }[];
}

export function calculateStorageHealth(input: StorageHealthInput): number {
  const capacityScore = Math.max(0, 100 - input.usedRatio * 100);
  const clusterRatio = input.clusters.filter((c) => c.status === 'ONLINE').length / Math.max(1, input.clusters.length);
  return Math.round((capacityScore + clusterRatio * 100) / 2);
}

interface NetworkHealthInput {
  links: { status: string }[];
  avgLatencyMs: number;
  avgPacketLoss: number;
}

export function calculateNetworkHealth(input: NetworkHealthInput): number {
  const linkRatio = input.links.filter((l) => l.status === 'ACTIVE').length / Math.max(1, input.links.length);
  const latencyScore = Math.max(0, 100 - input.avgLatencyMs);
  const packetLossScore = Math.max(0, 100 - input.avgPacketLoss * 100);
  return Math.round((linkRatio * 100 + latencyScore + packetLossScore) / 3);
}

export function calculateGlobalHealth(scores: number[]): number {
  if (scores.length === 0) return 0;
  const weights = scores.map((_, i) => scores.length - i);
  const weightedSum = scores.reduce((sum, score, i) => sum + score * weights[i]!, 0);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  return Math.round(weightedSum / totalWeight);
}
