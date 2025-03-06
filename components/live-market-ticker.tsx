"use client";

import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_ALPACA_API_KEY!;
const API_SECRET = process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY!;
const STOCK_SYMBOLS = ["AAPL", "GOOGL", "TSLA"];

export default function LiveMarketTicker() {
  const [prices, setPrices] = useState<{ [symbol: string]: number }>({});

  useEffect(() => {
    const socket = new WebSocket("wss://stream.data.alpaca.markets/v2/iex");

    socket.onopen = () => {
      console.log("Connected to Alpaca WebSocket");

      socket.send(
        JSON.stringify({
          action: "auth",
          key: API_KEY,
          secret: API_SECRET,
        })
      );

      socket.send(
        JSON.stringify({
          action: "subscribe",
          trades: STOCK_SYMBOLS,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      data.forEach((update: any) => {
        if (update.T === "t") {
          setPrices((prev) => ({
            ...prev,
            [update.S]: update.p,
          }));
        }
      });
    };

    socket.onclose = () => console.log("Disconnected from Alpaca WebSocket");

    socket.onerror = (error) => console.error("WebSocket error:", error);

    return () => socket.close();
  }, []);

  return (
    <div className="p-4 bg-accent rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Live Market Prices</h2>
      <ul className="mt-2">
        {STOCK_SYMBOLS.map((symbol) => (
          <li key={symbol} className="flex justify-between text-sm p-2 border-b">
            <span>{symbol}</span>
            <span className="font-semibold">
              {prices[symbol] ? `${prices[symbol].toFixed(2)}` : "Loading..."}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
