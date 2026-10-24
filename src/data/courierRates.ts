import type { CourierService, CourierTerritory } from "@/types/pickle";

export interface CourierQuote {
  amount: number | null;
  band: string;
  detail: string;
}

const premiumRates: Record<Exclude<CourierTerritory, "" | "metro"> | "metro", [number, number, number, number]> = {
  "within-ts": [200, 300, 400, 500],
  "other-state": [250, 350, 450, 700],
  metro: [250, 350, 570, 950],
};

const territoryNames: Record<CourierTerritory, string> = {
  "within-ts": "Within Telangana (TS)",
  "other-state": "Other State",
  metro: "Metro Cities",
};

export function getTerritoryName(territory: CourierTerritory | "") {
  return territory ? territoryNames[territory] : "";
}

export function getCourierServiceName(service: CourierService | "") {
  if (service === "premium") return "DTDC Pro Premium";
  if (service === "normal") return "DTDC Normal";
  return "";
}

/** Uses the supplied DTDC rate card. Weight is the pickle weight before packing. */
export function getCourierQuote(
  service: CourierService | "",
  territory: CourierTerritory | "",
  weightGrams: number,
): CourierQuote | null {
  if (!service || !territory) return null;

  if (service === "premium") {
    const rates = premiumRates[territory];
    if (weightGrams <= 100) return { amount: rates[0], band: "0–100 g", detail: "Rate card: 0–100 g" };
    if (weightGrams <= 500) return { amount: rates[1], band: "Up to 500 g", detail: "Rate card: 100–500 g" };
    if (weightGrams <= 1000) return { amount: rates[2], band: "Up to 1 kg", detail: "Rate card: up to 1 kg" };
    if (weightGrams <= 2000) return { amount: rates[3], band: "Up to 2 kg", detail: "Rate card: up to 2 kg" };
    return { amount: null, band: "Over 2 kg", detail: "Please confirm the Pro Premium rate for parcels over 2 kg." };
  }

  if (territory === "metro") return null;

  const withinTs = territory === "within-ts";
  const base = withinTs ? (weightGrams <= 100 ? 80 : 100) : 180;
  const firstBand = weightGrams <= 100 ? "0–100 g" : "Up to 1 kg";
  if (weightGrams <= 1000) {
    return { amount: base, band: firstBand, detail: `Rate card: ${firstBand}` };
  }

  // The rate card lists an "Above 1 kg" amount, interpreted as the charge
  // for each additional started kilogram after the first kilogram.
  const additionalKg = Math.ceil((weightGrams - 1000) / 1000);
  const additionalRate = withinTs ? 70 : 140;
  return {
    amount: base + additionalKg * additionalRate,
    band: `${(1 + additionalKg).toString()} kg parcel`,
    detail: `₹${base} up to 1 kg + ₹${additionalRate} × ${additionalKg} additional ${additionalKg === 1 ? "kg" : "kgs"}`,
  };
}
