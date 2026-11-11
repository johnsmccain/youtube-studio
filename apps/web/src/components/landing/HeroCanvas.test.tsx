import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import HeroCanvas from "./HeroCanvas";

// Helpers
const mockMatchMedia = (reducedMotion: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reducedMotion ? query.includes("reduce") : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
};

const mockNoWebGL = () => {
  // Patch HTMLCanvasElement.prototype.getContext so both webgl checks return null
  const original = HTMLCanvasElement.prototype.getContext;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  return original;
};

beforeEach(() => {
  mockMatchMedia(false); // motion allowed by default
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("HeroCanvas", () => {
  it("renders a wrapper div with correct accessibility attributes", () => {
    mockNoWebGL(); // avoid Three.js renderer in jsdom
    const { container } = render(<HeroCanvas />);
    const div = container.firstChild as HTMLElement;
    expect(div).toBeTruthy();
    expect(div.getAttribute("aria-hidden")).toBe("true");
    expect(div.getAttribute("role")).toBe("presentation");
  });

  it("does not append a canvas when prefers-reduced-motion is set", () => {
    mockMatchMedia(true);
    const { container } = render(<HeroCanvas />);
    // With reduced motion, the useEffect returns early — no canvas appended
    const canvases = container.querySelectorAll("canvas");
    expect(canvases.length).toBe(0);
  });

  it("does not throw when WebGL is unavailable", () => {
    mockNoWebGL();
    expect(() => render(<HeroCanvas />)).not.toThrow();
  });

  it("does not append a canvas when WebGL is unavailable", () => {
    mockNoWebGL();
    const { container } = render(<HeroCanvas />);
    const canvases = container.querySelectorAll("canvas");
    expect(canvases.length).toBe(0);
  });
});
