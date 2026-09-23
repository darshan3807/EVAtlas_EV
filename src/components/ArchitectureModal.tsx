/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Database,
  Cpu,
  Server,
  Layers,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Zap,
  Activity,
  Download
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
  const [activePipelineTab, setActivePipelineTab] = useState<number>(0);

  if (!isOpen) return null;

  const pipelineStages = [
    {
      title: '1. Multi-Modal Data Ingestion',
      subtitle: '8 Integrated Data Streams',
      items: [
        'EV Telematics: Real-time SoC %, discharge curves & range telemetry via CAN-bus IoT.',
        'Traffic & Mobility: Live arterial congestion feeds and peak commuter flow matrices.',
        'Weather & Meteorology: Ambient temperature, humidity, and solar UV irradiance from IMD.',
        'Charging Station CPO APIs: Live connector availability (OCPI / OCPP 2.0.1 standard).',
        'Grid & DISCOM Feeds: Local substation kVA transformer headroom & load curves.',
        'Solar Irradiance: Geospatial satellite irradiance mapping (kWh/m²/day).',
        'Spatial GIS: Road networks, elevation profiles, and Points of Interest (POIs).',
        'Dynamic Pricing Tariffs: Peak/off-peak commercial tariffs (₹/kWh).'
      ]
    },
    {
      title: '2. Data Processing & Normalization',
      subtitle: 'Geospatial & Temporal Pipeline',
      items: [
        'Data Cleaning & Validation: Anomaly rejection on telemetry telemetry drops.',
        'Unified Data Lakehouse: Ingestion orchestration with timestamp alignment.',
        'Feature Engineering: Spatial H3 hexagonal indexing & temporal seasonality encoding.'
      ]
    },
    {
      title: '3. AI / ML Predictive Engine',
      subtitle: 'Models & Optimization Heuristics',
      items: [
        'Demand Forecasting: Gradient Boosted Trees (XGBoost) projecting charging load over 3-24 month horizons.',
        'Shortage Detection: Real-time spatial clustering identifying grid deficit hotspots.',
        'Optimal Station Placement: Genetic algorithm & linear programming factoring land, grid kVA, and solar potential.',
        'Range & Queue Prediction: Recurrent neural models predicting dispenser queue wait times with 94.2% accuracy.',
        'Solar & Grid Balancer: Real-time dispatch optimizer maximizing solar self-consumption.'
      ]
    },
    {
      title: '4. Backend & Real-time Layer',
      subtitle: 'High-Throughput Services',
      items: [
        'FastAPI & Node.js Microservices: Low-latency REST & WebSocket interfaces.',
        'PostgreSQL + PostGIS: Geospatial querying of charging station polygons & radii.',
        'State Synchronization: Sub-second live updates for mobile emergency van beacons.'
      ]
    },
    {
      title: '5. Dual User Interface Consoles',
      subtitle: 'Driver App & Admin Dashboard',
      items: [
        'Driver Web/PWA App: Real-time station finder, wait times, smart routing, and 10-step SOS rescue.',
        'City Planner Dashboard: Demand heatmaps, infrastructure gap matrices, and solar hub simulation.'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>EVAtlas System Blueprint</span>
              <span className="text-slate-300">·</span>
              <span>Theme: AI for Climate Change</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              EVAtlas System Architecture & Platform Blueprint
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              EVAtlas Platform · Smart Cities, Energy and Circular Economy
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Architecture Pipeline Explorer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>5-Layer End-to-End System Architecture</span>
              </h3>
              <span className="text-[11px] text-slate-400">Interactive Pipeline</span>
            </div>

            {/* Pipeline Stage Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {pipelineStages.map((stage, i) => (
                <button
                  key={i}
                  onClick={() => setActivePipelineTab(i)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    activePipelineTab === i
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="text-[10px] text-slate-400 font-mono">Stage 0{i + 1}</div>
                  <div className="text-xs truncate">{stage.title.split('. ')[1]}</div>
                </button>
              ))}
            </div>

            {/* Selected Stage Detail Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {pipelineStages[activePipelineTab].title}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {pipelineStages[activePipelineTab].subtitle}
                  </div>
                </div>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                  Operational Spec
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {pipelineStages[activePipelineTab].items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Innovation Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Unique Innovation Pillars</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900">AI Demand Forecasting</span>
                <p className="text-slate-600 text-[11px]">
                  Predicts future charging demand growth before infrastructure deficits cause severe queue congestion.
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900">AI Infrastructure Heatmap</span>
                <p className="text-slate-600 text-[11px]">
                  Pinpoints underserved geographic areas needing urgent station deployment and grid expansion.
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900">Solar + Grid Intelligence</span>
                <p className="text-slate-600 text-[11px]">
                  Integrates rooftop solar potential and transformer headroom to achieve net-zero charging hubs.
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900">Roadside Emergency SOS Vans</span>
                <p className="text-slate-600 text-[11px]">
                  Connects stranded low-battery EVs with mobile charging battery vans to eliminate range anxiety entirely.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 italic">
              "EVAtlas doesn’t just find chargers — it predicts where chargers will be needed and helps EVs reach them safely."
            </div>
          </div>

          {/* Technical Standards & Protocols */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Open Protocols & Technical Standards</span>
              </h3>
              <span className="text-[11px] text-slate-400">Enterprise Compliance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900">OCPP 2.0.1 / 1.6J</div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                  Charger Protocol
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Smart charging profiles & live meter values</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900">OCPI 2.2.1</div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                  Roaming Protocol
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Cross-operator session handshakes</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900">ISO 15118-20</div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                  Vehicle-to-Grid (V2G)
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Automated plug & charge authentication</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900">PostGIS & H3</div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                  Spatial Engine
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Hexagonal spatial indexing & routing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Hosted prototype ready for GitHub Pages deployment.
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
              <span>Export Infrastructure Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
