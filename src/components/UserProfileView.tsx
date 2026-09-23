/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChargingStation, UserProfile } from '../types';
import { MOCK_TRIP_HISTORY, VEHICLE_PRESETS } from '../data/mockData';
import {
  User,
  Mail,
  Car,
  Battery,
  Compass,
  Bookmark,
  Clock,
  Bell,
  MapPin,
  CheckCircle2,
  Navigation,
  ExternalLink,
  Save,
  Trash2
} from 'lucide-react';

interface UserProfileViewProps {
  userProfile: UserProfile;
  stations: ChargingStation[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onNavigateToStation: (station: ChargingStation) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userProfile,
  stations,
  onUpdateProfile,
  onNavigateToStation,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [notifications, setNotifications] = useState(userProfile.notificationsEnabled);
  const [preferredPlug, setPreferredPlug] = useState(userProfile.preferredPlug);
  const [selectedVehicleId, setSelectedVehicleId] = useState(userProfile.vehicle.id);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const savedStations = stations.filter((s) =>
    userProfile.savedStationIds.includes(s.id)
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle =
      VEHICLE_PRESETS.find((v) => v.id === selectedVehicleId) || userProfile.vehicle;

    onUpdateProfile({
      name,
      email,
      notificationsEnabled: notifications,
      preferredPlug,
      vehicle,
    });

    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleRemoveSavedStation = (stationId: string) => {
    const nextSaved = userProfile.savedStationIds.filter((id) => id !== stationId);
    onUpdateProfile({ savedStationIds: nextSaved });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{userProfile.name}</h1>
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold rounded-full">
                Active EV Driver
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{userProfile.email}</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 sm:text-right">
          <div className="text-slate-400">Current Location</div>
          <div className="font-semibold text-slate-800 flex items-center gap-1 sm:justify-end mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{userProfile.currentLocationName}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Vehicle & Settings */}
        <div className="space-y-6 md:col-span-2">
          {/* Registered Vehicle Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-700" />
                <span>My Electric Vehicle</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {userProfile.vehicle.brand}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Model</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {userProfile.vehicle.name}
                </span>
                <span className="text-[10px] text-slate-500">{userProfile.vehicle.connectorType} Compatible</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Battery Pack</span>
                <span className="font-bold text-emerald-700 text-sm font-mono mt-0.5 block">
                  {userProfile.vehicle.batteryKwh} kWh
                </span>
                <span className="text-[10px] text-slate-500">Usable Capacity</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Average Real-World Range</span>
                <span className="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                  {userProfile.vehicle.realWorldRangeKm} km
                </span>
                <span className="text-[10px] text-slate-500">Tested Highway Buffer</span>
              </div>
            </div>
          </div>

          {/* Saved Charging Stations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-700" />
                <span>Saved Charging Stations</span>
              </h2>
              <span className="text-xs text-slate-500">
                {savedStations.length} saved
              </span>
            </div>

            {savedStations.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No saved stations yet. Click "Save Station" on any charger card to pin it here.
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedStations.map((station) => (
                  <div
                    key={station.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{station.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {station.area} · {station.distanceKm} km · {station.availablePorts} free
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateToStation(station)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate</span>
                      </button>

                      <button
                        onClick={() => handleRemoveSavedStation(station.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trip History */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Recent Journeys</span>
              </h2>
              <span className="text-xs text-slate-500">Last 30 days</span>
            </div>

            <div className="space-y-2.5">
              {MOCK_TRIP_HISTORY.map((trip) => (
                <div
                  key={trip.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {trip.from} → {trip.to}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {trip.date} · {trip.distanceKm} km · Used {trip.batteryUsedPct}% battery
                    </div>
                    {trip.chargingStopName && (
                      <div className="text-[11px] text-emerald-700 mt-0.5">
                        Charged at: {trip.chargingStopName}
                      </div>
                    )}
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs font-semibold text-emerald-700">
                      Saved ₹{trip.costSavedInr}
                    </span>
                    <div className="text-[10px] text-slate-400">vs petrol/diesel</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs"
          >
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Profile Settings
            </h2>

            {isSavedNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Preferences saved successfully!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-600 font-medium">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-medium">Vehicle Preset</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
              >
                {VEHICLE_PRESETS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.batteryKwh} kWh)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-medium">Preferred Plug Type</label>
              <select
                value={preferredPlug}
                onChange={(e) => setPreferredPlug(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
              >
                <option value="CCS2">CCS2 (Combo DC Fast)</option>
                <option value="Type 2">Type 2 (AC Destination)</option>
                <option value="GB/T">GB/T (Fast DC)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Charger availability alerts</span>
              </label>

              <div className="text-[11px] text-slate-400">
                Theme: Clean Light (Standard EVAtlas Interface)
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
