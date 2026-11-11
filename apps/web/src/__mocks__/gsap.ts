// GSAP mock for Vitest — animation APIs are no-ops in test environment.
import { vi } from "vitest";

const noop = () => ({ kill: vi.fn() });
const noopSet = vi.fn();

const timeline = () => ({
  from: vi.fn().mockReturnThis(),
  to: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  kill: vi.fn(),
});

export const gsap = {
  from: noop,
  to: noop,
  set: noopSet,
  timeline,
  registerPlugin: vi.fn(),
};

export const ScrollTrigger = {
  batch: vi.fn(),
  kill: vi.fn(),
  getAll: vi.fn(() => []),
  refresh: vi.fn(),
};

export default gsap;
