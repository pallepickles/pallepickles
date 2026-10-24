"use client";

import { useEffect, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, MapPin, X } from "lucide-react";
import { getProduct } from "@/data/products";
import { getCourierQuote, getCourierServiceName, getTerritoryName } from "@/data/courierRates";
import { useCart } from "@/context/CartContext";
import type { WeightGrams } from "@/types/pickle";

const formatPrice = (value: number) => new Intl.NumberFormat("en-IN").format(value);
const formatWeight = (weight: WeightGrams) => weight === 1000 ? "1 kg" : `${weight} g`;

export function CheckoutModal({ open, onClose, onBack }: { open: boolean; onClose: () => void; onBack: () => void }) {
  const { items, customer, subtotal, updateCustomer } = useCart();
  const isIndia = customer.country.trim().toLowerCase() === "india";
  const pickleWeightGrams = items.reduce((total, item) => total + item.weight * item.quantity, 0);
  const courierQuote = isIndia
    ? getCourierQuote(customer.courierService, customer.courierTerritory, pickleWeightGrams)
    : null;

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose, open]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) return;
    const orderLines = items.map((item, index) => {
      const product = getProduct(item.productId);
      if (!product) return "";
      const lineTotal = product.prices[item.weight] * item.quantity;
      return `${index + 1}. ${product.name} (${formatWeight(item.weight)}) x ${item.quantity} - ₹${formatPrice(lineTotal)}`;
    }).filter(Boolean).join("\n");

    const address = `${customer.street}, ${customer.city}, ${customer.state}, ${customer.country} - ${customer.postalCode}`;
    const courier = isIndia
      ? customer.courierService && customer.courierTerritory
        ? `${getCourierServiceName(customer.courierService)} · ${getTerritoryName(customer.courierTerritory)} · ${courierQuote?.amount == null ? "charge to be confirmed for packed weight" : `₹${formatPrice(courierQuote.amount)} (${courierQuote.band})`}`
        : "DTDC service and destination territory to be selected"
      : "International shipping charge to be confirmed";
    const estimatedBeforePacking = courierQuote?.amount === null || !courierQuote
      ? "To be confirmed after packing and courier quote"
      : `₹${formatPrice(subtotal + courierQuote.amount)}`;
    const message = [
      "*NEW ORDER - PALLE PICKLES* 🌾",
      "*Powered by SS Entreprises*",
      "",
      "👤 *Customer Details:*",
      `• *Name:* ${customer.name}`,
      `• *Phone:* ${customer.phone}`,
      "",
      "📍 *Delivery Address (Worldwide):*",
      address,
      "",
      "📦 *Order Details:*",
      orderLines,
      "",
      `💰 *Pickle Subtotal:* ₹${formatPrice(subtotal)}`,
      `🚚 *Courier:* ${courier}`,
      "📦 *Packing Charge:* To be confirmed",
      `💰 *Estimated Total Before Packing:* ${estimatedBeforePacking}`,
      "",
      `📝 *Note:* ${customer.instructions.trim() || "None"}`,
      "",
      "Please confirm my order and share payment details. Thank you!",
      "I will pay and send you a screenshot once you tell me the packing and courier charges.",
    ].join("\n");

    // Save the latest form state before leaving. The cart and customer fields stay
    // in localStorage if the customer comes back from WhatsApp without ordering.
    window.localStorage.setItem("palle-pickles-store-v1", JSON.stringify({ items, customer }));
    window.location.assign(`https://wa.me/919642875111?text=${encodeURIComponent(message)}`);
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="checkout-side"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to basket</button><div className="checkout-side__content"><span className="checkout-mark"><MapPin size={20} /></span><span className="drawer-kicker">JUST ONE MORE THING</span><h2>Where should<br />we send the flavour?</h2><p>Tell us where you are and we&rsquo;ll help your favourite pickles find their way home.</p></div><div className="checkout-side__bottom"><span>WORLDWIDE SHIPPING</span><span>Small-batch · Packed fresh</span></div></div>
        <div className="checkout-form-wrap">
          <div className="checkout-form-header"><div><span className="drawer-kicker">DELIVERY DETAILS</span><h2 id="checkout-title">Let&rsquo;s get it to you</h2></div><button className="icon-button" onClick={onClose} aria-label="Close delivery form"><X size={20} /></button></div>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field form-field--wide"><span>Full name <i>*</i></span><input autoComplete="name" required value={customer.name} onChange={(e) => updateCustomer("name", e.target.value)} placeholder="The name on your doorstep" /></label>
              <label className="form-field form-field--wide"><span>Phone / WhatsApp number <i>*</i></span><input autoComplete="tel" type="tel" required value={customer.phone} onChange={(e) => updateCustomer("phone", e.target.value)} placeholder="Include country code, if outside India" /></label>
              <label className="form-field form-field--wide"><span>Street address / door no. <i>*</i></span><input autoComplete="street-address" required value={customer.street} onChange={(e) => updateCustomer("street", e.target.value)} placeholder="House, street, apartment" /></label>
              <label className="form-field"><span>City / town <i>*</i></span><input autoComplete="address-level2" required value={customer.city} onChange={(e) => updateCustomer("city", e.target.value)} placeholder="City" /></label>
              <label className="form-field"><span>State / province <i>*</i></span><input autoComplete="address-level1" required value={customer.state} onChange={(e) => updateCustomer("state", e.target.value)} placeholder="State" /></label>
              <label className="form-field"><span>Country <i>*</i></span><input autoComplete="country-name" required value={customer.country} onChange={(e) => updateCustomer("country", e.target.value)} placeholder="Country" /></label>
              <label className="form-field"><span>Pincode / ZIP <i>*</i></span><input autoComplete="postal-code" required value={customer.postalCode} onChange={(e) => updateCustomer("postalCode", e.target.value)} placeholder="Postal code" /></label>
              <label className="form-field form-field--wide"><span>Special instructions <small>OPTIONAL</small></span><textarea rows={2} value={customer.instructions} onChange={(e) => updateCustomer("instructions", e.target.value)} placeholder="Anything we should know?" /></label>
            </div>
            {isIndia ? (
              <section className="courier-panel" aria-labelledby="courier-title">
                <div className="courier-panel__heading"><strong id="courier-title">Choose your DTDC courier rate</strong><span>India delivery</span></div>
                <div className="courier-fields">
                  <label className="form-field"><span>Destination territory <i>*</i></span><select required value={customer.courierTerritory} onChange={(e) => {
                    const territory = e.target.value;
                    updateCustomer("courierTerritory", territory);
                    if (territory === "metro" && customer.courierService === "normal") updateCustomer("courierService", "premium");
                  }}>
                    <option value="">Choose territory</option>
                    <option value="within-ts">Within Telangana (TS)</option>
                    <option value="other-state">Other State</option>
                    <option value="metro">Metro Cities (Chennai, Mumbai, Delhi, Ahmedabad, Kolkata)</option>
                  </select></label>
                  <label className="form-field"><span>Courier service <i>*</i></span><select required value={customer.courierService} onChange={(e) => updateCustomer("courierService", e.target.value)}>
                    <option value="">Choose service</option>
                    <option value="premium">DTDC Pro Premium</option>
                    {customer.courierTerritory !== "metro" && <option value="normal">DTDC Normal</option>}
                  </select></label>
                </div>
                <div className="courier-estimate" aria-live="polite">
                  <span>{pickleWeightGrams.toLocaleString("en-IN")} g pickle weight · {courierQuote?.band ?? "Select territory and service"}</span>
                  <strong>{courierQuote?.amount === null ? "Quote after packing" : courierQuote ? `₹${formatPrice(courierQuote.amount)}` : "—"}</strong>
                </div>
                <p className="courier-disclaimer">{courierQuote?.detail ? `${courierQuote.detail}. ` : ""}Rates use pickle weight before packing; final billable weight may change after packing. Normal rates above 1 kg apply the listed above-1-kg amount per additional started kg. Packing charge is confirmed separately.</p>
              </section>
            ) : (
              <div className="courier-panel courier-panel--international"><strong>International delivery</strong><span>Courier and packing charges will be confirmed on WhatsApp.</span></div>
            )}
            <div className="checkout-summary"><span>Pickle subtotal · {items.reduce((sum, item) => sum + item.quantity, 0)} jars</span><strong>₹{formatPrice(subtotal)}</strong></div>
            <div className="checkout-cost-lines"><div><span>Courier</span><strong>{courierQuote?.amount === null ? "Quote after packing" : courierQuote ? `₹${formatPrice(courierQuote.amount)}` : isIndia ? "Choose rate" : "To be confirmed"}</strong></div><div><span>Packing</span><strong>To be confirmed</strong></div><div className="checkout-cost-lines__total"><span>Estimated total before packing</span><strong>{courierQuote?.amount === null || !courierQuote ? "To be confirmed" : `₹${formatPrice(subtotal + courierQuote.amount)}`}</strong></div></div>
            <button className="button button--primary checkout-submit" type="submit">Place order on WhatsApp <ArrowUpRight size={17} /></button>
            <p className="form-footnote">We&rsquo;ll open WhatsApp with your order details ready to send.</p>
          </form>
        </div>
      </section>
    </div>
  );
}
