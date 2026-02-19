"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import { getStrapiURL } from "@/utils/get-strapi-url";
import type { HeroSectionProps, ImageProps } from "@/types";

const WaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn__icon-svg">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn__icon-svg">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

function splitHeading(heading: string): [string, string] {
  const words = heading.trim().split(" ");
  if (words.length === 1) return [heading, ""];
  const lastWord = words[words.length - 1];
  const firstLines = words.slice(0, -1).join(" ");
  return [firstLines, lastWord];
}

export function HeroSection({
  theme,
  heading,
  cta,
  image,
  backgroundVideo,
  logo,
  author,
  publishedAt,
  darken = false,
}: Readonly<HeroSectionProps>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollBlur, setScrollBlur] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [hasScrolled, setHasScrolled] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Safe null check for images
  const images: ImageProps[] = Array.isArray(image)
    ? image.filter(Boolean)
    : image ? [image] : [];

  const hasMultipleImages = images.length > 1;
  const [firstLine, secondLine] = splitHeading(heading);

  const videoUrl = backgroundVideo?.url
    ? getStrapiURL() + backgroundVideo.url
    : null;

  useEffect(() => {
    const setHeroHeight = () => {
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const viewportHeight = window.innerHeight;
      const heroHeight = viewportHeight - headerHeight;
      if (sectionRef.current) {
        sectionRef.current.style.height = `${heroHeight}px`;
      }
    };
    setHeroHeight();
    window.addEventListener("resize", setHeroHeight);
    return () => window.removeEventListener("resize", setHeroHeight);
  }, []);

  useEffect(() => {
    if (!hasMultipleImages) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, hasMultipleImages]);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = sectionRef.current?.getBoundingClientRect().height ?? window.innerHeight;
      const scrollPosition = window.scrollY;
      const bounceStopPoint = heroHeight * 0.7;
      const logoFadeRange = 300;
      const blurRange = 300;

      setHasScrolled(scrollPosition >= bounceStopPoint);

      if (scrollPosition < bounceStopPoint) {
        setLogoOpacity(1);
        setScrollBlur(0);
      } else {
        const distancePast = scrollPosition - bounceStopPoint;
        setLogoOpacity(Math.max(1 - distancePast / logoFadeRange, 0));
        setScrollBlur(Math.min(distancePast / blurRange, 1) * 10);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__background">

        {videoUrl ? (
          <div
            className="hero__background-video"
            style={{ filter: `blur(${scrollBlur}px)`, transform: `scale(${1 + scrollBlur * 0.01})` }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="hero__background-video-element"
            >
              <source src={videoUrl} type={backgroundVideo?.mime || "video/mp4"} />
            </video>
          </div>
        ) : (
          images.map((img, index) => (
            <div
              key={img.id || index}
              className={`hero__background-image ${index === currentImageIndex ? "hero__background-image--active" : ""}`}
              style={{ filter: `blur(${scrollBlur}px)`, transform: `scale(${1 + scrollBlur * 0.01})` }}
            >
              <StrapiImage
                src={img.url}
                alt={img.alternativeText || "Hero background"}
                width={1920}
                height={1080}
                priority={index === 0}
              />
            </div>
          ))
        )}

        {darken && <div className="hero__background__overlay"></div>}
      </div>

      <div className={`hero__headline hero__headline--${theme}`}>
        <h1>
          <span className="hero__headline-line--first">{firstLine}</span>
          {secondLine && <span className="hero__headline-line--second">{secondLine}</span>}
        </h1>
        {author && <p className="hero__author">{author}</p>}
        {publishedAt && <p className="hero__published-at">{publishedAt}</p>}
      </div>

      {cta && (
        <div className="hero__cta">
          <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
            <button className={`btn btn--iconic btn--medium btn--${theme}`}>
              <span className="btn__icon-circle btn__icon-circle--left" aria-hidden="true"><WaveIcon /></span>
              <span className="btn__label">{cta.text}</span>
              <span className="btn__icon-circle btn__icon-circle--right" aria-hidden="true"><ChevronIcon /></span>
            </button>
          </Link>
        </div>
      )}

      {hasMultipleImages && !videoUrl && (
        <div className="hero__carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`hero__carousel-indicator ${index === currentImageIndex ? "hero__carousel-indicator--active" : ""}`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {logo && (
        <div
          className={`hero__logo-wrapper ${!hasScrolled ? "hero__logo-wrapper--bounce" : ""}`}
          style={{ opacity: logoOpacity }}
        >
          <StrapiImage
            src={logo.image.url}
            alt={logo.image.alternativeText || "No alternative text provided"}
            className={`hero__logo hero__logo--${theme}`}
            width={120}
            height={120}
          />
        </div>
      )}
    </section>
  );
}