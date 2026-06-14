// MedTrack — Medication detail. Schedule, countdown, 30-day calendar, refills.
function Cal30({ med }) {
  const todayIdx = 26, startOffset = 2;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(<div key={"b" + i} />);
  for (let i = 0; i < 30; i++) {
    let cls = "future";
    if (i < todayIdx) cls = med.missedDays.includes(i) ? "missed" : "taken";
    else if (i === todayIdx) cls = med.todayStatus === "taken" ? "taken" : "today";
    cells.push(<div key={i} className={"cal-cell " + cls}>{i + 1}</div>);
  }
  return (
    <div>
      <div className="cal-grid" style={{ marginBottom: 7 }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} className="cal-dow">{d}</div>)}
      </div>
      <div className="cal-grid">{cells}</div>
    </div>
  );
}

function MedDetailScreen({ state, medId, back, go }) {
  const med = state.meds.find((m) => m.id === medId) || state.meds[0];
  const st = MT.supplyStatus(med.daysRemaining);
  return (
    <div className="mt-scroll">
      <div className="mt-safe-top" />
      <TopBar title={med.name} sub={med.strength + " · " + med.purpose} onBack={back}
        trailing={<button className="bell" style={{ width: 44, height: 44, borderRadius: 14 }} aria-label="Report">{I("info", { size: 20 })}</button>} />
      <div className="mt-pad" style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 30 }}>

        {/* schedule + countdown */}
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <MedTile med={med} size={52} />
          <div style={{ flex: 1 }}>
            <div className="t-secondary">{med.scheduleLabel}</div>
            <div className="t-title" style={{ marginTop: 2 }}>Next dose {med.nextDoseIn}</div>
          </div>
          {med.todayStatus === "pending"
            ? <button className="btn btn-primary btn-sm" onClick={() => go("dose", med.id)}>Confirm</button>
            : med.todayStatus === "taken"
              ? <Chip status="healthy">{I("checkSm", { size: 14 })} Taken</Chip>
              : <Chip>{I("clock", { size: 13 })} Later</Chip>}
        </div>

        {/* supply */}
        <div className="card card-pad">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div className="t-caption">Days of medication left</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span className={"t-hero c-" + st}>{med.daysRemaining}</span>
                <span className="t-secondary">of {med.totalDays}</span>
              </div>
            </div>
            <Chip status={st === "healthy" ? "healthy" : st === "low" ? "low" : "critical"}>{MT.STATUS_LABEL[st]}</Chip>
          </div>
          <SupplyBar days={med.daysRemaining} total={med.totalDays} showLabel={false} height={10} />
          {med.refillState === "dispatched" && (
            <button onClick={() => go("delivery")} className="row" style={{ width: "100%", background: "none", border: "none", borderTop: "1px solid var(--border)", marginTop: 14, cursor: "pointer", textAlign: "left" }}>
              <div className="row-icon" style={{ background: "var(--primary-tint)", color: "var(--primary)" }}>{I("truck", { size: 20 })}</div>
              <div style={{ flex: 1 }}><div className="t-body t-med">Refill on the way</div><div className="t-caption">Arriving tomorrow · 28 Jun</div></div>
              {I("chevronR", { size: 18, style: { color: "var(--text-3)" } })}
            </button>
          )}
        </div>

        {/* calendar */}
        <div>
          <SectionLabel>Last 30 days</SectionLabel>
          <div className="card card-pad">
            <Cal30 med={med} />
            <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              {[["taken", "Taken", "var(--primary)"], ["missed", "Missed", "var(--coral)"], ["future", "Upcoming", "var(--border-2)"]].map(([k, l, c]) => (
                <span key={k} className="t-caption" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 11, height: 11, borderRadius: 4, background: c }} />{l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* refill history */}
        <div>
          <SectionLabel>Refill history</SectionLabel>
          <div className="list-card">
            {med.refills.map((r, i) => (
              <div className="row" key={i}>
                <div className="row-icon">{I(r.method.startsWith("Failed") ? "alert" : r.method === "Pickup" ? "building" : "truck", { size: 20 })}</div>
                <div style={{ flex: 1 }}><div className="t-body">{r.date}</div><div className="t-caption">{r.method === "Pickup" ? "Collected at facility" : r.method}</div></div>
                {!r.method.startsWith("Failed") && <span className="c-healthy">{I("checkSm", { size: 18 })}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* prescriber */}
        <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span className="t-secondary">Prescribing facility</span><span className="t-body t-med" style={{ textAlign: "right", maxWidth: 200 }}>{med.facility}</span></div>
          <div className="hr" />
          <div style={{ display: "flex", justifyContent: "space-between" }}><span className="t-secondary">Clinician</span><span className="t-body t-med">{med.clinician}</span></div>
          <div className="hr" />
          <div style={{ display: "flex", justifyContent: "space-between" }}><span className="t-secondary">Last pickup</span><span className="t-body t-med">{med.lastPickup}</span></div>
        </div>

        <button className="btn btn-ghost" style={{ color: "var(--coral-text)", borderColor: "var(--coral-tint)" }}>{I("flag", { size: 18 })} Report a problem</button>
      </div>
    </div>
  );
}
window.MedDetailScreen = MedDetailScreen;
