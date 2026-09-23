/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChargingStation, Connector } from '../types';
import {
  Search,
  Filter,
  Zap,
  Sun,
  Clock,
  MapPin,
  ShieldCheck,
  BatteryCharging,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Gauge
} from 'lucide-react';

interface StationFinderProps {
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  onSelectStation: (station: ChargingStation) => void;
  onSetAsRouteDestination: (station: ChargingStation) => void;
  onTriggerSos: () => void;
}

export const StationFinder: React.FC<StationFinderProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  onSetAsRouteDestination,
  onTriggerSos,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState<string>('all');
  const [minPower, setMinPower] = useState<number>(0);
  const [onlySolar, setOnlySolar] = useState(false);
  const [activeTabModal, setActiveTabModal] = useState<'details' | 'simulate'>('details');

  // Charging session simulation state
  const [isCharging, setIsCharging] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(24);
  const [chargedEnergyKwh, setChargedEnergyKwh] = useState(0);
  const [chargingCostInr, setChargingCostInr] = useState(0);
  const [isReserved, setIsReserved] = useState(false);
  const [reservationTimer, setReservationTimer] = useState<number | null>(null);

  // Filter stations
  const filtered = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesConnector =
      selectedConnector === 'all' ||
      station.connectors.some((c) => c.type === selectedConnector);

    const matchesPower =
      minPower === 0 ||
      station.connectors.some((c) => c.powerKw >= minPower);

    const matchesSolar = !onlySolar || station.solarPowered;

    return matchesSearch && matchesConnector && matchesPower && matchesSolar;
  });

  const handleStartCharging = () => {
    setIsCharging(true);
    const interval = window.setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev >= 80) {
          clearInterval(interval);
          setIsCharging(false);
          return 80;
        }
        return prev + 1;
      });
      setChargedEnergyKwh((prev) => +(prev + 0.45).toFixed(2));
      setChargingCostInr((prev) => +(prev + 6.8).toFixed(2));
    }, 400);
  };

  const handleReserve = () => {
    setIsReserved(true);
    setReservationTimer(15);
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Pune / PCMC stations by area, highway, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 transition-colors"
            />
          </div>

          {/* Quick SOS Trigger button */}
          <button
            onClick={onTriggerSos}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Low Battery? Request Mobile SOS Van</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Connector selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Plug:</span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-md">
              {['all', 'CCS2', 'Type 2', 'GB/T'].map((plug) => (
                <button
                  key={plug}
                  onClick={() => setSelectedConnector(plug)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    selectedConnector === plug
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {plug === 'all' ? 'All Plugs' : plug}
                </button>
              ))}
            </div>
          </div>

          {/* Speed selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Speed:</span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-md">
              {[
                { label: 'Any', value: 0 },
                { label: '60kW+', value: 60 },
                { label: '120kW+', value: 120 },
              ].map((spd) => (
                <button
                  key={spd.value}
                  onClick={() => setMinPower(spd.value)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    minPower === spd.value
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {spd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Solar canopy toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
            <input
              type="checkbox"
              checked={onlySolar}
              onChange={(e) => setOnlySolar(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-1 font-medium">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Solar Powered Only
            </span>
          </label>
        </div>
      </div>

      {/* Stations List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((station) => {
          const isSelected = selectedStation?.id === station.id;
          const maxKw = Math.max(...station.connectors.map((c) => c.powerKw));

          return (
            <div
              key={station.id}
              onClick={() => onSelectStation(station)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer bg-white ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Card Header: Title & Availability */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                    {station.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>{station.area}</span>
                    <span aria-hidden="true">·</span>
                    <span>{station.distanceKm} km</span>
                    <span aria-hidden="true">·</span>
                    <span>₹{station.pricingPerKwh.toFixed(2)}/kWh</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-xs font-bold ${
                      station.availablePorts > 0 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {station.availablePorts} of {station.totalPorts} Free
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {station.queueEstimateMinutes === 0
                      ? 'No wait'
                      : `~${station.queueEstimateMinutes}m queue`}
                  </div>
                </div>
              </div>

              {/* Connector Badges (Clean functional buttons/spec) */}
              <div className="flex flex-wrap items-center gap-2 my-2.5">
                {station.connectors.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700"
                  >
                    <Zap className="w-3 h-3 text-emerald-600" />
                    <span className="font-semibold">{c.type}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-slate-600">{c.powerKw} kW</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">
                      {c.available}/{c.total}
                    </span>
                  </div>
                ))}
              </div>

              {/* Solar & Reliability Bar */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  {station.solarPowered ? (
                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Solar Canopy ({station.currentSolarGenerationKw.toFixed(1)} kW)</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">Standard Grid</span>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{station.reliabilityScore}% uptime</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStation(station);
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Station Deep Details Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{selectedStation.operator}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{selectedStation.area}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedStation.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedStation.address}</p>
              </div>

              <button
                onClick={() => onSelectStation(null as any)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center px-5 border-b border-slate-200 bg-white gap-4 text-xs font-medium">
              <button
                onClick={() => setActiveTabModal('details')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTabModal === 'details'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Charger Availability & Wait Times
              </button>
              <button
                onClick={() => setActiveTabModal('simulate')}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTabModal === 'simulate'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BatteryCharging className="w-3.5 h-3.5" />
                Simulate Charging Your EV
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              {activeTabModal === 'details' ? (
                <>
                  {/* Overview Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Electricity Rate</div>
                      <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                        ₹{selectedStation.pricingPerKwh.toFixed(2)}
                        <span className="text-xs text-slate-500 font-normal">/kWh</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Estimated Wait</div>
                      <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                        {selectedStation.queueEstimateMinutes === 0 ? 'No wait' : `${selectedStation.queueEstimateMinutes} min`}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Clean Solar Power</div>
                      <div className="text-base font-bold text-amber-700 font-mono mt-0.5">
                        {selectedStation.currentSolarGenerationKw.toFixed(1)}
                        <span className="text-xs text-slate-500 font-normal"> kW</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Local Grid Load</div>
                      <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                        {selectedStation.gridLoadPercentage}%
                      </div>
                    </div>
                  </div>

                  {/* Individual Connector Bays */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2">Charging Plugs at this Location</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedStation.connectors.map((c, i) => (
                        <div
                          key={c.id}
                          className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                              {String.fromCharCode(65 + i)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">
                                {c.type} Fast Charger
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Speed: {c.powerKw} kW Rapid
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              c.available > 0 ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {c.available > 0 ? 'Open & Ready' : 'In Use'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 24-Hour AI Occupancy & Demand Curve */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-bold text-slate-900">
                        Best Times to Charge (24-Hour Wait Forecast)
                      </h4>
                      <span className="text-[11px] text-slate-400">Live Forecast</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="h-20 flex items-end gap-1 pt-2">
                        {selectedStation.hourlyOccupancy.map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <div
                              className={`w-full rounded-t transition-all ${
                                val > 85
                                  ? 'bg-rose-500'
                                  : val > 60
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ height: `${val * 0.7}px` }}
                            />
                            {idx % 4 === 0 && (
                              <span className="text-[9px] text-slate-400 font-mono">
                                {idx}:00
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200 mt-2">
                        <span>Green: Fast & Open (Low Demand)</span>
                        <span>Orange/Red: Busy Hours (Expect Wait)</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1.5">On-Site Amenities</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStation.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Interactive Charging Simulation Tab */
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                        <BatteryCharging className="w-4 h-4 text-emerald-600" />
                        <span>Connected to Dispenser Bay A (120 kW CCS2)</span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-emerald-800">
                        {isCharging ? 'Charging in progress...' : 'Ready to charge'}
                      </span>
                    </div>

                    {/* Battery Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-emerald-950 font-medium">
                        <span>Vehicle State of Charge (SoC)</span>
                        <span className="font-mono font-bold text-sm">{batteryLevel}%</span>
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${batteryLevel}%` }}
                        />
                      </div>
                    </div>

                    {/* Live Telemetry Meters */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200 text-xs">
                      <div>
                        <div className="text-[11px] text-emerald-800">Energy Delivered</div>
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          {chargedEnergyKwh} kWh
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-emerald-800">Solar Power Share</div>
                        <div className="font-mono font-bold text-amber-700 text-sm">
                          {selectedStation.solarPowered ? '68% Green' : '0%'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-emerald-800">Estimated Cost</div>
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          ₹{chargingCostInr}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {!isCharging ? (
                      <button
                        onClick={handleStartCharging}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Zap className="w-4 h-4" />
                        Start Live Charge Session
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsCharging(false)}
                        className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Stop Charging
                      </button>
                    )}

                    <button
                      onClick={() => setBatteryLevel(24)}
                      className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                    >
                      Reset Sim
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isReserved ? (
                  <button
                    onClick={handleReserve}
                    className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Reserve Bay (15m hold)
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bay Reserved for 15 mins</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSetAsRouteDestination(selectedStation);
                    onSelectStation(null as any);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Navigate to Station</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
