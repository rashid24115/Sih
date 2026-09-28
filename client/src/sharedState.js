// Single Shared Source of Truth for URJAGRID Microgrid Trading & Settlement Engine

export const INITIAL_TRANSFORMERS = [
  {
    id: "TX-NORTH-402",
    name: "North Sector 4 Substation",
    capacityKw: 100,
    currentLoadPct: 62,
    headroomPct: 38,
    status: "NORMAL",
    connectedProsumers: 14,
    connectedConsumers: 38,
    feeder: "Feeder Loop 1"
  },
  {
    id: "TX-WEST-108",
    name: "West Feeder 2 Distribution",
    capacityKw: 80,
    currentLoadPct: 91,
    headroomPct: 9,
    status: "OVERLOAD_ALERT",
    connectedProsumers: 8,
    connectedConsumers: 52,
    feeder: "Feeder Loop 2"
  },
  {
    id: "TX-EAST-205",
    name: "East Grid Sector Transformer",
    capacityKw: 120,
    currentLoadPct: 55,
    headroomPct: 45,
    status: "NORMAL",
    connectedProsumers: 22,
    connectedConsumers: 45,
    feeder: "Feeder Loop 3"
  },
  {
    id: "TX-SOUTH-309",
    name: "South Feeder 1 Hub",
    capacityKw: 90,
    currentLoadPct: 48,
    headroomPct: 52,
    status: "NORMAL",
    connectedProsumers: 19,
    connectedConsumers: 29,
    feeder: "Feeder Loop 4"
  },
  {
    id: "TX-CENTRAL-501",
    name: "Central Commercial Node B",
    capacityKw: 150,
    currentLoadPct: 88,
    headroomPct: 12,
    status: "CONSTRAINED",
    connectedProsumers: 31,
    connectedConsumers: 85,
    feeder: "Feeder Loop 5"
  },
  {
    id: "TX-SUB-612",
    name: "Substation Ring 6",
    capacityKw: 200,
    currentLoadPct: 40,
    headroomPct: 60,
    status: "NORMAL",
    connectedProsumers: 45,
    connectedConsumers: 60,
    feeder: "Feeder Loop 6"
  }
];

