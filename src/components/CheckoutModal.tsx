"use client";

import { useEffect, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, MapPin, MessageCircle, X } from "lucide-react";
import { getProduct } from "@/data/products";
import { getCourierQuote, getTerritoryName } from "@/data/courierRates";
import { useCart } from "@/context/CartContext";
import type { WeightGrams } from "@/types/pickle";

const PALLE_PICKLES_WHATSAPP = "919642875111";
const DTDC_WHATSAPP = "919949525111";
const formatPrice = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
const formatWeight = (weight: WeightGrams) => weight >= 1000 ? `${weight / 1000} kg` : `${weight} g`;
const formatRequestedDate = (value: string) => {
  if (!value) return "Not selected";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

export function CheckoutModal({ open, onClose, onBack }: { open: boolean; onClose: () => void; onBack: () => void }) {
  const { items, customer, subtotal, updateCustomer } = useCart();
  const isIndia = customer.country.trim().toLowerCase() === "india";
  const pickleWeightGrams = items.reduce((total, item) => total + item.weight * item.quantity, 0);
  const pickleWeightKg = pickleWeightGrams / 1000;
  const courierQuote = isIndia ? getCourierQuote(customer.courierTerritory, pickleWeightGrams) : null;
  const domesticGrandTotal = courierQuote ? subtotal + courierQuote.amount : null;
  const missingCourierQuoteLabel = pickleWeightGrams > 10000
    ? "DTDC quote required above 10 kg"
    : "Select delivery area";
  const dtdcDestination = [customer.city, customer.state, customer.country].filter(Boolean).join(", ");
  const dtdcMessage = [
    "Hello DTDC, please share the international courier and delivery charge for this parcel.",
    `Destination: ${dtdcDestination}${customer.postalCode ? ` - ${customer.postalCode}` : ""}`,
    `Parcel pickle weight before packing: ${pickleWeightKg.toLocaleString("en-IN", { maximumFractionDigits: 2 })} kg`,
    "Packaging charge from Palle Pickles: FREE.",
    "Please let me know the international courier charge.",
  ].join("\n");
  const canContactDtdc = Boolean(customer.city.trim() && customer.state.trim() && customer.country.trim());
  const dtdcWhatsAppUrl = `https://wa.me/${DTDC_WHATSAPP}?text=${encodeURIComponent(dtdcMessage)}`;

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
      const unitPrice = product.prices[item.weight] ?? 0;
      const lineTotal = unitPrice * item.quantity;
      const variantLabel = product.variantLabels?.[item.weight] ?? formatWeight(item.weight);
      const productName = product.localName ? `${product.name} (${product.localName})` : product.name;
      return `${index + 1}. ${productName} (${variantLabel}) × ${item.quantity} @ ₹${formatPrice(unitPrice)} each = ₹${formatPrice(lineTotal)}`;
    }).filter(Boolean).join("\n");

    const address = `${customer.street}, ${customer.city}, ${customer.state}, ${customer.country} - ${customer.postalCode}`;
    const deliveryArea = isIndia ? getTerritoryName(customer.courierTerritory) : dtdcDestination;
    const dateLine = `${formatRequestedDate(customer.desiredDeliveryDate)} (requested date only; DTDC delivery schedules and rules apply, so it is not guaranteed)`;
    const courierLine = isIndia
      ? courierQuote
        ? `₹${formatPrice(courierQuote.amount)} (${getTerritoryName(customer.courierTerritory)} · ${courierQuote.band})`
        : missingCourierQuoteLabel
      : "International charge pending DTDC quote";
    const grandTotalLine = isIndia
      ? domesticGrandTotal == null
        ? missingCourierQuoteLabel
        : `₹${formatPrice(domesticGrandTotal)}`
      : `₹${formatPrice(subtotal)} + international courier charge (pending DTDC quote)`;

    const message = [
      "*NEW ORDER - PALLE PICKLES* 🌾",
      "*Powered by SS Entreprises*",
      "",
      "👤 *Customer Details:*",
      `• *Name:* ${customer.name}`,
      `• *Phone:* ${customer.phone}`,
      "",
      "📍 *Delivery Destination:*",
      address,
      `• *Delivery area:* ${deliveryArea}`,
      "",
      `🗓 *Desired delivery date:* ${dateLine}`,
      "",
      "📦 *Order Details:*",
      orderLines,
      "",
      `• *Items subtotal:* ₹${formatPrice(subtotal)}`,
      `• *DTDC delivery charge:* ${courierLine}`,
      "• *Packaging charge:* FREE",
      `💰 *Grand total:* ${grandTotalLine}`,
      "",
      `📝 *Special instructions:* ${customer.instructions.trim() || "None"}`,
      "",
      "Please confirm my order and share UPI ID or QR Code or GPay, Phonepe Number for payment. Thank you!",
      "I will pay and send you a screenshot.",
    ].join("\n");

    // Keep the basket and customer details available if the customer returns from WhatsApp.
    window.localStorage.setItem("palle-pickles-store-v1", JSON.stringify({ items, customer }));
    window.location.assign(`https://wa.me/${PALLE_PICKLES_WHATSAPP}?text=${encodeURIComponent(message)}`);
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="checkout-side">
          <button className="back-link" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to basket</button>
          <div className="checkout-side__content"><span className="checkout-mark"><MapPin size={20} /></span><span className="drawer-kicker">JUST ONE MORE THING</span><h2>Where should<br />we send the flavour?</h2><p>Tell us where you are and we&rsquo;ll help your favourite pickles find their way home.</p></div>
          <div className="checkout-side__bottom"><span>WORLDWIDE SHIPPING</span><span>Small-batch · Packed fresh</span></div>
        </div>
        <div className="checkout-form-wrap">
          <div className="checkout-form-header"><div><span className="drawer-kicker">DELIVERY DETAILS</span><h2 id="checkout-title">Let&rsquo;s get it to you</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close delivery form"><X size={20} /></button></div>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field form-field--wide"><span>Full name <i>*</i></span><input autoComplete="name" required value={customer.name} onChange={(e) => updateCustomer("name", e.target.value)} placeholder="The name on your doorstep" /></label>
              <label className="form-field form-field--wide"><span>Phone / WhatsApp number <i>*</i></span><input autoComplete="tel" type="tel" required value={customer.phone} onChange={(e) => updateCustomer("phone", e.target.value)} placeholder="Include country code, if outside India" /></label>
              <label className="form-field form-field--wide"><span>Street address / door no. <i>*</i></span><input autoComplete="street-address" required value={customer.street} onChange={(e) => updateCustomer("street", e.target.value)} placeholder="House, street, apartment" /></label>
              <label className="form-field"><span>City / town <i>*</i></span><input autoComplete="address-level2" required value={customer.city} onChange={(e) => updateCustomer("city", e.target.value)} placeholder="City" /></label>
              <label className="form-field"><span>State / province <i>*</i></span><input autoComplete="address-level1" required value={customer.state} onChange={(e) => updateCustomer("state", e.target.value)} placeholder="State" /></label>
              <label className="form-field"><span>Country <i>*</i></span><input autoComplete="country-name" required value={customer.country} onChange={(e) => updateCustomer("country", e.target.value)} placeholder="Country" /></label>
              <label className="form-field"><span>Pincode / ZIP <i>*</i></span><input autoComplete="postal-code" required value={customer.postalCode} onChange={(e) => updateCustomer("postalCode", e.target.value)} placeholder="Postal code" /></label>
              <label className="form-field"><span>Desired delivery date <i>*</i></span><input type="date" required value={customer.desiredDeliveryDate} onChange={(e) => updateCustomer("desiredDeliveryDate", e.target.value)} /></label>
              <p className="date-disclaimer">Your preferred date will be passed along as a request. DTDC delivery schedules and rules apply, so this date cannot be guaranteed.</p>
              <label className="form-field form-field--wide"><span>Special instructions <small>OPTIONAL</small></span><textarea rows={2} value={customer.instructions} onChange={(e) => updateCustomer("instructions", e.target.value)} placeholder="Anything we should know?" /></label>
            </div>

            {isIndia ? (
              <section className="courier-panel" aria-labelledby="courier-title">
                <div className="courier-panel__heading"><strong id="courier-title">DTDC India-wide delivery rates</strong><span>Flat slabs · packing free</span></div>
                <label className="form-field"><span>Delivery area <i>*</i></span><select required value={customer.courierTerritory} onChange={(e) => updateCustomer("courierTerritory", e.target.value)}>
                  <option value="">Choose delivery area</option>
                  <option value="ts">Telangana (TS) · ₹50 up to 5 kg, ₹40 above 5–10 kg</option>
                  <option value="ap">AP · ₹80 up to 5 kg, ₹60 above 5–10 kg</option>
                  <option value="other-states">Other states · ₹120 up to 10 kg</option>
                </select></label>
                <div className="courier-estimate" aria-live="polite">
                  <span>{pickleWeightGrams.toLocaleString("en-IN")} g pickle weight · {courierQuote?.band ?? missingCourierQuoteLabel}</span>
                  <strong>{courierQuote ? `₹${formatPrice(courierQuote.amount)}` : pickleWeightGrams > 10000 ? "Quote needed" : "—"}</strong>
                </div>
                <p className="courier-disclaimer">The flat slab applies for any weight within its limit, including 0.5 kg orders; there is no per-kg or half-kg deduction. Packaging is free. DTDC may determine a different final billable weight after packing. Parcels above 10 kg need a DTDC quote.</p>
              </section>
            ) : (
              <section className="courier-panel courier-panel--international" aria-labelledby="international-courier-title">
                <strong id="international-courier-title">DTDC international courier</strong>
                <span>International delivery charges are quoted separately by DTDC and will not be added until confirmed.</span>
                <a className="button button--outline courier-contact" href={canContactDtdc ? dtdcWhatsAppUrl : undefined} aria-disabled={!canContactDtdc} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} /> Contact DTDC on WhatsApp <ArrowUpRight size={15} />
                </a>
                {!canContactDtdc && <small className="courier-contact-hint">Enter the city, state, and country above to prepare the DTDC quote request.</small>}
              </section>
            )}

            <div className="checkout-summary"><span>Items subtotal · {items.reduce((sum, item) => sum + item.quantity, 0)} jars</span><strong>₹{formatPrice(subtotal)}</strong></div>
            <div className="checkout-cost-lines">
              <div><span>DTDC delivery</span><strong>{isIndia ? courierQuote ? `₹${formatPrice(courierQuote.amount)}` : missingCourierQuoteLabel : "International quote pending"}</strong></div>
              <div><span>Packaging</span><strong>FREE</strong></div>
              <div className="checkout-cost-lines__total"><span>Grand total</span><strong>{isIndia ? domesticGrandTotal === null ? missingCourierQuoteLabel : `₹${formatPrice(domesticGrandTotal)}` : `₹${formatPrice(subtotal)} + international courier pending`}</strong></div>
            </div>
            <button className="button button--primary checkout-submit" type="submit">Place order on WhatsApp <ArrowUpRight size={17} /></button>
            <p className="form-footnote">Palle Pickles receives your order. International courier quotes are handled separately with DTDC.</p>
          </form>
        </div>
      </section>
    </div>
  );
}
