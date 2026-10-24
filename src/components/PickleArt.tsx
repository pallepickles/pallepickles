import type { CSSProperties } from "react";

export function PickleArt({ label, accent, softAccent, large = false }: {
  label: string;
  accent: string;
  softAccent: string;
  large?: boolean;
}) {
  const style = { "--art-accent": accent, "--art-soft": softAccent } as CSSProperties;
  return (
    <div className={`pickle-art${large ? " pickle-art--large" : ""}`} style={style} aria-label={`${label} pickle illustration`} role="img">
      <span className="art-sun" />
      <span className="art-leaf art-leaf--one" />
      <span className="art-leaf art-leaf--two" />
      <span className="art-pepper art-pepper--one" />
      <span className="art-pepper art-pepper--two" />
      <div className="pickle-jar">
        <div className="pickle-jar__lid" />
        <div className="pickle-jar__glass">
          <div className="pickle-jar__label">
            <span>PALLE</span>
            <strong>{label}</strong>
            <i>HOME STYLE</i>
          </div>
          <div className="pickle-jar__contents"><span /><span /><span /><span /><span /></div>
        </div>
      </div>
      <span className="art-caption">Made with care, from our home to yours</span>
    </div>
  );
}
