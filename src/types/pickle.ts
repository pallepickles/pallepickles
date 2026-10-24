export type ProductCategory = "Veg" | "Non-Veg";
export type WeightGrams = 250 | 500 | 1000;
export type CourierService = "premium" | "normal";
export type CourierTerritory = "within-ts" | "other-state" | "metro";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  ingredients: string;
  imageLabel: string;
  accent: string;
  softAccent: string;
  prices: Record<WeightGrams, number>;
  badge?: string;
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
  instructions: string;
  courierService: CourierService | "";
  courierTerritory: CourierTerritory | "";
}
