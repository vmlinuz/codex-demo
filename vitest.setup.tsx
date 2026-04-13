import { cleanup } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("next/link", () => ({
  default: function MockNextLink({
    children,
    href,
    ...props
  }: Readonly<
    {
      children: ReactNode;
      href: string;
    } & AnchorHTMLAttributes<HTMLAnchorElement>
  >) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));
