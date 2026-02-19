"use client";
import { useState, useEffect } from "react";
import type { LinkProps, LogoProps } from "@/types";
import Link from "next/link";
import { StrapiImage } from "../StrapiImage";

interface FooterProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
    policies: LinkProps[];
    copy: string;
  };
}

export function Footer({ data }: FooterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!data) return null;

  const { logo, navigation, policies, copy } = data;

  return (
    <>
      <footer className="footer">
        <nav className="footer__nav">
          {logo?.image?.url && (
            <StrapiImage
              src={logo.image.url}
              alt={logo.image.alternativeText || "No alternative text"}
              width={100}
              height={100}
              className="footer__logo--white"
            />
          )}
          <ul className="footer__links">
            {navigation?.map((item) => (
              <li key={item.id}>
                <Link href={item.href} target={item.isExternal ? "_blank" : "_self"}>
                  <h5>{item.text}</h5>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer__policies">
          <ul className="footer__policies-nav">
            {policies?.map((item) => (
              <li key={item.id}>
                <Link href={item.href} target={item.isExternal ? "_blank" : "_self"} className="copy">
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
          <p className="copy">
            &copy; {new Date().getFullYear()} {copy}
          </p>
        </div>
      </footer>

      {mounted && (
        <button
          className={`scroll-to-top ${isVisible ? "scroll-to-top--visible" : ""}`}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        />
      )}
    </>
  );
}