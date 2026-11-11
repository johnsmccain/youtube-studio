"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Particle count scaled by device capability
const PARTICLE_COUNT_DESKTOP = 300;
const PARTICLE_COUNT_MOBILE = 150;
const CONNECTION_DISTANCE = 120;
const MOBILE_BREAKPOINT = 768;

// Brand colors
const COLOR_A = new THREE.Color("#1a6cf6");
const COLOR_B = new THREE.Color("#00d4ff");

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  phase: number;
}

/**
 * HeroCanvas — Three.js particle network scene.
 *
 * Loaded only via next/dynamic with ssr:false. Never runs on the server.
 * Checks for WebGL support before initialising. Disposes all GPU resources
 * on unmount. Respects prefers-reduced-motion by not starting the animation loop.
 */
export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion — do not animate at all
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const mount = mountRef.current;
    if (!mount) return;

    // Check WebGL support before creating renderer
    const testCanvas = document.createElement("canvas");
    const gl =
      testCanvas.getContext("webgl") ??
      testCanvas.getContext("experimental-webgl");
    if (!gl) return; // No WebGL — fall back to plain gradient background

    // ── Scene setup ──────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const particleCount = isMobile
      ? PARTICLE_COUNT_MOBILE
      : PARTICLE_COUNT_DESKTOP;

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 300;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL renderer failed — degrade gracefully
    }

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // transparent background
    mount.appendChild(renderer.domElement);

    // ── Particles ────────────────────────────────────────────────────────────
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * mount.clientWidth,
      y: (Math.random() - 0.5) * mount.clientHeight,
      z: (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      phase: Math.random() * Math.PI * 2,
    }));

    // Particle points geometry
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const color = COLOR_A.clone().lerp(COLOR_B, t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    pointsGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );

    const pointsMaterial = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Lines geometry — reused every frame
    const linesGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lineSegments = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lineSegments);

    // ── Mouse parallax ───────────────────────────────────────────────────────
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 40;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * -40;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── Resize handler ───────────────────────────────────────────────────────
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // ── Animation loop ───────────────────────────────────────────────────────
    let frameId: number;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.005;

      // Smooth camera parallax via lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      camera.position.x = currentMouseX;
      camera.position.y = currentMouseY;
      camera.lookAt(scene.position);

      // Update particle positions
      const posArray = pointsGeometry.attributes["position"]
        ?.array as Float32Array;
      if (!posArray) return;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        if (!p) continue;

        p.x += p.vx;
        p.y += p.vy;

        // Gentle sine-wave drift
        const drift = Math.sin(time + p.phase) * 0.3;
        posArray[i * 3] = p.x + drift;
        posArray[i * 3 + 1] = p.y + drift * 0.5;
        posArray[i * 3 + 2] = p.z;

        // Wrap around viewport bounds
        const hw = mount.clientWidth * 0.6;
        const hh = mount.clientHeight * 0.6;
        if (p.x > hw) p.x = -hw;
        else if (p.x < -hw) p.x = hw;
        if (p.y > hh) p.y = -hh;
        else if (p.y < -hh) p.y = hh;
      }

      pointsGeometry.attributes["position"]!.needsUpdate = true;

      // Build connection lines between nearby particles
      const linePositions: number[] = [];
      const lineColors: number[] = [];

      for (let i = 0; i < particleCount; i++) {
        const pi = particles[i];
        if (!pi) continue;
        for (let j = i + 1; j < particleCount; j++) {
          const pj = particles[j];
          if (!pj) continue;
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const alpha = 1 - dist / CONNECTION_DISTANCE;
            const t = i / particleCount;
            const color = COLOR_A.clone().lerp(COLOR_B, t);

            linePositions.push(
              posArray[i * 3]!,
              posArray[i * 3 + 1]!,
              posArray[i * 3 + 2]!,
              posArray[j * 3]!,
              posArray[j * 3 + 1]!,
              posArray[j * 3 + 2]!,
            );
            lineColors.push(
              color.r * alpha,
              color.g * alpha,
              color.b * alpha,
              color.r * alpha,
              color.g * alpha,
              color.b * alpha,
            );
          }
        }
      }

      linesGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3),
      );
      linesGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(lineColors, 3),
      );

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup on unmount ───────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      pointsGeometry.dispose();
      linesGeometry.dispose();
      pointsMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      role="presentation"
      className="absolute inset-0 z-0"
    />
  );
}
