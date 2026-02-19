"use client";
import { useEffect, useRef } from "react";
import type { FeaturedArticleProps } from "@/types";
import Link from "next/link";
import { StrapiImage } from "@/components/StrapiImage";
import ReactMarkdown from "react-markdown";

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

export function FeaturedArticle({
  headline,
  link,
  excerpt,
  image,
}: Readonly<FeaturedArticleProps>) {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

    if (textRef.current) observer.observe(textRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <article className="featured-article container">
      <div ref={textRef} className="featured-article__info slide-from-left">
        {headline && <h3>{headline}</h3>}
        {excerpt && (
          <ReactMarkdown className="copy">{excerpt}</ReactMarkdown>
        )}
        {link?.href && (
          <Link href={link.href} target={link.isExternal ? "_blank" : "_self"}>
            <button className="btn btn--iconic btn--medium btn--turquoise">
              <span className="btn__icon-circle btn__icon-circle--left" aria-hidden="true">
                <WaveIcon />
              </span>
              <span className="btn__label">{link.text}</span>
              <span className="btn__icon-circle btn__icon-circle--right" aria-hidden="true">
                <ChevronIcon />
              </span>
            </button>
          </Link>
        )}
      </div>
      <div ref={imageRef} className="featured-article__image-wrapper slide-from-right">
        {image?.url && (
          <StrapiImage
            src={image.url}
            alt={image.alternativeText || "No alternative text provided"}
            height={200}
            width={300}
          />
        )}
      </div>
    </article>
  );
}