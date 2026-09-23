/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab, UserRole, ChargingStation, PlanningZone } from './types';
import { INITIAL_STATIONS, MOBILE_VANS, PLANNING_ZONES } from './data/mockData';
import { Header } from './components/Header';
import { InteractiveMap } from './components/InteractiveMap';
import { StationFinder } from './components/StationFinder';
import { RoutePlanner } from './components/RoutePlanner';
import { MobileEmergencySos } from './components/MobileEmergencySos';
import { CityPlannerDashboard } from './components/CityPlannerDashboard';
import { ArchitectureModal } from './components/ArchitectureModal';
import { ExportReportModal } from './components/ExportReportModal';
import {
  Zap,
  Leaf,
  Sun,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('stations');
  const [userRole, setUserRole] = useState<UserRole>('driver');
  const [stations, setStations] = useState<ChargingStation[]>(INITIAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [destinationStation, setDestinationStation] = useState<ChargingStation | null>(null);

  // Emergency SOS state
  const [emergencyStrandedLocation, setEmergencyStrandedLocation] = useState<{ x: number; y: number } | null>(null);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  // Planning zones
  const [planningZones, setPlanningZones] = useState<PlanningZone[]>(PLANNING_ZONES);

  // Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Handler to add newly simulated optimal station to the live network
  const handleAddStationToNetwork = (newStation: ChargingStation) => {
    setStations((prev) => [newStation, ...prev]);
    setSelectedStation(newStation);
  };

  const handleSetAsRouteDestination = (station: ChargingStation) => {
    setDestinationStation(station);
    setActiveTab('route');
  };

  const handleTriggerSos = () => {
    setActiveTab('emergency');
  };

  const handleNavigateToFixedCharger = () => {
    // Select Urse Expressway Plaza as target
    const urseStation = stations.find((s) => s.id === 'st-03') || stations[0];
    setSelectedStation(urseStation);
    setActiveTab('stations');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Contract (3 Zones) */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'architecture') {
            setIsArchitectureOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Subtle Context Kicker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/80 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">EVAtlas Urban Mobility Network</span>
            <span aria-hidden="true">·</span>
            <span>Pune Regional Corridor</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Smart Cities, Energy & Circular Economy</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Pune/PCMC Grid Operational</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500">{stations.length} Active Hubs</span>
          </div>
        </div>

        {/* View 1: Live Stations & Map Finder */}
        {activeTab === 'stations' && (
          <div className="space-y-6">
            {/* Interactive Vector Map of Pune/PCMC */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Pune & PCMC Regional Electric Mobility Grid</span>
                </h2>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Click any hub pin for live dispenser telemetry & wait predictions
                </span>
              </div>

              <InteractiveMap
                stations={stations}
                selectedStationId={selectedStation?.id || null}
                onSelectStation={(st) => setSelectedStation(st)}
                mobileVans={MOBILE_VANS}
                showHeatmap={false}
                emergencyStrandedLocation={emergencyStrandedLocation}
                isDispatching={isDispatching}
              />
            </div>

            {/* Station Search & List Finder */}
            <StationFinder
              stations={stations}
              selectedStation={selectedStation}
              onSelectStation={(st) => setSelectedStation(st)}
              onSetAsRouteDestination={handleSetAsRouteDestination}
              onTriggerSos={handleTriggerSos}
            />
          </div>
        )}

        {/* View 2: Smart Range & Route Planner */}
        {activeTab === 'route' && (
          <div className="space-y-6">
            <RoutePlanner
              stations={stations}
              onSelectStation={(st) => setSelectedStation(st)}
              destinationStation={destinationStation}
            />
          </div>
        )}

        {/* View 3: Mobile Emergency SOS Assistance */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            {/* Map Preview in SOS Mode */}
            <InteractiveMap
              stations={stations}
              selectedStationId={null}
              onSelectStation={() => {}}
              mobileVans={MOBILE_VANS}
              selectedVanId={MOBILE_VANS[0].id}
              emergencyStrandedLocation={emergencyStrandedLocation}
              isDispatching={isDispatching}
            />

            <MobileEmergencySos
              onNavigateToFixedCharger={handleNavigateToFixedCharger}
              onSetSimulationState={(dispatching, loc) => {
                setIsDispatching(dispatching);
                setEmergencyStrandedLocation(loc);
              }}
            />
          </div>
        )}

        {/* View 4: Predictive City Planner & Grid Optimizer */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            {/* Heatmap enabled on planner view */}
            <InteractiveMap
              stations={stations}
              selectedStationId={selectedStation?.id || null}
              onSelectStation={(st) => setSelectedStation(st)}
              showHeatmap={true}
              planningZones={planningZones}
            />

            <CityPlannerDashboard
              onAddStationToNetwork={handleAddStationToNetwork}
              planningZones={planningZones}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
        onOpenReport={() => {
          setIsArchitectureOpen(false);
          setIsReportOpen(true);
        }}
      />

      <ExportReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        stations={stations}
        planningZones={planningZones}
      />

      {/* Clean Minimalist Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">EVAtlas</span>
            <span aria-hidden="true">·</span>
            <span>AI-Powered Predictive Planning for EV Charging Infrastructure</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              System Specs
            </button>
            <button
              onClick={() => setIsReportOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Export Report
            </button>
            <span className="text-slate-400">Smart Mobility Suite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
