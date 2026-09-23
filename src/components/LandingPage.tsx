/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Zap,
  Navigation,
  Compass,
  TrendingUp,
  Truck,
  Sun,
  ShieldCheck,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { DriverTab } from '../types';

interface LandingPageProps {
  onNavigate: (tab: DriverTab) => void;
  onSwitchToAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSwitchToAdmin,
}) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Intelligent EV Charging Infrastructure Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Smarter EV Charging.{' '}
            <span className="text-emerald-700">Better Journeys.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find reliable chargers, plan smarter routes, and discover where EV infrastructure is needed next.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('stations')}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Find a Charger</span>
            </button>

            <button
              onClick={() => onNavigate('route')}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 text-emerald-700" />
              <span>Plan Your Trip</span>
            </button>
          </div>
        </div>

        {/* Dashboard Preview Graphic */}
        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-lg p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-400 ml-2 font-mono">evatlas.io/live-network</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Pune Regional Hubs Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-medium text-slate-500">Live Available Fast Ports</div>
              <div className="text-xl font-bold text-slate-900 mt-1">42 / 54 Free</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Average wait: 0-3 mins</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-medium text-slate-500">Clean Solar Generation</div>
              <div className="text-xl font-bold text-amber-700 mt-1">118 kW Solar</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Rooftop canopies active</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-medium text-slate-500">Mobile Rescue Vans</div>
              <div className="text-xl font-bold text-slate-900 mt-1">3 On Duty</div>
              <div className="text-[11px] text-slate-500 mt-0.5">11 min avg. arrival</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Intelligent Features for Everyday EV Drivers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need for seamless commuting, interstate road trips, and reliable urban charging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('stations')}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Smart Charger Finder
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time plug availability, live wait estimates, and pricing so you never pull up to a broken or occupied stall.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <span>Explore Stations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('route')}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Smart Route Planning
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Considers vehicle battery capacity, highway elevations, weather, and traffic to plot optimal fast-charging stops.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
              <span>Plan Your Journey</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('emergency')}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
              Emergency Charging
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stranded with low battery? Request a nearby mobile charging van for an on-demand boost to reach the nearest plaza.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-700">
              <span>Request Help</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onNavigate('insights')}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              AI Demand Forecasting
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Predictive models highlight peak charging hours and future demand patterns across key transit corridors.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-purple-700">
              <span>View Insights</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5 */}
          <div
            onClick={onSwitchToAdmin}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group space-y-3 md:col-span-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              Solar & Grid Intelligence (City Infrastructure)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pairing clean rooftop solar canopies with battery storage (BESS) to charge electric vehicles with 100% green energy without straining the municipal power grid.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <span>Access City Planner Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section (Clearly labeled prototype/demo data) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Prototype Impact Metrics</h3>
            <p className="text-[11px] text-slate-500">Live simulated indicators across regional deployment</p>
          </div>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono rounded">
            Prototype Demo Data
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">1,250+</div>
            <div className="text-xs font-medium text-slate-600 mt-1">Charging Points</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Demo network</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">98%</div>
            <div className="text-xs font-medium text-slate-600 mt-1">Availability Visibility</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Live bay tracking</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-2xl font-extrabold text-blue-700 font-mono">24/7</div>
            <div className="text-xs font-medium text-slate-600 mt-1">Charging Assistance</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mobile rescue fleet</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-2xl font-extrabold text-purple-700 font-mono">Smart</div>
            <div className="text-xs font-medium text-slate-600 mt-1">Infrastructure Insights</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Predictive planning</div>
          </div>
        </div>
      </section>
    </div>
  );
};