export const INITIAL_PRODUCER_DATA = {
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

export const INITIAL_CONSUMER_DATA = {
  usageToday: 7.4,
  permittedLimit: 10.0,
  remainingLimit: 2.6,
  status: "Within permitted limit",
  meterId: "SM-CONS-9912",
  sanctionedKw: 5.0
};

export const INITIAL_GRID_OFFERS = [
  {
    id: "OFF-401",
    node: "TX-NORTH-402",
    sellerName: "Prosumer #84",
    sellerAlias: "Prosumer #84 (Sector 4)",
    amount: 4.0,
    price: "₹3.80/kWh",
    priceNumeric: 3.80,
    locality: "North Sector 4 Substation",
    transformerLoad: 62,
    availableHeadroom: 38,
    type: "APPROVED",
    status: "AVAILABLE",
    reason: "Safe headroom available & within consumer quota limit.",
    timeCreated: "Today, 08:30 AM"
  },
  {
    id: "OFF-108",
    node: "TX-WEST-108",
    sellerName: "Prosumer #12",
    sellerAlias: "Prosumer #12 (West Block)",
    amount: 10.0,
    price: "₹3.50/kWh",
    priceNumeric: 3.50,
    locality: "West Feeder 2 Distribution",
    transformerLoad: 91,
    availableHeadroom: 9,
    type: "BLOCKED_TRANSFORMER",
    status: "BLOCKED",
    reason: "Trade rejected — prevents transformer overload.",
    timeCreated: "Today, 09:10 AM"
  },
  {
    id: "OFF-205",
    node: "TX-EAST-205",
    sellerName: "Prosumer #55",
    sellerAlias: "Prosumer #55 (East Hub)",
    amount: 3.5,
    price: "₹3.90/kWh",
    priceNumeric: 3.90,
    locality: "East Grid Sector Transformer",
    transformerLoad: 55,
    availableHeadroom: 45,
    type: "BLOCKED_CONSUMER_LIMIT",
    status: "BLOCKED",
    reason: "Exceeds daily consumer sanctioned headroom quota limit.",
    timeCreated: "Today, 10:05 AM"
  },
  {
    id: "OFF-309",
    node: "TX-SOUTH-309",
    sellerName: "Prosumer #30",
    sellerAlias: "Prosumer #30 (South Solar)",
    amount: 2.5,
    price: "₹3.75/kWh",
    priceNumeric: 3.75,
    locality: "South Feeder 1 Hub",
    transformerLoad: 48,
    availableHeadroom: 52,
    type: "APPROVED",
    status: "AVAILABLE",
    reason: "Safe headroom & optimal feeder proximity.",
    timeCreated: "Today, 10:45 AM"
  },
  {
    id: "OFF-501",
    node: "TX-CENTRAL-501",
    sellerName: "Prosumer #99",
    sellerAlias: "Prosumer #99 (Central Plaza)",
    amount: 8.0,
    price: "₹3.60/kWh",
    priceNumeric: 3.60,
    locality: "Central Commercial Node B",
    transformerLoad: 88,
    availableHeadroom: 12,
    type: "BLOCKED_TRANSFORMER",
    status: "BLOCKED",
    reason: "Transformer capacity constrained.",
    timeCreated: "Today, 11:15 AM"
  },
  {
    id: "OFF-612",
    node: "TX-SUB-612",
    sellerName: "Prosumer #42",
    sellerAlias: "Prosumer #42 (Substation 6)",
    amount: 5.0,
    price: "₹3.85/kWh",
    priceNumeric: 3.85,
    locality: "Substation Ring 6",
    transformerLoad: 40,
    availableHeadroom: 60,
    type: "APPROVED",
    status: "AVAILABLE",
    reason: "Cleared by smart-meter gateway.",
    timeCreated: "Today, 11:50 AM"
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TX-1001",
    tradeId: "OFF-401",
    time: "Today, 09:15 AM",
    seller: "Amit Shah (Sector 4)",
    sellerName: "Amit Shah",
    buyer: "Gupta Bakery (You)",
    buyerName: "Gupta Bakery",
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
    tradeId: "OFF-402",
    time: "Today, 10:45 AM",
    seller: "Rajesh Kumar (Prosumer #31)",
    sellerName: "Rajesh Kumar",
    buyer: "Gupta Bakery (You)",
    buyerName: "Gupta Bakery",
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
    tradeId: "OFF-309",
    time: "Yesterday, 02:40 PM",
    seller: "South Solar (Prosumer #30)",
    sellerName: "South Solar",
    buyer: "Gupta Bakery (You)",
    buyerName: "Gupta Bakery",
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

const STORAGE_KEY = 'urjagrid_shared_market_state';

// Helper: Formatted time
export const getFormattedCurrentTime = () => {
  const now = new Date();
  return `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

// Broadcast channel for instantaneous cross-tab synchronization
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('urjagrid_channel');
  } catch (e) {
    console.warn('BroadcastChannel not available', e);
  }
}

export function getInitialSharedState() {
  return {
    prosumerData: JSON.parse(JSON.stringify(INITIAL_PRODUCER_DATA)),
    consumerData: JSON.parse(JSON.stringify(INITIAL_CONSUMER_DATA)),
    transformers: JSON.parse(JSON.stringify(INITIAL_TRANSFORMERS)),
    gridOffers: JSON.parse(JSON.stringify(INITIAL_GRID_OFFERS)),
    transactions: JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS))
  };
}

export function loadSharedState() {
  if (typeof window === 'undefined') return getInitialSharedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSharedState();
      saveSharedState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    // Ensure all keys exist
    return {
      prosumerData: parsed.prosumerData || INITIAL_PRODUCER_DATA,
      consumerData: parsed.consumerData || INITIAL_CONSUMER_DATA,
      transformers: parsed.transformers && parsed.transformers.length === 6 ? parsed.transformers : INITIAL_TRANSFORMERS,
      gridOffers: Array.isArray(parsed.gridOffers) ? parsed.gridOffers : INITIAL_GRID_OFFERS,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : INITIAL_TRANSACTIONS
    };
  } catch (err) {
    console.error('Error loading shared state from storage:', err);
    return getInitialSharedState();
  }
}

export function saveSharedState(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'STATE_UPDATED', state });
    }
  } catch (err) {
    console.error('Error saving shared state to storage:', err);
  }
}

export function subscribeSharedState(listener) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        listener(JSON.parse(e.newValue));
      } catch (err) {
        console.error('Error parsing storage event state:', err);
      }
    }
  };

  const handleBroadcast = (e) => {
    if (e.data && e.data.type === 'STATE_UPDATED' && e.data.state) {
      listener(e.data.state);
    }
  };

  window.addEventListener('storage', handleStorage);
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    window.removeEventListener('storage', handleStorage);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}

// Business Action: Create surplus offer
export function createTradeOfferInState({ amount, price, node, sellerName = 'Alex', sellerAlias }) {
  const currentState = loadSharedState();
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Invalid trade volume specified.');
  }

  if (numAmount > currentState.prosumerData.availableSurplus) {
    throw new Error(`Requested trade amount (${numAmount} kWh) exceeds available surplus (${currentState.prosumerData.availableSurplus.toFixed(1)} kWh)`);
  }

  const selectedNode = node || "TX-NORTH-402";
  const targetTransformer = currentState.transformers.find(t => t.id === selectedNode) || currentState.transformers[0];

  // Headroom check: Safe if headroom >= 20% and load < 85%
  const isHeadroomSafe = targetTransformer.headroomPct >= 20 && targetTransformer.currentLoadPct < 85;
  const resolvedAlias = sellerAlias || `${sellerName} (Prosumer)`;
  const tradeId = `TRD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOffer = {
    id: tradeId,
    node: selectedNode,
    sellerName: sellerName,
    sellerAlias: resolvedAlias,
    amount: numAmount,
    price: price || "₹3.85/kWh",
    priceNumeric: parseFloat(price?.replace(/[^\d.]/g, '') || 3.85),
    locality: targetTransformer.name,
    transformerLoad: targetTransformer.currentLoadPct,
    availableHeadroom: targetTransformer.headroomPct,
    type: isHeadroomSafe ? "APPROVED" : "BLOCKED_TRANSFORMER",
    status: isHeadroomSafe ? "AVAILABLE" : "BLOCKED",
    reason: isHeadroomSafe
      ? "Newly published prosumer surplus offer cleared by smart meter gateway."
      : "Feeder transformer near capacity limit.",
    timeCreated: getFormattedCurrentTime()
  };

  // Prepend to offers
  currentState.gridOffers.unshift(newOffer);

  // Deduct from prosumer surplus
  currentState.prosumerData.availableSurplus = Math.max(0, +(currentState.prosumerData.availableSurplus - numAmount).toFixed(1));

  saveSharedState(currentState);
  return { newOffer, updatedState: currentState };
}

// Business Action: Execute trade
export function executeTradeInState({ offerId, requestedKwh, buyerName = 'Gupta Bakery' }) {
  const currentState = loadSharedState();
  const offer = currentState.gridOffers.find(o => o.id === offerId);

  if (!offer) {
    throw new Error('Trade offer not found or already consumed.');
  }

  if (offer.status === 'COMPLETED' || offer.amount <= 0) {
    throw new Error('This trade offer has already been completed.');
  }

  const transformer = currentState.transformers.find(t => t.id === offer.node);
  const tradeVolume = requestedKwh ? Math.min(parseFloat(requestedKwh), offer.amount) : Math.min(offer.amount, currentState.consumerData.remainingLimit);

  // 4-Point Grid Verification Checks:
  const quotaPassed = tradeVolume <= currentState.consumerData.remainingLimit + 0.001;
  const headroomPassed = offer.type !== 'BLOCKED_TRANSFORMER' && (transformer ? transformer.currentLoadPct < 85 : offer.transformerLoad < 85);

  if (!quotaPassed || !headroomPassed) {
    throw new Error(!quotaPassed
      ? 'Exceeds daily consumer sanctioned headroom quota limit.'
      : 'Trade rejected — prevents transformer overload.'
    );
  }

  const actualAmount = Math.min(offer.amount, currentState.consumerData.remainingLimit);
  const priceVal = offer.priceNumeric || parseFloat(offer.price?.replace(/[^\d.]/g, '') || 3.80);
  const totalCost = (actualAmount * priceVal).toFixed(2);

  // Update offer remaining amount and status
  offer.amount = Math.max(0, +(offer.amount - actualAmount).toFixed(1));
  if (offer.amount <= 0) {
    offer.type = "COMPLETED";
    offer.status = "COMPLETED";
  }

  // Update Consumer data
  currentState.consumerData.usageToday = +(currentState.consumerData.usageToday + actualAmount).toFixed(1);
  currentState.consumerData.remainingLimit = Math.max(0, +(currentState.consumerData.remainingLimit - actualAmount).toFixed(1));

  // Update Prosumer data
  currentState.prosumerData.sharedTotal = +(currentState.prosumerData.sharedTotal + actualAmount).toFixed(1);
  currentState.prosumerData.score += 25;

  // Update Transformer State dynamically (load increases with dispatch)
  if (transformer) {
    const loadDelta = Math.round((actualAmount / transformer.capacityKw) * 100);
    transformer.currentLoadPct = Math.min(100, transformer.currentLoadPct + Math.max(1, loadDelta));
    transformer.headroomPct = Math.max(0, 100 - transformer.currentLoadPct);
    if (transformer.currentLoadPct > 85) transformer.status = "OVERLOAD_ALERT";
    else if (transformer.currentLoadPct > 75) transformer.status = "CONSTRAINED";
    else transformer.status = "NORMAL";

    if (transformer.id === currentState.prosumerData.transformerId) {
      currentState.prosumerData.gridLoad = transformer.currentLoadPct;
      currentState.prosumerData.gridHeadroom = transformer.headroomPct;
    }
  }

  // Create unified single transaction record with matching Trade/Txn ID
  const sharedTxnId = offer.id.startsWith('OFF-') ? offer.id.replace('OFF-', 'TX-') : offer.id;
  const txHash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 8)}`;
  const timeFormatted = getFormattedCurrentTime();

  const newTxn = {
    id: sharedTxnId,
    tradeId: offer.id,
    time: timeFormatted,
    seller: offer.sellerAlias || `${offer.sellerName || 'Alex'} (Prosumer)`,
    sellerName: offer.sellerName || 'Alex',
    buyer: `${buyerName} (You)`,
    buyerName: buyerName,
    amount: `${actualAmount.toFixed(1)} kWh`,
    rate: offer.price,
    price: offer.price,
    value: `₹${totalCost}`,
    totalValue: `₹${totalCost}`,
    transformer: offer.node,
    status: "Confirmed",
    gridStatus: "Verified",
    hash: txHash
  };

  // Prepend new transaction to shared transactions ledger
  currentState.transactions.unshift(newTxn);

  saveSharedState(currentState);
  return { newTxn, updatedState: currentState };
}

export function resetSharedState() {
  const initial = getInitialSharedState();
  saveSharedState(initial);
  return initial;
}
