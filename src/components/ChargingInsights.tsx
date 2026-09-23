/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlanningZone, ChargingStation } from '../types';
import {
  TrendingUp,
  MapPin,
  Sparkles,
  Layers,
  Sun,
  Zap,
  Info,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

interface ChargingInsightsProps {
  stations: ChargingStation[];
  planningZones: PlanningZone[];
  onSelectStation?: (station: ChargingStation) => void;
}

export const ChargingInsights: React.FC<ChargingInsightsProps> = ({
  stations,
  planningZones,
  onSelectStation,
}) => {
  const [selectedZone, setSelectedZone] = useState<PlanningZone>(planningZones[0]);
  const [timeHorizon, setTimeHorizon] = useState<'current' | '6m' | '12m'>('current');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <TrendingUp className="w-4 h-4" />
            <span>AI Charging Demand & Infrastructure Heatmap</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Regional Charging Insights
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize where electric vehicle charging demand is high, where chargers are needed next, and green solar opportunities.
          </p>
        </div>

        {/* Time Horizon Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          <span className="text-slate-500 px-2 font-medium">Projection:</span>
          {(['current', '6m', '12m'] as const).map((hz) => (
            <button
              key={hz}
              onClick={() => setTimeHorizon(hz)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeHorizon === hz
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {hz === 'current' ? 'Current Demand' : hz === '6m' ? '6 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-700">Heatmap Categories:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-600">High Demand (Overloaded)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600">Medium Demand (Active)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Low Demand (Ample Capacity)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-slate-600">Infrastructure Gap (Expansion Needed)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500">
          Showing Pune & PCMC Urban Zone
        </div>
      </div>

      {/* Heatmap & AI Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Vector Heatmap */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>Interactive Urban Heatmap</span>
              </span>
              <span className="text-slate-500">Click any zone circle below to view recommendations</span>
            </div>

            <InteractiveMap
              stations={stations}
              selectedStationId={null}
              onSelectStation={onSelectStation || (() => {})}
              showHeatmap={true}
              planningZones={planningZones}
            />
          </div>

          {/* Urban Zones Quick Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {planningZones.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              const isHigh = zone.deficitIndex >= 75;

              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {zone.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isHigh ? 'High Demand' : 'Medium Demand'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    Gap Index: <strong className="text-slate-800">{zone.deficitIndex}/100</strong> · +{zone.recommendedAdditionalPorts} ports needed
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: AI Recommendation Side Panel */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">AI Recommendation</h3>
                <p className="text-[11px] text-slate-500">Targeted infrastructure advice</p>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                {selectedZone.name}
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                High charging demand is expected in this area. A new charging station with +{selectedZone.recommendedAdditionalPorts} fast ports would significantly alleviate commuter queues.
              </p>
            </div>

            {/* Zone breakdown stats */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Active Registered EVs:</span>
                <span className="font-bold text-slate-900">{selectedZone.currentFleetCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Annual EV Fleet Growth:</span>
                <span className="font-bold text-emerald-700">+{selectedZone.growthRateAnnual}% / yr</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Existing Fast Ports:</span>
                <span className="font-bold text-slate-900">{selectedZone.currentFastPorts}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Clean Solar Potential:</span>
                <span className="font-bold text-amber-700">{selectedZone.solarPotentialKwp} kWp Rooftop</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Infrastructure Gap Severity:</span>
                <span className="font-bold text-rose-700">{selectedZone.deficitIndex}% (Critical)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Recommended Action</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Deploy a high-speed solar-buffered hub with 6x 120kW CCS2 dispensers and 45kWp solar canopy to stabilize the regional grid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
