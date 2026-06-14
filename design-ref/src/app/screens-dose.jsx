// MedTrack — Dose confirmation. Fast, full-bleed. Check animation on confirm.
function DoseScreen({ state, medId, back, actions, go }) {
  const med = state.meds.find((m) => m.id === medId) || state.meds[0];
  const [phase, setPhase] = useState(med.todayStatus === "taken" ? "done" : "confirm");
  const [skip, setSkip] = useState(false);
  const [reason, setReason] = useState(null);

  function confirm() {
    actions.confirmDose(med.id);
    setPhase("done");
    setTimeout(() => go("home"), 1700);
  }
  function doSkip() {
    if (!reason) return;
    actions.skipDose(med.id, reason);
    setSkip(false);
    go("home");
  }

  if (phase === "done") {
    return (
      <div className="mt-app" data-theme={undefined} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, padding: 32, background: "var(--app-bg)" }}>
        <div className="check-wrap">
          <div className="check-ring" />
          <div className="check-disc">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17.5 19 7" /></svg>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="t-heading">Dose confirmed</div>
          <div className="t-secondary" style={{ marginTop: 4 }}>{med.name} {med.strength} · logged at 8:12 AM</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-scroll" style={{ display: "flex", flexDirection: "column" }}>
      <div className="mt-safe-top" />
      <div style={{ padding: "6px 16px" }}>
        <button className="bell" style={{ width: 44, height: 44, borderRadius: 14 }} onClick={back} aria-label="Close">{I("x", { size: 22 })}</button>
      </div>

      <div className="mt-pad" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 28, textAlign: "center", paddingBottom: 30 }}>
        <div className="pill-tile" style={{ width: 88, height: 88, borderRadius: 28, background: "var(--primary-tint)" }}>{I("capsule", { size: 42, style: { color: "var(--primary)" } })}</div>
        <div>
          <div className="t-caption u-up" style={{ letterSpacing: "0.1em" }}>{med.scheduleLabel}</div>
          <div className="t-hero" style={{ fontSize: 32, marginTop: 8 }}>{med.name}</div>
          <div className="t-heading muted" style={{ fontWeight: 400, marginTop: 2 }}>{med.strength} · {med.form}</div>
        </div>
        <div className="card-tint card-pad" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", justifyContent: "center" }}>
          {I("info", { size: 18, style: { color: "var(--primary)" } })}
          <span className="t-secondary">Take with a full glass of water</span>
        </div>
      </div>

      <div className="mt-pad" style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 26 }}>
        <button className="btn btn-primary" onClick={confirm}>{I("check", { size: 20 })} I've taken this dose</button>
        <button className="btn-text" style={{ color: "var(--text-2)" }} onClick={() => setSkip(true)}>Skip this dose</button>
      </div>

      <Sheet open={skip} onClose={() => setSkip(false)} title="Why are you skipping this dose?">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MT.SKIP_REASONS.map((r) => (
            <div key={r} className={"choice" + (reason === r ? " sel" : "")} onClick={() => setReason(r)}>
              <div className="radio" /><span className="t-body t-med">{r}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 16 }} disabled={!reason} onClick={doSkip}>Confirm skip</button>
        <p className="t-caption" style={{ textAlign: "center", marginTop: 12, marginBottom: 0 }}>Your facility is notified so they can follow up if needed.</p>
      </Sheet>
    </div>
  );
}
window.DoseScreen = DoseScreen;
