import type { CourierTerritory } from "@/types/pickle";

export interface CourierQuote {
  amount: number;
  band: string;
  detail: string;
  ratePerKg: number;
}

const ratesPerKg: Record<CourierTerritory, number> = {
  ts: 50,
  ap: 80,
  "other-states": 120,
};

const territoryNames: Record<CourierTerritory, string> = {
  ts: "Telangana (TS)",
  ap: "Andhra Pradesh (AP)",
  "other-states": "Other states in India",
};

export function getTerritoryName(territory: CourierTerritory | "") {
  return territory ? territoryNames[territory] : "";
}

/** Applies the supplied India-wide DTDC rate per kg to the pickle weight before packing. */
export function getCourierQuote(
  territory: CourierTerritory | "",
  weightGrams: number,
): CourierQuote | null {
  if (!territory) return null;
  const ratePerKg = ratesPerKg[territory];
  const weightKg = weightGrams / 1000;
  const amount = Math.round(ratePerKg * weightKg * 100) / 100;
  return {
    amount,
    band: `${weightKg.toLocaleString("en-IN", { maximumFractionDigits: 2 })} kg × ₹${ratePerKg}/kg`,
    detail: `Calculated at ₹${ratePerKg}/kg on ${weightKg.toLocaleString("en-IN", { maximumFractionDigits: 2 })} kg pickle weight before packing`,
    ratePerKg,
  };
}
