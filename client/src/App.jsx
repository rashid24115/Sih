import React, { useState, useEffect } from 'react';
import { 
  Sun, Zap, Shield, Activity, ArrowRight, CheckCircle2, AlertTriangle, 
  BarChart3, RefreshCw, Award, ChevronRight, MapPin, Sparkles, TrendingUp, Cpu, Compass,
  FileText, LayoutDashboard, ShoppingBag, Search, Check, XCircle, CloudSun,
  Thermometer, Wind, AlertCircle, CheckCircle, ShieldAlert, Type, Eye, RotateCcw,
  SlidersHorizontal, Layers, Server, Network, Maximize2, X
} from 'lucide-react';

const API_BASE = '/api';

const INITIAL_PRODUCER_DATA = {
  generation: 18.4,
  usedLocally: 10.2,
  availableSurplus: 8.2,
  forecastSurplus: 9.6,
  forecastConfidence: 87,
  gridLoad: 62,
  gridHeadroom: 38,
  transformerId: "TX-NORTH-402",
  sharedTotal: 42.0,
  score: 840,
  badge: "Solar Supporter",
  irradiance: 845,
  temp: 31,
  humidity: 42,
  cloudCover: "12%",
  predictedTotal: 22.5
};

const INITIAL_GRID_OFFERS = [
  {
    id: "OFF-401",
    node: "TX-NORTH-402",
    sellerAlias: "Prosumer #84 (Sector 4)",
    amount: 4.0,
    price: "₹3.80/kWh",
    locality: "North Sector 4 Substation",
    transformerLoad: 62,
    availableHeadroom: 38,
    type: "APPROVED",
    reason: "Safe headroom available & within consumer quota limit."
  },
  {
    id: "OFF-108",
    node: "TX-WEST-108",
    sellerAlias: "Prosumer #12 (West Block)",
    amount: 10.0,
    price: "₹3.50/kWh",
    locality: "West Feeder 2 Distribution",
    transformerLoad: 91,
    availableHeadroom: 9,
    type: "BLOCKED_TRANSFORMER",
    reason: "Trade rejected — prevents transformer overload."
  },
  {
    id: "OFF-205",
    node: "TX-EAST-205",
    sellerAlias: "Prosumer #55 (East Hub)",
    amount: 3.5,
    price: "₹3.90/kWh",
    locality: "East Grid Sector Transformer",
    transformerLoad: 55,
    availableHeadroom: 45,
    type: "BLOCKED_CONSUMER_LIMIT",
    reason: "Exceeds daily consumer sanctioned headroom quota limit."
  },
  {
    id: "OFF-309",
    node: "TX-SOUTH-309",
    sellerAlias: "Prosumer #30 (South Solar)",
    amount: 2.5,
    price: "₹3.75/kWh",
    locality: "South Feeder 1 Hub",
    transformerLoad: 48,
    availableHeadroom: 52,
    type: "APPROVED",
    reason: "Safe headroom & optimal feeder proximity."
  },
  {
    id: "OFF-501",
    node: "TX-CENTRAL-501",
    sellerAlias: "Prosumer #99 (Central Plaza)",
    amount: 8.0,
    price: "₹3.60/kWh",
    locality: "Central Commercial Node B",
    transformerLoad: 88,
    availableHeadroom: 12,
    type: "BLOCKED_TRANSFORMER",
    reason: "Transformer capacity constrained."
  },
  {
    id: "OFF-612",
    node: "TX-SUB-612",
    sellerAlias: "Prosumer #42 (Substation 6)",
    amount: 5.0,
    price: "₹3.85/kWh",
    locality: "Substation Ring 6",
    transformerLoad: 40,
    availableHeadroom: 60,
    type: "APPROVED",
    reason: "Cleared by smart-meter gateway."
  }
];

const INITIAL_CONSUMER_DATA = {
  usageToday: 7.4,
  permittedLimit: 10.0,
  remainingLimit: 2.6,
  status: "Within permitted limit",
  meterId: "SM-CONS-9912"
};

const INITIAL_CONSUMER_TRANSACTIONS = [
  {
    id: "TX-1001",
    time: "Today, 09:15 AM",
    seller: "Amit Shah (Sector 4)",
    buyer: "Gupta Bakery (You)",
    amount: "2.0 kWh",
    rate: "₹5.20 / kWh",
    price: "₹5.20 / kWh",
    value: "₹10.40",
    totalValue: "₹10.40",
    transformer: "T-101",
    status: "Confirmed",
    gridStatus: "Verified",
    hash: "0x7f2a99c3e21b88a914c40149e"
  },
  {
    id: "TX-1002",
    time: "Today, 10:45 AM",
    seller: "Rajesh Kumar (Prosumer #31)",
    buyer: "Gupta Bakery (You)",
    amount: "3.2 kWh",
    rate: "₹3.80 / kWh",
    price: "₹3.80 / kWh",
    value: "₹12.16",
    totalValue: "₹12.16",
    transformer: "TX-NORTH-402",
    status: "Confirmed",
    gridStatus: "Verified",
    hash: "0x8e1a49f2b31c99b825d50250f"
  },
  {
    id: "TX-1003",
    time: "Yesterday, 02:40 PM",
    seller: "South Solar (Prosumer #30)",
    buyer: "Gupta Bakery (You)",
    amount: "2.5 kWh",
    rate: "₹3.75 / kWh",
    price: "₹3.75 / kWh",
    value: "₹9.38",
    totalValue: "₹9.38",
    transformer: "TX-SOUTH-309",
    status: "Confirmed",
    gridStatus: "Verified",
    hash: "0x3b1c8109d43f07a22659e238f"
  }
];

const INITIAL_PROSUMER_TRANSACTIONS = [
  {
    id: "TX-1001",
    time: "Today, 09:15 AM",
    seller: "Alex (You)",
    buyer: "Gupta Bakery",
    amount: "2.0 kWh",
    rate: "₹5.20 / kWh",
    price: "₹5.20 / kWh",
    value: "₹10.40",
    totalValue: "₹10.40",
    transformer: "T-101",
    status: "Confirmed",
    gridStatus: "Verified",
    hash: "0x7f2a99c3e21b88a914c40149e"
  },
  {
    id: "TX-1004",
    time: "Today, 11:20 AM",
    seller: "Alex (You)",
    buyer: "Metro Mart #14",
    amount: "4.0 kWh",
    rate: "₹3.85 / kWh",
    price: "₹3.85 / kWh",
    value: "₹15.40",
    totalValue: "₹15.40",
    transformer: "TX-NORTH-402",
    status: "Confirmed",
    gridStatus: "Verified",
    hash: "0x9c3e21b88a914c40149e7f2a"
  },
  {
    id: "TX-1005",
    time: "Yesterday, 02:40 PM",
    seller: "Alex (You)",
    buyer: "Sharma Dairy #90",
    amount: "5.0 kWh",
    rate: "₹3.85 / kWh",
    price: "₹3.85 / kWh",
    value: "₹19.25",
    totalValue: "₹19.25",
    transformer: "TX-NORTH-402",
    status: "Confirmed",
    gridStatus: "Verified",
    hash: "0x14c40149e7f2a99c3e21b88a"
  }
];

