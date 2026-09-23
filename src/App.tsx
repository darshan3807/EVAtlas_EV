/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DriverTab, UserRole, ChargingStation, PlanningZone, UserProfile } from './types';
import { INITIAL_STATIONS, MOBILE_VANS, PLANNING_ZONES, DEFAULT_USER_PROFILE } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import { StationFinder } from './components/StationFinder';
import { RoutePlanner } from './components/RoutePlanner';
import { ChargingInsights } from './components/ChargingInsights';
import { EmergencyHelp } from './components/EmergencyHelp';
import { UserProfileView } from './components/UserProfileView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { NavigationModal } from './components/NavigationModal';
import { ExportReportModal } from './components/ExportReportModal';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('driver');
  const [activeDriverTab, setActiveDriverTab] = useState<DriverTab>('dashboard');
  const [stations, setStations] = useState<ChargingStation[]>(INITIAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [navigatingStation, setNavigatingStation] = useState<ChargingStation | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [planningZones, setPlanningZones] = useState<PlanningZone[]>(PLANNING_ZONES);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Navigation action handlers
  const handleNavigateToStation = (station: ChargingStation) => {
    setNavigatingStation(station);
  };

  const handleOpenStationDetails = (station: ChargingStation) => {
    setSelectedStation(station);
    setActiveDriverTab('stations');
  };

  const handleToggleSaveStation = (stationId: string) => {
    setUserProfile((prev) => {
      const isSaved = prev.savedStationIds.includes(stationId);
      const nextSaved = isSaved
        ? prev.savedStationIds.filter((id) => id !== stationId)
        : [...prev.savedStationIds, stationId];
      return { ...prev, savedStationIds: nextSaved };
    });
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleAddStationToNetwork = (newStation: ChargingStation) => {
    setStations((prev) => [newStation, ...prev]);
    setSelectedStation(newStation);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-16 sm:pb-20">
      {/* Top Header */}
      <Header
        userRole={userRole}
        setUserRole={setUserRole}
        activeDriverTab={activeDriverTab}
        setActiveDriverTab={setActiveDriverTab}
        userName={userProfile.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Driver Portal Views */}
        {userRole === 'driver' && (
          <>
            {activeDriverTab === 'home' && (
              <LandingPage
                onNavigate={setActiveDriverTab}
                onSwitchToAdmin={() => setUserRole('admin')}
              />
            )}

            {activeDriverTab === 'dashboard' && (
              <UserDashboard
                userProfile={userProfile}
                stations={stations}
                onNavigateToTab={setActiveDriverTab}
                onOpenNavigationModal={handleNavigateToStation}
                onOpenStationDetails={handleOpenStationDetails}
              />
            )}

            {activeDriverTab === 'stations' && (
              <StationFinder
                stations={stations}
                selectedStation={selectedStation}
                onSelectStation={setSelectedStation}
                onOpenNavigation={handleNavigateToStation}
                savedStationIds={userProfile.savedStationIds}
                onToggleSave={handleToggleSaveStation}
                onTriggerSos={() => setActiveDriverTab('emergency')}
              />
            )}

            {activeDriverTab === 'route' && (
              <RoutePlanner
                stations={stations}
                onSelectStation={setSelectedStation}
                onOpenNavigationModal={handleNavigateToStation}
                destinationStation={selectedStation}
              />
            )}

            {activeDriverTab === 'insights' && (
              <ChargingInsights
                stations={stations}
                planningZones={planningZones}
                onSelectStation={(st) => {
                  setSelectedStation(st);
                  setActiveDriverTab('stations');
                }}
              />
            )}

            {activeDriverTab === 'emergency' && (
              <EmergencyHelp
                currentLocationName={userProfile.currentLocationName}
                nearbyVan={MOBILE_VANS[0]}
                onNavigateToStation={() => {
                  const nearest = stations[0];
                  handleNavigateToStation(nearest);
                }}
              />
            )}

            {activeDriverTab === 'profile' && (
              <UserProfileView
                userProfile={userProfile}
                stations={stations}
                onUpdateProfile={handleUpdateProfile}
                onNavigateToStation={handleNavigateToStation}
              />
            )}
          </>
        )}

        {/* City Planner & Operator Portal View */}
        {userRole === 'admin' && (
          <AdminDashboardView
            stations={stations}
            planningZones={planningZones}
            onAddStationToNetwork={handleAddStationToNetwork}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}
      </main>

      {/* Turn-by-Turn Navigation Modal (Google Maps Style Simulation) */}
      {navigatingStation && (
        <NavigationModal
          station={navigatingStation}
          userBatterySoc={userProfile.batteryPercentage}
          userLocationName={userProfile.currentLocationName}
          onClose={() => setNavigatingStation(null)}
        />
      )}

      {/* Infrastructure Export Report Modal (Admin Portal) */}
      <ExportReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        stations={stations}
        planningZones={planningZones}
      />

      {/* Android-Style Bottom Navigation Bar */}
      <BottomNav
        userRole={userRole}
        activeDriverTab={activeDriverTab}
        onSelectDriverTab={setActiveDriverTab}
        onOpenReport={() => setIsReportOpen(true)}
        onSwitchRole={setUserRole}
      />
    </div>
  );
}
