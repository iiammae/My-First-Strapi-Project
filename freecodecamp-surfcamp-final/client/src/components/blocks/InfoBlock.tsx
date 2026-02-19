"use client";
import { useEffect, useRef } from "react";
import { StrapiImage } from "../StrapiImage";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { InfoBlockProps } from "@/types";

const WaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn__icon-svg">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn__icon-svg">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.05-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z" />
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn__icon-svg">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

function isContactCta(text: string) {
  return text.toLowerCase().includes("contact");
}

export function InfoBlock({
  theme,
  reversed,
  image,
  headline,
  content,
  cta,
}: Readonly<InfoBlockProps>) {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (imageRef.current) observer.observe(imageRef.current);
    if (textRef.current) observer.observe(textRef.current);

    return () => observer.disconnect();
  }, []);

  if (!image?.url) return null;

  return (
    <section className={`info info--${theme} ${reversed && "info--reversed"}`}>
      <div
        ref={imageRef}
        className={`info__image-wrapper slide-from-${reversed ? "right" : "left"}`}
      >
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          height={500}
          width={600}
          className="info__image"
        />
      </div>
      <div
        ref={textRef}
        className={`info__text slide-from-${reversed ? "left" : "right"}`}
      >
        <h2 className={`info__headline info__headline--${theme}`}>{headline}</h2>
        <ReactMarkdown className="copy">{content}</ReactMarkdown>
        {cta && (
          <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
            <button className={`btn btn--iconic btn--medium btn--${theme}`}>
              <span className="btn__icon-circle btn__icon-circle--left" aria-hidden="true">
                {isContactCta(cta.text) ? <PhoneIcon /> : <WaveIcon />}
              </span>
              <span className="btn__label">{cta.text}</span>
              <span className="btn__icon-circle btn__icon-circle--right" aria-hidden="true"><ChevronIcon /></span>
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}