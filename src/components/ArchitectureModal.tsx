/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Zap,
  Navigation,
  Truck,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BatteryCharging,
  Sparkles,
  Download,
  MapPin,
  Smile
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReport: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  onOpenReport,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  if (!isOpen) return null;

  const features = [
    {
      icon: MapPin,
      color: 'emerald',
      title: 'Find Open, Working Chargers',
      subtitle: 'Never pull up to an occupied or broken plug',
      description:
        'EVAtlas connects directly to charging stations across the region to show you live plug availability, real-time charging speeds, and estimated wait times before you leave home.',
      highlights: [
        'Live plug status: Instantly see how many fast chargers are open right now.',
        'Wait time predictions: Know if there is a queue or if you can plug in immediately.',
        '15-Minute bay reservation: Hold an open charger while you drive to the station.',
        'Transparent pricing: Compare electricity rates (₹/kWh) across different providers.',
      ],
    },
    {
      icon: Navigation,
      color: 'blue',
      title: 'Smart Road Trip & Battery Planner',
      subtitle: 'Automatic charging stops customized for your vehicle',
      description:
        'Long trips are stress-free with EVAtlas. Tell us your destination, and our trip planner checks your exact car model, battery level, weather, and road hills to map the ideal charging stops.',
      highlights: [
        'Tailored to your EV: Works with Tata Nexon, MG ZS EV, Mahindra XUV400, and more.',
        'Hill & weather aware: Factors in extra power needed for uphill climbs and AC cooling.',
        'Downhill battery recharge: Calculates regenerative braking power gained descending mountain roads.',
        'Optimized stops: Suggests quick 20-minute top-ups at high-speed highway stations.',
      ],
    },
    {
      icon: Truck,
      color: 'rose',
      title: 'Emergency Roadside Battery Rescue',
      subtitle: 'Never get stranded with an empty battery',
      description:
        'If your electric car runs out of charge far away from a fixed station, EVAtlas dispatches a nearby mobile charging van straight to your location.',
      highlights: [
        'One-tap SOS dispatch: Share your location and request immediate assistance.',
        'Rapid mobile boost: Supplies 15 minutes of emergency power (+30 km driving range).',
        'Live map tracking: Watch the roadside assistance van drive to your location in real time.',
        'Safe continuation: Automatically guides you to the nearest fast charging plaza.',
      ],
    },
    {
      icon: Sun,
      color: 'amber',
      title: 'Clean Solar Energy & City Planning',
      subtitle: 'Greener electricity and smarter station placement',
      description:
        'EVAtlas helps city officials and grid operators plan where new charging stations are needed most, combining solar rooftop canopies with battery storage for 100% clean power.',
      highlights: [
        'Predicts future charging demand before queues and bottlenecks happen.',
        'Identifies underserved neighborhoods needing new charging infrastructure.',
        'Pairs charging hubs with solar canopies to charge cars with clean sunshine.',
        'Protects the electrical grid during peak morning and evening rush hours.',
      ],
    },
  ];

  const CurrentIcon = features[selectedFeature].icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EVAtlas Guide</span>
              <span className="text-slate-300">·</span>
              <span>Intelligent EV Mobility</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              How EVAtlas Works
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simple, reliable, and intelligent charging for everyday electric vehicle drivers and modern cities.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 4 Feature Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              const isSelected = selectedFeature === index;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedFeature(index)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">
                    {feat.title.split(' ')[0]} {feat.title.split(' ')[1]}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {feat.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Feature Deep Dive */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CurrentIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {features[selectedFeature].title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {features[selectedFeature].subtitle}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200/80">
              {features[selectedFeature].description}
            </p>

            {/* Feature Highlights */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-slate-800">Key Benefits for You:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features[selectedFeature].highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Quick Steps to Get Started */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-emerald-600" />
              <span>Getting Started with EVAtlas in 3 Easy Steps</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center mb-1.5">
                  1
                </div>
                <div className="font-bold text-slate-900">Find a Charger</div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Search nearby fast chargers, check live open plugs, and reserve a bay before you arrive.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center mb-1.5">
                  2
                </div>
                <div className="font-bold text-slate-900">Plan Highway Trips</div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Pick your vehicle model and destination. EVAtlas maps the fastest route with zero battery stress.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center mb-1.5">
                  3
                </div>
                <div className="font-bold text-slate-900">Drive with Peace of Mind</div>
                <p className="text-slate-500 text-[11px] mt-1">
                  If an emergency ever happens, our roadside mobile charging vans are one tap away.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            EVAtlas · Making electric mobility simple and stress-free
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenReport();
              }}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Summary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
