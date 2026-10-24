import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main">
        <div className="footer-brand"><a className="brand-lockup brand-lockup--footer" href="#home"><span className="brand-mark"><span>ప</span></span><span><strong>Palle Pickles</strong><small>Powered by SS Entreprises</small></span></a><p>A little village flavour for every table, wherever you call home.</p><a className="footer-instagram" href="https://wa.me/919642875111" target="_blank" rel="noreferrer"><MessageCircle size={17} /> Message our kitchen <ArrowUpRight size={14} /></a></div>
        <div className="footer-col"><span className="footer-label">SAY HELLO</span><a href="mailto:pallepickles@gmail.com"><Mail size={16} /> pallepickles@gmail.com</a><a href="https://wa.me/919642875111" target="_blank" rel="noreferrer"><MessageCircle size={16} /> +91 9642875111</a></div>
        <div className="footer-col"><span className="footer-label">A NOTE FROM US</span><p>Every jar is made in small batches with traditional recipes and carefully chosen ingredients. Worldwide shipping available.</p><a href="#pickles">Explore the menu <ArrowUpRight size={14} /></a></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Palle Pickles</span><span>Made with care in India <i>✳</i> Powered by SS Entreprises</span></div>
    </footer>
  );
}
