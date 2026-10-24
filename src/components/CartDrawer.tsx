"use client";

import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { getProduct } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { PickleArt } from "@/components/PickleArt";
import type { WeightGrams } from "@/types/pickle";

const formatPrice = (value: number) => new Intl.NumberFormat("en-IN").format(value);
const formatWeight = (weight: WeightGrams) => weight === 1000 ? "1 kg" : `${weight} g`;

export function CartDrawer({ open, onClose, onCheckout }: { open: boolean; onClose: () => void; onCheckout: () => void }) {
  const { items, itemCount, subtotal, incrementItem, decrementItem, removeItem } = useCart();

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-header"><div><span className="drawer-kicker">YOUR LITTLE STASH</span><h2 id="cart-title">Your basket <span>({itemCount})</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Close basket"><X size={20} /></button></div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-cart"><span className="empty-cart__icon"><ShoppingBag size={25} /></span><h3>Your basket is waiting</h3><p>Add a jar of something lovely to get started.</p><button className="button button--outline" onClick={onClose}>Explore the pickles</button></div>
          ) : items.map((item) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            const lineTotal = product.prices[item.weight] * item.quantity;
            return (
              <div className="cart-line" key={`${item.productId}-${item.weight}`}>
                <div className="cart-line__art"><PickleArt label={product.imageLabel.toUpperCase()} accent={product.accent} softAccent={product.softAccent} /></div>
                <div className="cart-line__main"><div className="cart-line__top"><div><h3>{product.name}</h3><span>{formatWeight(item.weight)} · {product.category}</span></div><strong>₹{formatPrice(lineTotal)}</strong></div>
                  <div className="cart-line__bottom"><div className="quantity-control"><button onClick={() => decrementItem(item.productId, item.weight)} aria-label={`Decrease ${product.name} quantity`}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => incrementItem(item.productId, item.weight)} aria-label={`Increase ${product.name} quantity`}><Plus size={13} /></button></div><button className="remove-button" onClick={() => removeItem(item.productId, item.weight)}><Trash2 size={14} /> Remove</button></div>
                </div>
              </div>
            );
          })}
        </div>
        {items.length > 0 && <div className="drawer-footer"><div className="subtotal-row"><span>Subtotal</span><strong>₹{formatPrice(subtotal)}</strong></div><p>Shipping and delivery details are confirmed on WhatsApp.</p><button className="button button--primary checkout-button" onClick={onCheckout}>Continue to delivery <ArrowRight size={17} /></button><div className="secure-note">Hand-packed with care · Worldwide delivery</div></div>}
      </aside>
    </div>
  );
}
