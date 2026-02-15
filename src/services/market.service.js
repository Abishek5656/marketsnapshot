import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();
import cache from "../cache/nodeCache.js";

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL"];
const POLLING_INTERVAL = 840000; // 14 minutes (keeps Render free tier active/warm)
const CACHE_TTL = 900; // 15 minutes (in seconds)

// Helper function to fetch and update cache
const fetchAndCache = async (symbols) => {
  try {
    const cacheKey = `market_snapshot_${symbols.sort().join("_")}`;
    const rawData = await yahooFinance.quote(symbols);

    // Ensure rawData is an array
    const dataArray = Array.isArray(rawData) ? rawData : [rawData];
    const formattedData = dataArray.map(formatStockData);

    cache.set(cacheKey, formattedData, CACHE_TTL); // Cache for 60s
    console.log(
      `Updated cache for ${symbols.join(", ")} at ${new Date().toISOString()}`,
    );
  } catch (error) {
    console.error("Error in background polling:", error);
  }
};

export const startMarketPolling = () => {
  console.log("Starting market data polling...");

  // Initial fetch
  fetchAndCache(DEFAULT_SYMBOLS);

  // Poll every 10 seconds
  setInterval(() => {
    fetchAndCache(DEFAULT_SYMBOLS);
  }, POLLING_INTERVAL);
};

export const getMarketSnapshotService = async (symbols) => {
  if (!symbols || symbols.length === 0) {
    throw new Error("No symbols provided");
  }

  const cacheKey = `market_snapshot_${symbols.sort().join("_")}`;
  const cached = cache.get(cacheKey);

  if (cached) return cached;

  try {
    const rawData = await yahooFinance.quote(symbols);

    // Ensure rawData is an array
    const dataArray = Array.isArray(rawData) ? rawData : [rawData];
    const formattedData = dataArray.map(formatStockData);

    cache.set(cacheKey, formattedData, CACHE_TTL);
    return formattedData;
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
};

export const getSingleMarketSnapshotService = async (ticker) => {
  if (!ticker) throw new Error("Ticker is required");

  const cacheKey = `market_snapshot_${ticker.toUpperCase()}`;
  const cached = cache.get(cacheKey);

  if (cached) return cached;

  try {
    const data = await yahooFinance.quote(ticker);
    const formattedData = formatStockData(data);

    cache.set(cacheKey, formattedData, CACHE_TTL);
    return formattedData;
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    throw error;
  }
};

const formatStockData = (data) => {
  return {
    meta: {
      ticker: data.symbol,
      timestamp: new Date().toISOString(),
    },
    data: {
      price: data.regularMarketPrice,
      change_percent: data.regularMarketChangePercent,
    },
    reasoning: generateReasoning(data),
  };
};

const generateReasoning = (data) => {
  const change = data.regularMarketChangePercent || 0;
  let thesis = "Neutral market movement.";
  let risk = "Medium";

  if (change > 2) {
    thesis = "Strong bullish momentum driven by positive market sentiment.";
    risk = "Low";
  } else if (change > 0.5) {
    thesis = "Mildly bullish trend, showing steady growth.";
    risk = "Low-Medium";
  } else if (change < -2) {
    thesis = "Strong bearish pressure, indicating potential sell-off.";
    risk = "High";
  } else if (change < -0.5) {
    thesis = "Mildly bearish trend, caution advised.";
    risk = "Medium-High";
  }

  return { thesis, risk };
};
