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
  Navigation,
  Bookmark,
  Star,
  DollarSign,
  Gauge
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

interface StationFinderProps {
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  onSelectStation: (station: ChargingStation | null) => void;
  onOpenNavigation: (station: ChargingStation) => void;
  savedStationIds?: string[];
  onToggleSave?: (stationId: string) => void;
  onTriggerSos?: () => void;
}

export const StationFinder: React.FC<StationFinderProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  onOpenNavigation,
  savedStationIds = [],
  onToggleSave,
  onTriggerSos,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState<string>('all');
  const [minPower, setMinPower] = useState<number>(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlySolar, setOnlySolar] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(25);
  const [maxPriceInr, setMaxPriceInr] = useState<number>(25);
  const [activeTabModal, setActiveTabModal] = useState<'details' | 'simulate'>('details');

  // Charging session simulation state inside modal
  const [isCharging, setIsCharging] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(24);
  const [chargedEnergyKwh, setChargedEnergyKwh] = useState(0);
  const [chargingCostInr, setChargingCostInr] = useState(0);
  const [isReserved, setIsReserved] = useState(false);

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

    const matchesAvailability = !onlyAvailable || station.availablePorts > 0;
    const matchesSolar = !onlySolar || station.solarPowered;
    const matchesDistance = station.distanceKm <= maxDistanceKm;
    const matchesPrice = station.pricingPerKwh <= maxPriceInr;

    return (
      matchesSearch &&
      matchesConnector &&
      matchesPower &&
      matchesAvailability &&
      matchesSolar &&
      matchesDistance &&
      matchesPrice
    );
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

  const isCurrentStationSaved =
    selectedStation && savedStationIds.includes(selectedStation.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <MapPin className="w-4 h-4" />
            <span>Interactive Charger Network</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Find an EV Charger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search verified high-speed charging points with real-time bay availability and wait estimates.
          </p>
        </div>

        {onTriggerSos && (
          <button
            onClick={onTriggerSos}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Low Battery? Request Rescue Van</span>
          </button>
        )}
      </div>

      {/* Main Layout: Left Search & Filters, Right Interactive Map + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Search & Filters Panel (4 Cols on LG) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Search & Filters</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {filtered.length} of {stations.length} hubs
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search area, landmark or station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 outline-hidden transition-all"
            />
          </div>

          {/* Filter 1: Connector Type */}
          <div className="space-y-1.5 text-xs">
            <span className="text-slate-600 font-medium block">Plug Standard</span>
            <div className="grid grid-cols-2 gap-1.5">
              {['all', 'CCS2', 'Type 2', 'GB/T'].map((plug) => (
                <button
                  key={plug}
                  onClick={() => setSelectedConnector(plug)}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-colors ${
                    selectedConnector === plug
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {plug === 'all' ? 'All Plugs' : plug}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 2: Charging Speed */}
          <div className="space-y-1.5 text-xs">
            <span className="text-slate-600 font-medium block">Minimum Charging Speed</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Any', value: 0 },
                { label: '60 kW+', value: 60 },
                { label: '120 kW+', value: 120 },
              ].map((spd) => (
                <button
                  key={spd.value}
                  onClick={() => setMinPower(spd.value)}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-colors ${
                    minPower === spd.value
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {spd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 3: Maximum Distance Slider */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Max Distance</span>
              <span className="font-mono font-bold text-slate-900">{maxDistanceKm} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="2"
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Filter 4: Max Electricity Price */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Max Rate</span>
              <span className="font-mono font-bold text-slate-900">₹{maxPriceInr}/kWh</span>
            </div>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={maxPriceInr}
              onChange={(e) => setMaxPriceInr(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Toggles: Available Now & Solar Canopy */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Available Bays Only (Open now)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={onlySolar}
                onChange={(e) => setOnlySolar(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Solar-Powered Stations Only</span>
              </span>
            </label>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedConnector('all');
              setMinPower(0);
              setOnlyAvailable(false);
              setOnlySolar(false);
              setMaxDistanceKm(25);
              setMaxPriceInr(25);
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>

        {/* Right Column: Interactive Map & Station Cards (8 Cols on LG) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive Map */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Station Map Overview</span>
              </span>
              <span className="text-slate-500">Click any marker pin to view station details</span>
            </div>

            <InteractiveMap
              stations={filtered}
              selectedStationId={selectedStation?.id || null}
              onSelectStation={(st) => onSelectStation(st)}
              showHeatmap={false}
            />
          </div>

          {/* Stations Cards List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Matching Stations ({filtered.length})</span>
              <span>Sorted by nearest distance</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filtered.map((station) => {
                const isSelected = selectedStation?.id === station.id;
                const isAvailable = station.availablePorts > 0;
                const isSaved = savedStationIds.includes(station.id);
                const primaryConn = station.connectors[0] || { type: 'CCS2', powerKw: 120 };

                return (
                  <div
                    key={station.id}
                    onClick={() => onSelectStation(station)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer bg-white flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {station.area}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                            {station.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {station.address}
                          </p>
                        </div>

                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-3 mt-3 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Distance</span>
                          <span className="font-semibold text-slate-800">{station.distanceKm} km</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block">Open Bays</span>
                          <span className="font-semibold text-slate-800">
                            {station.availablePorts} of {station.totalPorts} free
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block">Charger Speed</span>
                          <span className="font-semibold text-slate-800">
                            {primaryConn.powerKw} kW ({primaryConn.type})
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block">Electricity Rate</span>
                          <span className="font-semibold text-slate-800">
                            ₹{station.pricingPerKwh.toFixed(2)}/kWh
                          </span>
                        </div>
                      </div>

                      {/* Amenities / Solar */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <strong className="text-slate-800">4.8</strong>
                          {station.solarPowered && (
                            <span className="text-amber-700 font-medium">· Solar Hub</span>
                          )}
                        </div>

                        <span>
                          {station.queueEstimateMinutes === 0
                            ? 'No wait'
                            : `~${station.queueEstimateMinutes}m wait`}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons: Get Directions & View Station */}
                    <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenNavigation(station);
                        }}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get Directions</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStation(station);
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors"
                      >
                        View Station
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Station Details Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
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
                onClick={() => onSelectStation(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Close"
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
                    ? 'border-emerald-700 text-emerald-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Station Details & Bay Status
              </button>
              <button
                onClick={() => setActiveTabModal('simulate')}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTabModal === 'simulate'
                    ? 'border-emerald-700 text-emerald-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BatteryCharging className="w-3.5 h-3.5" />
                Simulate Charging Session
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {activeTabModal === 'details' ? (
                <>
                  {/* Overview Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-medium">Rate / kWh</div>
                      <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                        ₹{selectedStation.pricingPerKwh.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-medium">Expected Wait</div>
                      <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                        {selectedStation.queueEstimateMinutes === 0
                          ? 'No wait'
                          : `${selectedStation.queueEstimateMinutes} min`}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-medium">Solar Generation</div>
                      <div className="text-base font-bold text-amber-700 font-mono mt-0.5">
                        {selectedStation.currentSolarGenerationKw.toFixed(1)} kW
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-medium">Grid Status</div>
                      <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                        {selectedStation.gridLoadPercentage}% Load
                      </div>
                    </div>
                  </div>

                  {/* Charging Plugs List */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2">Available Charger Bays</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedStation.connectors.map((c, i) => (
                        <div
                          key={c.id}
                          className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              {String.fromCharCode(65 + i)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">
                                {c.type} Fast Charger
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {c.powerKw} kW Rapid
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              c.available > 0 ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {c.available > 0 ? 'Available' : 'Occupied'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 24-Hour Wait Forecast */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1.5">
                      24-Hour Busy Hours Forecast
                    </h4>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="h-20 flex items-end gap-1 pt-2">
                        {selectedStation.hourlyOccupancy.map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className={`w-full rounded-t transition-all ${
                                val > 85
                                  ? 'bg-rose-500'
                                  : val > 60
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-600'
                              }`}
                              style={{ height: `${val * 0.7}px` }}
                            />
                            {idx % 4 === 0 && (
                              <span className="text-[9px] text-slate-400 font-mono">
                                {idx}h
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200 mt-2">
                        <span>Green: Low Wait</span>
                        <span>Amber/Red: High Demand</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1.5">Amenities</h4>
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
                /* Simulation Tab */
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                        <BatteryCharging className="w-4 h-4 text-emerald-700" />
                        <span>Connected to Dispenser Bay A (120 kW CCS2)</span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-emerald-800">
                        {isCharging ? 'Charging active...' : 'Ready to start'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-emerald-950 font-medium">
                        <span>Vehicle Battery Level</span>
                        <span className="font-mono font-bold text-sm">{batteryLevel}%</span>
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${batteryLevel}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200 text-xs">
                      <div>
                        <div className="text-[11px] text-emerald-800">Energy Delivered</div>
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          {chargedEnergyKwh} kWh
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-emerald-800">Solar Share</div>
                        <div className="font-mono font-bold text-amber-700 text-sm">
                          {selectedStation.solarPowered ? '68% Clean' : '0%'}
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

                  <div className="flex items-center gap-3">
                    {!isCharging ? (
                      <button
                        onClick={handleStartCharging}
                        className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Start Charging</span>
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
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {onToggleSave && (
                  <button
                    onClick={() => onToggleSave(selectedStation.id)}
                    className={`px-3 py-2 border rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      isCurrentStationSaved
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isCurrentStationSaved ? 'fill-emerald-700 text-emerald-700' : ''}`} />
                    <span>{isCurrentStationSaved ? 'Saved' : 'Save Station'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const st = selectedStation;
                    onSelectStation(null);
                    onOpenNavigation(st);
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
