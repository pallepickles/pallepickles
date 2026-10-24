"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Globe2, HandHeart, Leaf, ShieldCheck } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

type Filter = "All pickles" | "Veg" | "Non-Veg";

export default function HomePage() {
  const [filter, setFilter] = useState<Filter>("All pickles");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState("");
  const filteredProducts = useMemo(() => filter === "All pickles" ? products : products.filter((product) => product.category === filter), [filter]);

  const notifyAdded = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const startCheckout = () => { setCartOpen(false); setCheckoutOpen(true); };

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <main>
        <Hero />
        <section className="promise-strip" aria-label="Our promises">
          <div><span><Leaf size={17} /></span><p><strong>Real ingredients</strong><small>Nothing you don&rsquo;t need</small></p></div>
          <div><span><HandHeart size={17} /></span><p><strong>Made by hand</strong><small>Small batches, every time</small></p></div>
          <div><span><ShieldCheck size={17} /></span><p><strong>Family recipes</strong><small>Generations of flavour</small></p></div>
          <div><span><Globe2 size={17} /></span><p><strong>Sent with care</strong><small>Shipping worldwide</small></p></div>
        </section>

        <section className="catalog-section section-shell" id="pickles">
          <div className="section-intro"><div><span className="eyebrow"><span className="eyebrow-line" /> FROM OUR KITCHEN</span><h2>Meet your new<br /><em>favourite pickle.</em></h2></div><p>Each jar brings a little warmth, a little spice, and a whole lot of home to your table.</p></div>
          <div className="catalog-toolbar"><div className="catalog-count"><span>{String(filteredProducts.length).padStart(2, "0")}</span> jars made with love</div><div className="filter-tabs" role="group" aria-label="Filter by pickle type">
            {(["All pickles", "Veg", "Non-Veg"] as const).map((option) => <button key={option} className={filter === option ? "filter-tab is-active" : "filter-tab"} onClick={() => setFilter(option)} aria-pressed={filter === option}>{option}{option === "Non-Veg" && <span className="nonveg-dot" />}</button>)}
          </div></div>
          <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdded={notifyAdded} />)}</div>
          <p className="catalog-footnote"><BadgeCheck size={15} /> All prices in INR · Freshly made in small batches</p>
        </section>

        <section className="story-section" id="about"><div className="story-art"><div className="story-art__sun" /><div className="story-seal"><span>పల్లె<br />రుచి</span><i>VILLAGE TASTE</i></div><div className="story-art__copy"><span>FROM THE HEART OF ANDHRA</span><strong>Recipes with<br />a little history.</strong></div><div className="story-leaf story-leaf--one" /><div className="story-leaf story-leaf--two" /></div>
          <div className="story-copy"><span className="eyebrow"><span className="eyebrow-line" /> A STORY IN EVERY JAR</span><h2>Some flavours<br />feel like <em>coming home.</em></h2><p>Our pickles begin in the heart of a village kitchen, where good food takes its time and every recipe has a story. We keep those traditions alive with carefully chosen ingredients and the same care we&rsquo;d give our own family.</p><p>From the first crackle of mustard seeds to the last spoonful of spice, every batch is made to bring people closer around the table.</p><a className="story-link" href="#pickles">Find your flavour <ArrowRight size={16} /></a></div>
        </section>

        <section className="closing-banner"><div className="closing-pattern" /><div className="closing-copy"><span className="eyebrow eyebrow--light">A LITTLE VILLAGE MAGIC</span><h2>Bring home the<br /><em>palle flavour.</em></h2><p>Your next favourite jar is just a click away.</p><a className="button button--light" href="#pickles">Shop all pickles <ArrowRight size={16} /></a></div><div className="closing-seal"><span>MADE WITH<br />LOVE &amp; MASALA</span><strong>పల్లె</strong></div></section>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={startCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onBack={() => { setCheckoutOpen(false); setCartOpen(true); }} />
      {toast && <div className="toast-message" role="status"><span><Leaf size={16} /></span>{toast}</div>}
    </>
  );
}
