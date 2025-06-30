import React from "react";

export function MarketTicker() {
  return (
    <iframe
      className="w-full h-[75px] border-0"
      name="crbz_scag_frame"
      src="https://akm-img-a-in.tosshub.com/aajtak/resource/market-widgets/prod/bse-nse-ticker-v2.html?v=4.0"
    ></iframe>
  );
}
