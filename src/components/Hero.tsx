import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { PickleArt } from "@/components/PickleArt";

export function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> A little taste of home <Sparkles size={13} /></div>
        <h1>Prathi muddhalo<br /><em>&lsquo;palle flavour&rsquo;.</em></h1>
        <p className="hero-description">The bold, beautiful taste of a village kitchen. Hand-made Andhra pickles, prepared with pure ingredients and recipes passed down with love.</p>
        <div className="hero-actions">
          <a className="button button--primary" href="#pickles">Find your favourite <ArrowUpRight size={17} /></a>
          <a className="text-link" href="#about"><span className="play-icon"><ArrowDown size={14} /></span> Our story</a>
        </div>
        <div className="hero-proof"><div className="proof-avatars"><span>అ</span><span>♡</span><span>ఇ</span></div><p><strong>Made the old-fashioned way</strong><small>Good ingredients. No shortcuts.</small></p></div>
      </div>
      <div className="hero-art-wrap">
        <div className="hero-stamp"><span>FROM OUR<br />VILLAGE KITCHEN</span><strong>100%</strong><small>made with care</small></div>
        <PickleArt label="AVAKAYA" accent="#a94221" softAccent="#f4d9c0" large />
        <div className="hero-art-note"><span>01 / 07</span><span>Sunshine, spice &amp; everything nice</span></div>
      </div>
      <a className="scroll-cue" href="#pickles"><span /> Scroll to savour</a>
    </section>
  );
}
