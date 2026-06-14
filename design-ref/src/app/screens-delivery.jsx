// MedTrack — Delivery tracking. 3-step tracker, map placeholder, past deliveries.
function DeliveryScreen({ state, go }) {
  const d = state.delivery.active;
  const steps = ["Dispatched", "In transit", "Delivered"];
  return (
    <div className="mt-scroll">
      <div className="mt-safe-top" />
      <div className="mt-header"><div className="mt-header-title"><span className="t-secondary">Track your medication</span><span className="t-heading" style={{ fontSize: 24 }}>Delivery</span></div></div>

      <div className="mt-pad" style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 24 }}>
        {/* active */}
        <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="pill-tile">{I("package", { size: 22 })}</div>
            <div style={{ flex: 1 }}><div className="t-title">{d.med}</div><div className="t-caption">{d.quantity}</div></div>
            <Chip status="low">{I("truck", { size: 13 })} In transit</Chip>
          </div>

          {/* tracker */}
          <div className="track">
            {steps.map((s, i) => (
              <div className="track-step" key={s}>
                {i < steps.length - 1 && <div className={"track-line" + (i < d.step ? " done" : "")} />}
                <div className={"track-node " + (i < d.step ? "done" : i === d.step ? "current" : "")}>
                  {i < d.step ? I("checkSm", { size: 16 }) : i === 0 ? I("package", { size: 16 }) : i === 1 ? I("truck", { size: 16 }) : I("home", { size: 16 })}
                </div>
                <span className={"track-cap" + (i === d.step ? " on" : "")}>{s}</span>
              </div>
            ))}
          </div>

          <div className="card-tint" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, borderRadius: 16 }}>
            {I("clock", { size: 20, style: { color: "var(--primary)" } })}
            <div style={{ flex: 1 }}><div className="t-body t-med">Estimated arrival {d.eta}</div><div className="t-caption">{d.window}</div></div>
          </div>
        </div>

        {/* map */}
        <div>
          <SectionLabel>Live location</SectionLabel>
          <div className="map-ph">
            <span className="map-tag" style={{ top: 14, left: 16 }}>// agent en route · 4.2 km away</span>
            <div className="map-pin">{I("truck", { size: 18, style: { color: "#fff" } })}</div>
            <span className="map-tag" style={{ bottom: 14, right: 16 }}>{state.patient.address.split(",")[1] || "Kileleshwa"} →</span>
          </div>
          <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
            <div className="row-icon" style={{ borderRadius: "50%", background: "var(--primary-tint)", color: "var(--primary)" }}>{I("user", { size: 20 })}</div>
            <div style={{ flex: 1 }}><div className="t-body t-med">{d.agent}</div><div className="t-caption">Your delivery agent · ref {d.ref}</div></div>
            <button className="bell" style={{ width: 42, height: 42, borderRadius: 13, color: "var(--primary)" }} aria-label="Contact support">{I("phone", { size: 20 })}</button>
          </div>
        </div>

        {/* past */}
        <div>
          <SectionLabel>Past deliveries</SectionLabel>
          <div className="list-card">
            {state.delivery.past.map((p, i) => {
              const failed = p.status === "Failed";
              return (
                <div className="row" key={i}>
                  <div className="row-icon" style={failed ? { background: "var(--coral-tint)", color: "var(--coral-text)" } : null}>{I(failed ? "alert" : "package", { size: 20 })}</div>
                  <div style={{ flex: 1 }}><div className="t-body t-med">{p.med}</div><div className="t-caption">{p.date}</div></div>
                  <Chip status={failed ? "critical" : "healthy"}>{failed ? p.note : "Delivered"}</Chip>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
window.DeliveryScreen = DeliveryScreen;
