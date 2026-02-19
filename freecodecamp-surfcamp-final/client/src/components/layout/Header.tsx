"use client";
import type { LinkProps, LogoProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { StrapiImage } from "../StrapiImage";

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
    cta: LinkProps;
  };
}

const WaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn__icon-svg">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn__icon-svg">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

function getStickyTriggerY(): number {
  const section = document.querySelector<HTMLElement>(
    "#experience, section.info--orange, section.info--turquoise, .info"
  );
  if (section) {
    return section.getBoundingClientRect().top + window.scrollY - 80;
  }
  const hero = document.querySelector<HTMLElement>(".hero");
  if (hero) {
    return hero.offsetHeight - 80;
  }
  return 300;
}

export function Header({ data }: HeaderProps) {
  const pathname = usePathname();
  const headerLight = pathname === "/experience";
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollHandlerRef = useRef<(() => void) | null>(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    setIsSticky(false);

    if (scrollHandlerRef.current) {
      window.removeEventListener("scroll", scrollHandlerRef.current);
      scrollHandlerRef.current = null;
    }

    const timer = setTimeout(() => {
      const triggerY = getStickyTriggerY();

      const handleScroll = () => {
        setIsSticky(window.scrollY >= triggerY);
      };

      scrollHandlerRef.current = handleScroll;
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 300);

    return () => {
      clearTimeout(timer);
      if (scrollHandlerRef.current) {
        window.removeEventListener("scroll", scrollHandlerRef.current);
        scrollHandlerRef.current = null;
      }
    };
  }, [pathname]);

  if (!data) return null;

  const { logo, navigation, cta } = data;
  const logoFilter = headerLight ? "white" : "black";

  return (
    <header
      className={[
        "header",
        headerLight ? "header--light" : "",
        isSticky ? "header--sticky" : "",
        menuOpen ? "header--menu-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href="/" onClick={() => setMenuOpen(false)}>
        <StrapiImage
          src={logo.image.url}
          alt={logo.image.alternativeText || "No alternative text provided"}
          className={`header__logo header__logo--${logoFilter}`}
          width={120}
          height={120}
        />
      </Link>

      {/* Desktop nav */}
      <ul className="header__nav">
        {navigation.map((item) => (
          <li key={item.id}>
            <Link href={item.href} target={item.isExternal ? "_blank" : "_self"}>
              <h5>{item.text}</h5>
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop CTA */}
      {cta ? (
        <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"} className="header__cta">
          <button className="btn btn--iconic btn--black btn--small">
            <span className="btn__icon-circle btn__icon-circle--left" aria-hidden="true">
              <WaveIcon />
            </span>
            <span className="btn__label">{cta.text}</span>
            <span className="btn__icon-circle btn__icon-circle--right" aria-hidden="true">
              <ChevronIcon />
            </span>
          </button>
        </Link>
      ) : null}

      {/* Hamburger button */}
      <button
        className={`header__hamburger ${menuOpen ? "header__hamburger--open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu overlay */}
      <div className={`header__mobile-menu ${menuOpen ? "header__mobile-menu--open" : ""}`}>
        <ul className="header__mobile-nav">
          {navigation.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                target={item.isExternal ? "_blank" : "_self"}
                onClick={() => setMenuOpen(false)}
              >
                <h3>{item.text}</h3>
              </Link>
            </li>
          ))}
        </ul>
        {cta && (
          <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"} onClick={() => setMenuOpen(false)}>
            <button className="btn btn--iconic btn--medium btn--black">
              <span className="btn__icon-circle btn__icon-circle--left" aria-hidden="true">
                <WaveIcon />
              </span>
              <span className="btn__label">{cta.text}</span>
              <span className="btn__icon-circle btn__icon-circle--right" aria-hidden="true">
                <ChevronIcon />
              </span>
            </button>
          </Link>
        )}
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className="header__backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  );
}