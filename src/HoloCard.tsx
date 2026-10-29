import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { formatPrice, type MenuItem } from "./data";
import { cn } from "./utils/cn";

export interface HoloCardProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  ariaLabel?: string;
}

export function HoloCard({ children, className, style, onClick, ariaLabel }: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Clamp coordinates within [0, 1]
    const clampedX = Math.max(0, Math.min(1, x));
    const clampedY = Math.max(0, Math.min(1, y));

    // Smooth rotational tilt in 3D (-8.5deg to +8.5deg for silky, cushioned responsiveness)
    const rotateX = ((clampedY - 0.5) * -15).toFixed(2);
    const rotateY = ((clampedX - 0.5) * 15).toFixed(2);

    // Dynamic light coordinates in percentages
    const px = (clampedX * 100).toFixed(1);
    const py = (clampedY * 100).toFixed(1);

    // Holographic rainbow foil offset
    const foilX = (clampedX * 120 - 10).toFixed(1);
    const foilY = (clampedY * 120 - 10).toFixed(1);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.setProperty("--holo-rx", `${rotateX}deg`);
      cardRef.current.style.setProperty("--holo-ry", `${rotateY}deg`);
      cardRef.current.style.setProperty("--holo-x", `${px}%`);
      cardRef.current.style.setProperty("--holo-y", `${py}%`);
      cardRef.current.style.setProperty("--holo-foil-x", `${foilX}%`);
      cardRef.current.style.setProperty("--holo-foil-y", `${foilY}%`);
      cardRef.current.style.setProperty("--holo-opacity", "1");
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsInteracting(true);
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--holo-opacity", "1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsInteracting(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!cardRef.current) return;
    // Luxurious smooth spring return to neutral resting state
    cardRef.current.style.setProperty("--holo-rx", "0deg");
    cardRef.current.style.setProperty("--holo-ry", "0deg");
    cardRef.current.style.setProperty("--holo-x", "50%");
    cardRef.current.style.setProperty("--holo-y", "50%");
    cardRef.current.style.setProperty("--holo-foil-x", "50%");
    cardRef.current.style.setProperty("--holo-foil-y", "50%");
    cardRef.current.style.setProperty("--holo-opacity", "0");
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsInteracting(false);
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--holo-rx", "0deg");
    cardRef.current.style.setProperty("--holo-ry", "0deg");
    cardRef.current.style.setProperty("--holo-x", "50%");
    cardRef.current.style.setProperty("--holo-y", "50%");
    cardRef.current.style.setProperty("--holo-foil-x", "50%");
    cardRef.current.style.setProperty("--holo-foil-y", "50%");
    cardRef.current.style.setProperty("--holo-opacity", "0");
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn("holo-card-wrapper group", className)}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className={cn("holo-card", isInteracting && "is-interacting")}>
        <button
          onClick={onClick}
          className="w-full bg-transparent p-0 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-ink)] rounded-[inherit]"
          aria-label={ariaLabel}
        >
          {/* Card Perimeter Holographic Glow */}
          <div className="holo-border-glow" aria-hidden="true" />

          {children}
        </button>
      </div>
    </div>
  );
}

export interface HoloMenuCardProps {
  item: MenuItem;
  onOpen: (item: MenuItem) => void;
  variant?: "featured" | "menu";
  className?: string;
  style?: CSSProperties;
}

export function HoloMenuCard({
  item,
  onOpen,
  variant = "menu",
  className,
  style,
}: HoloMenuCardProps) {
  const isFeatured = variant === "featured";

  return (
    <HoloCard
      onClick={() => onOpen(item)}
      ariaLabel={`${item.name}, ${formatPrice(item.price)}`}
      className={className}
      style={style}
    >
      {/* Visual Image Container with Holographic Overlays */}
      <div className="relative overflow-hidden bg-[var(--color-ink-raised)]">
        <img
          src={item.image}
          alt={item.name}
          className={cn(
            "w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]",
            isFeatured ? "aspect-[4/5]" : "aspect-[5/4]"
          )}
          loading="lazy"
        />

        {/* Holographic Prismatic Rainbow Foil */}
        <div className="holo-foil" aria-hidden="true" />

        {/* Holographic Specular Glare */}
        <div className="holo-glare" aria-hidden="true" />

        {/* Holographic Micro-Sparkles Texture */}
        <div className="holo-sparkles" aria-hidden="true" />

        {/* Badge with 3D Depth */}
        {isFeatured && item.badge && (
          <span className="holo-badge absolute left-3 top-3 bg-[var(--color-gold)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)] shadow-md transition-transform duration-500 group-hover:scale-105">
            {item.badge}
          </span>
        )}
      </div>

      {/* Item Details with 3D Parallax */}
      <div className="holo-content p-4 pt-4 md:p-5">
        {isFeatured ? (
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-2xl leading-tight text-[var(--color-cream)] transition-colors duration-300 group-hover:text-[var(--color-gold-bright)]">
                {item.name}
              </h3>
              <span className="shrink-0 text-sm font-medium text-[var(--color-gold)]">
                {formatPrice(item.price)}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--color-stone)]">
              {item.description}
            </p>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-1.5">
                {item.vegetarian && (
                  <span className="rounded-full border border-[var(--color-line)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--color-gold)]">
                    Veg
                  </span>
                )}
                {item.spicy && (
                  <span className="rounded-full border border-[var(--color-line)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--color-gold)]">
                    Spicy
                  </span>
                )}
                {item.popular && (
                  <span className="rounded-full border border-[var(--color-line)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--color-gold)]">
                    Popular
                  </span>
                )}
              </div>
              <h2 className="mt-2 font-display text-[26px] leading-tight text-[var(--color-cream)] transition-colors duration-300 group-hover:text-[var(--color-gold-bright)]">
                {item.name}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--color-stone)]">
                {item.description}
              </p>
            </div>
            <span className="shrink-0 pt-7 text-sm font-medium text-[var(--color-gold)]">
              {formatPrice(item.price)}
            </span>
          </div>
        )}
      </div>
    </HoloCard>
  );
}
