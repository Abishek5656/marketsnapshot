import yahooFinance from "yahoo-finance2";
import * as yfAll from "yahoo-finance2";

console.log("Default export:", yahooFinance);
console.log("Type of default export:", typeof yahooFinance);
console.log(
  "Is instance of YahooFinance?",
  yahooFinance && yahooFinance.constructor && yahooFinance.constructor.name,
);
console.log("Named exports:", Object.keys(yfAll));

try {
  const yf = new yahooFinance();
  console.log("Instantiated default:", yf);
} catch (e) {
  console.log("Cannot instantiate default:", e.message);
}
