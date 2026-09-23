/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChargingStation, DriverTab, UserProfile } from '../types';
import {
  Battery,
  Zap,
  Navigation,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Star,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Truck
} from 'lucide-react';

interface UserDashboardProps {
  userProfile: UserProfile;
  stations: ChargingStation[];
  onNavigateToTab: (tab: DriverTab) => void;
  onOpenNavigationModal: (station: ChargingStation) => void;
  onOpenStationDetails: (station: ChargingStation) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  userProfile,
  stations,
  onNavigateToTab,
  onOpenNavigationModal,
  onOpenStationDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available' | 'fast'>('all');

  // Filter nearby stations
  const filteredStations = stations.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.area.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedFilter === 'available') return s.availablePorts > 0;
    if (selectedFilter === 'fast')
      return s.connectors.some((c) => c.powerKw >= 60);
    return true;
  });

  // Calculate nearby stats
  const totalFreeNearbyPorts = stations.reduce(
    (acc, st) => acc + (st.distanceKm <= 10 ? st.availablePorts : 0),
    0
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Top Welcome & Battery Snapshot */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>EV Driver Dashboard</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Good morning, {userProfile.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Current location: {userProfile.currentLocationName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('emergency')}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Roadside SOS</span>
            </button>

            <button
              onClick={() => onNavigateToTab('route')}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Plan Trip</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Driver Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Battery % */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Battery Level</span>
              <Battery className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {userProfile.batteryPercentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium">State of Charge</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${userProfile.batteryPercentage}%` }}
              />
            </div>
          </div>

          {/* Card 2: Remaining Range */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Remaining Range</span>
              <Compass className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {userProfile.estimatedRangeKm}
              </span>
              <span className="text-xs text-slate-500 font-medium">km remaining</span>
            </div>
            <div className="text-[11px] text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Enough for city commuting</span>
            </div>
          </div>

          {/* Card 3: Nearby Available Chargers */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Nearby Chargers</span>
              <Zap className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {totalFreeNearbyPorts}
              </span>
              <span className="text-xs text-slate-500 font-medium">ports free nearby</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Within 10 km corridor
            </div>
          </div>

          {/* Card 4: Next Planned Trip */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Next Planned Trip</span>
              <Calendar className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-sm font-bold text-slate-900 line-clamp-1">
              Pune to Mumbai BKC
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Tomorrow, 8:30 AM</span>
              <span className="text-emerald-700 font-semibold">1 Stop planned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent "Find a Charger" Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Nearby Charging Stations</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time available fast chargers around your current position
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('stations')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Open Full Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search station by name or area (e.g. Akurdi, Hinjawadi, Urse)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Nearby
            </button>
            <button
              onClick={() => setSelectedFilter('available')}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'available'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Now
            </button>
            <button
              onClick={() => setSelectedFilter('fast')}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'fast'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              60kW+ Rapid
            </button>
          </div>
        </div>

        {/* Stations Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredStations.slice(0, 6).map((station) => {
            const isAvailable = station.availablePorts > 0;
            const primaryConnector = station.connectors[0] || {
              type: 'CCS2',
              powerKw: 120,
            };

            return (
              <div
                key={station.id}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {station.area}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                        {station.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {station.address}
                      </p>
                    </div>

                    {/* Status Badge */}
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

                  {/* Quick specs grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-3 mt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Distance</span>
                      <span className="font-semibold text-slate-800">{station.distanceKm} km</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Available Ports</span>
                      <span className="font-semibold text-slate-800">
                        {station.availablePorts} of {station.totalPorts} free
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Charger Type</span>
                      <span className="font-semibold text-slate-800">
                        {primaryConnector.type} ({primaryConnector.powerKw} kW)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Electricity Rate</span>
                      <span className="font-semibold text-slate-800">
                        ₹{station.pricingPerKwh.toFixed(2)}/kWh
                      </span>
                    </div>
                  </div>

                  {/* Rating & Estimated charge time */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <strong className="text-slate-800">4.8</strong>
                      <span>(120+ ratings)</span>
                    </span>

                    <span>~25 min to 80%</span>
                  </div>
                </div>

                {/* Primary Actions: Navigate & View Details */}
                <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                  <button
                    onClick={() => onOpenNavigationModal(station)}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </button>

                  <button
                    onClick={() => onOpenStationDetails(station)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
