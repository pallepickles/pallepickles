import type { CSSProperties } from "react";

interface PickleJarArtwork {
  id: string;
  label: string;
  accent: string;
  softAccent: string;
}

function PickleJar({ id, label, accent, softAccent, entranceAnimation = false }: PickleJarArtwork & { entranceAnimation?: boolean }) {
  const rotationOffset = id.split("").reduce((total, letter) => total + letter.charCodeAt(0), 0) % 7;
  const style = {
    "--art-accent": accent,
    "--art-soft": softAccent,
    "--jar-delay": `-${rotationOffset}s`,
  } as CSSProperties;

  return (
    <div className={`pickle-jar-motion${entranceAnimation ? " pickle-jar-motion--hero" : ""}`} style={style}>
      <div className={`pickle-jar${id ? ` pickle-jar--${id}` : ""}`}>
        <div className="pickle-jar__lid" />
        <div className="pickle-jar__glass">
          <div className="pickle-jar__label">
            <span>PALLE</span>
            <strong>{label}</strong>
            <i>HOME STYLE</i>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PickleArt({
  label,
  accent,
  softAccent,
  large = false,
  variant,
  comboItems,
}: {
  label: string;
  accent: string;
  softAccent: string;
  large?: boolean;
  variant?: string;
  comboItems?: PickleJarArtwork[];
}) {
  const artStyle = { "--art-accent": accent, "--art-soft": softAccent } as CSSProperties;
  const displayComboItems = comboItems ?? [];
  const hasComboItems = displayComboItems.length > 0;
  const accessibleLabel = hasComboItems
    ? `${label} pickle illustration with ${displayComboItems.length} jars: ${displayComboItems.map((item) => item.label).join(", ")}`
    : `${label} pickle illustration`;

  return (
    <div className={`pickle-art${large ? " pickle-art--large" : ""}`} style={artStyle} aria-label={accessibleLabel} role="img">
      <span className="art-sun" />
      <span className="art-leaf art-leaf--one" />
      <span className="art-leaf art-leaf--two" />
      <span className="art-pepper art-pepper--one" />
      <span className="art-pepper art-pepper--two" />
      {hasComboItems ? (
        <div className={`pickle-combo-jars pickle-combo-jars--${displayComboItems.length}`} aria-hidden="true">
          {displayComboItems.map((item) => <PickleJar key={item.id} {...item} />)}
        </div>
      ) : (
        <PickleJar id={variant ?? ""} label={label} accent={accent} softAccent={softAccent} entranceAnimation={large} />
      )}
      <span className="art-caption">Made with care, from our home to yours</span>
    </div>
  );
}
