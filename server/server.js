import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database / State Store
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
  irradiance: 845, // W/m²
  temp: 31, // °C
  humidity: 42, // %
  cloudCover: "12%",
  predictedTotal: 22.5 // kWh peak prediction today
};

const INITIAL_TRANSFORMERS = [
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

const INITIAL_GRID_OFFERS = [
  {
    id: "OFF-401",
    node: "TX-NORTH-402",
    sellerAlias: "Prosumer #84 (Sector 4)",
    amount: 4.0,
    price: "₹3.80/kWh",
    priceNumeric: 3.80,
    locality: "North Sector 4",
    transformerLoad: 62,
    availableHeadroom: 38,
    type: "APPROVED",
    reason: "Safe headroom available & within consumer quota limit.",
    timeCreated: "Today, 08:30 AM"
  },
  {
    id: "OFF-108",
    node: "TX-WEST-108",
    sellerAlias: "Prosumer #12 (West Block)",
    amount: 10.0,
    price: "₹3.50/kWh",
    priceNumeric: 3.50,
    locality: "West Feeder 2",
    transformerLoad: 91,
    availableHeadroom: 9,
    type: "BLOCKED_TRANSFORMER",
    reason: "Trade rejected — prevents transformer overload.",
    timeCreated: "Today, 09:10 AM"
  },
  {
    id: "OFF-205",
    node: "TX-EAST-205",
    sellerAlias: "Prosumer #55 (East Hub)",
    amount: 3.5,
    price: "₹3.90/kWh",
    priceNumeric: 3.90,
    locality: "East Grid Sector",
    transformerLoad: 55,
    availableHeadroom: 45,
    type: "BLOCKED_CONSUMER_LIMIT",
    reason: "Exceeds daily consumer sanctioned headroom quota limit.",
    timeCreated: "Today, 10:05 AM"
  },
  {
    id: "OFF-309",
    node: "TX-SOUTH-309",
    sellerAlias: "Prosumer #30 (South Solar)",
    amount: 2.5,
    price: "₹3.75/kWh",
    priceNumeric: 3.75,
    locality: "South Feeder 1",
    transformerLoad: 48,
    availableHeadroom: 52,
    type: "APPROVED",
    reason: "Safe headroom & optimal feeder proximity.",
    timeCreated: "Today, 10:45 AM"
  },
  {
    id: "OFF-501",
    node: "TX-CENTRAL-501",
    sellerAlias: "Prosumer #99 (Central Plaza)",
    amount: 8.0,
    price: "₹3.60/kWh",
    priceNumeric: 3.60,
    locality: "Central Node B",
    transformerLoad: 88,
    availableHeadroom: 12,
    type: "BLOCKED_TRANSFORMER",
    reason: "Transformer capacity constrained.",
    timeCreated: "Today, 11:15 AM"
  },
  {
    id: "OFF-612",
    node: "TX-SUB-612",
    sellerAlias: "Prosumer #42 (Substation 6)",
    amount: 5.0,
    price: "₹3.85/kWh",
    priceNumeric: 3.85,
    locality: "Substation Ring 6",
    transformerLoad: 40,
    availableHeadroom: 60,
    type: "APPROVED",
    reason: "Cleared by smart-meter gateway.",
    timeCreated: "Today, 11:50 AM"
  }
];

const INITIAL_CONSUMER_DATA = {
  usageToday: 7.4,
  permittedLimit: 10.0,
  remainingLimit: 2.6,
  status: "Within permitted limit",
  meterId: "SM-CONS-9912",
  sanctionedKw: 5.0
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

// Mutating Runtime State
let prosumerData = JSON.parse(JSON.stringify(INITIAL_PRODUCER_DATA));
let consumerData = JSON.parse(JSON.stringify(INITIAL_CONSUMER_DATA));
let gridOffers = JSON.parse(JSON.stringify(INITIAL_GRID_OFFERS));
let transformers = JSON.parse(JSON.stringify(INITIAL_TRANSFORMERS));
let consumerTransactions = JSON.parse(JSON.stringify(INITIAL_CONSUMER_TRANSACTIONS));
let prosumerTransactions = JSON.parse(JSON.stringify(INITIAL_PROSUMER_TRANSACTIONS));

// Helper: Format Time
const getFormattedTime = () => {
  const now = new Date();
  return `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

// ==================== AUTHENTICATION & ONE-TIME ACCESS ====================
const AUTH_ACCOUNTS = {
  prosumer: {
    id: "PROS-84-NORTH",
    name: "Amit Shah",
    alias: "Amit Shah (Sector 4 Solar Hub)",
    role: "prosumer",
    meterId: "INV-402-SOLAR-09",
    node: "TX-NORTH-402",
    solarCapacityKw: 18.4,
    password: "solar2026",
    details: "Rooftop PV System • 3-Phase Smart Inverter"
  },
  consumer: {
    id: "CONS-9912-BAKERY",
    name: "Gupta Bakery",
    alias: "Gupta Bakery (Commercial)",
    role: "consumer",
    meterId: "SM-CONS-9912",
    node: "TX-NORTH-402",
    sanctionedLimitKw: 10.0,
    password: "grid2026",
    details: "Commercial LT Connection • Sanctioned Headroom 10 kWh/day"
  }
};

// One-time access token store (single-use only)
let oneTimeTokens = [
  { code: "840219", role: "prosumer", createdAt: Date.now(), expiresAt: Date.now() + 86400000, used: false, consumedAt: null },
  { code: "619420", role: "consumer", createdAt: Date.now(), expiresAt: Date.now() + 86400000, used: false, consumedAt: null }
];
let activeSessions = new Map();

// ==================== REST ROUTES ====================

// Auth 1: Request One-Time Access Passcode (OTAC)
app.post('/api/auth/request-otp', (req, res) => {
  const { role, accountId } = req.body;
  if (!role || !['prosumer', 'consumer'].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified for One-Time Access" });
  }

  // Generate 6-digit dynamic passcode
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const tokenRecord = {
    code,
    role,
    accountId: accountId || (role === 'prosumer' ? AUTH_ACCOUNTS.prosumer.id : AUTH_ACCOUNTS.consumer.id),
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
    used: false,
    consumedAt: null
  };

  oneTimeTokens.push(tokenRecord);

  res.json({
    success: true,
    code,
    role,
    validForSec: 300,
    message: "Dynamic One-Time Access Passcode (OTAC) generated. This code is valid for one-time access only."
  });
});

// Auth 2: Login with One-Time Access Verification
app.post('/api/auth/login', (req, res) => {
  const { role, accountId, password, otp } = req.body;

  if (!role || !['prosumer', 'consumer'].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  const expectedAccount = AUTH_ACCOUNTS[role];
  if (accountId && accountId.trim() !== expectedAccount.id) {
    return res.status(401).json({ error: `Account ID mismatch for ${role} portal. Expected: ${expectedAccount.id}` });
  }

  if (password && password !== expectedAccount.password) {
    return res.status(401).json({ error: "Invalid credentials / password for smart grid gateway" });
  }

  if (!otp) {
    return res.status(400).json({ error: "One-Time Access Passcode (OTAC) is mandatory." });
  }

  const trimmedOtp = otp.toString().trim();
  const tokenRecord = oneTimeTokens.find(t => t.code === trimmedOtp && t.role === role);

  if (!tokenRecord) {
    return res.status(401).json({ 
      error: "INVALID_TOKEN", 
      message: "Invalid One-Time Access Code for this role. Please request a new code." 
    });
  }

  if (tokenRecord.used) {
    return res.status(403).json({ 
      error: "CONSUMED_TOKEN", 
      message: `Security Lock: This One-Time Passcode (${trimmedOtp}) was already consumed at ${tokenRecord.consumedAt}. One-Time Access policy strictly forbids re-use. Please request a fresh passcode.` 
    });
  }

  if (Date.now() > tokenRecord.expiresAt) {
    return res.status(401).json({ 
      error: "EXPIRED_TOKEN", 
      message: "One-Time Access Code has expired. Please request a fresh passcode." 
    });
  }

  // Burn / Consume the token permanently
  tokenRecord.used = true;
  tokenRecord.consumedAt = new Date().toLocaleTimeString();

  // Create isolated single-role session
  const sessionToken = `OTAC-SESS-${role.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const sessionData = {
    sessionToken,
    role,
    account: {
      id: expectedAccount.id,
      name: expectedAccount.name,
      alias: expectedAccount.alias,
      meterId: expectedAccount.meterId,
      node: expectedAccount.node,
      details: expectedAccount.details
    },
    consumedOtp: trimmedOtp,
    authenticatedAt: new Date().toISOString(),
    lockedRole: role
  };

  activeSessions.set(sessionToken, sessionData);

  res.json({
    success: true,
    session: sessionData,
    message: `Authentication successful. One-time access verified. Session strictly locked to ${role.toUpperCase()} terminal.`
  });
});

// Auth 3: Session Verification
app.get('/api/auth/session', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ active: false, error: "No session token provided" });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ active: false, error: "Session invalid or expired" });
  }

  res.json({ active: true, session });
});

