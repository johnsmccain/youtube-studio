import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Features } from "./Features";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

describe("Features", () => {
  it("renders all 4 feature cards", () => {
    render(<Features />);
    expect(screen.getByText("Research")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Produce")).toBeInTheDocument();
    expect(screen.getByText("Analyse")).toBeInTheDocument();
  });

  it("each card has a title and description", () => {
    render(<Features />);
    expect(screen.getByText(/trending topics and keywords/i)).toBeInTheDocument();
    expect(screen.getByText(/ranked video ideas/i)).toBeInTheDocument();
    expect(screen.getByText(/AI thumbnails/i)).toBeInTheDocument();
    expect(screen.getByText(/watch time/i)).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<Features />);
    expect(
      screen.getByRole("heading", { name: /everything in one workflow/i }),
    ).toBeInTheDocument();
  });
});
