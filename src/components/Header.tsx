"use client";

import { useState } from "react";
import { Leaf, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const links = [
    ["Home", "#home"],
    ["Our pickles", "#pickles"],
    ["Our story", "#about"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="site-header">
      <div className="top-ribbon">Small-batch Andhra pickles · Made with love in India · Shipping worldwide</div>
      <div className="nav-shell">
        <a className="brand-lockup" href="#home" aria-label="Palle Pickles home">
          <span className="brand-mark"><Leaf size={21} strokeWidth={1.8} /></span>
          <span><strong>Palle Pickles</strong><small>Powered by SS Entreprises</small></span>
        </a>
        <nav className={`desktop-nav${menuOpen ? " desktop-nav--open" : ""}`} aria-label="Main navigation">
          {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <button className="cart-trigger" onClick={onCartClick} aria-label={`Open cart with ${itemCount} items`}>
            <ShoppingBag size={19} strokeWidth={1.8} /><span className="cart-trigger__label">Your basket</span>
            <span className="cart-count">{itemCount}</span>
          </button>
          <button className="mobile-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
