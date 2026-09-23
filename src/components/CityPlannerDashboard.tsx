/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlanningZone, ChargingStation } from '../types';
import { PLANNING_ZONES } from '../data/mockData';
import {
  TrendingUp,
  Sun,
  Zap,
  Activity,
  ShieldAlert,
  Leaf,
  PlusCircle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface CityPlannerDashboardProps {
  onAddStationToNetwork: (newStation: ChargingStation) => void;
  planningZones: PlanningZone[];
}

export const CityPlannerDashboard: React.FC<CityPlannerDashboardProps> = ({
  onAddStationToNetwork,
  planningZones,
}) => {
  const [forecastHorizon, setForecastHorizon] = useState<'3m' | '6m' | '12m' | '24m'>('12m');
  const [selectedZone, setSelectedZone] = useState<PlanningZone>(planningZones[0]);

  // Station Placement Optimizer Sliders
  const [plannedChargersCount, setPlannedChargersCount] = useState<number>(6);
  const [solarCanopyKwp, setSolarCanopyKwp] = useState<number>(60);
  const [batteryStorageKwh, setBatteryStorageKwh] = useState<number>(120);
  const [offPeakTariffDiscount, setOffPeakTariffDiscount] = useState<number>(20); // %

  const [deploymentSuccess, setDeploymentSuccess] = useState<boolean>(false);

  // Growth Multipliers based on Forecast Horizon
  const horizonMultiplier = {
    '3m': 1.08,
    '6m': 1.18,
    '12m': 1.42,
    '24m': 1.95,
  }[forecastHorizon];

  const projectedFleet = Math.round(selectedZone.currentFleetCount * horizonMultiplier);
  const projectedDailyChargingSessions = Math.round(projectedFleet * 0.28);
  const projectedPeakPowerDemandMw = +(
    (projectedDailyChargingSessions * 35 * 0.45) /
    1000
  ).toFixed(2);

  // Optimizer calculations
  const gridHeadroomKva = selectedZone.gridCapacityKva;
  const addedLoadKw = plannedChargersCount * 90; // simultaneous peak factor
  const peakShavedWithSolarAndBess = Math.min(
    addedLoadKw,
    solarCanopyKwp * 0.8 + batteryStorageKwh * 0.4
  );
  const netGridStressKw = Math.max(0, addedLoadKw - peakShavedWithSolarAndBess);

  const solarSelfConsumptionPct = Math.min(
    95,
    Math.round(((solarCanopyKwp * 4.8) / (plannedChargersCount * 22 * 4)) * 100)
  );

  const waitTimeReductionMinutes = Math.min(
    22,
    Math.round(plannedChargersCount * 2.8)
  );

  const annualCo2AvoidedTons = Math.round(
    plannedChargersCount * 38 + solarCanopyKwp * 1.2
  );

  const estimatedCapExLakhs = Math.round(
    plannedChargersCount * 8.5 + solarCanopyKwp * 0.55 + batteryStorageKwh * 0.25
  );

  const estimatedPaybackYears = +(estimatedCapExLakhs / (plannedChargersCount * 4.2)).toFixed(1);

  const handleDeployStation = () => {
    const newStation: ChargingStation = {
      id: `st-opt-${Date.now()}`,
      name: `${selectedZone.name.split(' ')[0]} AI Eco Fast-Charging Hub`,
      operator: 'EVAtlas Municipal Green Grid',
      area: selectedZone.name,
      address: `Planned Optimal Site, ${selectedZone.name}, Pune/PCMC`,
      coordinates: {
        lat: 18.59 + (Math.random() - 0.5) * 0.05,
        lng: 73.74 + (Math.random() - 0.5) * 0.05,
        mapX: selectedZone.mapCoords.x + 2,
        mapY: selectedZone.mapCoords.y - 2,
      },
      connectors: [
        {
          id: `c-new-1`,
          type: 'CCS2',
          powerKw: 120,
          available: plannedChargersCount,
          total: plannedChargersCount,
          status: 'available',
        },
      ],
      totalPorts: plannedChargersCount,
      availablePorts: plannedChargersCount,
      status: 'Operational',
      pricingPerKwh: 14.0,
      solarPowered: solarCanopyKwp > 0,
      solarCapacityKwp: solarCanopyKwp,
      currentSolarGenerationKw: solarCanopyKwp * 0.85,
      gridLoadPercentage: Math.round((netGridStressKw / gridHeadroomKva) * 100),
      queueEstimateMinutes: 0,
      waitTrend: 'decreasing',
      distanceKm: 5.4,
      reliabilityScore: 99.8,
      amenities: ['Solar Canopy', 'BESS Storage', 'EV Driver Lounge', 'WiFi', '24/7 Security'],
      hourlyOccupancy: [10, 8, 5, 8, 15, 30, 50, 65, 70, 68, 65, 68, 72, 75, 78, 74, 68, 60, 48, 35, 24, 18, 14, 10],
      description: `Optimized AI-planned hub deployed in ${selectedZone.name} with ${solarCanopyKwp}kWp solar canopy and ${batteryStorageKwh}kWh BESS to buffer local transformer grid.`,
    };

    onAddStationToNetwork(newStation);
    setDeploymentSuccess(true);
    setTimeout(() => setDeploymentSuccess(false), 5000);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Smart City Planning</span>
            <span className="text-slate-300">·</span>
            <span>Clean Energy & Infrastructure</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 leading-snug">
            City EV Infrastructure & Solar Hub Planner
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate where new charging stations are needed, prevent long lines, and power new stations with clean solar energy.
          </p>
        </div>

        {/* Forecast Horizon Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-500 px-2 font-medium">Forecast Horizon:</span>
          {(['3m', '6m', '12m', '24m'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setForecastHorizon(h)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                forecastHorizon === h
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {h === '3m' ? '3 Months' : h === '6m' ? '6 Months' : h === '12m' ? '1 Year' : '2 Years'}
            </button>
          ))}
        </div>
      </div>

      {/* Urban Zone Deficit Matrix & Heatmap Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {planningZones.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          return (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all bg-white text-left ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{zone.name}</h4>
                <span
                  className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    zone.deficitIndex >= 80
                      ? 'bg-rose-100 text-rose-800'
                      : zone.deficitIndex >= 70
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  Deficit {zone.deficitIndex}/100
                </span>
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5 mt-2">
                <div className="flex justify-between">
                  <span>EV Fleet:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {Math.round(zone.currentFleetCount * horizonMultiplier).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fast Ports Gap:</span>
                  <span className="font-semibold text-rose-600 font-mono">
                    +{zone.recommendedAdditionalPorts} Needed
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Solar Potential:</span>
                  <span className="font-medium text-amber-700 font-mono">
                    {zone.solarPotentialKwp} kWp
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Zone Deep Analytics & AI Placement Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Zone Demand Telemetry & Grid Capacity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Selected Urban Cluster</span>
              <h3 className="text-sm font-bold text-slate-900">{selectedZone.name}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          {/* Metric Stats */}
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[11px]">Projected Daily Charging Load</div>
              <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                {projectedDailyChargingSessions.toLocaleString()} Sessions / day
              </div>
              <div className="text-[10px] text-emerald-700 mt-1">
                +{Math.round((horizonMultiplier - 1) * 100)}% expansion over current baseline
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[11px]">Local DISCOM Transformer Headroom</div>
              <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                {selectedZone.gridCapacityKva} kVA
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Daily arterial traffic: {selectedZone.trafficVolumeDaily.toLocaleString()} vehicles
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[11px]">Solar Canopy Rooftop Viability</div>
              <div className="text-base font-bold text-amber-700 font-mono mt-0.5">
                {selectedZone.solarPotentialKwp} kWp Potential
              </div>
              <div className="text-[10px] text-amber-800 mt-1">
                Average solar irradiance: 5.2 kWh/m²/day (Pune Western Ghats region)
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Interactive Hub Placement Optimizer */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Plan & Test a New Clean Charging Station</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Adjust charging speed, solar canopy size, and battery backup to see the immediate impact on lines and clean energy.
              </p>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Slider 1: Number of Fast Charging Ports */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center font-medium">
                <span className="text-slate-700">Number of Fast Chargers (120 kW)</span>
                <span className="font-mono font-bold text-slate-900">{plannedChargersCount} Ports</span>
              </div>
              <input
                type="range"
                min="2"
                max="16"
                step="2"
                value={plannedChargersCount}
                onChange={(e) => setPlannedChargersCount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>2 Ports</span>
                <span>8 Ports</span>
                <span>16 Ports</span>
              </div>
            </div>

            {/* Slider 2: Solar Canopy Capacity */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center font-medium">
                <span className="text-slate-700">Rooftop Solar Panels</span>
                <span className="font-mono font-bold text-amber-700">{solarCanopyKwp} kWp</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="10"
                value={solarCanopyKwp}
                onChange={(e) => setSolarCanopyKwp(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>None</span>
                <span>Medium (75 kWp)</span>
                <span>Large (150 kWp)</span>
              </div>
            </div>

            {/* Slider 3: Battery Energy Storage System (BESS) */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center font-medium">
                <span className="text-slate-700">Backup Battery Storage</span>
                <span className="font-mono font-bold text-slate-900">{batteryStorageKwh} kWh</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="20"
                value={batteryStorageKwh}
                onChange={(e) => setBatteryStorageKwh(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>None</span>
                <span>150 kWh</span>
                <span>300 kWh</span>
              </div>
            </div>

            {/* Slider 4: Dynamic Off-Peak Incentive */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center font-medium">
                <span className="text-slate-700">Off-Peak Discount for Drivers</span>
                <span className="font-mono font-bold text-slate-900">-{offPeakTariffDiscount}% Off</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={offPeakTariffDiscount}
                onChange={(e) => setOffPeakTariffDiscount(Number(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5%</span>
                <span>20%</span>
                <span>40%</span>
              </div>
            </div>
          </div>

          {/* Simulated Impact Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-[10px] text-emerald-800 font-medium block">
                Queue Wait Reduction
              </span>
              <div className="text-lg font-bold text-emerald-900 font-mono mt-0.5">
                -{waitTimeReductionMinutes} mins
              </div>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                Prevents peak highway queues
              </span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="text-[10px] text-amber-800 font-medium block">
                Solar Self-Consumption
              </span>
              <div className="text-lg font-bold text-amber-900 font-mono mt-0.5">
                {solarSelfConsumptionPct}% Green
              </div>
              <span className="text-[10px] text-amber-700 block mt-0.5">
                Zero fossil-grid dependency
              </span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
              <span className="text-[10px] text-blue-800 font-medium block">
                CO₂ Emissions Avoided
              </span>
              <div className="text-lg font-bold text-blue-900 font-mono mt-0.5">
                {annualCo2AvoidedTons} Tons/yr
              </div>
              <span className="text-[10px] text-blue-700 block mt-0.5">
                Net Zero Mobility Goal Metric
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-600 font-medium block">
                Estimated Payback (ROI)
              </span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {estimatedPaybackYears} Years
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Est. CapEx: ₹{estimatedCapExLakhs}L
              </span>
            </div>
          </div>

          {/* Deploy Action */}
          <div className="pt-2 flex items-center justify-between">
            {deploymentSuccess ? (
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Simulated Station Deployed to Live Urban Map! Check Live Stations tab.</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500">
                AI model predicts <strong className="text-slate-800">44% deficit alleviation</strong> in {selectedZone.name}.
              </div>
            )}

            <button
              onClick={handleDeployStation}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Deploy Optimized Hub to Urban Grid</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
