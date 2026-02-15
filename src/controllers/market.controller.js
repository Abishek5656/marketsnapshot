import {
  getMarketSnapshotService,
  getSingleMarketSnapshotService,
} from "../services/market.service.js";

export const getMarketSnapshot = async (req, res) => {
  const { ticker, symbols } = req.query;

  try {
    if (ticker) {
      // Handle single ticker request with reasoning
      const data = await getSingleMarketSnapshotService(ticker);
      return res.json(data);
    }

    // Fallback/Legacy: Handle multiple symbols list (returns raw array)
    let querySymbols;
    if (Array.isArray(symbols)) {
      querySymbols = symbols;
    } else if (typeof symbols === "string") {
      querySymbols = symbols.split(",").map((s) => s.trim());
    } else {
      querySymbols = ["AAPL", "MSFT", "GOOGL"];
    }

    const data = await getMarketSnapshotService(querySymbols);
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch data", error: err.message });
  }
};
