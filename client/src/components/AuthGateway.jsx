import React, { useState, useEffect } from 'react';
import { 
  Sun, ShoppingBag, Zap, Shield, ShieldCheck, Lock, Activity, 
  ArrowRight, Key, Sparkles, CheckCircle2, AlertTriangle, Layers, 
  ExternalLink, Network, Check
} from 'lucide-react';
import ProsumerLogin from './ProsumerLogin';
import ConsumerLogin from './ConsumerLogin';

export default function AuthGateway({ onLoginSuccess }) {
  // Determine initial portal from URL hash if available (#prosumer or #consumer)
  const getInitialPortal = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('prosumer')) return 'prosumer';
      if (hash.includes('consumer')) return 'consumer';
    }
    return 'prosumer'; // default to prosumer
  };

  const [activePortal, setActivePortal] = useState(getInitialPortal);

  // Sync with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('prosumer')) setActivePortal('prosumer');
      else if (hash.includes('consumer')) setActivePortal('consumer');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectPortal = (portal) => {
    setActivePortal(portal);
    if (typeof window !== 'undefined') {
      window.location.hash = `#${portal}-login`;
    }
  };

  // Instant demo launch helpers
  const handleFastProsumer = () => {
    onLoginSuccess({
      role: 'prosumer',
      sessionToken: `OTAC-PROS-DEMO-${Date.now()}`,
      account: {
        id: 'PROS-84-NORTH',
        name: 'Amit Shah',
        alias: 'Amit Shah (Sector 4 Solar Hub)',
        meterId: 'INV-402-SOLAR-09',
        node: 'TX-NORTH-402',
        solarCapacityKw: 18.4
      },
      authenticatedAt: new Date().toISOString(),
      consumedOtp: '840219 (Instant Demo)'
    });
  };

  const handleFastConsumer = () => {
    onLoginSuccess({
      role: 'consumer',
      sessionToken: `OTAC-CONS-DEMO-${Date.now()}`,
      account: {
        id: 'CONS-9912-BAKERY',
        name: 'Gupta Bakery',
        alias: 'Gupta Bakery (Commercial)',
        meterId: 'SM-CONS-9912',
        node: 'TX-NORTH-402',
        sanctionedLimitKw: 10.0
      },
      authenticatedAt: new Date().toISOString(),
      consumedOtp: '619420 (Instant Demo)'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500 selection:text-white">
      {/* Background Microgrid Ambient Grid Effect */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      ></div>

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-6 h-6 text-slate-950 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-mono">URJA<span className="text-amber-400">GRID</span></span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Smart Gate v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                P2P Microgrid Renewable Energy Exchange
              </p>
            </div>
          </div>

          {/* Quick 1-Click Evaluator Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden md:inline font-medium">Quick Evaluator:</span>
            <button
              onClick={handleFastProsumer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 transition-all shadow-xs"
              title="Enter Prosumer Portal directly with verified demo credentials"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Instant Prosumer</span>
            </button>
            <button
              onClick={handleFastConsumer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 transition-all shadow-xs"
              title="Enter Consumer Portal directly with verified demo credentials"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Instant Consumer</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Security Architecture Notification */}
        <div className="w-full max-w-4xl mb-7 bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white">One-Time Access Protocol Enforced:</span>
              <p className="text-slate-400 mt-0.5">
                Each One-Time Passcode (OTAC) can be used <strong>once only</strong>. Once logged in, your session is <strong>strictly locked</strong> to that specific role.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center font-mono text-[11px] bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Single-Role Session Lock</span>
          </div>
        </div>

        {/* Separate Portal Switcher Tabs */}
        <div className="w-full max-w-4xl mb-6">
          <div className="bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row gap-2 shadow-2xl">
            {/* Prosumer Tab */}
            <button
              type="button"
              onClick={() => selectPortal('prosumer')}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-black text-sm transition-all ${
                activePortal === 'prosumer'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 border border-amber-400'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
              }`}
            >
              <Sun className={`w-5 h-5 ${activePortal === 'prosumer' ? 'text-slate-950 stroke-[2.5]' : 'text-amber-400'}`} />
              <div className="text-left">
                <div className="leading-tight">Prosumer Terminal Login</div>
                <div className={`text-[10px] font-semibold ${activePortal === 'prosumer' ? 'text-amber-950/80' : 'text-slate-500'}`}>
                  Rooftop Solar & Surplus Energy Feed-In
                </div>
              </div>
            </button>

            {/* Consumer Tab */}
            <button
              type="button"
              onClick={() => selectPortal('consumer')}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-black text-sm transition-all ${
                activePortal === 'consumer'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/25 border border-emerald-400'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
              }`}
            >
              <ShoppingBag className={`w-5 h-5 ${activePortal === 'consumer' ? 'text-slate-950 stroke-[2.5]' : 'text-emerald-400'}`} />
              <div className="text-left">
                <div className="leading-tight">Consumer Portal Login</div>
                <div className={`text-[10px] font-semibold ${activePortal === 'consumer' ? 'text-emerald-950/80' : 'text-slate-500'}`}>
                  Headroom Clearance & Energy Purchase
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Render the Respective Dedicated Login Component */}
        <div className="w-full">
          {activePortal === 'prosumer' ? (
            <ProsumerLogin 
              onLoginSuccess={onLoginSuccess}
              onSwitchToConsumer={() => selectPortal('consumer')}
            />
          ) : (
            <ConsumerLogin 
              onLoginSuccess={onLoginSuccess}
              onSwitchToProsumer={() => selectPortal('prosumer')}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>URJAGRID • Cryptographically Verified Smart-Meter Microgrid Network</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Direct Prosumer URL: <code className="text-amber-400">#prosumer-login</code></span>
            <span>•</span>
            <span>Direct Consumer URL: <code className="text-emerald-400">#consumer-login</code></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
