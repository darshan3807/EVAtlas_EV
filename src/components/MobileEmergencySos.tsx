/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MobileChargingVan } from '../types';
import { MOBILE_VANS } from '../data/mockData';
import {
  AlertTriangle,
  Truck,
  Battery,
  BatteryCharging,
  Navigation,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  Radio
} from 'lucide-react';

interface MobileEmergencySosProps {
  onNavigateToFixedCharger: () => void;
  onSetSimulationState: (isDispatching: boolean, location: { x: number; y: number } | null) => void;
}

export const MobileEmergencySos: React.FC<MobileEmergencySosProps> = ({
  onNavigateToFixedCharger,
  onSetSimulationState,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);
  const [selectedVan, setSelectedVan] = useState<MobileChargingVan>(MOBILE_VANS[0]);
  const [batteryLevel, setBatteryLevel] = useState<number>(2);
  const [remainingRangeKm, setRemainingRangeKm] = useState<number>(4.8);
  const [etaCountdownMinutes, setEtaCountdownMinutes] = useState<number>(12);
  const [energyDeliveredKwh, setEnergyDeliveredKwh] = useState<number>(0);

  // Stranded car coordinates on map
  const strandedLocation = { x: 39, y: 44 };

  // Sync map state with current step
  useEffect(() => {
    if (currentStep >= 4 && currentStep <= 8) {
      onSetSimulationState(true, strandedLocation);
    } else if (currentStep >= 1 && currentStep < 4) {
      onSetSimulationState(false, strandedLocation);
    } else {
      onSetSimulationState(false, null);
    }
  }, [currentStep]);

  // Automated simulation timer
  useEffect(() => {
    let timer: number;
    if (isAutoSimulating) {
      timer = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 10) {
            setIsAutoSimulating(false);
            return 10;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isAutoSimulating]);

  // Step specific state progressions
  useEffect(() => {
    if (currentStep === 1) {
      setBatteryLevel(2);
      setRemainingRangeKm(4.8);
      setEtaCountdownMinutes(12);
      setEnergyDeliveredKwh(0);
    } else if (currentStep === 5) {
      setEtaCountdownMinutes(12);
    } else if (currentStep === 6) {
      setEtaCountdownMinutes(6);
    } else if (currentStep === 7) {
      setEtaCountdownMinutes(0);
      setEnergyDeliveredKwh(3.2);
    } else if (currentStep === 8) {
      setBatteryLevel(16);
      setRemainingRangeKm(32);
      setEnergyDeliveredKwh(7.5);
    } else if (currentStep >= 9) {
      setBatteryLevel(16);
      setRemainingRangeKm(32);
      setEnergyDeliveredKwh(7.5);
    }
  }, [currentStep]);

  const stepDescriptions = [
    {
      num: 1,
      title: 'Low Battery Detected',
      desc: 'IoT telematics alerts critically low battery state of charge (2% SoC, ~5 km range left).',
    },
    {
      num: 2,
      title: 'Check Nearby Fixed Stations',
      desc: 'System queries GIS network. Nearest fixed DC fast charger is 14.5 km away — unreachable!',
    },
    {
      num: 3,
      title: 'AI Matches Mobile Van',
      desc: 'Backend algorithms scan local emergency fleet for available roadside mobile battery vans.',
    },
    {
      num: 4,
      title: 'Dispatch Request Initiated',
      desc: 'Driver confirms SOS rescue request with precise GPS location & CCS2 connector specs.',
    },
    {
      num: 5,
      title: 'Provider Accepts & Navigates',
      desc: 'Mobile Charger 01 accepts dispatch and initiates high-priority travel (ETA: 12 mins).',
    },
    {
      num: 6,
      title: 'Real-Time Telemetry Tracking',
      desc: 'Live GPS beacon shows mobile van closing distance (2.1 km away, ETA: 6 mins).',
    },
    {
      num: 7,
      title: 'Provider Arrives & Connects',
      desc: 'Technician hooks up mobile 40kW DC fast charger to supply emergency recovery buffer.',
    },
    {
      num: 8,
      title: 'Safe Buffer Restored',
      desc: 'Battery is safely boosted to 16% SoC (~32 km range) in 12 minutes.',
    },
    {
      num: 9,
      title: 'Route to Nearest Fixed Hub',
      desc: 'System automatically plots turn-by-turn guidance to Urse Expressway Plaza (6.5 km away).',
    },
    {
      num: 10,
      title: 'Assistance Completed',
      desc: 'Rescue complete! Driver safely resumes trip toward fixed fast charging infrastructure.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner / Concept Explainer */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>EVAtlas Autonomous Dispatch Protocol</span>
              <span className="text-slate-300">·</span>
              <span>10-Step Roadside EV Battery Assistance</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              Mobile EV Emergency Charging Assistance Protocol
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              When an EV cannot safely reach a charging station, EVAtlas connects the stranded vehicle with the nearest mobile high-rate battery van.
            </p>
          </div>

          {/* Simulation Controls */}
          <div className="flex items-center gap-2">
            {!isAutoSimulating ? (
              <button
                onClick={() => setIsAutoSimulating(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Auto-Simulate 10 Steps</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAutoSimulating(false)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                <span>Pause Auto-Sim</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsAutoSimulating(false);
                setCurrentStep(1);
              }}
              className="p-2 bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
              title="Reset simulation to step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10-Step Horizontal Stepper */}
        <div className="pt-4 overflow-x-auto pb-2">
          <div className="flex items-center min-w-[760px] justify-between">
            {stepDescriptions.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <button
                  key={s.num}
                  onClick={() => {
                    setIsAutoSimulating(false);
                    setCurrentStep(s.num);
                  }}
                  className="flex flex-col items-center group focus-visible:outline-none"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-100 scale-110'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] mt-1 text-center font-medium max-w-[68px] leading-tight ${
                      isCurrent ? 'text-slate-900 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {s.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage for Current Step */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Stranded Vehicle Telemetry */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Stranded EV Telematics</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">IoT CAN-Bus Active</span>
          </div>

          {/* Battery Status Gauge */}
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              batteryLevel <= 5
                ? 'bg-rose-50/70 border-rose-200'
                : 'bg-emerald-50/70 border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">State of Charge (SoC)</span>
              <span
                className={`font-mono font-bold text-base ${
                  batteryLevel <= 5 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {batteryLevel}%
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  batteryLevel <= 5 ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${batteryLevel}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-600 pt-1">
              <span>Estimated Range:</span>
              <span className="font-mono font-bold">{remainingRangeKm.toFixed(1)} km</span>
            </div>
          </div>

          {/* Vehicle specs */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Vehicle Model</span>
              <span className="font-semibold text-slate-900">Tata Nexon EV Max</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Port Standard</span>
              <span className="font-semibold text-slate-900">CCS2 (Combo DC)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>GPS Coordinates</span>
              <span className="font-mono text-slate-900">18.6517° N, 73.7634° E</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Nearest Fixed Charger</span>
              <span className="text-rose-600 font-semibold">14.5 km away (Unreachable)</span>
            </div>
          </div>

          {/* Step Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              disabled={currentStep === 1}
              className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors"
            >
              Previous Step
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 10))}
              disabled={currentStep === 10}
              className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-colors flex items-center justify-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center & Right Column: Interactive State Monitor */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                {currentStep}
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {stepDescriptions[currentStep - 1].title}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Phase {currentStep} of 10</span>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
            {stepDescriptions[currentStep - 1].desc}
          </p>

          {/* Step 3 & 4: Mobile Van Fleet Selection */}
          {(currentStep === 3 || currentStep === 4) && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Available Roadside Mobile Chargers</h4>
              <div className="space-y-2">
                {MOBILE_VANS.map((van) => (
                  <div
                    key={van.id}
                    onClick={() => setSelectedVan(van)}
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      selectedVan.id === van.id
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          van.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{van.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Driver: {van.driverName} · {van.vehiclePlate} · {van.batteryCapacityKwh}kWh BESS
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-xs font-semibold ${
                          van.status === 'Available' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {van.status}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {van.distanceKm} km · ETA {van.etaMinutes}m
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {currentStep === 4 && (
                <button
                  onClick={() => setCurrentStep(5)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-xs"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Confirm Emergency Dispatch with {selectedVan.name}</span>
                </button>
              )}
            </div>
          )}

          {/* Step 5 & 6: Travel & Live Tracking Telemetry */}
          {(currentStep === 5 || currentStep === 6) && (
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Truck className="w-4 h-4 text-blue-600 animate-bounce" />
                  <span>{selectedVan.name} is En Route to Your Location</span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700">
                  ETA: {etaCountdownMinutes} Minutes
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200 text-xs">
                <div>
                  <div className="text-[11px] text-blue-800">Technician</div>
                  <div className="font-semibold text-slate-900">{selectedVan.driverName}</div>
                </div>
                <div>
                  <div className="text-[11px] text-blue-800">Assistance Rate</div>
                  <div className="font-semibold text-slate-900">40 kW DC Fast</div>
                </div>
                <div>
                  <div className="text-[11px] text-blue-800">Van Battery SoC</div>
                  <div className="font-semibold text-emerald-700 font-mono">92% Charged</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7 & 8: Emergency Charging in Action */}
          {(currentStep === 7 || currentStep === 8) && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <BatteryCharging className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>High-Rate Mobile Boost in Progress (40 kW DC)</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  +{energyDeliveredKwh} kWh Added
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-emerald-950 font-medium">
                  <span>Battery Charged to Safe Travel Level</span>
                  <span className="font-mono font-bold">{batteryLevel}% (+32 km range)</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300"
                    style={{ width: `${batteryLevel}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-emerald-800">
                Enough energy has been provided for your EV to safely drive to the nearest fixed high-speed charging station at Urse Plaza.
              </p>
            </div>
          )}

          {/* Step 9 & 10: Guidance to Fixed Fast Charger */}
          {(currentStep === 9 || currentStep === 10) && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Emergency Rescue Succeeded! Navigation Ready</span>
                </div>
                <span className="text-xs font-semibold text-emerald-700">Safe to Drive</span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>Next Destination: <strong className="text-slate-900">Urse Expressway Supercharge Plaza</strong></div>
                <div>Distance: <strong>6.5 km</strong> (Battery capacity allows ~32 km drive)</div>
                <div>Available Plugs: <strong>4 of 6 Free</strong> (No queue waiting)</div>
              </div>

              <button
                onClick={onNavigateToFixedCharger}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open Navigation to Fixed Fast Charger</span>
              </button>
            </div>
          )}

          {/* Mobile Charging Van Hardware Specification Box */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-700 mb-2">
              Mobile Charging Van Fleet Architecture & Hardware Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Energy Storage</span>
                <span className="font-semibold text-slate-800">80 kWh LiFePO4 BESS</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Charging Power</span>
                <span className="font-semibold text-slate-800">40 kW DC / 22 kW AC</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Plug Standards</span>
                <span className="font-semibold text-slate-800">CCS2, Type 2, GB/T</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Telematics</span>
                <span className="font-semibold text-slate-800">GPS / 4G IoT Telemetry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
