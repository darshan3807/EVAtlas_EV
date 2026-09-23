/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'driver' | 'admin';

export type DriverTab =
  | 'home'
  | 'dashboard'
  | 'stations'
  | 'route'
  | 'insights'
  | 'emergency'
  | 'profile';

export type AdminTab =
  | 'overview'
  | 'infrastructure'
  | 'heatmap'
  | 'solar-grid';

export interface Connector {
  id: string;
  type: 'CCS2' | 'Type 2' | 'GB/T' | 'CHAdeMO';
  powerKw: number;
  available: number;
  total: number;
  status: 'available' | 'occupied' | 'reserved';
}

export interface ChargingStation {
  id: string;
  name: string;
  operator: string;
  area: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // percentage in SVG coordinate space 0..100
    mapY: number; // percentage in SVG coordinate space 0..100
  };
  connectors: Connector[];
  totalPorts: number;
  availablePorts: number;
  status: 'Operational' | 'High Demand' | 'Maintenance';
  pricingPerKwh: number; // in INR ₹
  solarPowered: boolean;
  solarCapacityKwp: number;
  currentSolarGenerationKw: number;
  gridLoadPercentage: number;
  queueEstimateMinutes: number;
  waitTrend: 'increasing' | 'stable' | 'decreasing';
  distanceKm: number;
  reliabilityScore: number; // percentage e.g. 98.4
  amenities: string[];
  hourlyOccupancy: number[]; // 24 hours (0-100%)
  description: string;
  rating?: number;
  operatingHours?: string;
}

export interface EVVehicle {
  id: string;
  name: string;
  brand: string;
  batteryKwh: number;
  claimedRangeKm: number;
  realWorldRangeKm: number;
  maxChargeKw: number;
  efficiencyWhPerKm: number;
  connectorType: 'CCS2' | 'Type 2' | 'GB/T';
}

export interface MobileChargingVan {
  id: string;
  name: string;
  driverName: string;
  status: 'Available' | 'En Route' | 'Charging' | 'Busy';
  distanceKm: number;
  etaMinutes: number;
  batteryCapacityKwh: number;
  currentSocPercentage: number;
  chargingRateKw: number;
  compatibleConnectors: string[];
  currentLocation: string;
  mapCoords: { x: number; y: number };
  vehiclePlate: string;
}

export interface RouteWaypoint {
  name: string;
  distanceKm: number;
  elevationMeters: number;
  estimatedBatterySoc: number; // 0..100%
  isChargingStop?: boolean;
  chargeTimeMinutes?: number;
  notes?: string;
}

export interface PlanningZone {
  id: string;
  name: string;
  currentFleetCount: number;
  growthRateAnnual: number;
  currentFastPorts: number;
  recommendedAdditionalPorts: number;
  deficitIndex: number; // 1-100 (higher = worse deficiency)
  gridCapacityKva: number;
  solarPotentialKwp: number;
  trafficVolumeDaily: number;
  mapCoords: { x: number; y: number; radius: number };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  vehicle: EVVehicle;
  batteryPercentage: number;
  estimatedRangeKm: number;
  currentLocationName: string;
  savedStationIds: string[];
  notificationsEnabled: boolean;
  preferredPlug: string;
}

export interface NavigationStep {
  instruction: string;
  distance: string;
  duration: string;
  turnIcon: 'straight' | 'left' | 'right' | 'roundabout' | 'arrive';
}
