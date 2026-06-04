export type RegionCode = 'AMERICAS' | 'EUROPE' | 'APAC' | 'AFRICA' | 'ARCTIC';
export type RegionStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE';

export interface Region {
  id: string;
  code: RegionCode;
  name: string;
  timezone: string;
  lat: number;
  lng: number;
  status: RegionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Datacenter {
  id: string;
  regionId: string;
  name: string;
  slug: string;
  address: string;
  lat: number;
  lng: number;
  tier: 'T1' | 'T2' | 'T3' | 'T4';
  status: RegionStatus;
  powerCapacityKw: number;
  coolingType: 'AIR' | 'LIQUID' | 'HYBRID' | 'FREE_AIR';
  createdAt: string;
  updatedAt: string;
}