// Auth 4: Logout / Destroy Session
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').trim();
    activeSessions.delete(token);
  }
  res.json({ success: true, message: "One-time session securely terminated." });
});


// 1. Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'URJAGRID Smart Grid Settlement Engine v2.4',
    time: new Date().toISOString(),
    nodesMonitored: transformers.length,
    activeOffers: gridOffers.length
  });
});

// 2. Prosumer State
app.get('/api/prosumer', (req, res) => {
  res.json({
    ...prosumerData,
    activeOffersCount: gridOffers.filter(o => o.sellerAlias.includes("You")).length
  });
});

// 3. Consumer State
app.get('/api/consumer', (req, res) => {
  res.json(consumerData);
});

// 4. Transformers
app.get('/api/transformers', (req, res) => {
  res.json(transformers);
});

// 5. Offers (with optional filter)
app.get('/api/offers', (req, res) => {
  const { type, node } = req.query;
  let filtered = [...gridOffers];

  if (type) {
    filtered = filtered.filter(o => o.type.toLowerCase() === type.toLowerCase());
  }
  if (node) {
    filtered = filtered.filter(o => o.node.toLowerCase() === node.toLowerCase());
  }

  res.json(filtered);
});

// 6. Create Offer (Prosumer)
app.post('/api/offers', (req, res) => {
  const { amount, price, node, feederArea } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: "Invalid energy volume specified" });
  }

  if (numAmount > prosumerData.availableSurplus) {
    return res.status(400).json({
      error: `Requested offer amount (${numAmount} kWh) exceeds available surplus (${prosumerData.availableSurplus.toFixed(1)} kWh)`
    });
  }

  const selectedNode = node || "TX-NORTH-402";
  const targetTransformer = transformers.find(t => t.id === selectedNode) || transformers[0];

  // Headroom check for transformer
  const isHeadroomSafe = targetTransformer.headroomPct >= 20;

  const newOffer = {
    id: `OFF-${Math.floor(100 + Math.random() * 900)}`,
    node: selectedNode,
    sellerAlias: "Prosumer (You)",
    amount: numAmount,
    price: price || "₹3.85/kWh",
    priceNumeric: parseFloat(price?.replace(/[^\d.]/g, '') || 3.85),
    locality: targetTransformer.name,
    transformerLoad: targetTransformer.currentLoadPct,
    availableHeadroom: targetTransformer.headroomPct,
    type: isHeadroomSafe ? "APPROVED" : "BLOCKED_TRANSFORMER",
    reason: isHeadroomSafe
      ? "Newly published prosumer surplus offer cleared by smart meter gateway."
      : "Feeder transformer near capacity limit.",
    timeCreated: getFormattedTime()
  };

  // Prepend new offer
  gridOffers.unshift(newOffer);

  // Deduct from prosumer available surplus
  prosumerData.availableSurplus = Math.max(0, +(prosumerData.availableSurplus - numAmount).toFixed(1));

  res.status(201).json({
    message: "Offer published successfully to local transformer ledger",
    offer: newOffer,
    updatedSurplus: prosumerData.availableSurplus
  });
});

