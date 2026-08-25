# Online Food Website — HungryMan

A fully interactive single-page web application for **HungryMan**, a wood-fired pizza brand with two kitchens (Nabinagar, Niribili and Savar). Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS 4**.

---

## Overview

HungryMan is a front-end showcase for a food delivery / dine-in restaurant. Everything runs client-side from a local data file (`src/data.ts`) — there is no backend. The app simulates the full ordering flow: browse the menu, filter and search, choose sizes and notes, build a cart, and check out with a generated order ID.

---

## Features

### Ordering flow
- **Menu catalog** — 21 dishes across 7 categories (pizza, burgers, pasta, starters, drinks, desserts).
- **Category filters** — quick-tab filtering (All / Pizza / Burgers / Pasta / Starters / Drinks / Desserts).
- **Live search** — filters by dish name or description as you type.
- **Dish modal** — pick a **size** (where relevant), enter a **kitchen note**, and choose **quantity** before adding to cart.
- **Cart drawer** — slide-out panel with line items, quantity controls, and subtotal.
- **Checkout** — choose **Dine-in / Collect**, then fill in name, phone, kitchen, date, time, and special requests.
- **Order confirmation** — generates an order ID like `HM-1234` and shows a success dialog.

### Reservation flow
- **Reserve a table** — pick guests (1–8), kitchen branch, date, time slot, and optional notes.
- **Validation** — name and a valid 10+ digit phone number required; dates cannot be in the past.
- **Confirmation screen** — summary of the request once submitted.

### Home / marketing pages
- **Home** — hero section, kitchen story, "featured / popular" menu, guest reviews with star ratings, and locations CTA.
- **About (Our Kitchen)** — brand story and philosophy cards.
- **Locations** — branch cards with hours, phone, and ordering CTAs, plus weekly hours grid.
- **Footer** — visit, kitchen, and contact links with `tel:`, `mailto:`, Facebook and Instagram.

### UX / polish
- Fully responsive (mobile nav drawer, hamburger toggle).
- Sticky header with scroll-aware background (`scrolled` state).
- Toast notifications on add-to-cart.
- Fixed cart/open-modal toasts; body scroll is locked when a modal is open.
- Skip-to-content link and ARIA labels for accessibility.
- Currency formatted as Bangladeshi Taka (`৳`) via `toLocaleString("en-BD")`.

---

## Project Structure

```
Online Food website/
├── index.html              # Entry HTML, fonts, meta tags
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite + React + Tailwind plugin config
├── public/
│   └── images/             # Static images (e.g. hero-pizza.jpg)
└── src/
    ├── main.tsx            # ReactDOM bootstrap (StrictMode, #root)
    ├── App.tsx             # Root component — all pages & state
    ├── data.ts             # Types, menu, locations, reviews, contact info
    ├── index.css           # Tailwind entry + custom design tokens/utilities
    └── utils/
        └── cn.ts           # clsx + tailwind-merge helper
```

---

## Tech Stack

| Layer      | Tool                               |
|------------|------------------------------------|
| UI         | React 19                           |
| Language   | TypeScript 5.9                     |
| Build      | Vite 7                            |
| Styling    | Tailwind CSS 4 (`@tailwindcss/vite`)|
| Bundling   | `vite-plugin-singlefile` (single-file output) |
| Utilities  | `clsx`, `tailwind-merge`           |

---

## Getting Started

### Prerequisites
- Node.js (npm) installed locally.

### Install
```bash
npm install
```

### Run the dev server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview the production build
```bash
npm run preview
```

---

## Author

**Saif Al Saad**
BSc in *Software Engineering*
Major in *Software Quality Assurance & Testing*
*Daffodil Internatiol University*