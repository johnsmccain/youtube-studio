// Three.js mock for Vitest — jsdom has no WebGL context.
// All Three.js classes used in HeroCanvas are stubbed here.
import { vi } from "vitest";

export const WebGLRenderer = vi.fn().mockImplementation(() => ({
  setSize: vi.fn(),
  setPixelRatio: vi.fn(),
  render: vi.fn(),
  dispose: vi.fn(),
  domElement: document.createElement("canvas"),
}));

export const Scene = vi.fn().mockImplementation(() => ({
  add: vi.fn(),
}));

export const PerspectiveCamera = vi.fn().mockImplementation(() => ({
  position: { z: 0 },
  aspect: 1,
  updateProjectionMatrix: vi.fn(),
}));

export const BufferGeometry = vi.fn().mockImplementation(() => ({
  setAttribute: vi.fn(),
  dispose: vi.fn(),
}));

export const Float32BufferAttribute = vi.fn();

export const PointsMaterial = vi.fn().mockImplementation(() => ({
  dispose: vi.fn(),
}));

export const LineBasicMaterial = vi.fn().mockImplementation(() => ({
  dispose: vi.fn(),
}));

export const Points = vi.fn().mockImplementation(() => ({
  geometry: { attributes: { position: { array: new Float32Array(0) } } },
}));

export const LineSegments = vi.fn().mockImplementation(() => ({
  geometry: { setAttribute: vi.fn(), dispose: vi.fn() },
}));

export const Color = vi.fn();

export const AdditiveBlending = 2;
