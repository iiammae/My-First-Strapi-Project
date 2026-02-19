"use client";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { StrapiImage } from "../StrapiImage";
import { ParagraphWithImageProps } from "@/types";

export function ParagraphWithImage({
  content,
  image,
  reversed,
  imageLandscape,
}: Readonly<ParagraphWithImageProps>) {
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
      { threshold: 0.2 }
    );

    if (textRef.current) observer.observe(textRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`article-text-image ${reversed ? "article-text-image--reversed" : ""} ${imageLandscape ? "" : "article-text-image--portrait"}`}
    >
      <div
        ref={textRef}
        className={`article-text-image__text-wrapper slide-from-${reversed ? "right" : "left"}`}
      >
        <ReactMarkdown className="copy article-text-image__text article-paragraph">
          {content}
        </ReactMarkdown>
      </div>
      <div
        ref={imageRef}
        className={`article-text-image__container slide-from-${reversed ? "left" : "right"}`}
      >
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          width={1920}
          height={1080}
          className="article-text-image__image"
        />
      </div>
    </div>
  );
}