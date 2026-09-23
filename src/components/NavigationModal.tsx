/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChargingStation } from '../types';
import {
  X,
  Navigation,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Battery,
  Zap,
  ExternalLink,
  MapPin,
  Play,
  Pause
} from 'lucide-react';

interface NavigationModalProps {
  station: ChargingStation | null;
  onClose: () => void;
  userBatterySoc?: number;
  userLocationName?: string;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({
  station,
  onClose,
  userBatterySoc = 74,
  userLocationName = 'Pradhikaran, Akurdi, Pune',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSimulatingDrive, setIsSimulatingDrive] = useState(false);
  const [progressPct, setProgressPct] = useState(0);

  if (!station) return null;

  // Realistic mock turn-by-turn directions based on the station
  const steps = [
    {
      instruction: `Head south-west from ${userLocationName} toward Old Highway`,
      distance: '350 m',
      duration: '1 min',
      icon: ArrowUp,
    },
    {
      instruction: `Turn left onto Nigdi-Akurdi Spine Road`,
      distance: '1.2 km',
      duration: '3 min',
      icon: ArrowUpLeft,
    },
    {
      instruction: `Take the ramp on the right toward ${station.area}`,
      distance: '2.4 km',
      duration: '4 min',
      icon: ArrowUpRight,
    },
    {
      instruction: `At the junction, keep straight toward ${station.name}`,
      distance: `${(station.distanceKm - 1.5).toFixed(1)} km`,
      duration: '3 min',
      icon: ArrowUp,
    },
    {
      instruction: `Arrive at ${station.name} on your right. Charger bays are open.`,
      distance: '100 m',
      duration: '30 sec',
      icon: CheckCircle2,
    },
  ];

  // Simulated ETA and battery
  const estimatedDriveMinutes = Math.max(4, Math.round(station.distanceKm * 2.1));
  const estimatedBatteryConsumption = Math.max(1, Math.round((station.distanceKm * 0.15) * 10) / 10);
  const arrivalBatterySoc = Math.max(1, Math.round(userBatterySoc - estimatedBatteryConsumption));

  // Simulation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulatingDrive) {
      timer = setInterval(() => {
        setProgressPct((prev) => {
          if (prev >= 100) {
            setIsSimulatingDrive(false);
            setCurrentStepIndex(steps.length - 1);
            return 100;
          }
          const next = prev + 5;
          const stepIdx = Math.min(steps.length - 1, Math.floor((next / 100) * steps.length));
          setCurrentStepIndex(stepIdx);
          return next;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isSimulatingDrive, steps.length]);

  const activeStep = steps[currentStepIndex];
  const StepIcon = activeStep.icon;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.coordinates.lat},${station.coordinates.lng}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Google Maps Style Navigation Header */}
        <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-start justify-between shadow-md">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-700/80 border border-emerald-600 flex items-center justify-center shrink-0">
              <StepIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-wide uppercase text-emerald-200">
                Turn-by-Turn Navigation · Step {currentStepIndex + 1} of {steps.length}
              </div>
              <h2 className="text-base sm:text-lg font-bold leading-snug mt-0.5">
                {activeStep.instruction}
              </h2>
              <div className="text-xs text-emerald-100 flex items-center gap-2 mt-1">
                <span>In {activeStep.distance}</span>
                <span aria-hidden="true">·</span>
                <span>{activeStep.duration}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/50 transition-colors"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Trip Telemetry Bar */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>{Math.max(1, Math.round(estimatedDriveMinutes * (1 - progressPct / 100)))} min</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="text-slate-700 font-medium">
              {(station.distanceKm * (1 - progressPct / 100)).toFixed(1)} km left
            </div>
            <span className="text-slate-300">·</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
              Light Traffic
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Battery className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              Arrival: <strong className="text-slate-900">{arrivalBatterySoc}%</strong>
            </span>
          </div>
        </div>

        {/* Modal Body: Route Map Schematic & Steps */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Drive Progress</span>
              <span className="font-mono font-semibold text-slate-800">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Interactive Route Schematic */}
          <div className="relative bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200/80">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Destination</span>
                <div className="text-sm font-bold text-slate-900">{station.name}</div>
                <div className="text-xs text-slate-500">{station.address}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {station.availablePorts} of {station.totalPorts} Plugs Free
                </span>
                <div className="text-[11px] text-slate-500 mt-1">₹{station.pricingPerKwh.toFixed(2)}/kWh</div>
              </div>
            </div>

            {/* Turn Steps List */}
            <div className="mt-3 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Full Route Overview
              </div>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {steps.map((st, idx) => {
                  const Icon = st.icon;
                  const isCurrent = idx === currentStepIndex;
                  const isPassed = idx < currentStepIndex;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                        isCurrent
                          ? 'bg-white border border-emerald-500 shadow-xs'
                          : isPassed
                          ? 'text-slate-400 bg-slate-100/50'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          isCurrent
                            ? 'bg-emerald-600 text-white'
                            : isPassed
                            ? 'bg-slate-200 text-slate-500'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className={`leading-snug ${isCurrent ? 'font-bold text-slate-900' : ''}`}>
                          {st.instruction}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {st.distance} · {st.duration}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {!isSimulatingDrive ? (
              <button
                onClick={() => setIsSimulatingDrive(true)}
                className="px-3.5 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{progressPct > 0 ? 'Resume Drive' : 'Start Simulation'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSimulatingDrive(false)}
                className="px-3.5 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            )}

            {progressPct > 0 && (
              <button
                onClick={() => {
                  setIsSimulatingDrive(false);
                  setProgressPct(0);
                  setCurrentStepIndex(0);
                }}
                className="px-2.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
                title="Restart route"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-lg transition-colors"
            >
              Exit Navigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
