import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import marketRoutes from "./routes/market.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { benchmarkMiddleware } from "./middlewares/benchmark.middleware.js";

const app = express();

app.use(benchmarkMiddleware);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", marketRoutes);

app.use(errorHandler);

export default app;
