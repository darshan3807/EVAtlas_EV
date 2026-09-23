/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlanningZone, ChargingStation, AdminTab } from '../types';
import {
  Zap,
  Sun,
  TrendingUp,
  Download,
  MapPin,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Activity,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

interface AdminDashboardViewProps {
  stations: ChargingStation[];
  planningZones: PlanningZone[];
  onAddStationToNetwork: (newStation: ChargingStation) => void;
  onOpenReport: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  stations,
  planningZones,
  onAddStationToNetwork,
  onOpenReport,
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<AdminTab>('overview');
  const [selectedZone, setSelectedZone] = useState<PlanningZone>(planningZones[0]);

  // Simulation state for planning a new hub
  const [plannedChargersCount, setPlannedChargersCount] = useState<number>(8);
  const [solarCanopyKwp, setSolarCanopyKwp] = useState<number>(60);
  const [batteryStorageKwh, setBatteryStorageKwh] = useState<number>(100);
  const [offPeakTariffDiscount, setOffPeakTariffDiscount] = useState<number>(20);
  const [deploymentSuccess, setDeploymentSuccess] = useState<boolean>(false);

  // Derived stats
  const totalFastPorts = stations.reduce((acc, st) => acc + st.totalPorts, 0);
  const activeStationsCount = stations.filter((s) => s.status === 'Operational').length;
  const avgUtilization = Math.round(
    stations.reduce(
      (acc, s) => acc + ((s.totalPorts - s.availablePorts) / s.totalPorts) * 100,
      0
    ) / stations.length
  );
  const totalGapsCount = planningZones.filter((z) => z.deficitIndex >= 70).length;

  const handleDeploySimulatedHub = () => {
    const newStation: ChargingStation = {
      id: `st-sim-${Date.now().toString().slice(-4)}`,
      name: `${selectedZone.name} Clean Solar Hub`,
      operator: 'EVAtlas Municipal Grid',
      area: selectedZone.name,
      address: `Sector 4, Phase 2, ${selectedZone.name}, Pune`,
      coordinates: {
        lat: 18.60 + Math.random() * 0.05,
        lng: 73.75 + Math.random() * 0.05,
        mapX: selectedZone.mapCoords.x + 2,
        mapY: selectedZone.mapCoords.y + 2,
      },
      connectors: [
        {
          id: `c-sim-1`,
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
      pricingPerKwh: 15.0 - (offPeakTariffDiscount / 100) * 4,
      solarPowered: solarCanopyKwp > 0,
      solarCapacityKwp: solarCanopyKwp,
      currentSolarGenerationKw: solarCanopyKwp * 0.85,
      gridLoadPercentage: 35,
      queueEstimateMinutes: 0,
      waitTrend: 'stable',
      distanceKm: 2.5,
      reliabilityScore: 99.8,
      amenities: ['Solar Canopy', 'Driver Lounge', 'Restrooms', 'WiFi'],
      hourlyOccupancy: [10, 8, 5, 10, 20, 35, 50, 65, 70, 60, 55, 50, 55, 65, 70, 65, 60, 50, 40, 30, 20, 15, 12, 10],
      description: `Optimized municipal charging hub with ${plannedChargersCount} fast ports and ${solarCanopyKwp}kWp solar canopy.`,
    };

    onAddStationToNetwork(newStation);
    setDeploymentSuccess(true);
    setTimeout(() => setDeploymentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Download Report Action */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Building2 className="w-4 h-4" />
            <span>City Planner & Charging Operator Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Urban Infrastructure Planning
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify network deficit zones, simulate renewable hub placement, and balance municipal grid demand.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenReport}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs for Admin Navigation */}
      <div className="flex items-center border-b border-slate-200 bg-white rounded-xl px-4 text-xs font-medium gap-2 overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveAdminSubTab('overview')}
          className={`py-3 px-3 border-b-2 font-semibold transition-colors whitespace-nowrap ${
            activeAdminSubTab === 'overview'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Network Overview
        </button>

        <button
          onClick={() => setActiveAdminSubTab('infrastructure')}
          className={`py-3 px-3 border-b-2 font-semibold transition-colors whitespace-nowrap ${
            activeAdminSubTab === 'infrastructure'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Recommended Infrastructure
        </button>

        <button
          onClick={() => setActiveAdminSubTab('heatmap')}
          className={`py-3 px-3 border-b-2 font-semibold transition-colors whitespace-nowrap ${
            activeAdminSubTab === 'heatmap'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Demand Heatmap
        </button>

        <button
          onClick={() => setActiveAdminSubTab('solar-grid')}
          className={`py-3 px-3 border-b-2 font-semibold transition-colors whitespace-nowrap ${
            activeAdminSubTab === 'solar-grid'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Solar & Grid Intelligence
        </button>
      </div>

      {/* Key Metric Cards (Required 6 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Total Stations
          </span>
          <div className="text-xl font-bold text-slate-900 font-mono mt-1">
            {stations.length} Hubs
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {totalFastPorts} Fast Ports
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Active Stations
          </span>
          <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
            {activeStationsCount} / {stations.length}
          </div>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">
            100% operational
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Avg Utilization
          </span>
          <div className="text-xl font-bold text-slate-900 font-mono mt-1">
            {avgUtilization}%
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Peak at 6:30 PM
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Current Demand
          </span>
          <div className="text-xl font-bold text-amber-700 font-mono mt-1">
            High
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Expressway corridor
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Infrastructure Gaps
          </span>
          <div className="text-xl font-bold text-rose-700 font-mono mt-1">
            {totalGapsCount} Zones
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Urgent expansion
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Forecasted Demand
          </span>
          <div className="text-xl font-bold text-blue-700 font-mono mt-1">
            +42% / yr
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Fleet growth rate
          </span>
        </div>
      </div>

      {/* View 1: Overview & Charts */}
      {activeAdminSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Charging Demand Over Time (24h) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">
                24-Hour Regional Charging Demand Curve
              </h3>
              <span className="text-[11px] text-slate-400">Peak vs Off-Peak</span>
            </div>

            <div className="h-40 flex items-end gap-1.5 pt-4">
              {[20, 15, 12, 10, 15, 30, 65, 88, 92, 85, 75, 70, 78, 85, 95, 98, 90, 80, 70, 55, 40, 30, 25, 20].map(
                (val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className={`w-full rounded-t transition-all ${
                        val > 85 ? 'bg-rose-500' : val > 60 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ height: `${val * 1.2}px` }}
                    />
                    {idx % 4 === 0 && (
                      <span className="text-[9px] text-slate-400 font-mono">{idx}h</span>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Morning Commute: 8:00 AM - 10:30 AM</span>
              <span>Evening Peak: 5:30 PM - 8:30 PM</span>
            </div>
          </div>

          {/* Chart 2: Regional Demand Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">
                Regional Demand & Utilization Breakdown
              </h3>
              <span className="text-[11px] text-slate-400">By Urban Corridor</span>
            </div>

            <div className="space-y-3 pt-2">
              {planningZones.map((z) => (
                <div key={z.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800">{z.name}</span>
                    <span className="font-mono font-bold text-slate-900">{z.deficitIndex}% Deficit</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        z.deficitIndex >= 80
                          ? 'bg-rose-600'
                          : z.deficitIndex >= 65
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${z.deficitIndex}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 2: Recommended Infrastructure Table/Cards */}
      {(activeAdminSubTab === 'infrastructure' || activeAdminSubTab === 'overview') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recommended Infrastructure Investments
              </h3>
              <p className="text-xs text-slate-500">
                Prioritized areas where adding fast-charging hubs delivers the highest congestion relief
              </p>
            </div>
            <button
              onClick={onOpenReport}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Audit Report</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Area / Corridor</th>
                  <th className="py-2.5 px-3">Current Demand</th>
                  <th className="py-2.5 px-3">Forecast Demand</th>
                  <th className="py-2.5 px-3">Infrastructure Gap</th>
                  <th className="py-2.5 px-3">Solar Potential</th>
                  <th className="py-2.5 px-3">AI Recommendation</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {planningZones.map((z) => (
                  <tr key={z.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{z.name}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {z.currentFleetCount.toLocaleString()} active EVs
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      +{z.growthRateAnnual}% / yr
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          z.deficitIndex >= 80
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {z.deficitIndex}/100 Deficit
                      </span>
                    </td>
                    <td className="py-3 px-3 text-amber-700 font-mono font-medium">
                      {z.solarPotentialKwp} kWp
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-xs">
                      Add +{z.recommendedAdditionalPorts} fast ports with rooftop solar canopy
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedZone(z);
                          setActiveAdminSubTab('solar-grid');
                        }}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded font-semibold text-[11px] transition-colors"
                      >
                        Analyze Demand
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Heatmap on Admin Tab */}
      {activeAdminSubTab === 'heatmap' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Regional Deficit & Heatmap Analysis
            </h3>
            <span className="text-xs text-slate-500">Live Pune/PCMC network simulation</span>
          </div>

          <InteractiveMap
            stations={stations}
            selectedStationId={null}
            onSelectStation={() => {}}
            showHeatmap={true}
            planningZones={planningZones}
          />
        </div>
      )}

      {/* View 4: Solar + Grid Intelligence Section */}
      {activeAdminSubTab === 'solar-grid' && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Sun className="w-4 h-4 text-amber-600" />
              <span>Sustainable Charging Infrastructure Strategy</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Pairing Clean Solar Canopies with Battery Energy Storage (BESS)
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
              By installing solar rooftop canopies over parking bays, stations generate clean electricity directly during daylight hours.
              Combined with local battery storage, daytime sunshine is saved to fast-charge electric cars during evening rush hours without straining the municipal power grid.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Criteria 1</span>
                <span className="text-xs font-bold text-slate-900">High EV Demand</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Heavy commuter traffic</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Criteria 2</span>
                <span className="text-xs font-bold text-slate-900">Good Solar Potential</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">&gt;5.2 kWh/m²/day irradiance</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Criteria 3</span>
                <span className="text-xs font-bold text-slate-900">Available Grid Capacity</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Substation load headroom</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Criteria 4</span>
                <span className="text-xs font-bold text-slate-900">High Infrastructure Need</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Eliminates 15m+ queues</span>
              </div>
            </div>
          </div>

          {/* Interactive Hub Placement Optimizer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  <span>Simulate Adding a Clean Charging Station</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Target Zone: <strong className="text-slate-900">{selectedZone.name}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Change Zone:</span>
                <select
                  value={selectedZone.id}
                  onChange={(e) => {
                    const z = planningZones.find((pz) => pz.id === e.target.value);
                    if (z) setSelectedZone(z);
                  }}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                >
                  {planningZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">Fast Charging Ports (120 kW)</span>
                  <span className="font-bold text-slate-900">{plannedChargersCount} Ports</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="2"
                  value={plannedChargersCount}
                  onChange={(e) => setPlannedChargersCount(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">Rooftop Solar Panels</span>
                  <span className="font-bold text-amber-700">{solarCanopyKwp} kWp</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="10"
                  value={solarCanopyKwp}
                  onChange={(e) => setSolarCanopyKwp(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">Battery Storage Backup</span>
                  <span className="font-bold text-slate-900">{batteryStorageKwh} kWh</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="20"
                  value={batteryStorageKwh}
                  onChange={(e) => setBatteryStorageKwh(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">Off-Peak Discount for Drivers</span>
                  <span className="font-bold text-slate-900">-{offPeakTariffDiscount}% Off</span>
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
              </div>
            </div>

            {/* Impact Projection Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-emerald-800 font-semibold block">Queue Reduction</span>
                <span className="text-base font-bold text-emerald-900 font-mono mt-0.5 block">-16 mins</span>
                <span className="text-[10px] text-emerald-700">Avoids peak queues</span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-[10px] text-amber-800 font-semibold block">Solar Clean Energy</span>
                <span className="text-base font-bold text-amber-900 font-mono mt-0.5 block">78% Green</span>
                <span className="text-[10px] text-amber-700">Zero fossil grid strain</span>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-[10px] text-blue-800 font-semibold block">CO₂ Avoided</span>
                <span className="text-base font-bold text-blue-900 font-mono mt-0.5 block">142 Tons/yr</span>
                <span className="text-[10px] text-blue-700">Net zero transit goal</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 font-semibold block">Est. Payback</span>
                <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">3.2 Years</span>
                <span className="text-[10px] text-slate-500">Fast commercial ROI</span>
              </div>
            </div>

            {/* Deploy simulated station button */}
            <div className="pt-2 flex items-center justify-between">
              {deploymentSuccess ? (
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Simulated Station Deployed to Live Urban Map! Check Live Stations tab.</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500">
                  AI predicts this station will resolve <strong className="text-slate-800">48% of the deficit</strong> in {selectedZone.name}.
                </div>
              )}

              <button
                onClick={handleDeploySimulatedHub}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Deploy to Live Map</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
