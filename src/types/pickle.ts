export type ProductCategory = "Veg" | "Non-Veg";
export type WeightGrams = 250 | 500 | 1000;
export type CourierTerritory = "ts" | "ap" | "other-states";

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
  desiredDeliveryDate: string;
  instructions: string;
  courierTerritory: CourierTerritory | "";
}
