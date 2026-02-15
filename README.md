# Market Snapshot Service

A high-performance Node.js service providing real-time(ish) market data snapshots with <200ms latency via intelligent caching and background polling.

## Features

- **Ultra Low Latency**: Achieves sub-200ms response times for default market snapshots using background polling and in-memory caching.
- **Reasoning Engine**: Automatically generates a market "thesis" and "risk level" based on real-time price movements.
- **Smart Polling**: Optimized for Free Tier hosting (e.g., Render) with a 14-minute polling interval to keep instances active.
- **Modern Stack**: Built with Express, Node.js, and ES Modules.
- **Robust Caching**: Uses `node-cache` with a TTL strategy to balance freshness and performance.

## API Endpoints

### GET /api/snapshot

Retrieves the latest market data and automated financial reasoning.

**Parameters:**

- `ticker` (optional): Fetch data for a single ticker (e.g., `NVDA`) with detailed reasoning.
- `symbols` (optional): Comma-separated list of stock symbols (e.g., `AAPL,TSLA`). Defaults to `AAPL, MSFT, GOOGL`.

**Sample Response (Single Ticker):**

```json
{
  "meta": {
    "ticker": "NVDA",
    "timestamp": "2026-02-14T12:34:56.789Z"
  },
  "data": {
    "price": 135.5,
    "change_percent": 2.45
  },
  "reasoning": {
    "thesis": "Strong bullish momentum driven by positive market sentiment.",
    "risk": "Low"
  }
}
```

**Sample Response (Multiple Symbols):**

```json
[
  {
    "meta": { "ticker": "AAPL", ... },
    "data": { "price": 150.00, ... },
    "reasoning": { ... }
  },
  ...
]
```

## Performance Architecture

To meet the strict <200ms latency requirement:

1.  **Background Polling**: A scheduler runs every 14 minutes (840,000ms) to fetch formatted data for default symbols (`AAPL`, `MSFT`, `GOOGL`) and keeps the cache warm.
2.  **Cache-First Strategy**: API requests serve pre-formatted JSON directly from memory (RAM), eliminating external API latency and data processing overhead during the request.
3.  **On-Demand Fallback**: Custom symbol requests are fetched on-demand and cached for 15 minutes.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Start the production server:
    ```bash
    npm start
    ```

## Environment Variables

- `PORT`: Server port (default: 3000)
