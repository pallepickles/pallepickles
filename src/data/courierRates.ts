import type { CourierTerritory } from "@/types/pickle";

export interface CourierQuote {
  amount: number;
  band: string;
}

interface RateBand {
  maxWeightGrams: number;
  amount: number;
  label: string;
}

const rateBands: Record<CourierTerritory, RateBand[]> = {
  ts: [
    { maxWeightGrams: 5000, amount: 50, label: "flat rate up to 5 kg" },
    { maxWeightGrams: 10000, amount: 40, label: "flat rate above 5 kg up to 10 kg" },
  ],
  ap: [
    { maxWeightGrams: 5000, amount: 80, label: "flat rate up to 5 kg" },
    { maxWeightGrams: 10000, amount: 60, label: "flat rate above 5 kg up to 10 kg" },
  ],
  "other-states": [
    { maxWeightGrams: 10000, amount: 120, label: "flat rate up to 10 kg" },
  ],
};

const territoryNames: Record<CourierTerritory, string> = {
  ts: "Telangana (TS)",
  ap: "AP",
  "other-states": "Other states in India",
};

export function getTerritoryName(territory: CourierTerritory | "") {
  return territory ? territoryNames[territory] : "";
}

/** Returns the flat DTDC slab for the parcel's pickle weight before packaging. */
export function getCourierQuote(
  territory: CourierTerritory | "",
  weightGrams: number,
): CourierQuote | null {
  if (!territory || weightGrams <= 0) return null;
  const band = rateBands[territory].find(({ maxWeightGrams }) => weightGrams <= maxWeightGrams);
  return band ? { amount: band.amount, band: band.label } : null;
}
