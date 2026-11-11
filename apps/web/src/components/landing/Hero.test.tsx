import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

// next/dynamic is mocked — HeroCanvas won't actually load in tests
vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

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

const TEST_SIGN_IN_URL = "http://localhost:3001/api/auth/signin/google";

describe("Hero", () => {
  it("renders the product headline", () => {
    render(<Hero signInUrl={TEST_SIGN_IN_URL} />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/AI YouTube/i)).toBeInTheDocument();
  });

  it("renders the sign-in button with correct href", () => {
    render(<Hero signInUrl={TEST_SIGN_IN_URL} />);
    const link = screen.getByRole("link", {
      name: /sign in with your google account/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", TEST_SIGN_IN_URL);
  });

  it("sign-in link has a descriptive aria-label", () => {
    render(<Hero signInUrl={TEST_SIGN_IN_URL} />);
    const link = screen.getByRole("link", { name: /sign in with your google account/i });
    expect(link).toBeInTheDocument();
  });

  it("does not render an error message when authError is not provided", () => {
    render(<Hero signInUrl={TEST_SIGN_IN_URL} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders the error message when authError is provided", () => {
    const errorMsg = "Sign-in failed. Please try again.";
    render(<Hero signInUrl={TEST_SIGN_IN_URL} authError={errorMsg} />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(errorMsg);
  });

  it("renders the tagline", () => {
    render(<Hero signInUrl={TEST_SIGN_IN_URL} />);
    expect(screen.getByText(/research trends/i)).toBeInTheDocument();
  });
});
