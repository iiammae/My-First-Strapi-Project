"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionProps, ImageProps } from "@/types";

export function HeroSection({
  theme,
  heading,
  cta,
  image,
  logo,
  author,
  publishedAt,
  darken = false,
}: Readonly<HeroSectionProps>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollBlur, setScrollBlur] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Convert image to array format (handles both single and multiple images)
  const images: ImageProps[] = Array.isArray(image) ? image : [image];
  const hasMultipleImages = images.length > 1;

  // DEBUG: Log to see what we received
  console.log("🖼️ Hero Section Images:", {
    rawImage: image,
    isArray: Array.isArray(image),
    imagesArray: images,
    count: images.length,
    hasMultiple: hasMultipleImages
  });

  // Image carousel effect - rotate every 5 seconds
  useEffect(() => {
    if (!hasMultipleImages) return; // Don't rotate if only one image

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length, hasMultipleImages]);

  // Blur on scroll effect - only when leaving hero section
  // Also handle logo fade and bounce animation
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 700; // Hero section height (70rem = ~700px) - UPDATED
      const scrollPosition = window.scrollY;
      
      // Bounce indicator - stops at same time as fade/blur (70% through hero)
      const bounceStopPoint = heroHeight * 0.7; // Stop at 70% = ~490px
      
      if (scrollPosition < bounceStopPoint) {
        setHasScrolled(false); // Keep bouncing while in hero
      } else {
        setHasScrolled(true); // Stop bounce when leaving hero (same as fade)
      }
      
      // Logo fade - only start fading when leaving hero section
      const logoFadeStart = heroHeight * 0.7; // Start fading at 70% through hero
      const logoFadeRange = 300;
      
      if (scrollPosition < logoFadeStart) {
        // Still in hero - full opacity
        setLogoOpacity(1);
      } else {
        // Leaving hero - start fading
        const distancePastStart = scrollPosition - logoFadeStart;
        const opacity = Math.max(1 - (distancePastStart / logoFadeRange), 0);
        setLogoOpacity(opacity);
      }
      
      // Image blur - only start blurring after scrolling past 70% of hero section
      const blurStartPoint = heroHeight * 0.7; // Start blur at 70% down hero
      const blurRange = 300; // Blur over 300px distance
      
      if (scrollPosition < blurStartPoint) {
        // Still in hero section - no blur
        setScrollBlur(0);
      } else {
        // Past hero section - start blurring
        const distancePastStart = scrollPosition - blurStartPoint;
        const blurAmount = Math.min(distancePastStart / blurRange, 1) * 10; // Max 10px blur
        setScrollBlur(blurAmount);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero">
      {/* Background Images with Carousel */}
      <div className="hero__background">
        {images.map((img, index) => (
          <div
            key={img.id || index}
            className={`hero__background-image ${
              index === currentImageIndex ? "hero__background-image--active" : ""
            }`}
            style={{
              filter: `blur(${scrollBlur}px)`,
              transform: `scale(${1 + scrollBlur * 0.01})`, // Slight zoom as it blurs
            }}
          >
            <StrapiImage
              src={img.url}
              alt={img.alternativeText || "Hero background"}
              width={1920}
              height={1080}
              priority={index === 0} // Prioritize first image
            />
          </div>
        ))}
        {darken && <div className="hero__background__overlay"></div>}
      </div>

      {/* Content */}
      <div className={`hero__headline hero__headline--${theme}`}>
        <h1>{heading}</h1>
        {author && <p className="hero__author">{author}</p>}
        {publishedAt && <p className="hero__published-at">{publishedAt}</p>}
      </div>

      {/* CTA Button */}
      {cta && (
        <div className="hero__cta">
          <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
            <button className={`btn btn--medium btn--${theme}`}>
              {cta.text}
            </button>
          </Link>
        </div>
      )}

      {/* Carousel Indicators (dots) - only show if multiple images */}
      {hasMultipleImages && (
        <div className="hero__carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`hero__carousel-indicator ${
                index === currentImageIndex ? "hero__carousel-indicator--active" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Logo with bounce animation and fade on scroll */}
      {logo && (
        <div 
          className={`hero__logo-wrapper ${!hasScrolled ? 'hero__logo-wrapper--bounce' : ''}`}
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