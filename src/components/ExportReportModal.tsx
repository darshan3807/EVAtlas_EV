/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlanningZone, ChargingStation } from '../types';
import { X, Printer, Check, Copy, Download, FileText, Award } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: ChargingStation[];
  planningZones: PlanningZone[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  stations,
  planningZones,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalFastPorts = stations.reduce(
    (acc, s) => acc + s.connectors.filter((c) => c.powerKw >= 60).length,
    0
  );
  const totalSolarKwp = stations.reduce((acc, s) => acc + (s.solarCapacityKwp || 0), 0);
  const totalPortsNeeded = planningZones.reduce(
    (acc, z) => acc + z.recommendedAdditionalPorts,
    0
  );

  const reportDate = 'March 2026';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const text = `# EVAtlas: AI-Powered Predictive Planning for EV Charging Infrastructure
AI EV Intelligence Platform | Pune Regional Grid
Theme: AI for Climate Change · Smart Cities, Energy and Circular Economy
Platform: EVAtlas Predictive Mobility Suite

## Executive Summary
EVAtlas is an AI-powered EV intelligence platform that predicts where charging demand will grow, identifies infrastructure gaps, recommends optimal & solar-powered stations, and helps drivers find, plan, and access reliable charging in real time.

## Key Infrastructure Audit Metrics (Pune & PCMC Region)
- Active Operational Hubs: ${stations.length}
- Total Monitored Fast Ports: ${totalFastPorts}
- Integrated Solar Canopy Capacity: ${totalSolarKwp} kWp
- Projected 2-Year Charging Deficit: +${totalPortsNeeded} additional DC fast ports required

## Zone Gap Analysis
${planningZones.map((z) => `- ${z.name}: Deficit Index ${z.deficitIndex}/100, +${z.recommendedAdditionalPorts} ports needed, Solar potential: ${z.solarPotentialKwp} kWp`).join('\n')}

## Mobile Roadside Battery Assistance
- 10-Step protocol connecting stranded EVs (<5% SoC) with nearest 80kWh LiFePO4 mobile charging vans.
- Average emergency response time: 11-14 minutes to restore safe +30 km driving buffer.
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">
              EVAtlas Strategic Infrastructure Report
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed font-sans">
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  EVAtlas Strategic Infrastructure Blueprint
                </h1>
                <div className="text-slate-500 text-xs mt-1">
                  Predictive Planning, Queue Optimization & Mobile Assistance
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400 font-mono">
                <div>Date: {reportDate}</div>
                <div>Status: Verified Proposal</div>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
              <div>
                <strong>Domain:</strong> AI for Smart Cities & Clean Mobility
              </div>
              <div>
                <strong>Theme:</strong> AI for Climate Change
              </div>
              <div>
                <strong>System:</strong> EVAtlas Infrastructure Engine
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">01. Executive Summary & Vision</h2>
            <p className="text-slate-600">
              Electric Vehicle adoption across Maharashtra is accelerating faster than intelligent charging infrastructure.
              Drivers confront unreliable stations, unexpected queues, and range anxiety. EVAtlas resolves this gap through
              AI demand forecasting, optimal solar-backed site placement, and an on-demand 10-step mobile battery assistance network.
            </p>
          </div>

          {/* Section 2: Key Urban Metrics */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">02. Infrastructure Baseline & Gap Analysis</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Monitored Fast Ports</span>
                <span className="text-base font-bold font-mono text-slate-900">{totalFastPorts}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Solar Rooftop Installed</span>
                <span className="text-base font-bold font-mono text-amber-700">{totalSolarKwp} kWp</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 block">2-Year Fast Port Deficit</span>
                <span className="text-base font-bold font-mono text-rose-600">+{totalPortsNeeded} Ports</span>
              </div>
            </div>

            {/* Zone breakdown table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mt-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                    <th className="p-2.5">Urban Corridor</th>
                    <th className="p-2.5 text-right">EV Fleet</th>
                    <th className="p-2.5 text-right">Deficit Index</th>
                    <th className="p-2.5 text-right">Needed Fast Ports</th>
                    <th className="p-2.5 text-right">Solar Potential</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {planningZones.map((z) => (
                    <tr key={z.id}>
                      <td className="p-2.5 font-sans font-medium text-slate-800">{z.name}</td>
                      <td className="p-2.5 text-right">{z.currentFleetCount.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-bold text-rose-600">{z.deficitIndex}/100</td>
                      <td className="p-2.5 text-right text-emerald-700">+{z.recommendedAdditionalPorts}</td>
                      <td className="p-2.5 text-right text-slate-600">{z.solarPotentialKwp} kWp</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Mobile Roadside Assistance */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">03. Mobile Roadside EV Assistance</h2>
            <p className="text-slate-600">
              When an EV vehicle drops below safe range (e.g. 2% SoC) with no reachable fixed station, EVAtlas initiates
              autonomous dispatch of nearby mobile 80 kWh LiFePO4 battery vans equipped with 40 kW DC fast chargers,
              delivering an emergency 15-minute boost (+32 km range) to safely reach fixed highway hubs.
            </p>
          </div>

          {/* Section 4: Architecture Specification */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Generated by EVAtlas Autonomous Predictive Infrastructure Suite</span>
            <span>EVAtlas · AI EV Infrastructure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
