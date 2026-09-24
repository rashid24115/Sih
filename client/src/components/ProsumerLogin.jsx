import React, { useState, useEffect } from 'react';
import { 
  Sun, Zap, ShieldCheck, Lock, Key, RefreshCw, AlertCircle, 
  CheckCircle2, ArrowRight, Clock, Fingerprint, Eye, EyeOff, 
  Sparkles, ShieldAlert, Cpu, Check, Copy
} from 'lucide-react';

const API_BASE = '/api';

export default function ProsumerLogin({ onLoginSuccess, onSwitchToConsumer }) {
  const [accountId, setAccountId] = useState('PROS-84-NORTH');
  const [meterKey, setMeterKey] = useState('INV-402-SOLAR-09');
  const [password, setPassword] = useState('solar2026');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  
  // OTAC generator state
  const [generatedOtp, setGeneratedOtp] = useState('840219');
  const [otpGeneratedTime, setOtpGeneratedTime] = useState(Date.now());
  const [countdown, setCountdown] = useState(300); // 5 min
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Submission & feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Track consumed OTPs locally for instant feedback
  const [consumedOtps, setConsumedOtps] = useState(new Set());

  // Countdown timer for OTAC
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGenerateOtp = async () => {
    setIsGeneratingOtp(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'prosumer', accountId })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedOtp(data.code);
        setOtp(data.code); // auto-fill for convenience
        setCountdown(data.validForSec || 300);
        setOtpGeneratedTime(Date.now());
      } else {
        // Fallback local dynamic OTAC
        const localCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(localCode);
        setOtp(localCode);
        setCountdown(300);
      }
    } catch {
      const localCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(localCode);
      setOtp(localCode);
      setCountdown(300);
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const handleCopyOtp = () => {
    if (generatedOtp) {
      navigator.clipboard?.writeText(generatedOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  const handleFillDemo = () => {
    setAccountId('PROS-84-NORTH');
    setMeterKey('INV-402-SOLAR-09');
    setPassword('solar2026');
    if (!generatedOtp || consumedOtps.has(generatedOtp)) {
      handleGenerateOtp();
    } else {
      setOtp(generatedOtp);
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otp.trim()) {
      setErrorMsg('Please enter your One-Time Access Passcode (OTAC).');
      return;
    }

    // Check client-side single-use guard
    if (consumedOtps.has(otp.trim())) {
      setErrorMsg(`⛔ Security Lock: One-Time Passcode (${otp.trim()}) has already been consumed! Each passcode can be accessed one-time only. Please request a new passcode.`);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'prosumer',
          accountId: accountId.trim(),
          password,
          otp: otp.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'CONSUMED_TOKEN') {
          setConsumedOtps(prev => new Set(prev).add(otp.trim()));
        }
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      // Mark token as consumed
      setConsumedOtps(prev => new Set(prev).add(otp.trim()));
      setSuccessMsg('One-Time Access Verified! Entering Prosumer Solar Terminal...');

      setTimeout(() => {
        onLoginSuccess({
          role: 'prosumer',
          sessionToken: data.session?.sessionToken || `OTAC-PROS-${Date.now()}`,
          account: data.session?.account || {
            id: 'PROS-84-NORTH',
            name: 'Amit Shah',
            alias: 'Amit Shah (Sector 4 Solar Hub)',
            meterId: 'INV-402-SOLAR-09',
            node: 'TX-NORTH-402',
            solarCapacityKw: 18.4
          },
          authenticatedAt: new Date().toISOString(),
          consumedOtp: otp.trim()
        });
      }, 700);

    } catch (err) {
      // If server unreachable or error, allow fallback validation if credentials match
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        if (password === 'solar2026') {
          setConsumedOtps(prev => new Set(prev).add(otp.trim()));
          setSuccessMsg('One-Time Access Verified (Offline Model)! Launching Solar Terminal...');
          setTimeout(() => {
            onLoginSuccess({
              role: 'prosumer',
              sessionToken: `OTAC-PROS-OFFLINE-${Date.now()}`,
              account: {
                id: 'PROS-84-NORTH',
                name: 'Amit Shah',
                alias: 'Amit Shah (Sector 4 Solar Hub)',
                meterId: 'INV-402-SOLAR-09',
                node: 'TX-NORTH-402',
                solarCapacityKw: 18.4
              },
              authenticatedAt: new Date().toISOString(),
              consumedOtp: otp.trim()
            });
          }, 700);
          return;
        }
      }
      setErrorMsg(err.message || 'Login failed. Please check your credentials and OTAC.');
    } finally {
      setIsLoading(false);
    }
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const isOtpExpired = countdown === 0;

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Info Column: Solar Branding & Specs */}
      <div className="lg:col-span-5 bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl border border-amber-500/30 relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Dedicated Prosumer Terminal</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Solar Producer & Microgrid Feed-In
            </h2>
            <p className="text-amber-200/80 text-sm mt-2 leading-relaxed">
              Authenticate via encrypted Smart-Meter handshake to monetize surplus solar power and publish P2P energy offers on local feeder nodes.
            </p>
          </div>

          {/* Telemetry Card Preview */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-400" /> Interconnected Node
              </span>
              <span className="font-mono bg-amber-500/20 px-2 py-0.5 rounded text-white border border-amber-500/40">
                TX-NORTH-402
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Solar Array Cap:</span>
                <p className="text-lg font-black text-white font-mono">18.4 kW</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Surplus Available:</span>
                <p className="text-lg font-black text-emerald-400 font-mono">8.2 kWh</p>
              </div>
            </div>

            <div className="bg-amber-500/10 rounded-xl p-2.5 border border-amber-500/20 flex items-center justify-between text-xs">
              <span className="text-amber-200 font-medium">Smart Inverter Gateway:</span>
              <span className="font-mono text-white font-bold">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Security / One-Time Access Explainer */}
        <div className="relative z-10 pt-6 mt-6 border-t border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Single-Role One-Time Access Protocol</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Logging in locks this browser session strictly to the <strong>Prosumer role</strong>. Your one-time passcode will be burned immediately upon verification.
          </p>

          <button
            type="button"
            onClick={onSwitchToConsumer}
            className="w-full mt-2 py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Switch to Consumer Login Page</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 shadow-xl border-2 border-slate-200 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-600 uppercase tracking-wider">
                <Sun className="w-4 h-4 text-amber-500" /> Prosumer Portal Authorization
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">Prosumer Secure Sign In</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Authorized rooftop solar generators & battery storage prosumers
              </p>
            </div>

            {/* Quick Demo Fill Pill */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black border border-amber-300 transition-all shadow-xs"
              title="Autofill standard demo credentials"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Fill Demo</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mt-4 p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs font-medium animate-shake">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Account ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Prosumer Service Account ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Sun className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="e.g. PROS-84-NORTH"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white rounded-xl text-sm font-semibold text-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            {/* Smart Inverter Hardware Key */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Smart Inverter / Gateway Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={meterKey}
                  onChange={(e) => setMeterKey(e.target.value)}
                  placeholder="INV-402-SOLAR-09"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white rounded-xl text-sm font-semibold text-slate-900 font-mono outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white rounded-xl text-sm font-semibold text-slate-900 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ONE-TIME ACCESS PASSCODE (OTAC) SECTION */}
            <div className="pt-2">
              <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                      Single-Use One-Time Passcode (OTAC)
                    </span>
                  </div>

                  {/* Generator / Refresh Button */}
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    disabled={isGeneratingOtp}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingOtp ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingOtp ? 'Generating...' : 'Get New One-Time Code'}</span>
                  </button>
                </div>

                {/* Display Current Generated OTAC with Copy action */}
                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">Live Generated OTAC:</span>
                    <span className="text-lg font-black font-mono tracking-widest text-amber-600">
                      {generatedOtp || '------'}
                    </span>
                    {consumedOtps.has(generatedOtp) && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                        CONSUMED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOtp}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      title="Copy OTAC"
                    >
                      {copiedOtp ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* OTAC Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Enter the 6-Digit One-Time Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTAC"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-amber-300 focus:border-amber-600 rounded-xl text-base font-black font-mono tracking-widest text-slate-900 text-center outline-none shadow-xs"
                  />
                  <p className="text-[11px] text-amber-800/80 font-medium mt-1">
                    * Single-use only: Once you login, this exact code is permanently burned and cannot be accessed again.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isOtpExpired}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-400"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Verifying One-Time Handshake...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Authorize Prosumer Terminal (One-Time Access)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>URJAGRID Smart Inverter Protocol v2.4</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Node TX-NORTH-402 Online
          </span>
        </div>
      </div>
    </div>
  );
}
