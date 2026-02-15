export const benchmarkMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[Performance] ${req.method} ${req.originalUrl} took ${duration}ms`,
    );
  });
  next();
};
