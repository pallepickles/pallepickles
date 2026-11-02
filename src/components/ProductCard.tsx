"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { PickleArt } from "@/components/PickleArt";
import { useCart } from "@/context/CartContext";
import { getComboProducts } from "@/data/products";
import type { Product, WeightGrams } from "@/types/pickle";

const formatPrice = (value: number) => new Intl.NumberFormat("en-IN").format(value);
const formatWeight = (weight: WeightGrams) => weight >= 1000 ? `${weight / 1000} kg` : `${weight} g`;

export function ProductCard({ product, onAdded }: { product: Product; onAdded: (name: string) => void }) {
  const [weight, setWeight] = useState<WeightGrams>(product.weights[0] ?? 500);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const price = product.prices[weight] ?? 0;
  const variantLabel = product.variantLabels?.[weight] ?? formatWeight(weight);
  const comboItems = getComboProducts(product).map((item) => ({
    id: item.id,
    label: item.imageLabel.toUpperCase(),
    accent: item.accent,
    softAccent: item.softAccent,
  }));

  const handleAdd = () => {
    addItem(product.id, weight);
    onAdded(`${product.name} added to your basket`);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <article className={`product-card${product.category === "Combo" ? " product-card--combo" : ""}`}>
      <div className="product-visual">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <PickleArt label={product.imageLabel.toUpperCase()} accent={product.accent} softAccent={product.softAccent} variant={product.id} comboItems={comboItems} />
        <span className={`category-tag${product.category === "Non-Veg" ? " category-tag--nonveg" : product.category === "Combo" ? " category-tag--combo" : ""}`}><i />{product.category}</span>
      </div>
      <div className="product-content">
        <div className="product-heading"><h3>{product.name}{product.localName && <small lang="te">{product.localName}</small>}</h3><span className="product-price">₹{formatPrice(price)}</span></div>
        <p className="product-description">{product.description}</p>
        <p className="product-ingredients">{product.ingredients}</p>
        <div className="product-card__bottom">
          {product.weights.length > 1 ? <div className="weight-options" role="group" aria-label={`Choose pack size for ${product.name}`}>
            {product.weights.map((size) => <button key={size} className={weight === size ? "weight-option is-selected" : "weight-option"} onClick={() => setWeight(size)} aria-pressed={weight === size}>{product.variantLabels?.[size] ?? formatWeight(size)}</button>)}
          </div> : <span className="variant-fixed">{variantLabel}</span>}
          <button className={`add-button${added ? " add-button--added" : ""}`} onClick={handleAdd} aria-label={`Add ${product.name}, ${variantLabel}, to basket`}>
            {added ? <Check size={17} /> : <Plus size={17} />}<span>{added ? "Added" : "Add"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
