import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import useTheme from "@/theme/useTheme";

function getParticleOptions({ isDark, reducedMotion }) {
  const particleColor = isDark ? "#f8fafc" : "#1f2937";
  const lineColor = isDark ? "#e2e8f0" : "#374151";
  const particleOpacity = isDark ? 0.34 : 0.28;
  const lineOpacity = isDark ? 0.22 : 0.18;

  return {
    fullScreen: { enable: false },
    detectRetina: true,
    fpsLimit: reducedMotion ? 24 : 60,
    background: { color: "transparent" },
    particles: {
      color: { value: particleColor },
      links: {
        color: lineColor,
        distance: 150,
        enable: true,
        opacity: lineOpacity,
        width: 1,
      },
      move: {
        enable: !reducedMotion,
        direction: "none",
        outModes: { default: "out" },
        random: false,
        speed: reducedMotion ? 0 : 1,
        straight: false,
      },
      number: {
        density: { enable: true, width: 900, height: 900 },
        value: reducedMotion ? 24 : 52,
      },
      opacity: { value: particleOpacity },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: { enable: !reducedMotion, mode: "push" },
        onHover: { enable: !reducedMotion, mode: "grab" },
        resize: { enable: true },
      },
      modes: {
        push: { quantity: 4 },
        grab: {
          distance: 180,
          links: {
            opacity: isDark ? 0.3 : 0.25,
          },
        },
      },
    },
  };
}

export default function InteractiveBackground() {
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);

    onChange();
    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const options = useMemo(
    () =>
      getParticleOptions({
        isDark: theme === "dark",
        reducedMotion,
      }),
    [theme, reducedMotion],
  );

  if (!ready) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <Particles id="interactive-background" options={options} className="h-full w-full" />
    </div>
  );
}

