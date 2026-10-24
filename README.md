# Palle Pickles

A responsive storefront for Palle Pickles, powered by SS Entreprises. Built with Next.js App Router, TypeScript, Tailwind CSS, and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build, run `npm run build` and then `npm start`.

## Store behavior

- Product size and price selection for 250 g, 500 g, and 1 kg packs.
- Basket quantities, basket items, and delivery details persist in browser `localStorage`.
- Checkout creates a formatted WhatsApp order for +91 9642875111. The basket and form remain saved if the customer returns without sending it.
- Sample prices and product details live in `src/data/products.ts`.
