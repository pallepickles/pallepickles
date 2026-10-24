"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { PickleArt } from "@/components/PickleArt";
import { useCart } from "@/context/CartContext";
import type { Product, WeightGrams } from "@/types/pickle";

const weights: WeightGrams[] = [250, 500, 1000];
const formatPrice = (value: number) => new Intl.NumberFormat("en-IN").format(value);

export function ProductCard({ product, onAdded }: { product: Product; onAdded: (name: string) => void }) {
  const [weight, setWeight] = useState<WeightGrams>(250);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product.id, weight);
    onAdded(`${product.name} added to your basket`);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <article className="product-card">
      <div className="product-visual">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <PickleArt label={product.imageLabel.toUpperCase()} accent={product.accent} softAccent={product.softAccent} />
        <span className={`category-tag${product.category === "Non-Veg" ? " category-tag--nonveg" : ""}`}><i />{product.category}</span>
      </div>
      <div className="product-content">
        <div className="product-heading"><h3>{product.name}</h3><span className="product-price">₹{formatPrice(product.prices[weight])}</span></div>
        <p className="product-description">{product.description}</p>
        <p className="product-ingredients">{product.ingredients}</p>
        <div className="product-card__bottom">
          <div className="weight-options" role="group" aria-label={`Choose pack size for ${product.name}`}>
            {weights.map((size) => <button key={size} className={weight === size ? "weight-option is-selected" : "weight-option"} onClick={() => setWeight(size)} aria-pressed={weight === size}>{size === 1000 ? "1 kg" : `${size} g`}</button>)}
          </div>
          <button className={`add-button${added ? " add-button--added" : ""}`} onClick={handleAdd} aria-label={`Add ${product.name}, ${weight} grams, to basket`}>
            {added ? <Check size={17} /> : <Plus size={17} />}<span>{added ? "Added" : "Add"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
