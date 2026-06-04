export type EnergySourceType = 'SOLAR' | 'GRID' | 'HYDRO' | 'WIND' | 'DIESEL' | 'HYDROGEN';

export interface EnergySource {
  id: string;
  datacenterId: string;
  type: EnergySourceType;
  provider: string;
  capacityKw: number;
  currentOutputKw: number;
  status: string;
  contractExpiresAt: string;
  createdAt: string;
}

export interface EnergyMetric {
  id: string;
  sourceId: string;
  timestamp: string;
  outputKw: number;
  efficiency: number;
  estimatedRemainingHours: number;
}

export interface UpsSystem {
  id: string;
  datacenterId: string;
  name: string;
  capacityKwh: number;
  currentChargePercent: number;
  estimatedRuntimeMinutes: number;
  status: string;
  lastTestedAt: string;
}
