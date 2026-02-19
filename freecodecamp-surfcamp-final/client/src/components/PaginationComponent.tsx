"use client";
import { FC, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
  pageCount: number;
}

interface PaginationArrowProps {
  direction: "left" | "right";
  href: string;
  isDisabled: boolean;
}

const PaginationArrow: FC<PaginationArrowProps> = ({ direction, href, isDisabled }) => {
  const router = useRouter();
  const isLeft = direction === "left";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        router.push(href, { scroll: false });
      }}
      className={`pagination-arrow ${isDisabled ? "disabled" : ""}`}
      aria-disabled={isDisabled}
      disabled={isDisabled}
    >
      {isLeft ? "«" : "»"}
    </button>
  );
};

function PaginationInner({ pageCount }: Readonly<PaginationProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav role="navigation" aria-label="Pagination" className="pagination-nav">
      <ul className="pagination-list">
        <li>
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        </li>
        <li>
          <span className="page-number">Page {currentPage}</span>
        </li>
        <li>
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= pageCount}
          />
        </li>
      </ul>
    </nav>
  );
}

export function PaginationComponent({ pageCount }: Readonly<PaginationProps>) {
  return (
    <Suspense fallback={<div className="pagination-nav" />}>
      <PaginationInner pageCount={pageCount} />
    </Suspense>
  );
}