const AI_HOURLY_FORECAST = [
  { time: "08:00", val: 1.2, isPeak: false },
  { time: "10:00", val: 2.8, isPeak: false },
  { time: "12:00", val: 4.5, isPeak: true },
  { time: "14:00", val: 4.1, isPeak: true },
  { time: "16:00", val: 2.3, isPeak: false },
  { time: "18:00", val: 0.8, isPeak: false }
];

export default function App() {
  // Navigation & Role States
  const [role, setRole] = useState('consumer'); // 'prosumer', 'consumer', 'topology'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'offers', 'find', 'transactions', 'topology'

  // Application Data States
  const [prosumerData, setProsumerData] = useState(INITIAL_PRODUCER_DATA);
  const [consumerData, setConsumerData] = useState(INITIAL_CONSUMER_DATA);
  const [gridOffers, setGridOffers] = useState(INITIAL_GRID_OFFERS);
  const [consumerTransactions, setConsumerTransactions] = useState(INITIAL_CONSUMER_TRANSACTIONS);
  const [prosumerTransactions, setProsumerTransactions] = useState(INITIAL_PROSUMER_TRANSACTIONS);
  const [transformers, setTransformers] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Active ledger based on current role perspective
  const activeTransactions = role === 'consumer' ? consumerTransactions : prosumerTransactions;

  // Accessibility & Font Size Engine State
  const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'xlarge'
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Filter & Search
  const [offerFilter, setOfferFilter] = useState('ALL'); // 'ALL', 'APPROVED', 'BLOCKED'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Trade
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedGridOffer, setSelectedGridOffer] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [validationStep, setValidationStep] = useState(0); 
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [tradeReceipt, setTradeReceipt] = useState(null);
  const [selectedTxnForDetails, setSelectedTxnForDetails] = useState(INITIAL_CONSUMER_TRANSACTIONS[0]);
  const [previewImage, setPreviewImage] = useState(null);

  // Form Input
  const [shareAmount, setShareAmount] = useState(4.0);
  const [sharePrice, setSharePrice] = useState("₹3.85/kWh");
  const [preferredNode, setPreferredNode] = useState("TX-NORTH-402");

  // Presentation Guided Tour
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const demoSteps = [
    { 
      title: "Scene 1: Prosumer Solar Generation & Surplus", 
      role: "prosumer", 
      tab: "overview", 
      text: "Prosumer views current generation (18.4 kWh), self-consumed load (10.2 kWh), and available tradeable surplus (8.2 kWh)." 
    },
    { 
      title: "Scene 2: Weather Telemetry & AI Yield Forecast", 
      role: "prosumer", 
      tab: "overview", 
      text: "AI neural model forecasts 22.5 kWh solar yield at 87% confidence, using 845 W/m² irradiance and clear-sky sensors." 
    },
    { 
      title: "Scene 3: Prosumer Publishes Surplus to Local Grid", 
      role: "prosumer", 
      tab: "overview", 
      text: "Prosumer publishes surplus energy onto feeder transformer TX-NORTH-402 with automated headroom verification." 
    },
    { 
      title: "Scene 4: Consumer Quota & Sanctioned Headroom", 
      role: "consumer", 
      tab: "overview", 
      text: "Consumer monitors 7.4 kWh consumption today with 2.6 kWh remaining headroom quota before hitting sanctioned threshold." 
    },
    { 
      title: "Scene 5: Find Energy (6 Transformers Evaluated)", 
      role: "consumer", 
      tab: "find", 
      text: "6 Local Transformer offers loaded: illustrating APPROVED, BLOCKED (Transformer Overload), and BLOCKED (Consumer Quota Exceeded)." 
    },
    { 
      title: "Scene 6: 4-Point Automated Grid Validation Check", 
      role: "consumer", 
      tab: "find", 
      text: "Testing real-time 4-point smart-meter gate check: Quota compliance, transformer thermal headroom, and feeder loop proximity." 
    },
    { 
      title: "Scene 7: Smart-Meter Gateway Authorized Settlement", 
      role: "consumer", 
      tab: "find", 
      text: "Trade is approved and settled cryptographically only when both consumer and transformer network headroom limits are satisfied." 
    },
    { 
      title: "Scene 8: Synchronized Microgrid Audit Ledger", 
      role: "consumer", 
      tab: "transactions", 
      text: "Settled transaction logged immutably in the peer-to-peer distribution ledger with verification hash." 
    }
  ];

  // Apply Font Size and High Contrast to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-xlarge');
    root.classList.add(`font-${fontSize}`);
    
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [fontSize, isHighContrast]);

  // Initial Fetch from Backend
  const fetchBackendData = async () => {
    try {
      const [resPros, resCons, resOff, resTx, resTrans] = await Promise.all([
        fetch(`${API_BASE}/prosumer`),
        fetch(`${API_BASE}/consumer`),
        fetch(`${API_BASE}/offers`),
        fetch(`${API_BASE}/transactions`),
        fetch(`${API_BASE}/transformers`)
      ]);

      if (resPros.ok && resCons.ok && resOff.ok && resTx.ok && resTrans.ok) {
        setProsumerData(await resPros.json());
        setConsumerData(await resCons.json());
        setGridOffers(await resOff.json());
        const txData = await resTx.json();
        if (txData && txData.consumer && txData.prosumer) {
          setConsumerTransactions(txData.consumer);
          setProsumerTransactions(txData.prosumer);
        } else if (Array.isArray(txData)) {
          setConsumerTransactions(txData);
        }
        setTransformers(await resTrans.json());
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.warn('Backend server not reachable or starting up. Using local high-fidelity state.', err);
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Update selected receipt when role changes
  useEffect(() => {
    if (role === 'consumer') {
      setSelectedTxnForDetails(consumerTransactions[0] || INITIAL_CONSUMER_TRANSACTIONS[0]);
    } else {
      setSelectedTxnForDetails(prosumerTransactions[0] || INITIAL_PROSUMER_TRANSACTIONS[0]);
    }
  }, [role]);

  const handleNextDemoStep = () => {
    const nextStep = (demoStep + 1) % demoSteps.length;
    setDemoStep(nextStep);
    const config = demoSteps[nextStep];
    setRole(config.role);
    setActiveTab(config.tab);

    if (nextStep === 2) {
      setShowShareModal(true);
    } else {
      setShowShareModal(false);
    }

    if (nextStep === 4) {
      setShowBuyModal(false);
    }

    if (nextStep === 5) {
      const approvedOffer = gridOffers.find(o => o.type === 'APPROVED') || gridOffers[0];
      setSelectedGridOffer(approvedOffer);
      setShowBuyModal(true);
      setValidationStep(1);
      setTimeout(() => {
        setValidationStep(2);
      }, 1200);
    }

    if (nextStep === 6) {
      const approvedOffer = gridOffers.find(o => o.type === 'APPROVED') || gridOffers[0];
      setSelectedGridOffer(approvedOffer);
      setShowBuyModal(true);
      setValidationStep(2);
      setTradeSuccess(true);
    }

    if (nextStep === 7) {
      setShowBuyModal(false);
    }
  };

  // Reset Demo to Initial Clean State
  const handleResetDemo = async () => {
    if (window.confirm("Reset all URJAGRID demo records and balances back to initial state?")) {
      try {
        await fetch(`${API_BASE}/reset`, { method: 'POST' });
        await fetchBackendData();
      } catch (e) {
        setProsumerData(INITIAL_PRODUCER_DATA);
        setConsumerData(INITIAL_CONSUMER_DATA);
        setGridOffers(INITIAL_GRID_OFFERS);
        setTransactions(INITIAL_TRANSACTIONS);
      }
      setDemoStep(0);
      setIsDemoActive(false);
    }
  };

  // Create Surplus Offer
  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setValidationStep(1);

    const numAmount = parseFloat(shareAmount);

    try {
      if (isBackendConnected) {
        const res = await fetch(`${API_BASE}/offers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: numAmount,
            price: sharePrice,
            node: preferredNode
          })
        });
        const data = await res.json();
        if (res.ok) {
          setValidationStep(2);
          setTimeout(() => {
            fetchBackendData();
            setShowShareModal(false);
            setValidationStep(0);
          }, 1000);
          return;
        }
      }
    } catch (err) {
      console.warn("Using offline fallback creation", err);
    }

    // Local Fallback
    setTimeout(() => {
      setValidationStep(2);
      const newOffer = {
        id: `OFF-${Math.floor(100 + Math.random() * 900)}`,
        node: preferredNode,
        sellerAlias: "Prosumer (You)",
        amount: numAmount,
        price: sharePrice,
        locality: preferredNode === "TX-NORTH-402" ? "North Sector 4 Substation" : "Feeder Loop Distribution",
        transformerLoad: 62,
        availableHeadroom: 38,
        type: "APPROVED",
        reason: "Newly published prosumer surplus offer cleared by smart meter."
      };

      setGridOffers([newOffer, ...gridOffers]);
      setProsumerData(prev => ({
        ...prev,
        availableSurplus: Math.max(0, prev.availableSurplus - numAmount)
      }));

      setTimeout(() => {
        setShowShareModal(false);
        setValidationStep(0);
      }, 1000);
    }, 1200);
  };

  // Execute Trade
  const handleExecuteTrade = async (offer) => {
    if (offer.type !== 'APPROVED') return;

    setValidationStep(1);

    try {
      if (isBackendConnected) {
        const res = await fetch(`${API_BASE}/trade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            offerId: offer.id,
            requestedKwh: Math.min(offer.amount, consumerData.remainingLimit)
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setTimeout(() => {
            setValidationStep(2);
            setTradeSuccess(true);
            setTradeReceipt(data.transaction);
            setSelectedTxnForDetails(data.transaction);
            fetchBackendData();
          }, 1200);
          return;
        }
      }
    } catch (err) {
      console.warn("Using offline trade logic", err);
    }

    // Offline Local Trade Fallback
    setTimeout(() => {
      setValidationStep(2);
      setTradeSuccess(true);

      const amountToBuy = Math.min(offer.amount, consumerData.remainingLimit);
      const priceVal = parseFloat(offer.price?.replace(/[^\d.]/g, '') || 3.80);
      const totalCost = (amountToBuy * priceVal).toFixed(2);
      
      const newTx = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        time: "Just now",
        seller: offer.sellerAlias,
        buyer: "Consumer (You)",
        amount: `${amountToBuy.toFixed(1)} kWh`,
        rate: offer.price,
        price: offer.price,
        value: `₹${totalCost}`,
        totalValue: `₹${totalCost}`,
        transformer: offer.node,
        status: "Confirmed",
        gridStatus: "Verified"
      };

      setTradeReceipt(newTx);
      setSelectedTxnForDetails(newTx);
      setTransactions([newTx, ...transactions]);
      
      setGridOffers(prev => prev.map(o => o.id === offer.id ? { ...o, amount: Math.max(0, +(o.amount - amountToBuy).toFixed(1)) } : o));

      setProsumerData(prev => ({
        ...prev,
        sharedTotal: +(prev.sharedTotal + amountToBuy).toFixed(1),
        score: prev.score + 25
      }));

      setConsumerData(prev => ({
        ...prev,
        usageToday: +(prev.usageToday + amountToBuy).toFixed(1),
        remainingLimit: Math.max(0, +(prev.remainingLimit - amountToBuy).toFixed(1))
      }));

    }, 1200);
  };

  // Filtered Grid Offers
  const filteredOffers = gridOffers.filter(offer => {
    if (offerFilter === 'APPROVED' && offer.type !== 'APPROVED') return false;
    if (offerFilter === 'BLOCKED' && offer.type === 'APPROVED') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return offer.id.toLowerCase().includes(q) || 
             offer.node.toLowerCase().includes(q) || 
             offer.locality.toLowerCase().includes(q) ||
             offer.sellerAlias.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* ==================== TOP NAVIGATION HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/30">
              <Zap className="w-7 h-7 text-white stroke-[2.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                  URJAGRID
                </span>
                <span className="text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full shadow-xs">
                  P2P Energy Exchange
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 hidden sm:flex items-center gap-2">
                <span>Smart Grid Microgrid Trading System</span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isBackendConnected ? 'Backend Live & Synced' : 'Grid Model Active'}
                </span>
              </p>
            </div>
          </div>

          {/* Controls: Font Size, High Contrast, Role Switcher, Presentation */}
          <div className="flex items-center flex-wrap gap-2.5">
            
            {/* Font Size & Accessibility Switcher (KEY USER REQUIREMENT) */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-300 flex items-center shadow-xs" title="Adjust Text & Display Size">
              <span className="px-2 text-xs font-bold text-slate-600 flex items-center gap-1">
                <Type className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Size:</span>
              </span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'normal'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Normal Font Size"
              >
                Normal
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'large'
                    ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Large Font Size (Recommended)"
              >
                Large +
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'xlarge'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Extra Large Font Size"
              >
                Extra Large ++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isHighContrast
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="Toggle High-Contrast Border & Text Mode"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden lg:inline">{isHighContrast ? 'High Contrast On' : 'High Contrast'}</span>
            </button>

            {/* Role Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-300 flex items-center gap-1 shadow-xs">
              <button
                onClick={() => { setRole('prosumer'); setActiveTab('overview'); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                  role === 'prosumer'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Sun className="w-4 h-4 stroke-[2.5]" />
                <span>Prosumer</span>
              </button>
              
              <button
                onClick={() => { setRole('consumer'); setActiveTab('overview'); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                  role === 'consumer'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>Consumer</span>
              </button>
            </div>

            {/* Presentation Mode */}
            <button
              onClick={() => setIsDemoActive(!isDemoActive)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold border transition-all ${
                isDemoActive 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 animate-pulse-slow' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Guided Tour</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={handleResetDemo}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-300 transition-all"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>
        </div>
      </header>

      {/* ==================== GUIDED PRESENTATION BANNER ==================== */}
      {isDemoActive && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white border-b-2 border-indigo-400 px-4 py-3.5 sticky top-[73px] z-30 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-indigo-500/30 text-indigo-200 rounded-xl border border-indigo-400/40 shrink-0">
                <Compass className="w-6 h-6 text-amber-300 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded font-mono">
                    Scene {demoStep + 1} / {demoSteps.length}
                  </span>
                  <span className="text-slate-400">•</span>
                  <h3 className="text-base font-extrabold text-white tracking-wide">{demoSteps[demoStep].title}</h3>
                </div>
                <p className="text-sm text-indigo-100 mt-1 font-medium leading-snug">{demoSteps[demoStep].text}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={handleNextDemoStep}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-amber-400/20"
              >
                <span>Advance Scene</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MAIN APPLICATION LAYOUT ==================== */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-7 p-4 md:p-6 lg:p-8">
        
        {/* ==================== SIDEBAR ==================== */}
        <aside className="w-full md:w-72 shrink-0 flex flex-col gap-4">
          
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-row md:flex-col gap-2 shadow-sm">
            <div className="px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-500 hidden md:block border-b border-slate-100">
              {role === 'prosumer' ? '⚡ Prosumer Dashboard' : '🛒 Consumer Portal'}
            </div>

            {role === 'prosumer' ? (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left ${
                    activeTab === 'overview' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Overview & Weather</span>
                </button>
                <button
                  onClick={() => setActiveTab('offers')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left ${
                    activeTab === 'offers' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>My Active Offers ({gridOffers.filter(o => o.sellerAlias.includes("You")).length})</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left ${
                    activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Consumer Quota</span>
                </button>
                <button
                  onClick={() => setActiveTab('find')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left ${
                    activeTab === 'find' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Search className="w-5 h-5" />
                  <span>Find Energy (6 Nodes)</span>
                </button>
                <button
                  onClick={() => setActiveTab('topology')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left ${
                    activeTab === 'topology' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Network className="w-5 h-5" />
                  <span>Transformer Topology</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left ${
                activeTab === 'transactions' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Settlement Ledger ({activeTransactions.length})</span>
            </button>
          </div>

          {/* Transformer Node Hardware Telemetry Widget (Clean, No Images) */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-extrabold text-slate-900">Feeder Transformer</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                HEALTHY
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-semibold">Local Node:</span>
                <span className="font-mono text-slate-950 font-bold text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  {prosumerData.transformerId}
                </span>
              </div>
              
              <div>
                <div className="flex justify-between text-slate-700 mb-1.5">
                  <span className="font-semibold">Current Load:</span>
                  <span className="text-emerald-700 font-extrabold font-mono text-base">{prosumerData.gridLoad}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-300">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${prosumerData.gridLoad}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-slate-700 pt-1 border-t border-slate-100">
                <span className="font-semibold">Available Headroom:</span>
                <span className="text-emerald-800 font-black font-mono text-base">
                  {prosumerData.gridHeadroom}% (15.2 kWh)
                </span>
              </div>
            </div>
          </div>

        </aside>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <main className="flex-1 space-y-7">
          
          {/* ========================================================================= */}
          {/* ROLE: PROSUMER                                                            */}
          {/* ========================================================================= */}
          {role === 'prosumer' && (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-7">
                  
                  {/* Prosumer Greeting Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-amber-500/15 via-amber-50 to-white border-2 border-amber-300 rounded-3xl p-6 sm:p-7 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-extrabold text-amber-800 uppercase tracking-wider mb-1.5">
                        <Sun className="w-5 h-5 text-amber-600 stroke-[2.5]" /> Prosumer Portal • Sector 4
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Good Morning, Alex 👋</h2>
                      <p className="text-base font-medium text-slate-700 mt-2 max-w-xl leading-relaxed">
                        Your rooftop solar array is generating surplus clean power. Trade directly with verified neighborhood consumers on transformer <strong className="font-mono text-slate-950 font-extrabold">TX-NORTH-402</strong>.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-6 py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/30 text-base shrink-0 border border-amber-400"
                    >
                      <Zap className="w-5 h-5 stroke-[3]" />
                      <span>+ Share Surplus Energy</span>
                    </button>
                  </div>

                  {/* 3 Prominent Stat Cards (EXTRA-LARGE NUMBERS & LABELS) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    
                    {/* Solar Generation */}
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm metric-card space-y-2">
                      <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                        Today's Solar Generation
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
                        {prosumerData.generation} <span className="text-xl text-slate-500 font-semibold">kWh</span>
                      </div>
                      <div className="pt-2 flex items-center gap-1.5 text-sm text-emerald-800 font-extrabold">
                        <TrendingUp className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                        <span>High Solar Yield Day (+18%)</span>
                      </div>
                    </div>

                    {/* Used Locally */}
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm metric-card space-y-2">
                      <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                        Used Locally (Home)
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-slate-800 font-mono tracking-tight">
                        {prosumerData.usedLocally} <span className="text-xl text-slate-500 font-semibold">kWh</span>
                      </div>
                      <div className="pt-2 text-sm text-slate-600 font-medium">
                        Self-consumed domestic appliances
                      </div>
                    </div>

                    {/* Available Surplus */}
                    <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-2 border-amber-400 rounded-2xl p-6 shadow-sm metric-card space-y-2">
                      <div className="text-sm font-extrabold text-amber-900 uppercase tracking-wide flex items-center justify-between">
                        <span>Available Surplus</span>
                        <span className="text-xs bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-black">READY</span>
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-amber-600 font-mono tracking-tight">
                        {prosumerData.availableSurplus.toFixed(1)} <span className="text-xl text-amber-800 font-semibold">kWh</span>
                      </div>
                      <div className="pt-2 text-sm text-amber-950 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        <span>Ready for P2P Feeder Dispatch</span>
                      </div>
                    </div>

                  </div>

                  {/* WEATHER FORECAST & AI YIELD PREDICTION CARD */}
                  <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-7">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl border border-amber-300">
                          <CloudSun className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                              Weather Telemetry & AI Solar Yield Prediction
                            </h3>
                            <span className="text-xs font-black uppercase bg-indigo-100 text-indigo-800 border border-indigo-300 px-3 py-1 rounded-full">
                              ML Model v2.4 Active
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-600 mt-0.5">
                            Real-time solar irradiance sensors and neural load distribution forecasting
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-2 shadow-xs">
                          <Sparkles className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                          <span>{prosumerData.forecastConfidence}% AI Confidence</span>
                        </span>
                      </div>
                    </div>

                    {/* Live Weather Metrics Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      
                      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <Sun className="w-4 h-4 text-amber-500" />
                          <span>Solar Irradiance</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950">
                          {prosumerData.irradiance} <span className="text-sm font-semibold text-slate-500">W/m²</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <Thermometer className="w-4 h-4 text-rose-500" />
                          <span>Ambient Temp</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950">
                          {prosumerData.temp}°C <span className="text-sm font-semibold text-slate-500">(Sunny)</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <Wind className="w-4 h-4 text-sky-500" />
                          <span>Cloud Cover</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950">
                          {prosumerData.cloudCover} <span className="text-sm font-semibold text-slate-500">(Minimal)</span>
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-sm font-black text-amber-900">
                          <Zap className="w-4 h-4 text-amber-600" />
                          <span>Projected Surplus</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700">
                          {prosumerData.forecastSurplus} <span className="text-sm font-semibold text-amber-900">kWh</span>
                        </div>
                      </div>

                    </div>

                    {/* Hourly Predicted Generation Curve */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-extrabold text-slate-900">
                          AI Projected Hourly Generation Curve (Today)
                        </span>
                        <span className="text-sm font-bold text-slate-600">
                          Peak Yield: <strong className="text-amber-600 font-mono text-base">4.5 kWh @ 12:00 PM</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-6 gap-3 items-end h-44 bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
                        {AI_HOURLY_FORECAST.map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                            <span className="text-xs sm:text-sm font-mono font-bold text-slate-700 group-hover:text-amber-600 transition-colors">
                              {item.val}k
                            </span>
                            <div className="w-full bg-slate-200 rounded-t-lg relative overflow-hidden flex items-end" style={{ height: `${(item.val / 5.0) * 100}%` }}>
                              <div 
                                className={`w-full ${item.isPeak ? 'bg-amber-500' : 'bg-emerald-500'} rounded-t-lg transition-all duration-500 group-hover:brightness-110`} 
                                style={{ height: '100%' }}
                              ></div>
                            </div>
                            <span className={`text-xs sm:text-sm font-mono font-bold ${item.isPeak ? 'text-amber-700' : 'text-slate-500'}`}>
                              {item.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weighted Load Forecast Insights Banner */}
                    <div className="p-4 sm:p-5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl flex items-start gap-4 text-sm text-slate-800">
                      <Sparkles className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-indigo-950 text-base block mb-1">
                          Weighted Load Forecast Insights
                        </span>
                        <span className="leading-relaxed">
                          Weather telemetry predicts <strong>845 W/m² clear-sky irradiance</strong> with optimal panel angle. Factoring historical self-consumption habits, the neural model estimates a net tradeable surplus of <strong>9.6 kWh</strong> between 11:00 AM and 03:00 PM.
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* Prosumer Tab: My Offers */}
              {activeTab === 'offers' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Your Active Solar Offers</h2>
                      <p className="text-base text-slate-600 mt-1">Offers listed on local transformer node TX-NORTH-402 and feeder loop</p>
                    </div>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-5 py-3 rounded-xl text-sm transition-all flex items-center gap-2 shadow-md shadow-amber-500/20"
                    >
                      <Zap className="w-4 h-4" />
                      <span>+ Create Surplus Offer</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {gridOffers.filter(o => o.sellerAlias.includes("You")).map(offer => (
                      <div key={offer.id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm metric-card">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{offer.id}</span>
                            <span className="text-xs px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold">
                              ACTIVE
                            </span>
                          </div>
                          <span className="font-mono text-lg font-black text-amber-600">{offer.price}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-3xl font-black font-mono text-slate-900">{offer.amount} kWh</div>
                          <div className="text-sm font-semibold text-slate-600">Node: {offer.node} ({offer.locality})</div>
                        </div>

                        <div className="text-sm text-slate-700 pt-3 border-t border-slate-100 flex items-center justify-between font-semibold">
                          <span>Transformer Headroom: {offer.availableHeadroom}%</span>
                          <span className="text-emerald-700 font-extrabold">Status: Cleared</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* ROLE: CONSUMER                                                            */}
          {/* ========================================================================= */}
          {role === 'consumer' && (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-7">
                  
                  {/* Consumer Greeting Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-emerald-500/15 via-emerald-50 to-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-7 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800 uppercase tracking-wider mb-1.5">
                        <ShoppingBag className="w-5 h-5 text-emerald-700 stroke-[2.5]" /> Consumer Portal • Meter ID: {consumerData.meterId}
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Hello, Alex 👋</h2>
                      <p className="text-base font-medium text-slate-700 mt-2 max-w-xl leading-relaxed">
                        Purchase clean local solar energy directly from validated neighborhood prosumers while maintaining feeder transformer stability.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('find')}
                      className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 text-base shrink-0 border border-emerald-500"
                    >
                      <Search className="w-5 h-5 stroke-[3]" />
                      <span>Find Energy in Transformers</span>
                    </button>
                  </div>

                  {/* 3 Prominent Stat Cards: Consumer Quota (EXTRA LARGE FONTS) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm metric-card space-y-2">
                      <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                        Today's Metered Usage
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
                        {consumerData.usageToday.toFixed(1)} <span className="text-xl text-slate-500 font-semibold">kWh</span>
                      </div>
                      <div className="pt-2 text-sm text-slate-600 font-medium">
                        Live smart-meter verified load
                      </div>
                    </div>

                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm metric-card space-y-2">
                      <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                        Permitted Sanctioned Limit
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-slate-800 font-mono tracking-tight">
                        {consumerData.permittedLimit.toFixed(1)} <span className="text-xl text-slate-500 font-semibold">kWh</span>
                      </div>
                      <div className="pt-2 text-sm text-slate-600 font-medium">
                        Maximum daily sanctioned safety quota
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-2 border-emerald-400 rounded-2xl p-6 shadow-sm metric-card space-y-2">
                      <div className="text-sm font-extrabold text-emerald-900 uppercase tracking-wide flex items-center justify-between">
                        <span>Remaining Headroom Quota</span>
                        <span className="text-xs bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded font-black">SAFE</span>
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-emerald-700 font-mono tracking-tight">
                        {consumerData.remainingLimit.toFixed(1)} <span className="text-xl text-emerald-900 font-semibold">kWh</span>
                      </div>
                      <div className="pt-2 flex items-center gap-1.5 text-sm text-emerald-800 font-extrabold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Within permitted safety quota</span>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* ENHANCEMENT 2: 6 LOCAL TRANSFORMER CARDS (MATCHING REFERENCE DESIGN)      */}
              {/* ========================================================================= */}
              {(activeTab === 'find' || activeTab === 'overview') && (
                <div className="space-y-6 pt-2">
                  
                  {/* Section Title & Filter Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-sm">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                        Local Transformer Grid Validation
                      </h2>
                      <p className="text-base text-slate-600 mt-0.5">
                        6 Transformer Node offers evaluated for network capacity & consumer quota compliance
                      </p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 uppercase mr-1">Filter:</span>
                      <button
                        onClick={() => setOfferFilter('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                          offerFilter === 'ALL'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        All 6 Nodes
                      </button>
                      <button
                        onClick={() => setOfferFilter('APPROVED')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                          offerFilter === 'APPROVED'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        Approved Only
                      </button>
                      <button
                        onClick={() => setOfferFilter('BLOCKED')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                          offerFilter === 'BLOCKED'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        Blocked Only
                      </button>
                    </div>
                  </div>

                  {/* GRID OF 6 TRANSFORMER CARDS (EXTRA LEGIBLE, DISTINCT COLOR CODING) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOffers.map(offer => {
                      
                      // ==========================================
                      // CARD STYLE 1: APPROVED (GREEN)
                      // ==========================================
                      if (offer.type === 'APPROVED') {
                        return (
                          <div 
                            key={offer.id} 
                            className="bg-emerald-50/70 border-3 border-emerald-500 rounded-3xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden space-y-5 metric-card"
                          >
                            <div>
                              {/* Header */}
                              <div className="flex items-start gap-3.5 pb-4 border-b border-emerald-300">
                                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                                  <Check className="w-6 h-6 stroke-[3.5]" />
                                </div>
                                <div>
                                  <h4 className="text-base font-black text-emerald-950 tracking-wider uppercase">
                                    APPROVED
                                  </h4>
                                  <p className="text-sm text-emerald-800 font-bold">
                                    Trade cleared — safe headroom
                                  </p>
                                </div>
                              </div>

                              {/* Details Table with Big Clear Numbers */}
                              <div className="py-4 space-y-3 text-sm font-sans">
                                <div className="flex justify-between items-center text-slate-800">
                                  <span className="font-semibold">Transformer Load</span>
                                  <span className="font-black text-emerald-900 font-mono text-base">{offer.transformerLoad}%</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-800">
                                  <span className="font-semibold">Available Headroom</span>
                                  <span className="font-black text-emerald-900 font-mono text-base">{offer.availableHeadroom}%</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-800">
                                  <span className="font-semibold">Trade Request</span>
                                  <span className="font-black text-emerald-900 font-mono text-base">{offer.amount} kWh</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-800 pt-1">
                                  <span className="font-semibold">Unit Price</span>
                                  <span className="font-black text-emerald-700 font-mono text-base">{offer.price}</span>
                                </div>
                              </div>

                              {/* Outcome Footer */}
                              <div className="pt-3 border-t border-emerald-300 flex items-center justify-between text-sm font-black text-emerald-900">
                                <span>Result: APPROVED</span>
                                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedGridOffer(offer);
                                setShowBuyModal(true);
                                setValidationStep(0);
                                setTradeSuccess(false);
                                setTradeReceipt(null);
                              }}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 border border-emerald-500"
                            >
                              <span>Execute Trade</span>
                              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                        );
                      }

                      // ==========================================
                      // CARD STYLE 2: BLOCKED DUE TO TRANSFORMER OVERLOAD (RED)
                      // ==========================================
                      if (offer.type === 'BLOCKED_TRANSFORMER') {
                        return (
                          <div 
                            key={offer.id} 
                            className="bg-rose-50/70 border-3 border-rose-500 rounded-3xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden space-y-5 metric-card"
                          >
                            <div>
                              {/* Header */}
                              <div className="flex items-start gap-3.5 pb-4 border-b border-rose-300">
                                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                                  <XCircle className="w-6 h-6 stroke-[3]" />
                                </div>
                                <div>
                                  <h4 className="text-base font-black text-rose-950 tracking-wider uppercase">
                                    BLOCKED
                                  </h4>
                                  <p className="text-sm text-rose-800 font-bold">
                                    Trade rejected — prevents overload
                                  </p>
                                </div>
                              </div>

                              {/* Details Table with Big Clear Numbers */}
                              <div className="py-4 space-y-3 text-sm font-sans">
                                <div className="flex justify-between items-center text-slate-800">
                                  <span className="font-semibold">Transformer Load</span>
                                  <span className="font-black text-rose-800 font-mono text-base">{offer.transformerLoad}%</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-800">
                                  <span className="font-semibold">Available Headroom</span>
                                  <span className="font-black text-rose-800 font-mono text-base">{offer.availableHeadroom}%</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-800">
                                  <span className="font-semibold">Trade Request</span>
                                  <span className="font-black text-rose-800 font-mono text-base">{offer.amount} kWh</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-800 pt-1">
                                  <span className="font-semibold">Unit Price</span>
                                  <span className="font-black text-rose-700 font-mono text-base">{offer.price}</span>
                                </div>
                              </div>

                              {/* Outcome Footer */}
                              <div className="pt-3 border-t border-rose-300 flex items-center justify-between text-sm font-black text-rose-900">
                                <span>Result: BLOCKED</span>
                                <XCircle className="w-5 h-5 text-rose-600" />
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedGridOffer(offer);
                                setShowBuyModal(true);
                                setValidationStep(0);
                                setTradeSuccess(false);
                                setTradeReceipt(null);
                              }}
                              className="w-full bg-rose-100 hover:bg-rose-200 text-rose-900 border-2 border-rose-300 font-extrabold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
                            >
                              <span>Inspect Overload Block</span>
                              <AlertCircle className="w-4 h-4 text-rose-700" />
                            </button>
                          </div>
                        );
                      }

                      // ==========================================
                      // CARD STYLE 3: CONSUMER LIMIT EXCEEDED (BLUE / INDIGO)
                      // ==========================================
                      return (
                        <div 
                          key={offer.id} 
                          className="bg-indigo-50/70 border-3 border-indigo-500 rounded-3xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden space-y-5 metric-card"
                        >
                          <div>
                            {/* Header */}
                            <div className="flex items-start gap-3.5 pb-4 border-b border-indigo-300">
                              <div className="w-10 h-10 rounded-full bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md">
                                <Shield className="w-6 h-6 stroke-[3]" />
                              </div>
                              <div>
                                <h4 className="text-base font-black text-indigo-950 tracking-wider uppercase">
                                  CONSUMER LIMIT
                                </h4>
                                <p className="text-sm text-indigo-800 font-bold">
                                  Stays within sanctioned limit
                                </p>
                              </div>
                            </div>

                            {/* Details Table with Big Clear Numbers */}
                            <div className="py-4 space-y-3 text-sm font-sans">
                              <div className="flex justify-between items-center text-slate-800">
                                <span className="font-semibold">Permitted Limit</span>
                                <span className="font-black text-indigo-950 font-mono text-base">{consumerData.permittedLimit} kWh/day</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-800">
                                <span className="font-semibold">Current Usage</span>
                                <span className="font-black text-indigo-950 font-mono text-base">{consumerData.usageToday} kWh</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-800">
                                <span className="font-semibold">Requested Energy</span>
                                <span className="font-black text-indigo-950 font-mono text-base">{offer.amount} kWh</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-800 pt-1">
                                <span className="font-semibold">Unit Price</span>
                                <span className="font-black text-indigo-800 font-mono text-base">{offer.price}</span>
                              </div>
                            </div>

                            {/* Outcome Footer */}
                            <div className="pt-3 border-t border-indigo-300 flex items-center justify-between text-sm font-black text-indigo-950">
                              <span>Result: EXCEEDS LIMIT</span>
                              <ShieldAlert className="w-5 h-5 text-indigo-700" />
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedGridOffer(offer);
                              setShowBuyModal(true);
                              setValidationStep(0);
                              setTradeSuccess(false);
                              setTradeReceipt(null);
                            }}
                            className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border-2 border-indigo-300 font-extrabold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
                          >
                            <span>Inspect Quota Limit</span>
                            <Shield className="w-4 h-4 text-indigo-700" />
                          </button>
                        </div>
                      );

                    })}
                  </div>

                  {/* Reference Image Mandatory Banner */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 text-center text-sm sm:text-base font-bold tracking-wide shadow-lg border border-slate-700 flex items-center justify-center gap-3">
                    <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Trade is approved only when both consumer and network limits are satisfied.</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* TAB: TRANSFORMER TOPOLOGY (CONSUMER ONLY)                                 */}
          {/* ========================================================================= */}
          {role === 'consumer' && activeTab === 'topology' && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      Microgrid Transformer Network Topology
                    </h2>
                    <p className="text-base text-slate-600 mt-1">
                      Live thermal loading and headroom capacity across all 6 distribution nodes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      All Nodes Synchronized
                    </span>
                  </div>
                </div>

                {/* Transformer Network Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-3">
                  {INITIAL_GRID_OFFERS.map((nodeOffer, idx) => {
                    const isOverloaded = nodeOffer.transformerLoad > 85;
                    const isConstrained = nodeOffer.transformerLoad > 75 && nodeOffer.transformerLoad <= 85;

                    return (
                      <div 
                        key={idx} 
                        className={`p-5 rounded-2xl border-2 transition-all ${
                          isOverloaded 
                            ? 'bg-rose-50/70 border-rose-400' 
                            : isConstrained 
                            ? 'bg-amber-50/70 border-amber-400' 
                            : 'bg-emerald-50/60 border-emerald-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-base font-black text-slate-900">{nodeOffer.node}</span>
                          <span className={`text-xs font-black px-2.5 py-1 rounded ${
                            isOverloaded 
                              ? 'bg-rose-600 text-white' 
                              : isConstrained 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {isOverloaded ? 'OVERLOAD RISK' : isConstrained ? 'CONSTRAINED' : 'NORMAL'}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-600 mb-3">{nodeOffer.locality}</div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between font-bold">
                            <span>Thermal Load:</span>
                            <span className="font-mono text-base">{nodeOffer.transformerLoad}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                isOverloaded ? 'bg-rose-600' : isConstrained ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${nodeOffer.transformerLoad}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs font-semibold text-slate-600 pt-1">
                            <span>Headroom: {nodeOffer.availableHeadroom}%</span>
                            <span>Limit: Safe &lt; 85%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: GRID TRANSACTION LEDGER                                              */}
          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {/* TAB: GRID TRANSACTION LEDGER & TRADE CONFIRMED DETAILS (SETTLEMENT LAYER) */}
          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {/* TAB: GRID TRANSACTION LEDGER & TRADE CONFIRMED DETAILS (SETTLEMENT LAYER) */}
          {/* ========================================================================= */}
          {activeTab === 'transactions' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {role === 'consumer' ? 'Consumer Purchase Settlement Ledger' : 'Prosumer Sales Settlement Ledger'}
                  </h2>
                  <p className="text-base text-slate-600 mt-1">
                    {role === 'consumer'
                      ? 'Electricity purchases settled for consumer Gupta Bakery (You) — single consumer account'
                      : 'Electricity sales dispatched from prosumer Alex (You) — single prosumer account'}
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bi-Directional Telemetry Verified</span>
                </div>
              </div>

              {/* SECTION: TRADE DETAILS RECEIPT (MATCHING USER UPLOADED SCREENSHOT) */}
              {selectedTxnForDetails && (
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-9 shadow-sm max-w-2xl mx-auto space-y-6">
                  
                  {/* Header */}
                  <div className="text-center space-y-1.5 pb-2">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                      Trade Confirmed
                    </h3>
                    <p className="text-base font-medium text-slate-500">
                      Your local renewable energy trade has been recorded.
                    </p>
                  </div>

                  {/* Transaction ID Pill Box */}
                  <div className="bg-slate-100/70 border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between">
                    <span className="text-sm sm:text-base font-medium text-slate-500">Transaction ID</span>
                    <span className="text-base sm:text-lg font-black font-mono text-emerald-700">
                      {selectedTxnForDetails.id}
                    </span>
                  </div>

                  {/* Key-Value Details Rows */}
                  <div className="divide-y divide-slate-100 text-sm sm:text-base">
                    
                    <div className="py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Seller</span>
                      <span className="font-extrabold text-slate-950">
                        {role === 'prosumer' ? 'Alex (You)' : selectedTxnForDetails.seller}
                      </span>
                    </div>

                    <div className="py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Buyer</span>
                      <span className="font-extrabold text-slate-950">
                        {role === 'consumer' ? 'Gupta Bakery (You)' : selectedTxnForDetails.buyer}
                      </span>
                    </div>

                    <div className="py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Energy</span>
                      <span className="font-extrabold font-mono text-slate-950">{selectedTxnForDetails.amount}</span>
                    </div>

                    <div className="py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Price</span>
                      <span className="font-extrabold font-mono text-slate-950">
                        {selectedTxnForDetails.price || selectedTxnForDetails.rate || "₹5.20 / kWh"}
                      </span>
                    </div>

                    <div className="py-3.5 flex items-center justify-between bg-emerald-50/50 -mx-3 px-3 rounded-xl">
                      <span className="text-slate-700 font-bold">Value</span>
                      <span className="font-black font-mono text-emerald-800 text-xl sm:text-2xl">
                        {selectedTxnForDetails.value || selectedTxnForDetails.totalValue || "₹10.40"}
                      </span>
                    </div>

                    <div className="py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Transformer</span>
                      <span className="font-extrabold font-mono text-slate-950">{selectedTxnForDetails.transformer}</span>
                    </div>

                    <div className="py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Status</span>
                      <span className="font-extrabold text-slate-950">{selectedTxnForDetails.status || "Confirmed"}</span>
                    </div>

                  </div>

                  {/* Settlement Framework Banner (Exactly matching user uploaded image) */}
                  <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-center space-y-1">
                    <h4 className="text-sm sm:text-base font-extrabold text-amber-900">
                      Settlement framework
                    </h4>
                    <p className="text-xs sm:text-sm font-medium text-amber-800/90">
                      To be accounted for through the applicable DISCOM billing/settlement framework.
                    </p>
                  </div>

                </div>
              )}

              {/* Transactions Ledger Table */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {role === 'consumer' ? 'Your Energy Purchase Transactions' : 'Your Energy Sales Dispatches'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {role === 'consumer'
                        ? 'Buyer is strictly your consumer account (Gupta Bakery). Prosumers (sellers) vary.'
                        : 'Seller is strictly your prosumer account (Alex). Consumers (buyers) vary.'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Click any row to inspect its trade monetary receipt above</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-800">
                    <thead className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wider border-b-2 border-slate-200 font-extrabold">
                      <tr>
                        <th className="p-4">Txn ID</th>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Seller</th>
                        <th className="p-4">Buyer</th>
                        <th className="p-4">Energy</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Value (₹)</th>
                        <th className="p-4">Transformer</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {activeTransactions.map(tx => {
                        const isSelected = selectedTxnForDetails?.id === tx.id;
                        return (
                          <tr 
                            key={tx.id} 
                            onClick={() => setSelectedTxnForDetails(tx)}
                            className={`cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-emerald-50/80 hover:bg-emerald-50' 
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="p-4 font-black text-slate-900 text-base">{tx.id}</td>
                            <td className="p-4 text-slate-600 font-sans font-medium text-sm">{tx.time}</td>
                            <td className="p-4 text-amber-600 font-sans font-bold text-sm">
                              {role === 'prosumer' ? 'Alex (You)' : tx.seller}
                            </td>
                            <td className="p-4 text-emerald-700 font-sans font-bold text-sm">
                              {role === 'consumer' ? 'Gupta Bakery (You)' : tx.buyer}
                            </td>
                            <td className="p-4 font-black text-slate-900 text-base">{tx.amount}</td>
                            <td className="p-4 text-slate-700 text-sm font-bold">{tx.price || tx.rate || "₹3.80 / kWh"}</td>
                            <td className="p-4 font-black text-emerald-800 text-base">{tx.value || tx.totalValue || "₹12.16"}</td>
                            <td className="p-4 text-slate-600 text-sm font-semibold">{tx.transformer}</td>
                            <td className="p-4 font-sans">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                                <CheckCircle className="w-3.5 h-3.5" />
                                {tx.status}
                              </span>
                            </td>
                            <td className="p-4 text-center font-sans">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTxnForDetails(tx);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  isSelected 
                                    ? 'bg-emerald-600 text-white shadow-xs' 
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {isSelected ? 'Viewing' : 'View Details'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: SHARE SURPLUS ENERGY                                               */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl border border-amber-300">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Share Your Solar Surplus</h3>
                  <p className="text-sm font-medium text-slate-600">Configure P2P clean energy dispatch</p>
                </div>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Available Surplus</label>
                <input 
                  type="text" 
                  disabled 
                  value={`${prosumerData.availableSurplus.toFixed(1)} kWh`}
                  className="w-full bg-slate-100 border-2 border-slate-300 rounded-xl px-4 py-3 text-base font-mono font-bold text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Energy Volume to Offer (kWh)</label>
                <input 
                  type="number" 
                  step="0.5"
                  min="0.5"
                  max={prosumerData.availableSurplus}
                  value={shareAmount}
                  onChange={(e) => setShareAmount(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-base font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Unit Price (₹/kWh)</label>
                <input 
                  type="text"
                  value={sharePrice}
                  onChange={(e) => setSharePrice(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-base font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Preferred Feeder Area</label>
                <select 
                  value={preferredNode}
                  onChange={(e) => setPreferredNode(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                >
                  <option value="TX-NORTH-402">North Sector 4 Substation (TX-NORTH-402)</option>
                  <option value="TX-EAST-205">East Grid Sector (TX-EAST-205)</option>
                  <option value="TX-SOUTH-309">South Feeder 1 Hub (TX-SOUTH-309)</option>
                </select>
              </div>

              {validationStep > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between text-slate-900 font-extrabold">
                    <span>Checking Local Grid Headroom...</span>
                    {validationStep === 1 ? (
                      <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                    ) : (
                      <span className="text-emerald-700 font-black">🟢 Safe to Proceed</span>
                    )}
                  </div>
                  <div className="space-y-1.5 text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Transformer identified ({preferredNode})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Headroom verified (38% safe margin)</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={validationStep === 1}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-extrabold py-4 rounded-2xl text-base transition-all shadow-md flex items-center justify-center gap-2 border border-amber-400"
              >
                {validationStep === 1 ? (
                  <span>Verifying Grid Capacity...</span>
                ) : (
                  <span>Check Capacity & Publish Offer</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TRANSFORMER TRADE EVALUATION (CONSUMER)                            */}
      {/* ========================================================================= */}
      {showBuyModal && selectedGridOffer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl border border-slate-300">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Transformer Trade Evaluation</h3>
                  <p className="text-sm font-medium text-slate-600">Node: {selectedGridOffer.node}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBuyModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {!tradeSuccess ? (
              <div className="space-y-5">
                
                {/* Specific Outcome Status Box based on reference */}
                {selectedGridOffer.type === 'APPROVED' && (
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-2 text-sm">
                    <div className="flex items-center justify-between font-black text-emerald-950 text-base">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        RESULT: APPROVED
                      </span>
                      <span className="font-mono text-emerald-800">{selectedGridOffer.price}</span>
                    </div>
                    <p className="text-emerald-900 font-medium leading-relaxed">
                      Transformer load is <strong>{selectedGridOffer.transformerLoad}%</strong> with <strong>{selectedGridOffer.availableHeadroom}% headroom</strong>. Safe for P2P dispatch.
                    </p>
                  </div>
                )}

                {selectedGridOffer.type === 'BLOCKED_TRANSFORMER' && (
                  <div className="p-5 bg-rose-50 border-2 border-rose-400 rounded-2xl space-y-2 text-sm">
                    <div className="flex items-center justify-between font-black text-rose-950 text-base">
                      <span className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-600" />
                        RESULT: BLOCKED (OVERLOAD)
                      </span>
                    </div>
                    <p className="text-rose-900 font-medium leading-relaxed">
                      Transformer load is critical at <strong>{selectedGridOffer.transformerLoad}%</strong>. Available headroom is only <strong>{selectedGridOffer.availableHeadroom}%</strong>. Trade rejected to prevent feeder meltdown.
                    </p>
                  </div>
                )}

                {selectedGridOffer.type === 'BLOCKED_CONSUMER_LIMIT' && (
                  <div className="p-5 bg-indigo-50 border-2 border-indigo-400 rounded-2xl space-y-2 text-sm">
                    <div className="flex items-center justify-between font-black text-indigo-950 text-base">
                      <span className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-indigo-700" />
                        RESULT: EXCEEDS CONSUMER LIMIT
                      </span>
                    </div>
                    <p className="text-indigo-950 font-medium leading-relaxed">
                      Requested energy volume ({selectedGridOffer.amount} kWh) exceeds remaining consumer headroom quota limit ({consumerData.remainingLimit.toFixed(1)} kWh).
                    </p>
                  </div>
                )}

                {/* Offer Details Bar */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm space-y-2 font-sans">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">Seller Alias:</span>
                    <span className="font-mono text-slate-900 font-bold">{selectedGridOffer.sellerAlias}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">Trade Volume:</span>
                    <span className="font-mono text-slate-900 font-black text-base">{selectedGridOffer.amount} kWh</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">Substation Area:</span>
                    <span className="text-slate-900 font-bold">{selectedGridOffer.locality}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleExecuteTrade(selectedGridOffer)}
                  disabled={selectedGridOffer.type !== 'APPROVED' || validationStep === 1}
                  className={`w-full font-black py-4 rounded-2xl text-base transition-all shadow-lg flex items-center justify-center gap-2.5 ${
                    selectedGridOffer.type === 'APPROVED'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {validationStep === 1 ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Validating Grid Parameters...
                    </span>
                  ) : selectedGridOffer.type === 'APPROVED' ? (
                    <span>Execute Grid Authorized Trade</span>
                  ) : (
                    <span>Trade Blocked by Safety Policy</span>
                  )}
                </button>
              </div>
            ) : (
              /* Success Screen */
              <div className="text-center py-5 space-y-5 animate-in fade-in zoom-in duration-200">
                <div className="w-20 h-20 bg-emerald-100 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.8]" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">TRADE APPROVED & EXECUTED</h4>
                  <p className="text-base text-emerald-800 font-extrabold mt-1">
                    Smart meter transaction settled on {selectedGridOffer.node}
                  </p>
                  {tradeReceipt && (
                    <div className="mt-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-mono text-slate-600 space-y-1">
                      <div>Txn ID: <strong>{tradeReceipt.id}</strong></div>
                      <div>Settled Volume: <strong>{tradeReceipt.amount}</strong></div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowBuyModal(false);
                    setActiveTab('transactions');
                    if (tradeReceipt) {
                      setSelectedTxnForDetails(tradeReceipt);
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 rounded-2xl text-base transition-all shadow-md"
                >
                  Close & View Ledger
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: IMAGE PREVIEW (FULL RESOLUTION HIGH CLARITY)                       */}
      {/* ========================================================================= */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-slate-950/80 text-white p-2.5 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={previewImage} 
              alt="High Definition Preview" 
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="p-4 bg-slate-900 text-white text-center text-sm font-bold">
              URJAGRID • High Definition Microgrid & Hardware Architecture
            </div>
          </div>
        </div>
      )}

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-200 bg-white py-5 px-6 text-sm text-slate-600 mt-auto shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-slate-900">URJAGRID</span>
            <span>• Grid-Aware Local Microgrid Exchange</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-slate-500">
            <span>Transformer Headroom Engine Active</span>
            <span>•</span>
            <span className="font-bold text-emerald-700">IEEE 1547 Microgrid Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
