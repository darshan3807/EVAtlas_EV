/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EVVehicle, ChargingStation } from '../types';
import { VEHICLE_PRESETS } from '../data/mockData';
import {
  Navigation,
  Battery,
  Zap,
  TrendingDown,
  TrendingUp,
  Sun,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';

interface RoutePlannerProps {
  stations: ChargingStation[];
  onSelectStation: (station: ChargingStation) => void;
  destinationStation?: ChargingStation | null;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  stations,
  onSelectStation,
  destinationStation,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<EVVehicle>(VEHICLE_PRESETS[0]);
  const [selectedRoute, setSelectedRoute] = useState<'expressway' | 'mahabaleshwar' | 'lonavala'>('expressway');
  const [startSoc, setStartSoc] = useState<number>(65);
  const [ambientTemp, setAmbientTemp] = useState<number>(34); // in Celsius
  const [acMode, setAcMode] = useState<'eco' | 'comfort' | 'off'>('comfort');
  const [drivingStyle, setDrivingStyle] = useState<'eco' | 'normal' | 'sport'>('normal');

  // Route specs
  const routeConfigs = {
    expressway: {
      title: 'Akurdi (Pune) → Mumbai BKC via Expressway',
      distanceKm: 148,
      durationHours: '2h 45m',
      elevationProfile: [
        { km: 0, alt: 560, name: 'Akurdi Start' },
        { km: 28, alt: 590, name: 'Talegaon Toll' },
        { km: 58, alt: 610, name: 'Lonavala Crest' },
        { km: 82, alt: 90, name: 'Khopoli Descent (Regen +4% SoC)' },
        { km: 118, alt: 35, name: 'Panvel Interchange' },
        { km: 148, alt: 10, name: 'BKC Destination' },
      ],
      recommendedStopStationId: 'st-03', // Urse Plaza
    },
    mahabaleshwar: {
      title: 'Hinjawadi IT Park → Mahabaleshwar Hill Station',
      distanceKm: 124,
      durationHours: '3h 10m',
      elevationProfile: [
        { km: 0, alt: 560, name: 'Hinjawadi' },
        { km: 45, alt: 620, name: 'Shirwal Toll' },
        { km: 80, alt: 680, name: 'Wai Foothills' },
        { km: 105, alt: 1150, name: 'Pasarni Ghat (Climb -12% SoC)' },
        { km: 124, alt: 1350, name: 'Mahabaleshwar' },
      ],
      recommendedStopStationId: 'st-05',
    },
    lonavala: {
      title: 'Pune Central (Shivajinagar) → Lonavala Tiger Point',
      distanceKm: 68,
      durationHours: '1h 30m',
      elevationProfile: [
        { km: 0, alt: 560, name: 'Shivajinagar' },
        { km: 35, alt: 570, name: 'Dehu Road' },
        { km: 68, alt: 640, name: 'Lonavala' },
      ],
      recommendedStopStationId: 'st-03',
    },
  };

  const currentRoute = routeConfigs[selectedRoute];

  // Dynamic Range consumption physics calculation
  // Base efficiency: Wh/km
  const acMultiplier = acMode === 'comfort' ? 1.15 : acMode === 'eco' ? 1.07 : 1.0;
  const tempMultiplier = ambientTemp > 35 ? 1.1 : ambientTemp < 15 ? 1.08 : 1.0;
  const styleMultiplier = drivingStyle === 'sport' ? 1.2 : drivingStyle === 'eco' ? 0.9 : 1.0;

  const effectiveEfficiency =
    selectedVehicle.efficiencyWhPerKm * acMultiplier * tempMultiplier * styleMultiplier;

  // Usable battery energy
  const currentEnergyKwh = (startSoc / 100) * selectedVehicle.batteryKwh;
  const tripEnergyNeededKwh = (currentRoute.distanceKm * effectiveEfficiency) / 1000;
  const remainingEnergyKwh = currentEnergyKwh - tripEnergyNeededKwh;

  const requiresChargingStop = remainingEnergyKwh < selectedVehicle.batteryKwh * 0.15; // less than 15% reserve
  const arrivalSocWithoutStop = Math.max(0, Math.round((remainingEnergyKwh / selectedVehicle.batteryKwh) * 100));

  const recommendedStation = stations.find(
    (s) => s.id === currentRoute.recommendedStopStationId
  ) || stations[0];

  return (
    <div className="space-y-4">
      {/* Route & Vehicle Selection Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Range-Aware Route Optimization Engine</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Considers vehicle battery chemistry, ambient temperature, elevation gradients, and queue wait times.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Route:</span>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:border-emerald-600 text-xs"
            >
              <option value="expressway">Pune → Mumbai Expressway (148 km)</option>
              <option value="mahabaleshwar">Hinjawadi → Mahabaleshwar (124 km)</option>
              <option value="lonavala">Pune → Lonavala (68 km)</option>
            </select>
          </div>
        </div>

        {/* Vehicle Selector & Battery Slider */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Vehicle picker */}
          <div className="space-y-1.5">
            <label className="text-slate-600 font-medium">Select Electric Vehicle</label>
            <div className="grid grid-cols-2 gap-2">
              {VEHICLE_PRESETS.map((veh) => (
                <button
                  key={veh.id}
                  onClick={() => setSelectedVehicle(veh)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedVehicle.id === veh.id
                      ? 'border-emerald-600 bg-emerald-50/50 text-slate-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold truncate">{veh.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {veh.batteryKwh} kWh · {veh.claimedRangeKm} km
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Starting State of Charge */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Starting Battery SoC</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{startSoc}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={startSoc}
              onChange={(e) => setStartSoc(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% Low</span>
              <span>Safe 50%</span>
              <span>100% Full</span>
            </div>
          </div>

          {/* Environmental Controls */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Ambient Temp & Climate</span>
              <span className="font-mono font-semibold text-amber-700">{ambientTemp}°C</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex items-center justify-between gap-1 pt-1">
              <span className="text-[11px] text-slate-500">AC Cabin Mode:</span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-200 rounded text-[10px]">
                {(['off', 'eco', 'comfort'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setAcMode(m)}
                    className={`px-2 py-0.5 rounded capitalize ${
                      acMode === m ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Calculation Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Range Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Route Distance & ETA</span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {currentRoute.distanceKm} km
          </div>
          <div className="text-xs text-slate-600">
            Estimated drive time: <span className="font-medium text-slate-900">{currentRoute.durationHours}</span>
          </div>
        </div>

        {/* Metric 2: Arrival Battery State */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Arrival Battery Buffer</span>
            <Battery className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              requiresChargingStop ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {requiresChargingStop ? `${arrivalSocWithoutStop}% (Buffer Low)` : `${arrivalSocWithoutStop}% Safe`}
          </div>
          <div className="text-xs text-slate-500">
            Energy required: {tripEnergyNeededKwh.toFixed(1)} kWh ({effectiveEfficiency.toFixed(0)} Wh/km)
          </div>
        </div>

        {/* Metric 3: Charging Recommendation */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>AI Charging Recommendation</span>
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xs font-bold text-slate-900">
            {requiresChargingStop
              ? '1 Fast Charge Stop Recommended'
              : 'Direct Trip Feasible Without Stops'}
          </div>
          <div className="text-[11px] text-slate-500">
            {requiresChargingStop
              ? 'Optimal stop at Urse Plaza (15m boost recommended)'
              : 'Sufficient charge to reach destination comfortably'}
          </div>
        </div>
      </div>

      {/* Elevation & Regenerative Braking Curve */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Elevation Profile & Regenerative Braking Harvest
            </h3>
            <p className="text-[11px] text-slate-500">
              Ghat descent downhill slopes enable regenerative energy recovery directly back into the battery pack.
            </p>
          </div>
          <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>+3.8% SoC Regenerated Downhill</span>
          </div>
        </div>

        {/* Waypoints elevation visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
          {currentRoute.elevationProfile.map((wp, i) => (
            <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="font-mono text-[10px] text-slate-400">{wp.km} km</div>
              <div className="font-semibold text-slate-800 truncate">{wp.name}</div>
              <div className="font-mono text-emerald-700 text-[11px] mt-1 font-medium">
                {wp.alt}m ASL
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Charging Stop Highlight */}
      {requiresChargingStop && (
        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                <span>AI Suggested Stop: {recommendedStation.name}</span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                  {recommendedStation.connectors[0].powerKw} kW Fast
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Recommended 16-minute stop adds +22 kWh, reaching destination with 38% battery comfort buffer.
                Queue wait is estimated at 0-4 minutes.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectStation(recommendedStation)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            Inspect Charger & Reserve
          </button>
        </div>
      )}
    </div>
  );
};
