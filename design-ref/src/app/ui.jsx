// MedTrack — shared UI primitives.
const { useState, useEffect, useRef } = React;
const I = (name, props) => window.Icon[name](props || {});

// Supply depletion bar with status color + days label
function SupplyBar({ days, total, showLabel = true, height = 8 }) {
  const st = MT.supplyStatus(days);
  const pct = Math.max(4, Math.min(100, (days / total) * 100));
  return (
    <div>
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span className="t-secondary">Supply remaining</span>
          <span className={"t-secondary t-med c-" + st}>{days} days</span>
        </div>
      )}
      <div className="bar" style={{ height }}>
        <div className={"bar-fill fill-" + st} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

// Mon–Sun streak — `animate` re-fills today's pip when it flips to taken
function StreakDots({ week }) {
  return (
    <div className="streak">
      {week.map((d, i) => (
        <div className="streak-day" key={i}>
          <div className={"streak-pip " + d.s}>
            {d.s === "taken" && I("checkSm", { size: 15 })}
            {d.s === "missed" && I("x", { size: 13, sw: 2 })}
            {d.s === "today" && <span style={{ width: 7, height: 7, borderRadius: 9, background: "currentColor" }} />}
          </div>
          <span className="streak-label">{d.d}</span>
        </div>
      ))}
    </div>
  );
}

function Chip({ status, children }) {
  const cls = status ? " chip-" + status : "";
  return <span className={"chip" + cls}>{status && <span className="dot" />}{children}</span>;
}

function MedTile({ med, size }) {
  const st = MT.supplyStatus(med.daysRemaining);
  const cls = st === "healthy" ? "" : st;
  return <div className={"pill-tile " + cls} style={size ? { width: size, height: size } : null}>{I("capsule", { size: 22 })}</div>;
}

// Sub-screen top bar with back chevron + centered title + optional trailing
function TopBar({ title, onBack, trailing, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px 12px" }}>
      <button className="bell" style={{ width: 44, height: 44, borderRadius: 14 }} onClick={onBack} aria-label="Back">
        {I("left", { size: 22 })}
      </button>
      <div style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", gap: 1 }}>
        <span className="t-title">{title}</span>
        {sub && <span className="t-caption">{sub}</span>}
      </div>
      <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{trailing}</div>
    </div>
  );
}

function SectionLabel({ children, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 12px" }}>
      <span className="u-up muted-3">{children}</span>
      {action && <button className="btn-text" style={{ padding: 0, fontSize: 13 }} onClick={onAction}>{action}</button>}
    </div>
  );
}

// Bottom sheet
function Sheet({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--scrim)", animation: "screen-in .2s" }} />
      <div className="screen-in" style={{ position: "relative", background: "var(--surface)", borderRadius: "26px 26px 0 0", padding: "10px 20px 30px", boxShadow: "var(--shadow-pop)" }}>
        <div style={{ width: 40, height: 4, borderRadius: 99, background: "var(--border-2)", margin: "0 auto 16px" }} />
        {title && <div className="t-title" style={{ marginBottom: 14 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { SupplyBar, StreakDots, Chip, MedTile, TopBar, SectionLabel, Sheet, I });
