/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MobileChargingVan } from '../types';
import {
  AlertTriangle,
  Truck,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  BatteryCharging,
  RotateCcw
} from 'lucide-react';

interface EmergencyHelpProps {
  currentLocationName?: string;
  nearbyVan: MobileChargingVan;
  onNavigateToStation?: () => void;
}

export const EmergencyHelp: React.FC<EmergencyHelpProps> = ({
  currentLocationName = 'Nigdi-Akurdi Highway, PCMC, Pune',
  nearbyVan,
  onNavigateToStation,
}) => {
  const [requestStatus, setRequestStatus] = useState<
    'idle' | 'requested' | 'en_route' | 'arrived' | 'charging' | 'completed'
  >('idle');
  const [etaRemainingMins, setEtaRemainingMins] = useState(nearbyVan.etaMinutes || 11);

  const handleRequestHelp = () => {
    setRequestStatus('requested');
    setTimeout(() => {
      setRequestStatus('en_route');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Simple Stress-Free Header */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-sm">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Need Charging Help?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          If your battery is critically low or empty, request a mobile charging van to come directly to your roadside location.
        </p>
      </div>

      {/* Main Status & Action Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        {requestStatus === 'idle' && (
          <>
            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Your Current Location</span>
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="line-clamp-1">{currentLocationName}</span>
                </div>
                <div className="text-[11px] text-slate-500">GPS location confirmed</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Nearby Assistance Van</span>
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{nearbyVan.name}</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{nearbyVan.distanceKm} km away · ETA ~{nearbyVan.etaMinutes} mins</span>
                </div>
              </div>
            </div>

            {/* Clear Primary & Secondary Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleRequestHelp}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Truck className="w-5 h-5" />
                <span>Request Charging Assistance</span>
              </button>

              <a
                href="tel:18002008888"
                className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <PhoneCall className="w-4 h-4 text-slate-600" />
                <span>Call Emergency Helpline (1800-200-8888)</span>
              </a>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              Assistance vans carry 80kWh batteries and rapid 40kW DC fast chargers compatible with all electric vehicles.
            </div>
          </>
        )}

        {/* When Requested / En Route */}
        {requestStatus !== 'idle' && (
          <div className="space-y-5 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              {requestStatus === 'en_route' ? (
                <Truck className="w-7 h-7 text-emerald-700 animate-bounce" />
              ) : requestStatus === 'charging' ? (
                <BatteryCharging className="w-7 h-7 text-emerald-700 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-7 h-7 text-emerald-700" />
              )}
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                {requestStatus === 'requested' && 'Finding Nearest Van...'}
                {requestStatus === 'en_route' && 'Van is En Route'}
                {requestStatus === 'arrived' && 'Van Arrived on Scene'}
                {requestStatus === 'charging' && 'Emergency Boost Active'}
                {requestStatus === 'completed' && 'Boost Complete · Safe to Drive'}
              </span>

              <h2 className="text-xl font-bold text-slate-900 mt-3">
                {requestStatus === 'en_route' && `${nearbyVan.name} is on the way`}
                {requestStatus === 'arrived' && 'Technician is connecting rapid charger'}
                {requestStatus === 'charging' && 'Transferring 8 kWh power buffer (+32 km range)'}
                {requestStatus === 'completed' && 'Your vehicle has +32 km range restored!'}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Driver: {nearbyVan.driverName} · Plate: {nearbyVan.vehiclePlate}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-xs space-y-2 text-left">
              <div className="flex justify-between text-slate-600">
                <span>Estimated Arrival:</span>
                <span className="font-bold text-slate-900">~{etaRemainingMins} minutes</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Meeting Location:</span>
                <span className="font-medium text-slate-900">{currentLocationName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Assistance Type:</span>
                <span className="font-medium text-slate-900">Rapid 40kW DC Boost</span>
              </div>
            </div>

            {/* Advance simulation buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {requestStatus === 'en_route' && (
                <button
                  onClick={() => setRequestStatus('arrived')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Simulate Van Arrival
                </button>
              )}

              {requestStatus === 'arrived' && (
                <button
                  onClick={() => setRequestStatus('charging')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Simulate Start Charging
                </button>
              )}

              {requestStatus === 'charging' && (
                <button
                  onClick={() => setRequestStatus('completed')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Simulate Finish Boost
                </button>
              )}

              {requestStatus === 'completed' && onNavigateToStation && (
                <button
                  onClick={onNavigateToStation}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate to Nearest Fixed Charger</span>
                </button>
              )}

              <button
                onClick={() => setRequestStatus('idle')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
