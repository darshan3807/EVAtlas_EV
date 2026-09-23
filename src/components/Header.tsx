/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationTab, UserRole } from '../types';
import { Zap, ShieldCheck, Download, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenReport: () => void;
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onOpenReport,
  onOpenArchitecture,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element brand wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('stations')}
            className="flex items-center gap-2 text-left group focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                EVAtlas
              </span>
              <span className="text-[10px] tracking-wide text-slate-400 font-medium">
                Predictive EV Infrastructure
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('stations')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'stations'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-1'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Stations & Map
          </button>

          <button
            onClick={() => setActiveTab('route')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'route'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-1'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Smart Range & Route
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'emergency'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-1'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Emergency SOS Assist
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'planner'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-1'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Predictive City Planner
          </button>

          <button
            onClick={onOpenArchitecture}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'architecture'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-1'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Architecture
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {/* Segmented control for Driver vs City Planner view */}
          <div className="hidden sm:flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => {
                setUserRole('driver');
                if (activeTab === 'planner') setActiveTab('stations');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                userRole === 'driver'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Driver Mode
            </button>
            <button
              onClick={() => {
                setUserRole('planner');
                setActiveTab('planner');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                userRole === 'planner'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              City Planner
            </button>
          </div>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            title="Export Clean Infrastructure Blueprint"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export Blueprint</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-between overflow-x-auto gap-2 text-xs">
        <button
          onClick={() => setActiveTab('stations')}
          className={`px-2.5 py-1 font-medium whitespace-nowrap rounded ${
            activeTab === 'stations' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'
          }`}
        >
          Stations
        </button>
        <button
          onClick={() => setActiveTab('route')}
          className={`px-2.5 py-1 font-medium whitespace-nowrap rounded ${
            activeTab === 'route' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'
          }`}
        >
          Range & Route
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-2.5 py-1 font-medium whitespace-nowrap rounded ${
            activeTab === 'emergency' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-600'
          }`}
        >
          SOS Van
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`px-2.5 py-1 font-medium whitespace-nowrap rounded ${
            activeTab === 'planner' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'
          }`}
        >
          City Planner
        </button>
        <button
          onClick={onOpenArchitecture}
          className="px-2.5 py-1 font-medium whitespace-nowrap rounded text-slate-600 hover:bg-slate-100"
        >
          Tech Spec
        </button>
      </div>
    </header>
  );
};
