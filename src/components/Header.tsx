/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DriverTab, UserRole } from '../types';
import { Zap, ShieldCheck, Building2, User, Sparkles } from 'lucide-react';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeDriverTab: DriverTab;
  setActiveDriverTab: (tab: DriverTab) => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  setUserRole,
  activeDriverTab,
  setActiveDriverTab,
  userName = 'Darshan',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (userRole === 'driver') {
                setActiveDriverTab('home');
              }
            }}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                EVAtlas
              </span>
              <span className="text-[10px] tracking-wide text-slate-500 font-medium">
                Intelligent EV Infrastructure
              </span>
            </div>
          </button>
        </div>

        {/* Center / Right: Role Switcher & Profile Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher Pill: Driver vs City Admin */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-medium border border-slate-200/80">
            <button
              onClick={() => setUserRole('driver')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                userRole === 'driver'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Driver</span>
            </button>

            <button
              onClick={() => setUserRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                userRole === 'admin'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>City Admin</span>
            </button>
          </div>

          {/* Profile Shortcut */}
          {userRole === 'driver' && (
            <button
              onClick={() => setActiveDriverTab('profile')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs transition-colors ${
                activeDriverTab === 'profile'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="View Profile"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                {userName.charAt(0)}
              </div>
              <span className="hidden sm:inline font-medium">{userName}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
