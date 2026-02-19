"use client";
import { useEffect, useRef } from "react";
import type { SubscribeProps } from "@/types";
import { useActionState } from "react";
import { subscribeAction } from "@/data/actions";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
};

export function Subscribe({
  headline,
  content,
  placeholder,
  buttonText,
}: Readonly<SubscribeProps>) {
  const [formState, formAction] = useActionState(subscribeAction, INITIAL_STATE);
  const sectionRef = useRef<HTMLElement>(null);

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

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const zodErrors = formState?.zodErrors?.email;
  const strapiErrors = formState?.strapiErrors?.message;
  const errorMessage = strapiErrors || zodErrors || formState?.errorMessage;
  const successMessage = formState?.successMessage;

  return (
    <section ref={sectionRef} className="newsletter container slide-from-bottom">
      <div className="newsletter__info">
        <h4>{headline}</h4>
        <p className="copy">{content}</p>
      </div>
      <form className="newsletter__form" action={formAction}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={errorMessage || successMessage || placeholder}
          className={`newsletter__email ${errorMessage ? "newsletter__email--error" : ""}`}
        />
        <button
          type="submit"
          className="newsletter__subscribe btn btn--turquoise btn--medium"
        >
          {buttonText}
        </button>
      </form>
    </section>
  );
}