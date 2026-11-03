import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main">
        <div className="footer-brand"><a className="brand-lockup brand-lockup--footer" href="#home" aria-label="Palle Pickles home"><Image className="brand-logo" src="/palle-pickles-village-logo.png" alt="" width={1254} height={1254} sizes="64px" /><span><strong>Palle Pickles</strong><small>Powered by SS Entreprises</small></span></a><p>A little village flavour for every table, wherever you call home.</p><a className="footer-instagram" href="https://wa.me/919642875111" target="_blank" rel="noreferrer"><MessageCircle size={17} /> Message our kitchen <ArrowUpRight size={14} /></a></div>
        <div className="footer-col"><span className="footer-label">SAY HELLO</span><a href="mailto:pallepickles@gmail.com"><Mail size={16} /> pallepickles@gmail.com</a><a href="https://wa.me/919642875111" target="_blank" rel="noreferrer"><MessageCircle size={16} /> +91 9642875111</a></div>
        <div className="footer-col"><span className="footer-label">A NOTE FROM US</span><p>Every jar is made in small batches with traditional recipes and carefully chosen ingredients. Worldwide shipping available.</p><a href="#pickles">Explore the menu <ArrowUpRight size={14} /></a></div>
      </div>
      <section className="footer-location" aria-labelledby="footer-location-title">
        <div className="footer-location__copy">
          <span className="footer-label">OUR HOME IN TELANGANA</span>
          <h2 id="footer-location-title">Find us in <em>Husnabad.</em></h2>
          <p>Our village roots are in Husnabad, Telangana, India. From here, a little Palle flavour makes its way to tables around the world.</p>
        </div>
        <div className="footer-location__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3791.8145491877035!2d79.20934677518214!3d18.12635328289207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTjCsDA3JzM0LjkiTiA3OcKwMTInNDIuOSJF!5e0!3m2!1sen!2sin!4v1793681363237!5m2!1sen!2sin"
            title="Palle Pickles location in Husnabad, Telangana"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Palle Pickles</span><span>Made with care in India <i>✳</i> Powered by SS Entreprises</span></div>
      <div className="footer-credit" aria-label="Built by AI Developer India">
        <span>Built by</span>
        <a className="footer-credit__link" href="https://www.aideveloperindia.xyz/" target="_blank" rel="noreferrer" aria-label="Visit AI Developer India">
          <Image className="footer-credit__logo" src="/A-logo.png" alt="" width={1024} height={1024} sizes="30px" />
        </a>
        <span>AI Developer India</span>
      </div>
    </footer>
  );
}
