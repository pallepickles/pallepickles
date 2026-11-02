export type ProductCategory = "Veg" | "Non-Veg" | "Combo";
export type WeightGrams = 250 | 500 | 750 | 1000 | 1250;
export type CourierTerritory = "ts" | "ap" | "other-states";

export interface Product {
  id: string;
  name: string;
  localName?: string;
  category: ProductCategory;
  description: string;
  ingredients: string;
  imageLabel: string;
  accent: string;
  softAccent: string;
  weights: WeightGrams[];
  prices: Partial<Record<WeightGrams, number>>;
  variantLabels?: Partial<Record<WeightGrams, string>>;
  badge?: string;
  comboProductIds?: string[];
}

export interface CartItem {
  productId: string;
  weight: WeightGrams;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  desiredDeliveryDate: string;
  instructions: string;
  courierTerritory: CourierTerritory | "";
}
