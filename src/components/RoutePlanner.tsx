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
  MapPin,
  Clock,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Sparkles,
  Sliders,
  Play
} from 'lucide-react';

interface RoutePlannerProps {
  stations: ChargingStation[];
  onSelectStation: (station: ChargingStation) => void;
  onOpenNavigationModal?: (station: ChargingStation) => void;
  destinationStation?: ChargingStation | null;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  stations,
  onSelectStation,
  onOpenNavigationModal,
  destinationStation,
}) => {
  const [originText, setOriginText] = useState('Pradhikaran, Akurdi, Pune');
  const [destinationText, setDestinationText] = useState('Bandra Kurla Complex (BKC), Mumbai');
  const [currentBatterySoc, setCurrentBatterySoc] = useState<number>(68);
  const [vehicleRangeKm, setVehicleRangeKm] = useState<number>(310);
  const [selectedVehicle, setSelectedVehicle] = useState<EVVehicle>(VEHICLE_PRESETS[0]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Pre-configured route calculation demo
  const routeDistanceKm = 148;
  const estimatedDriveTime = '2 hours 35 mins';
  const expectedBatteryUsagePct = Math.round((routeDistanceKm / vehicleRangeKm) * 100 * 1.12);
  const arrivalWithoutCharge = Math.max(0, currentBatterySoc - expectedBatteryUsagePct);
  const needsChargingStop = arrivalWithoutCharge < 18;

  const recommendedStop = stations.find((s) => s.id === 'st-03') || stations[0]; // Urse Expressway Plaza
  const estimatedChargingTimeMins = 18;
  const arrivalBatteryWithStop = 42;

  const handleOptimizeRoute = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Navigation className="w-4 h-4" />
            <span>Smart Trip & Range Planner</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Plan Your Journey
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Range-aware trip planning that predicts battery consumption and automatically plots optimal fast charging stops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOptimizeRoute}
            disabled={isOptimizing}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isOptimizing ? 'Optimizing...' : 'Optimize Route'}</span>
          </button>

          {onOpenNavigationModal && (
            <button
              onClick={() => onOpenNavigationModal(recommendedStop)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Navigation</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) and Results / Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Inputs (5 Cols on LG) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Trip Parameters</span>
          </h2>

          {/* From Input */}
          <div className="space-y-1 text-xs">
            <label className="text-slate-600 font-medium block">Starting Location (From)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={originText}
                onChange={(e) => setOriginText(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden font-medium"
              />
            </div>
          </div>

          {/* To Input */}
          <div className="space-y-1 text-xs">
            <label className="text-slate-600 font-medium block">Destination (To)</label>
            <div className="relative">
              <Navigation className="w-4 h-4 absolute left-3 top-2.5 text-emerald-700" />
              <input
                type="text"
                value={destinationText}
                onChange={(e) => setDestinationText(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Current Battery % Slider */}
          <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Current Battery Percentage</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{currentBatterySoc}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={currentBatterySoc}
              onChange={(e) => setCurrentBatterySoc(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% Low</span>
              <span>50%</span>
              <span>100% Full</span>
            </div>
          </div>

          {/* Vehicle Range Slider */}
          <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Vehicle Real-World Range</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{vehicleRangeKm} km</span>
            </div>
            <input
              type="range"
              min="150"
              max="500"
              step="10"
              value={vehicleRangeKm}
              onChange={(e) => setVehicleRangeKm(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>150 km</span>
              <span>310 km (Default)</span>
              <span>500 km</span>
            </div>
          </div>

          {/* Vehicle Selector */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-600 font-medium block">Select Vehicle Model</label>
            <div className="grid grid-cols-2 gap-2">
              {VEHICLE_PRESETS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVehicle(v);
                    setVehicleRangeKm(v.realWorldRangeKm);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedVehicle.id === v.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="truncate text-xs">{v.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {v.batteryKwh} kWh · {v.realWorldRangeKm} km
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output: Route Metrics & Clear Timeline (7 Cols on LG) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-medium block">Distance</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                {routeDistanceKm} km
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Total route</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-medium block">Travel Time</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                {estimatedDriveTime}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Includes charging</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-medium block">Battery Usage</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                ~{expectedBatteryUsagePct}%
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Without recharge</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-medium block">Arrival SoC</span>
              <span className="text-base font-bold text-emerald-700 font-mono mt-0.5 block">
                {arrivalBatteryWithStop}%
              </span>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">With 1 stop</span>
            </div>
          </div>

          {/* Required Route Timeline: Start ↓ Drive ↓ Recommended Charger ↓ Charge ↓ Continue Journey ↓ Destination */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Recommended Journey Timeline
              </h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Optimal 1-Stop Plan
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1: Start */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Start Journey</div>
                  <div className="text-[11px] text-slate-500">{originText}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    Starting Battery: <strong className="text-slate-900">{currentBatterySoc}%</strong>
                  </div>
                </div>
              </div>

              {/* Step 2: Drive */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-800">Drive 28 km on NH 48 Expressway</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Cruising at 85 km/h · Battery will decrease from {currentBatterySoc}% to {Math.max(10, currentBatterySoc - 16)}%
                  </div>
                </div>
              </div>

              {/* Step 3: Recommended Charger */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Recommended Fast Charger Stop
                      </span>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {recommendedStop.name}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {recommendedStop.address} · {recommendedStop.connectors[0].powerKw} kW CCS2
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectStation(recommendedStop)}
                      className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      View Station
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 4: Charge */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-800">
                    Charge for {estimatedChargingTimeMins} minutes
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Restores battery from {Math.max(10, currentBatterySoc - 16)}% back to 80% (+26 kWh)
                  </div>
                </div>
              </div>

              {/* Step 5: Continue Journey */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-800">Continue Journey (120 km)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Bypass Khopoli Ghat (Regenerative braking recharges +3.8% battery on descent)
                  </div>
                </div>
              </div>

              {/* Step 6: Destination */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Arrive at Destination</div>
                  <div className="text-[11px] text-slate-500">{destinationText}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    Estimated Arrival Battery: {arrivalBatteryWithStop}% (Safe Reserve)
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar at Bottom of Timeline */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                100% verified route with reliable high-speed charging.
              </span>

              {onOpenNavigationModal && (
                <button
                  onClick={() => onOpenNavigationModal(recommendedStop)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Start Navigation to Stop</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
