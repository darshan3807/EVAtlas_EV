/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DriverTab, UserRole } from '../types';
import {
  Home,
  LayoutDashboard,
  Compass,
  Navigation,
  TrendingUp,
  Truck,
  User,
  Building2,
  Layers,
  Sun,
  Download,
  Sliders
} from 'lucide-react';

interface BottomNavProps {
  userRole: UserRole;
  activeDriverTab: DriverTab;
  onSelectDriverTab: (tab: DriverTab) => void;
  onOpenReport?: () => void;
  onSwitchRole: (role: UserRole) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  userRole,
  activeDriverTab,
  onSelectDriverTab,
  onOpenReport,
  onSwitchRole,
}) => {
  if (userRole === 'admin') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 sm:px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-around sm:justify-center gap-1 sm:gap-6">
          <button
            onClick={() => onSwitchRole('driver')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-medium">Driver Mode</span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <button
            onClick={onOpenReport}
            className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-700 text-white font-semibold shadow-xs hover:bg-emerald-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-[10px]">Download Report</span>
          </button>
        </div>
      </div>
    );
  }

  // Driver navigation items
  const driverItems: { id: DriverTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stations', label: 'Find Charger', icon: Compass },
    { id: 'route', label: 'Plan Trip', icon: Navigation },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'emergency', label: 'Emergency', icon: Truck },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-1 sm:px-4 py-1.5"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-around">
        {driverItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeDriverTab === item.id;
          const isEmergency = item.id === 'emergency';

          return (
            <button
              key={item.id}
              onClick={() => onSelectDriverTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? isEmergency
                    ? 'text-rose-700 font-bold bg-rose-50/60'
                    : 'text-emerald-700 font-bold bg-emerald-50/60'
                  : isEmergency
                  ? 'text-rose-600 hover:text-rose-700'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isEmergency ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
