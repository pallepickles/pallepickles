"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "@/data/products";
import type { CartItem, CustomerDetails, WeightGrams } from "@/types/pickle";

const STORAGE_KEY = "palle-pickles-store-v1";

const emptyCustomer: CustomerDetails = {
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  instructions: "",
  courierService: "",
  courierTerritory: "",
};

interface PersistedState {
  items: CartItem[];
  customer: CustomerDetails;
}

interface CartContextValue {
  items: CartItem[];
  customer: CustomerDetails;
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (productId: string, weight: WeightGrams) => void;
  incrementItem: (productId: string, weight: WeightGrams) => void;
  decrementItem: (productId: string, weight: WeightGrams) => void;
  removeItem: (productId: string, weight: WeightGrams) => void;
  updateCustomer: (field: keyof CustomerDetails, value: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<PersistedState>;
          if (Array.isArray(parsed.items)) setItems(parsed.items);
          if (parsed.customer && typeof parsed.customer === "object") {
            setCustomer({ ...emptyCustomer, ...parsed.customer });
          }
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = { items, customer };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [customer, hydrated, items]);

  const addItem = useCallback((productId: string, weight: WeightGrams) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId && item.weight === weight);
      if (existing) {
        return current.map((item) =>
          item.productId === productId && item.weight === weight
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { productId, weight, quantity: 1 }];
    });
  }, []);

  const changeQuantity = useCallback((productId: string, weight: WeightGrams, amount: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId && item.weight === weight
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((productId: string, weight: WeightGrams) => {
    setItems((current) => current.filter((item) => !(item.productId === productId && item.weight === weight)));
  }, []);

  const updateCustomer = useCallback((field: keyof CustomerDetails, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => {
      const product = getProduct(item.productId);
      return total + (product?.prices[item.weight] ?? 0) * item.quantity;
    }, 0);

    return {
      items,
      customer,
      itemCount,
      subtotal,
      hydrated,
      addItem,
      incrementItem: (productId, weight) => changeQuantity(productId, weight, 1),
      decrementItem: (productId, weight) => changeQuantity(productId, weight, -1),
      removeItem,
      updateCustomer,
    };
  }, [addItem, changeQuantity, customer, hydrated, items, removeItem, updateCustomer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
