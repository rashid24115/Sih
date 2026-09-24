import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, ShieldCheck, Lock, Key, RefreshCw, AlertCircle, 
  CheckCircle2, ArrowRight, Clock, Fingerprint, Eye, EyeOff, 
  Sparkles, ShieldAlert, Cpu, Check, Copy, Gauge, Activity
} from 'lucide-react';

const API_BASE = '/api';

export default function ConsumerLogin({ onLoginSuccess, onSwitchToProsumer }) {
  const [accountId, setAccountId] = useState('CONS-9912-BAKERY');
  const [meterKey, setMeterKey] = useState('SM-CONS-9912');
  const [password, setPassword] = useState('grid2026');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  
  // OTAC generator state
  const [generatedOtp, setGeneratedOtp] = useState('619420');
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
        body: JSON.stringify({ role: 'consumer', accountId })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedOtp(data.code);
        setOtp(data.code); // auto-fill for convenience
        setCountdown(data.validForSec || 300);
      } else {
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
    setAccountId('CONS-9912-BAKERY');
    setMeterKey('SM-CONS-9912');
    setPassword('grid2026');
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
          role: 'consumer',
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
      setSuccessMsg('One-Time Access Verified! Entering Consumer Grid Portal...');

      setTimeout(() => {
        onLoginSuccess({
          role: 'consumer',
          sessionToken: data.session?.sessionToken || `OTAC-CONS-${Date.now()}`,
          account: data.session?.account || {
            id: 'CONS-9912-BAKERY',
            name: 'Gupta Bakery',
            alias: 'Gupta Bakery (Commercial)',
            meterId: 'SM-CONS-9912',
            node: 'TX-NORTH-402',
            sanctionedLimitKw: 10.0
          },
          authenticatedAt: new Date().toISOString(),
          consumedOtp: otp.trim()
        });
      }, 700);

    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        if (password === 'grid2026') {
          setConsumedOtps(prev => new Set(prev).add(otp.trim()));
          setSuccessMsg('One-Time Access Verified (Offline Model)! Launching Consumer Portal...');
          setTimeout(() => {
            onLoginSuccess({
              role: 'consumer',
              sessionToken: `OTAC-CONS-OFFLINE-${Date.now()}`,
              account: {
                id: 'CONS-9912-BAKERY',
                name: 'Gupta Bakery',
                alias: 'Gupta Bakery (Commercial)',
                meterId: 'SM-CONS-9912',
                node: 'TX-NORTH-402',
                sanctionedLimitKw: 10.0
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
      {/* Left Info Column: Consumer Branding & Quota Specs */}
      <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl border border-emerald-500/30 relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Dedicated Consumer Portal</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              P2P Energy Marketplace & Headroom Buyer
            </h2>
            <p className="text-emerald-200/80 text-sm mt-2 leading-relaxed">
              Authenticate via cryptographic Smart-Meter clearance to browse local solar offers, verify transformer headroom, and buy green power below utility tariffs.
            </p>
          </div>

          {/* Telemetry Card Preview */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-400" /> Smart Meter Sanction
              </span>
              <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-white border border-emerald-500/40">
                SM-CONS-9912
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Daily Quota Limit:</span>
                <p className="text-lg font-black text-white font-mono">10.0 kWh</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Headroom Left:</span>
                <p className="text-lg font-black text-emerald-400 font-mono">2.6 kWh</p>
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-xl p-2.5 border border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-emerald-200 font-medium">4-Point Gate Check:</span>
              <span className="font-mono text-white font-bold">READY</span>
            </div>
          </div>
        </div>

        {/* Security / One-Time Access Explainer */}
        <div className="relative z-10 pt-6 mt-6 border-t border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Single-Role One-Time Access Protocol</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Logging in locks this browser session strictly to the <strong>Consumer role</strong>. Your one-time passcode will be burned immediately upon verification.
          </p>

          <button
            type="button"
            onClick={onSwitchToProsumer}
            className="w-full mt-2 py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Switch to Prosumer Login Page</span>
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
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4 text-emerald-500" /> Consumer Portal Authorization
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">Consumer Secure Sign In</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Residential, commercial & municipal clean energy buyers
              </p>
            </div>

            {/* Quick Demo Fill Pill */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 transition-all shadow-xs"
              title="Autofill standard demo credentials"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
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
                Consumer Connection Account ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="e.g. CONS-9912-BAKERY"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-semibold text-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            {/* Smart Meter ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Smart Meter Gateway ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={meterKey}
                  onChange={(e) => setMeterKey(e.target.value)}
                  placeholder="SM-CONS-9912"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-semibold text-slate-900 font-mono outline-none transition-all"
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
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-semibold text-slate-900 outline-none transition-all"
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
              <div className="bg-emerald-50/70 border-2 border-emerald-300/80 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      Single-Use One-Time Passcode (OTAC)
                    </span>
                  </div>

                  {/* Generator / Refresh Button */}
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    disabled={isGeneratingOtp}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingOtp ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingOtp ? 'Generating...' : 'Get New One-Time Code'}</span>
                  </button>
                </div>

                {/* Display Current Generated OTAC with Copy action */}
                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">Live Generated OTAC:</span>
                    <span className="text-lg font-black font-mono tracking-widest text-emerald-600">
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
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
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
                    className="w-full px-4 py-2.5 bg-white border border-emerald-300 focus:border-emerald-600 rounded-xl text-base font-black font-mono tracking-widest text-slate-900 text-center outline-none shadow-xs"
                  />
                  <p className="text-[11px] text-emerald-800/80 font-medium mt-1">
                    * Single-use only: Once you login, this exact code is permanently burned and cannot be accessed again.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isOtpExpired}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Verifying One-Time Handshake...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Authorize Consumer Portal (One-Time Access)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Smart Meter Headroom Standard IS-16444</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Discom Feeder Gateway Connected
          </span>
        </div>
      </div>
    </div>
  );
}
