import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  categories,
  EMAIL,
  FACEBOOK,
  formatPrice,
  hours,
  INSTAGRAM,
  locations,
  menu,
  PHONE,
  PHONE_DISPLAY,
  reviews,
  timeSlots,
  type Category,
  type LocationBranch,
  type MenuItem,
} from "./data";

type Page = "home" | "menu" | "about" | "locations" | "reserve";
type CartItem = {
  key: string;
  item: MenuItem;
  qty: number;
  size?: string;
  price: number;
  note?: string;
};

const HERO = "/images/hero-pizza.jpg";
const INTERIOR =
  "https://images.pexels.com/photos/36353801/pexels-photo-36353801.jpeg?auto=compress&cs=tinysrgb&w=1600";
const CHEF =
  "https://images.pexels.com/photos/32293385/pexels-photo-32293385.jpeg?auto=compress&cs=tinysrgb&w=1400";
const TABLE =
  "https://images.pexels.com/photos/30420679/pexels-photo-30420679.jpeg?auto=compress&cs=tinysrgb&w=1400";
const OVEN =
  "https://images.pexels.com/photos/29226707/pexels-photo-29226707.jpeg?auto=compress&cs=tinysrgb&w=1400";

const todayISO = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
};

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [filter, setFilter] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderDone, setOrderDone] = useState<string | null>(null);
  const [reserveDone, setReserveDone] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setMobileOpen(false);
  }, [page]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const locked = cartOpen || checkoutOpen || !!activeItem || mobileOpen || !!orderDone;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, checkoutOpen, activeItem, mobileOpen, orderDone]);

  const go = (next: Page) => setPage(next);

  const cartCount = cart.reduce((n, c) => n + c.qty, 0);
  const cartTotal = cart.reduce((n, c) => n + c.price * c.qty, 0);

  const addToCart = (item: MenuItem, qty: number, size?: string, note?: string) => {
    const price = size ? item.sizes?.find((s) => s.label === size)?.price ?? item.price : item.price;
    const key = `${item.id}-${size ?? "std"}-${note ?? ""}`;
    setCart((prev) => {
      const found = prev.find((p) => p.key === key);
      if (found) {
        return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { key, item, qty, size, price, note }];
    });
    setToast(`${item.name} added to your order`);
  };

  const updateQty = (key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((p) => p.key !== key) : prev.map((p) => (p.key === key ? { ...p, qty } : p)),
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-cream)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-[var(--color-gold)] focus:px-4 focus:py-2 focus:text-[var(--color-ink)]"
      >
        Skip to content
      </a>

      <Header
        page={page}
        go={go}
        scrolled={scrolled}
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main id="main">
        {page === "home" && <Home go={go} onOpenItem={setActiveItem} />}
        {page === "menu" && (
          <MenuPage
            filter={filter}
            setFilter={setFilter}
            query={query}
            setQuery={setQuery}
            onOpenItem={setActiveItem}
          />
        )}
        {page === "about" && <AboutPage go={go} />}
        {page === "locations" && <LocationsPage go={go} />}
        {page === "reserve" && (
          <ReservePage
            done={reserveDone}
            onDone={() => {
              setReserveDone(true);
              setToast("Table request received. We will confirm by phone.");
            }}
            onReset={() => setReserveDone(false)}
          />
        )}
      </main>

      <Footer go={go} />

      {activeItem && (
        <ItemModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onAdd={(qty, size, note) => {
            addToCart(activeItem, qty, size, note);
            setActiveItem(null);
            setCartOpen(true);
          }}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          total={cartTotal}
          onClose={() => setCartOpen(false)}
          onQty={updateQty}
          onCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
          onBrowse={() => {
            setCartOpen(false);
            go("menu");
          }}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          total={cartTotal}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={(id) => {
            setCheckoutOpen(false);
            setCart([]);
            setOrderDone(id);
          }}
        />
      )}

      {orderDone && (
        <OrderSuccess
          id={orderDone}
          onClose={() => setOrderDone(null)}
          onMenu={() => {
            setOrderDone(null);
            go("menu");
          }}
        />
      )}

      {toast && (
        <div
          role="status"
          className="toast fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-ink-raised)] px-5 py-3 text-sm text-[var(--color-cream)] shadow-[var(--shadow-soft)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function Header({
  page,
  go,
  scrolled,
  cartCount,
  onCart,
  mobileOpen,
  setMobileOpen,
}: {
  page: Page;
  go: (p: Page) => void;
  scrolled: boolean;
  cartCount: number;
  onCart: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const links: { id: Page; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "menu", label: "Menu" },
    { id: "about", label: "Our Kitchen" },
    { id: "locations", label: "Locations" },
    { id: "reserve", label: "Reserve" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-[var(--color-line)] bg-[rgba(14,12,10,0.92)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[78px] max-w-[1280px] items-center justify-between px-5 md:px-8">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-3 bg-transparent p-0 text-left"
          aria-label="HungryMan home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold)] font-display text-lg text-[var(--color-gold)]">
            H
          </span>
          <span>
            <span className="block font-display text-[28px] leading-none tracking-[0.18em]">HungryMan</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold)]">
              Eats
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`bg-transparent p-0 text-[13px] uppercase tracking-[0.18em] transition-colors ${
                page === l.id ? "text-[var(--color-gold)]" : "text-[var(--color-cream-muted)] hover:text-[var(--color-cream)]"
              }`}
              aria-current={page === l.id ? "page" : undefined}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost hidden md:inline-flex" onClick={() => go("menu")}>
            Order now
          </button>
          <button
            onClick={onCart}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-transparent text-[var(--color-cream)]"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-gold)] px-1 text-[11px] font-semibold text-[var(--color-ink)]">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-transparent lg:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className={`h-px w-5 bg-[var(--color-cream)] transition ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-[var(--color-cream)] transition ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`h-px w-5 bg-[var(--color-cream)] transition ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--color-line)] bg-[var(--color-ink)] px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="bg-transparent p-0 text-left font-display text-3xl text-[var(--color-cream)]"
              >
                {l.label}
              </button>
            ))}
            <a href={`tel:${PHONE}`} className="pt-2 text-sm text-[var(--color-gold)]">
              Call {PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Home({
  go,
  onOpenItem,
}: {
  go: (p: Page) => void;
  onOpenItem: (item: MenuItem) => void;
}) {
  const featured = menu.filter((m) => m.popular);

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden">
        <img src={HERO} alt="Wood-fired pizza at HungryMan" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[rgba(14,12,10,0.55)] to-[rgba(14,12,10,0.35)]" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-24">
          <p className="eyebrow fade-up">Nabinagar · Savar · Est. kitchen</p>
          <h1 className="mt-5 max-w-4xl font-display text-[56px] leading-[0.92] tracking-tight md:text-[92px]">
            Taste the difference.
            <span className="block italic text-[var(--color-gold)]">Feel the love.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] text-[var(--color-cream-muted)]">
            Town’s #1 pizza brand. Dough fermented overnight, fire that does the talking, and a dining room built for long tables.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="btn btn-primary" onClick={() => go("menu")}>
              Order ahead
            </button>
            <button className="btn btn-ghost" onClick={() => go("reserve")}>
              Reserve a table
            </button>
          </div>
          <div className="mt-12 flex flex-wrap gap-8 border-t border-[var(--color-line)] pt-6 text-sm text-[var(--color-cream-muted)]">
            <Stat k="4.6" v="Guest rating" />
            <Stat k="540+" v="Verified notes" />
            <Stat k="2" v="Kitchens" />
            <Stat k="11–11:30" v="Open daily" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
        <div>
          <p className="eyebrow">The kitchen</p>
          <h2 className="mt-4 font-display text-5xl leading-none md:text-6xl">Fire, flour, and a little patience.</h2>
          <div className="gold-rule mt-6" />
          <p className="mt-6 max-w-lg text-[17px] text-[var(--color-cream-muted)]">
            HungryMan began as a single oven in Niribili. We still stretch every pie by hand, ferment the dough overnight, and finish it in a fire hot enough to blister the rim in ninety seconds.
          </p>
          <p className="mt-4 max-w-lg text-[17px] text-[var(--color-cream-muted)]">
            Burgers are smashed on a cast-iron plancha. Pasta is finished in the pan. Nothing is rushed that should not be.
          </p>
          <button className="btn btn-ghost mt-8" onClick={() => go("about")}>
            Read our story
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={CHEF} alt="Chef stretching dough" className="h-[420px] w-full object-cover" />
          <img src={OVEN} alt="Pizza entering the oven" className="mt-10 h-[420px] w-full object-cover" />
        </div>
      </section>

      <section className="border-y border-[var(--color-line)] bg-[var(--color-ink-soft)] py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">The board</p>
              <h2 className="mt-3 font-display text-5xl">What the town orders.</h2>
            </div>
            <button className="btn btn-ghost self-start" onClick={() => go("menu")}>
              Full menu
            </button>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <article key={item.id} className="menu-card group">
                <button
                  onClick={() => onOpenItem(item)}
                  className="w-full bg-transparent p-0 text-left"
                  aria-label={`${item.name}, ${formatPrice(item.price)}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    {item.badge && (
                      <span className="absolute left-3 top-3 bg-[var(--color-gold)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink)]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-2xl leading-tight">{item.name}</h3>
                      <span className="shrink-0 text-sm text-[var(--color-gold)]">{formatPrice(item.price)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--color-stone)]">{item.description}</p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Feedbacks (540+)</p>
            <h2 className="mt-3 font-display text-5xl">What our guests keep saying.</h2>
          </div>
          <div className="hidden text-right md:block">
            <p className="font-display text-6xl leading-none text-[var(--color-gold)]">4.6</p>
            <p className="text-sm text-[var(--color-stone)]">Average across both kitchens</p>
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {reviews.map((r) => (
            <blockquote key={r.name} className="border border-[var(--color-line)] bg-[var(--color-ink-soft)] p-7">
              <Stars n={r.rating} />
              <p className="mt-4 font-display text-[26px] leading-snug italic text-[var(--color-cream)]">“{r.text}”</p>
              <footer className="mt-6 text-sm text-[var(--color-stone)]">
                <span className="text-[var(--color-cream)]">{r.name}</span> · {r.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img src={INTERIOR} alt="Dining room at HungryMan" className="h-[520px] w-full object-cover md:h-[640px]" />
        <div className="absolute inset-0 bg-[rgba(14,12,10,0.55)]" />
        <div className="absolute inset-0 mx-auto flex max-w-[1280px] flex-col justify-end px-5 py-16 md:px-8">
          <p className="eyebrow">Two kitchens. One fire.</p>
          <h2 className="mt-3 max-w-2xl font-display text-5xl md:text-6xl">Find us in Niribili and Savar.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => go("locations")}>
              Locations
            </button>
            <a className="btn btn-ghost" href={`tel:${PHONE}`}>
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function MenuPage({
  filter,
  setFilter,
  query,
  setQuery,
  onOpenItem,
}: {
  filter: Category;
  setFilter: (c: Category) => void;
  query: string;
  setQuery: (q: string) => void;
  onOpenItem: (item: MenuItem) => void;
}) {
  const items = useMemo(() => {
    return menu.filter((m) => {
      const catOk = filter === "all" || m.category === filter;
      const q = query.trim().toLowerCase();
      const qOk = !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [filter, query]);

  return (
    <section className="pt-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <p className="eyebrow">The menu</p>
        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h1 className="font-display text-5xl md:text-7xl">Order for the table.</h1>
          <p className="max-w-sm text-sm text-[var(--color-stone)]">
            Dine-in or collect. Add to cart, choose a kitchen, and we will have it ready at the time you pick.
          </p>
        </div>

        <div className="sticky top-[78px] z-30 mt-10 border-y border-[var(--color-line)] bg-[rgba(14,12,10,0.94)] py-4 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar flex gap-2 overflow-x-auto" role="tablist" aria-label="Menu categories">
              {categories.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={filter === c.id}
                  onClick={() => setFilter(c.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[12px] uppercase tracking-[0.16em] ${
                    filter === c.id
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-ink)]"
                      : "border-[var(--color-line)] bg-transparent text-[var(--color-cream-muted)] hover:border-[var(--color-gold)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <label className="relative block w-full lg:w-72">
              <span className="sr-only">Search menu</span>
              <input
                className="field"
                placeholder="Search the kitchen…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
        </div>

        <p className="mt-6 text-sm text-[var(--color-gold)]">{items.length} dishes</p>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl">Nothing matches that search.</p>
            <button
              className="btn btn-ghost mt-6"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 py-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="menu-card group">
                <button
                  onClick={() => onOpenItem(item)}
                  className="w-full bg-transparent p-0 text-left"
                >
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 pt-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {item.vegetarian && <Tag>Veg</Tag>}
                        {item.spicy && <Tag>Spicy</Tag>}
                        {item.popular && <Tag>Popular</Tag>}
                      </div>
                      <h2 className="mt-2 font-display text-[28px] leading-tight">{item.name}</h2>
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--color-stone)]">{item.description}</p>
                    </div>
                    <span className="shrink-0 pt-7 text-[var(--color-gold)]">{formatPrice(item.price)}</span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AboutPage({ go }: { go: (p: Page) => void }) {
  return (
    <section className="pt-28">
      <div className="mx-auto max-w-[1100px] px-5 pb-24 md:px-8">
        <p className="eyebrow">Our kitchen</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] md:text-7xl">
          A pizza house that takes the long way.
        </h1>
        <div className="gold-rule mt-8" />
        <img src={TABLE} alt="A set table at HungryMan" className="mt-12 h-[480px] w-full object-cover" />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <p className="text-[18px] leading-8 text-[var(--color-cream-muted)]">
            HungryMan is a neighbourhood kitchen with two addresses and one standard. We opened in Nabinagar, Niribili, because we wanted a room that felt like a long dinner at a friend’s house — fire in the back, tables that stay late, pizza that does not apologise for being pizza.
          </p>
          <p className="text-[18px] leading-8 text-[var(--color-cream-muted)]">
            The Savar kitchen followed so more of the town could eat the same dough on the same night. We still mill, mix, and ferment in-house. We still smash burgers to order. We still plate dessert as if someone we like is sitting at table four.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { t: "Overnight dough", d: "A slow ferment for a lighter crumb and a deeper crust." },
            { t: "Hot fire", d: "Pies finish in under two minutes. The blister is the point." },
            { t: "Honest plates", d: "Short menu. Seasonal specials. Nothing we would not eat ourselves." },
          ].map((x) => (
            <div key={x.t} className="border border-[var(--color-line)] p-6">
              <h3 className="font-display text-3xl">{x.t}</h3>
              <p className="mt-3 text-sm text-[var(--color-stone)]">{x.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <button className="btn btn-primary" onClick={() => go("menu")}>
            See the menu
          </button>
          <button className="btn btn-ghost" onClick={() => go("reserve")}>
            Book a table
          </button>
        </div>
      </div>
    </section>
  );
}

function LocationsPage({ go }: { go: (p: Page) => void }) {
  return (
    <section className="pt-28">
      <div className="mx-auto max-w-[1280px] px-5 pb-24 md:px-8">
        <p className="eyebrow">Visit</p>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">Two kitchens. Same fire.</h1>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {locations.map((loc, i) => (
            <article key={loc.id} className="overflow-hidden border border-[var(--color-line)] bg-[var(--color-ink-soft)]">
              <img
                src={i === 0 ? INTERIOR : OVEN}
                alt={loc.name}
                className="h-64 w-full object-cover"
              />
              <div className="p-8">
                <p className="eyebrow">{loc.area}</p>
                <h2 className="mt-3 font-display text-4xl">{loc.name}</h2>
                <p className="mt-3 text-[var(--color-cream-muted)]">{loc.address}</p>
                <p className="mt-2 text-sm text-[var(--color-stone)]">{loc.mapNote}</p>
                <dl className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between gap-4 border-t border-[var(--color-line)] pt-3">
                    <dt className="text-[var(--color-stone)]">Hours</dt>
                    <dd>{loc.hours}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-[var(--color-line)] pt-3">
                    <dt className="text-[var(--color-stone)]">Phone</dt>
                    <dd>
                      <a href={`tel:${PHONE}`} className="text-[var(--color-gold)]">
                        {loc.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button className="btn btn-primary" onClick={() => go("menu")}>
                    Order from here
                  </button>
                  <button className="btn btn-ghost" onClick={() => go("reserve")}>
                    Reserve
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 grid gap-8 border border-[var(--color-line)] p-8 md:grid-cols-3">
          {hours.map((h) => (
            <div key={h.day}>
              <p className="text-sm uppercase tracking-[0.16em] text-[var(--color-stone)]">{h.day}</p>
              <p className="mt-2 font-display text-3xl">{h.time}</p>
            </div>
          ))}
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-[var(--color-stone)]">Write to us</p>
            <a href={`mailto:${EMAIL}`} className="mt-2 block font-display text-3xl text-[var(--color-gold)]">
              {EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReservePage({
  done,
  onDone,
  onReset,
}: {
  done: boolean;
  onDone: () => void;
  onReset: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    guests: "2",
    date: todayISO(),
    time: "7:00 PM",
    location: "niribili",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please add a name and phone number so we can confirm the table.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onDone();
    }, 700);
  };

  if (done) {
    return (
      <section className="mx-auto max-w-xl px-5 pb-28 pt-36 text-center">
        <p className="eyebrow">Request received</p>
        <h1 className="mt-4 font-display text-5xl">We are setting the table.</h1>
        <p className="mt-4 text-[var(--color-cream-muted)]">
          A host will call {form.phone || "you"} shortly to confirm {form.guests} guests at{" "}
          {locations.find((l) => l.id === form.location)?.name} on {form.date} at {form.time}.
        </p>
        <button className="btn btn-primary mt-8" onClick={onReset}>
          Make another request
        </button>
      </section>
    );
  }

  return (
    <section className="pt-28">
      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 pb-24 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div>
          <p className="eyebrow">Reserve</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">A table, when you want it.</h1>
          <p className="mt-5 max-w-md text-[var(--color-cream-muted)]">
            Weekends fill early. Tell us who is coming and we will hold the room. Large parties of eight or more should call the kitchen directly.
          </p>
          <form onSubmit={submit} className="mt-10 grid gap-4" noValidate>
            <Field label="Full name" value={form.name} onChange={(v) => set("name", v)} required />
            <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} required type="tel" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Guests</span>
                <select className="field" value={form.guests} onChange={(e) => set("guests", e.target.value)}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Kitchen</span>
                <select className="field" value={form.location} onChange={(e) => set("location", e.target.value)}>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Date</span>
                <input className="field" type="date" min={todayISO()} value={form.date} onChange={(e) => set("date", e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Time</span>
                <select className="field" value={form.time} onChange={(e) => set("time", e.target.value)}>
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Occasion or notes</span>
              <textarea className="field min-h-28" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </label>
            {error && (
              <p role="alert" className="text-sm text-[var(--color-danger)]">
                {error}
              </p>
            )}
            <button className="btn btn-primary justify-self-start" disabled={loading}>
              {loading ? "Sending…" : "Request table"}
            </button>
          </form>
        </div>
        <aside className="h-fit border border-[var(--color-line)] bg-[var(--color-ink-soft)] p-8">
          <p className="eyebrow">House notes</p>
          <ul className="mt-6 space-y-4 text-sm text-[var(--color-cream-muted)]">
            <li>We hold reservations for 15 minutes past the booked time.</li>
            <li>A 10% service charge applies to tables of six or more.</li>
            <li>Tell us about allergies when you book — the kitchen will adapt.</li>
            <li>For same-day large parties, call {PHONE_DISPLAY}.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

function ItemModal({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdd: (qty: number, size?: string, note?: string) => void;
}) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(item.sizes?.[0]?.label);
  const [note, setNote] = useState("");
  const price = size ? item.sizes?.find((s) => s.label === size)?.price ?? item.price : item.price;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 md:items-center md:p-6" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-title"
        className="drawer max-h-[92vh] w-full overflow-y-auto bg-[var(--color-ink)] md:max-w-[880px] md:border md:border-[var(--color-line)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2">
          <img src={item.image} alt={item.name} className="h-64 w-full object-cover md:h-full" />
          <div className="p-7 md:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{item.category}</p>
                <h2 id="item-title" className="mt-2 font-display text-4xl">
                  {item.name}
                </h2>
              </div>
              <button className="btn btn-ghost h-10 min-h-10 px-3" onClick={onClose} aria-label="Close dish">
                Close
              </button>
            </div>
            <p className="mt-4 text-[var(--color-cream-muted)]">{item.description}</p>
            <p className="mt-4 font-display text-3xl text-[var(--color-gold)]">{formatPrice(price)}</p>

            {item.sizes && (
              <fieldset className="mt-6">
                <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Size</legend>
                <div className="flex gap-2">
                  {item.sizes.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSize(s.label)}
                      className={`rounded-full border px-4 py-2 text-sm ${
                        size === s.label
                          ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-ink)]"
                          : "border-[var(--color-line)] bg-transparent"
                      }`}
                    >
                      {s.label} · {formatPrice(s.price)}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <label className="mt-6 block">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Kitchen note</span>
              <input className="field" placeholder="No onion, extra chilli, well done…" value={note} onChange={(e) => setNote(e.target.value)} />
            </label>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center border border-[var(--color-line)]">
                <button className="h-12 w-12 bg-transparent" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  −
                </button>
                <span className="w-8 text-center">{qty}</span>
                <button className="h-12 w-12 bg-transparent" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <button className="btn btn-primary flex-1" onClick={() => onAdd(qty, size, note || undefined)}>
                Add · {formatPrice(price * qty)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
  cart,
  total,
  onClose,
  onQty,
  onCheckout,
  onBrowse,
}: {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onQty: (key: string, qty: number) => void;
  onCheckout: () => void;
  onBrowse: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/60" onClick={onClose} role="presentation">
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className="drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[var(--color-line)] bg-[var(--color-ink)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
          <h2 className="font-display text-3xl">Your order</h2>
          <button className="btn btn-ghost h-10 min-h-10 px-3" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-3xl">The tray is empty.</p>
              <p className="mt-2 text-sm text-[var(--color-stone)]">Add a pie, a smash, or something for the table.</p>
              <button className="btn btn-primary mt-6" onClick={onBrowse}>
                Browse menu
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.map((c) => (
                <li key={c.key} className="flex gap-4 border-b border-[var(--color-line)] pb-5">
                  <img src={c.item.image} alt="" className="h-20 w-20 object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <p className="font-display text-xl leading-tight">{c.item.name}</p>
                      <p className="text-sm text-[var(--color-gold)]">{formatPrice(c.price * c.qty)}</p>
                    </div>
                    {c.size && <p className="text-xs text-[var(--color-stone)]">{c.size}</p>}
                    {c.note && <p className="text-xs italic text-[var(--color-stone)]">{c.note}</p>}
                    <div className="mt-3 flex items-center gap-3">
                      <button className="h-8 w-8 border border-[var(--color-line)] bg-transparent" onClick={() => onQty(c.key, c.qty - 1)} aria-label={`Remove one ${c.item.name}`}>
                        −
                      </button>
                      <span>{c.qty}</span>
                      <button className="h-8 w-8 border border-[var(--color-line)] bg-transparent" onClick={() => onQty(c.key, c.qty + 1)} aria-label={`Add one ${c.item.name}`}>
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-[var(--color-line)] p-6">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-[var(--color-stone)]">Subtotal</span>
              <span className="font-display text-2xl">{formatPrice(total)}</span>
            </div>
            <button className="btn btn-primary w-full" onClick={onCheckout}>
              Continue to details
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function CheckoutModal({
  cart,
  total,
  onClose,
  onConfirm,
}: {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "niribili" as LocationBranch["id"],
    date: todayISO(),
    time: "6:30 PM",
    service: "dine-in",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.phone.replace(/\D/g, "").length < 10) {
      setError("Add a name and a valid phone so the kitchen can reach you.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const id = `HM-${Math.floor(1000 + Math.random() * 9000)}`;
      onConfirm(id);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[75] overflow-y-auto bg-black/70 p-4 md:p-8" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="drawer mx-auto max-w-3xl border border-[var(--color-line)] bg-[var(--color-ink)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
          <div>
            <p className="eyebrow">Checkout</p>
            <h2 id="checkout-title" className="font-display text-3xl">
              How would you like to order?
            </h2>
          </div>
          <button className="btn btn-ghost h-10 min-h-10 px-3" onClick={onClose}>
            Close
          </button>
        </div>
        <form onSubmit={submit} className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {["dine-in", "collect"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("service", s)}
                  className={`rounded-md border px-4 py-4 text-sm uppercase tracking-[0.14em] ${
                    form.service === s
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-ink)]"
                      : "border-[var(--color-line)] bg-transparent"
                  }`}
                >
                  {s === "dine-in" ? "Dine-in" : "Collect"}
                </button>
              ))}
            </div>
            <Field label="Name" value={form.name} onChange={(v) => set("name", v)} required />
            <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} required type="tel" />
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Kitchen</span>
              <select className="field" value={form.location} onChange={(e) => set("location", e.target.value)}>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Date</span>
                <input className="field" type="date" min={todayISO()} value={form.date} onChange={(e) => set("date", e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Time</span>
                <select className="field" value={form.time} onChange={(e) => set("time", e.target.value)}>
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Special requests</span>
              <textarea className="field min-h-24" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Optional" />
            </label>
            {error && (
              <p role="alert" className="text-sm text-[var(--color-danger)]">
                {error}
              </p>
            )}
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Placing order…" : `Place order · ${formatPrice(total)}`}
            </button>
          </div>
          <aside className="h-fit bg-[var(--color-ink-soft)] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">Bag</p>
            <ul className="mt-4 space-y-3 text-sm">
              {cart.map((c) => (
                <li key={c.key} className="flex justify-between gap-3">
                  <span>
                    {c.qty} × {c.item.name}
                    {c.size ? ` (${c.size})` : ""}
                  </span>
                  <span className="text-[var(--color-gold)]">{formatPrice(c.price * c.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-between border-t border-[var(--color-line)] pt-4">
              <span>Total</span>
              <span className="font-display text-2xl">{formatPrice(total)}</span>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function OrderSuccess({ id, onClose, onMenu }: { id: string; onClose: () => void; onMenu: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-5">
      <div role="dialog" aria-modal="true" aria-labelledby="success-title" className="max-w-md border border-[var(--color-line)] bg-[var(--color-ink)] p-10 text-center">
        <p className="eyebrow">Confirmed</p>
        <h2 id="success-title" className="mt-3 font-display text-4xl">
          The kitchen has your ticket.
        </h2>
        <p className="mt-4 text-[var(--color-cream-muted)]">
          Order <span className="text-[var(--color-gold)]">{id}</span> is in. We’ll text when it’s on the pass.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
          <button className="btn btn-ghost" onClick={onMenu}>
            Add something else
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer({ go }: { go: (p: Page) => void }) {
  return (
    <footer className="mt-8 border-t border-[var(--color-line)]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-display text-4xl tracking-[0.18em]">HungryMan</p>
          <p className="mt-3 max-w-xs text-sm text-[var(--color-stone)]">
            Taste the difference. Feel the love. Town’s #1 pizza brand — Niribili and Savar.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Visit</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-cream-muted)]">
            {locations.map((l) => (
              <li key={l.id}>
                <button className="bg-transparent p-0 text-left hover:text-[var(--color-gold)]" onClick={() => go("locations")}>
                  {l.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Kitchen</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-cream-muted)]">
            <li>
              <button className="bg-transparent p-0 hover:text-[var(--color-gold)]" onClick={() => go("menu")}>
                Menu
              </button>
            </li>
            <li>
              <button className="bg-transparent p-0 hover:text-[var(--color-gold)]" onClick={() => go("reserve")}>
                Reservations
              </button>
            </li>
            <li>
              <button className="bg-transparent p-0 hover:text-[var(--color-gold)]" onClick={() => go("about")}>
                Our story
              </button>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:${PHONE}`} className="text-[var(--color-cream-muted)] hover:text-[var(--color-gold)]">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="text-[var(--color-cream-muted)] hover:text-[var(--color-gold)]">
                {EMAIL}
              </a>
            </li>
            <li className="flex gap-4 pt-2">
              <a href={FACEBOOK} target="_blank" rel="noreferrer" className="text-[var(--color-cream-muted)] hover:text-[var(--color-gold)]">
                Facebook
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-[var(--color-cream-muted)] hover:text-[var(--color-gold)]">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)]">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-2 px-5 py-5 text-xs text-[var(--color-stone)] md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} HungryMan. All rights reserved.</p>
          <p>Taste the difference. Feel the love.</p>
        </div>
      </div>
    </footer>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-stone)]">
        {label}
        {required ? " *" : ""}
      </span>
      <input id={id} className="field" type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-display text-3xl leading-none">{k}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em]">{v}</p>
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--color-line)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--color-gold)]">
      {children}
    </span>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <p className="text-[var(--color-gold)]" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n)}
      <span className="text-[var(--color-stone)]">{"★".repeat(5 - n)}</span>
    </p>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="18" cy="20" r="1.2" />
    </svg>
  );
}