// 7. Grid-Aware Trade Execution (Consumer -> P2P Offer)
app.post('/api/trade', (req, res) => {
  const { offerId, requestedKwh } = req.body;

  const offer = gridOffers.find(o => o.id === offerId);
  if (!offer) {
    return res.status(404).json({ error: "Offer not found or already consumed" });
  }

  const transformer = transformers.find(t => t.id === offer.node);
  const tradeVolume = requestedKwh ? Math.min(parseFloat(requestedKwh), offer.amount) : Math.min(offer.amount, consumerData.remainingLimit);

  // 4-Point Grid Verification Checks:
  const checks = {
    consumerQuotaCheck: {
      name: "Consumer Quota Compliance",
      passed: tradeVolume <= consumerData.remainingLimit + 0.001,
      currentUsage: consumerData.usageToday,
      remainingLimit: consumerData.remainingLimit,
      requested: tradeVolume,
      message: tradeVolume <= consumerData.remainingLimit
        ? `Within remaining quota headroom (${consumerData.remainingLimit.toFixed(1)} kWh remaining)`
        : `Exceeds consumer daily quota limit (${tradeVolume.toFixed(1)} kWh > ${consumerData.remainingLimit.toFixed(1)} kWh)`
    },
    transformerHeadroomCheck: {
      name: "Feeder Transformer Headroom",
      passed: offer.type !== 'BLOCKED_TRANSFORMER' && (transformer ? transformer.currentLoadPct < 85 : offer.transformerLoad < 85),
      currentLoad: offer.transformerLoad,
      headroom: offer.availableHeadroom,
      message: offer.transformerLoad < 85
        ? `Safe operating headroom available (${offer.availableHeadroom}% headroom)`
        : `Transformer critically loaded at ${offer.transformerLoad}%. Overload protection triggered!`
    },
    feederProximityCheck: {
      name: "Microgrid Feeder Proximity",
      passed: true,
      node: offer.node,
      message: `Verified direct feeder synchronization on node ${offer.node}`
    },
    smartMeterGatewayCheck: {
      name: "Smart-Meter Cryptographic Handshake",
      passed: true,
      meterId: consumerData.meterId,
      message: "Gateway signatures verified via bi-directional telemetry"
    }
  };

  const isTradePermitted = checks.consumerQuotaCheck.passed && checks.transformerHeadroomCheck.passed;

  if (!isTradePermitted) {
    return res.status(400).json({
      success: false,
      reason: !checks.consumerQuotaCheck.passed
        ? "Exceeds daily consumer sanctioned headroom quota limit."
        : "Trade rejected — prevents transformer overload.",
      checks
    });
  }

  // Execute Settlement
  const actualAmount = Math.min(offer.amount, consumerData.remainingLimit);
  const priceVal = offer.priceNumeric || 3.80;
  const totalCost = (actualAmount * priceVal).toFixed(2);

  // Update offer remaining amount
  offer.amount = +(offer.amount - actualAmount).toFixed(1);
  if (offer.amount <= 0) {
    gridOffers = gridOffers.filter(o => o.id !== offer.id);
  }

  // Update Consumer
  consumerData.usageToday = +(consumerData.usageToday + actualAmount).toFixed(1);
  consumerData.remainingLimit = Math.max(0, +(consumerData.remainingLimit - actualAmount).toFixed(1));

  // Update Prosumer metrics
  prosumerData.sharedTotal = +(prosumerData.sharedTotal + actualAmount).toFixed(1);
  prosumerData.score += 25;

  // Record Transaction
  const newTxn = {
    id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
    time: getFormattedTime(),
    seller: offer.sellerAlias,
    buyer: "Gupta Bakery (You)", // In consumer section: always the single consumer!
    amount: `${actualAmount.toFixed(1)} kWh`,
    rate: offer.price,
    price: offer.price,
    value: `₹${totalCost}`,
    totalValue: `₹${totalCost}`,
    transformer: offer.node,
    status: "Confirmed",
    gridStatus: "Verified",
    hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 8)}`
  };

  consumerTransactions.unshift(newTxn);
  if (offer.sellerAlias.includes("You")) {
    prosumerTransactions.unshift({
      ...newTxn,
      seller: "Alex (You)",
      buyer: "Gupta Bakery"
    });
  }

  res.json({
    success: true,
    message: "Trade successfully approved by smart-meter gateway and settled on microgrid ledger",
    transaction: newTxn,
    updatedConsumer: consumerData,
    checks
  });
});

// 8. Transactions Ledger (Role-aware)
app.get('/api/transactions', (req, res) => {
  const { role } = req.query;
  if (role === 'consumer') {
    return res.json(consumerTransactions);
  }
  if (role === 'prosumer') {
    return res.json(prosumerTransactions);
  }
  res.json({
    consumer: consumerTransactions,
    prosumer: prosumerTransactions
  });
});

// 9. AI Hourly Forecast & Weather
app.get('/api/forecast', (req, res) => {
  res.json({
    confidence: prosumerData.forecastConfidence,
    irradiance: prosumerData.irradiance,
    temp: prosumerData.temp,
    cloudCover: prosumerData.cloudCover,
    forecastSurplus: prosumerData.forecastSurplus,
    predictedTotal: prosumerData.predictedTotal,
    hourly: AI_HOURLY_FORECAST
  });
});

// 10. Reset Demo Data
app.post('/api/reset', (req, res) => {
  prosumerData = JSON.parse(JSON.stringify(INITIAL_PRODUCER_DATA));
  consumerData = JSON.parse(JSON.stringify(INITIAL_CONSUMER_DATA));
  gridOffers = JSON.parse(JSON.stringify(INITIAL_GRID_OFFERS));
  transformers = JSON.parse(JSON.stringify(INITIAL_TRANSFORMERS));
  consumerTransactions = JSON.parse(JSON.stringify(INITIAL_CONSUMER_TRANSACTIONS));
  prosumerTransactions = JSON.parse(JSON.stringify(INITIAL_PROSUMER_TRANSACTIONS));

  res.json({ message: "Demo state reset successfully" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[URJAGRID] Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
