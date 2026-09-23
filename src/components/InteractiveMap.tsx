/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChargingStation, MobileChargingVan, PlanningZone } from '../types';
import {
  Zap,
  Sun,
  Truck,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface InteractiveMapProps {
  stations: ChargingStation[];
  selectedStationId: string | null;
  onSelectStation: (station: ChargingStation) => void;
  mobileVans?: MobileChargingVan[];
  selectedVanId?: string | null;
  showHeatmap?: boolean;
  planningZones?: PlanningZone[];
  activeRouteWaypoints?: { x: number; y: number; name: string }[];
  emergencyStrandedLocation?: { x: number; y: number } | null;
  isDispatching?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  mobileVans = [],
  selectedVanId,
  showHeatmap = false,
  planningZones = [],
  activeRouteWaypoints = [],
  emergencyStrandedLocation = null,
  isDispatching = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState<'all' | 'solar' | 'fast'>('all');
  const [hoveredStation, setHoveredStation] = useState<ChargingStation | null>(null);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.9), 2.2));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const filteredStations = stations.filter((s) => {
    if (activeLayer === 'solar') return s.solarPowered;
    if (activeLayer === 'fast') return s.connectors.some((c) => c.powerKw >= 120);
    return true;
  });

  return (
    <div className="relative w-full h-[540px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 select-none shadow-xs">
      {/* Map Control Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-lg border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            activeLayer === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Hubs ({stations.length})
        </button>
        <button
          onClick={() => setActiveLayer('solar')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
            activeLayer === 'solar'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sun className="w-3 h-3" />
          Solar Canopy
        </button>
        <button
          onClick={() => setActiveLayer('fast')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
            activeLayer === 'fast'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3 h-3" />
          120kW+ Fast
        </button>
      </div>

      {/* Zoom / View controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 bg-white/90 backdrop-blur-md p-1 rounded-lg border border-slate-200 shadow-xs">
        <button
          onClick={() => handleZoom(0.2)}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Reset map view"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Map Key / Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-lg border border-slate-200 text-xs shadow-xs hidden sm:block">
        <div className="text-[11px] font-semibold text-slate-800 mb-1.5">Pune & PCMC Transit Grid</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Available Fast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>In Use / Queued</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span>Mobile Van (SOS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
            <span>Solar Integrated</span>
          </div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: '50% 50%',
          }}
        >
          <defs>
            {/* Soft grid background */}
            <pattern id="grid-pattern" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#e2e8f0" strokeWidth="0.15" />
            </pattern>

            {/* Heatmap gradients for demand zones */}
            <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.38" />
              <stop offset="60%" stopColor="#fb923c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heat-medium" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pulse-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background landmass */}
          <rect width="100" height="100" fill="#f8fafc" />
          <rect width="100" height="100" fill="url(#grid-pattern)" />

          {/* Green parks / Bio zones */}
          <ellipse cx="44" cy="63" rx="8" ry="5" fill="#ecfdf5" opacity="0.8" />
          <ellipse cx="30" cy="48" rx="6" ry="6" fill="#f0fdf4" opacity="0.7" />
          <ellipse cx="78" cy="40" rx="9" ry="7" fill="#f0fdf4" opacity="0.6" />

          {/* Mula-Mutha & Pavana Rivers */}
          <path
            d="M 10 18 Q 30 35 48 42 T 75 58 Q 88 64 98 72"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 32 32 Q 45 36 60 38 T 88 44"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Regional Road & Expressway Network */}
          {/* Mumbai-Pune Expressway */}
          <path
            d="M 5 10 L 25 28 L 38 46 L 46 60 L 58 72 L 72 82"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.8"
            strokeDasharray="1.5 1.5"
          />
          <path
            d="M 5 10 L 25 28 L 38 46 L 46 60 L 58 72 L 72 82"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.0"
          />

          {/* Pune Ring Road / Arterial bypass */}
          <path
            d="M 24 50 Q 50 25 80 40 T 78 80 Q 45 92 24 75 Z"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.2"
          />

          {/* Hinjawadi - PCMC - Viman Nagar Cross Spine */}
          <line x1="22" y1="54" x2="88" y2="58" stroke="#cbd5e1" strokeWidth="0.9" />
          <line x1="42" y1="20" x2="48" y2="85" stroke="#cbd5e1" strokeWidth="0.9" />

          {/* Zone Labels */}
          <text x="18" y="18" fill="#64748b" fontSize="2.2" fontWeight="600">Urse Toll (Expressway)</text>
          <text x="36" y="30" fill="#0f766e" fontSize="2.4" fontWeight="700">Akurdi Mobility Hub</text>
          <text x="16" y="56" fill="#64748b" fontSize="2.2" fontWeight="600">Hinjawadi IT Park</text>
          <text x="62" y="33" fill="#64748b" fontSize="2.2" fontWeight="600">Bhosari MIDC</text>
          <text x="44" y="77" fill="#64748b" fontSize="2.2" fontWeight="600">Shivajinagar Central</text>
          <text x="76" y="54" fill="#64748b" fontSize="2.2" fontWeight="600">Viman Nagar / Airport</text>

          {/* Planning Zone Heatmaps (if toggled or planner mode) */}
          {showHeatmap &&
            planningZones.map((zone) => (
              <circle
                key={zone.id}
                cx={zone.mapCoords.x}
                cy={zone.mapCoords.y}
                r={zone.mapCoords.radius}
                fill={zone.deficitIndex > 75 ? 'url(#heat-high)' : 'url(#heat-medium)'}
              />
            ))}

          {/* Active Route Path Waypoints (if route planning is active) */}
          {activeRouteWaypoints.length > 1 && (
            <polyline
              points={activeRouteWaypoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#059669"
              strokeWidth="1.4"
              strokeDasharray="2 1.5"
            />
          )}

          {/* Emergency Stranded EV & Dispatch Vector Line */}
          {emergencyStrandedLocation && (
            <>
              {/* Radar pulse around stranded EV */}
              <circle
                cx={emergencyStrandedLocation.x}
                cy={emergencyStrandedLocation.y}
                r="6"
                fill="#f43f5e"
                opacity="0.2"
                className="animate-ping"
              />
              <circle
                cx={emergencyStrandedLocation.x}
                cy={emergencyStrandedLocation.y}
                r="2.5"
                fill="#e11d48"
                stroke="#ffffff"
                strokeWidth="0.6"
              />
              <text
                x={emergencyStrandedLocation.x + 3.5}
                y={emergencyStrandedLocation.y + 1}
                fill="#be123c"
                fontSize="2.1"
                fontWeight="700"
              >
                Stranded EV (2% SoC)
              </text>

              {/* Dispatch route to Mobile Van if dispatching */}
              {isDispatching && mobileVans[0] && (
                <line
                  x1={mobileVans[0].mapCoords.x}
                  y1={mobileVans[0].mapCoords.y}
                  x2={emergencyStrandedLocation.x}
                  y2={emergencyStrandedLocation.y}
                  stroke="#2563eb"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
              )}
            </>
          )}

          {/* Mobile Charging Vans Pins */}
          {mobileVans.map((van) => (
            <g
              key={van.id}
              transform={`translate(${van.mapCoords.x}, ${van.mapCoords.y})`}
              className="cursor-pointer transition-transform hover:scale-125"
            >
              <circle
                cx="0"
                cy="0"
                r={selectedVanId === van.id ? '4' : '3'}
                fill={van.status === 'Available' ? '#2563eb' : '#64748b'}
                stroke="#ffffff"
                strokeWidth="0.8"
                className={van.status === 'En Route' ? 'animate-pulse' : ''}
              />
              <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
              <text x="3.5" y="1" fill="#1e40af" fontSize="1.8" fontWeight="600">
                {van.name.split(' ')[0]} {van.name.split(' ')[1]}
              </text>
            </g>
          ))}

          {/* Charging Station Pins */}
          {filteredStations.map((station) => {
            const isSelected = selectedStationId === station.id;
            const isAvailable = station.availablePorts > 0;

            return (
              <g
                key={station.id}
                transform={`translate(${station.coordinates.mapX}, ${station.coordinates.mapY})`}
                onClick={() => onSelectStation(station)}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
                className="cursor-pointer group"
              >
                {/* Selection halo */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r="5.5"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="0.7"
                    strokeDasharray="1.5 1"
                    className="animate-spin"
                  />
                )}

                {/* Base pin */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? '3.2' : '2.5'}
                  fill={isAvailable ? '#10b981' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth="0.7"
                  className="transition-all duration-200 group-hover:scale-110"
                />

                {/* Solar Indicator Dot on pin */}
                {station.solarPowered && (
                  <circle cx="1.8" cy="-1.8" r="1.1" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.3" />
                )}

                {/* Label on selected or hovered */}
                {(isSelected || hoveredStation?.id === station.id) && (
                  <g transform="translate(0, -5)">
                    <rect
                      x="-14"
                      y="-4.5"
                      width="28"
                      height="5"
                      rx="1"
                      fill="#0f172a"
                      fillOpacity="0.92"
                    />
                    <text
                      x="0"
                      y="-1.2"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="1.9"
                      fontWeight="600"
                    >
                      {station.name.length > 22 ? station.name.slice(0, 20) + '...' : station.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Station Floating Quick Info Card */}
      {selectedStationId && (
        <div className="absolute bottom-3 right-3 z-20 max-w-xs bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md">
          {(() => {
            const st = stations.find((s) => s.id === selectedStationId);
            if (!st) return null;
            return (
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{st.name}</h4>
                  <span
                    className={`text-[10px] font-semibold ${
                      st.availablePorts > 0 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {st.availablePorts}/{st.totalPorts} Free
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {st.area} · ₹{st.pricingPerKwh.toFixed(2)}/kWh · {st.distanceKm} km away
                </div>
                {st.solarPowered && (
                  <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Solar Canopy: {st.currentSolarGenerationKw.toFixed(1)} kW live</span>
                  </div>
                )}
                <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>Queue Wait: ~{st.queueEstimateMinutes} min</span>
                  <span className="font-semibold text-emerald-600">{st.reliabilityScore}% Uptime</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
