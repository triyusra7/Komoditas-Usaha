"use client";

import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade"
  | "scale-up"
  | "scale-down";

type AnimateInProps = {
  children: ReactNode;
  /** Animation style. Defaults to "fade-up". */
  variant?: AnimationVariant;
  /** Delay in ms before animation starts after entering viewport. */
  delay?: number;
  /** Duration of the animation in ms. Defaults to 600. */
  duration?: number;
  /** IntersectionObserver threshold (0-1). Defaults to 0.15. */
  threshold?: number;
  /** If true, animate every time element enters viewport. Defaults to false (once). */
  repeat?: boolean;
  /** HTML tag. Defaults to "div". */
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  style?: CSSProperties;
};

const VARIANT_STYLES: Record<
  AnimationVariant,
  { from: CSSProperties; to: CSSProperties }
> = {
  "fade-up": {
    from: { opacity: 0, transform: "translateY(32px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-down": {
    from: { opacity: 0, transform: "translateY(-32px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-left": {
    from: { opacity: 0, transform: "translateX(-32px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  "fade-right": {
    from: { opacity: 0, transform: "translateX(32px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "scale-up": {
    from: { opacity: 0, transform: "scale(0.92)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
  "scale-down": {
    from: { opacity: 0, transform: "scale(1.08)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
};

/**
 * Lightweight scroll-triggered animation wrapper.
 * Uses IntersectionObserver — no external deps, respects prefers-reduced-motion.
 */
export function AnimateIn({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.15,
  repeat = false,
  as: Tag = "div",
  className,
  style,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!repeat) observer.unobserve(el);
        } else if (repeat) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, repeat]);

  const variantConfig = VARIANT_STYLES[variant];

  const animStyle: CSSProperties = {
    ...variantConfig.from,
    ...(isVisible ? variantConfig.to : {}),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: "opacity, transform",
    ...style,
  };

  // @ts-expect-error — Tag is a dynamic element name, ref type is safe
  return <Tag ref={ref} className={cn(className)} style={animStyle}>{children}</Tag>;
}

type StaggerChildrenProps = {
  children: ReactNode;
  /** Stagger delay increment in ms for each child. Defaults to 100. */
  staggerDelay?: number;
  /** Base animation variant for children. */
  variant?: AnimationVariant;
  /** Duration of each child animation. */
  duration?: number;
  /** IntersectionObserver threshold. */
  threshold?: number;
  className?: string;
};

/**
 * Wraps children and staggers their appearance with incremental delays.
 * Each direct child gets wrapped in an AnimateIn.
 */
export function StaggerChildren({
  children,
  staggerDelay = 100,
  variant = "fade-up",
  duration = 600,
  threshold = 0.15,
  className,
}: StaggerChildrenProps) {
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className={className}>
      {childArray.map((child, i) => (
        <AnimateIn
          key={i}
          variant={variant}
          delay={i * staggerDelay}
          duration={duration}
          threshold={threshold}
        >
          {child}
        </AnimateIn>
      ))}
    </div>
  );
}
