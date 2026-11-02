"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { PickleArt } from "@/components/PickleArt";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlayback = () => {
      if (reducedMotion.matches || document.visibilityState !== "visible") {
        video.pause();
        return;
      }

      void video.play().catch(() => {});
    };

    updatePlayback();
    reducedMotion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);

    return () => {
      reducedMotion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, []);

  return (
    <section className="hero-section" id="home">
      <video
        ref={videoRef}
        className="hero-background-video"
        muted
        loop
        playsInline
        preload="metadata"
        poster="/palle-pickles-hero-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/palle-pickles-hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> A little taste of home <Sparkles size={13} /></div>
        <h1>Prathi muddhalo<br /><em>&lsquo;palle flavour&rsquo;.</em></h1>
        <p className="hero-description">The bold, beautiful taste of a village kitchen. Hand-made Telugu pickles, prepared with pure ingredients and recipes passed down with love.</p>
        <div className="hero-actions">
          <a className="button button--primary" href="#pickles">Find your favourite <ArrowUpRight size={17} /></a>
          <a className="text-link" href="#about"><span className="play-icon"><ArrowDown size={14} /></span> Our story</a>
        </div>
        <div className="hero-proof"><p><strong>Made the old-fashioned way</strong><small>Good ingredients. No shortcuts.</small></p></div>
      </div>
      <div className="hero-art-wrap">
        <div className="hero-stamp"><span>FROM OUR<br />VILLAGE KITCHEN</span><strong>100%</strong><small>made with care</small></div>
        <PickleArt label="PACCHADI" accent="#a94221" softAccent="#f4d9c0" variant="mango-pacchadi" large />
        <div className="hero-art-note"><span>Sunshine, spice &amp; everything nice</span></div>
      </div>
    </section>
  );
}
