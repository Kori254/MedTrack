// MedTrack — Medications tab. List of active prescriptions + add path.
function MedsScreen({ state, go }) {
  return (
    <div className="mt-scroll">
      <div className="mt-safe-top" />
      <div className="mt-header"><div className="mt-header-title"><span className="t-secondary">{state.meds.length} active prescriptions</span><span className="t-heading" style={{ fontSize: 24 }}>Medications</span></div></div>
      <div className="mt-pad" style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 24 }}>
        {state.meds.map((m) => <MedCard key={m.id} med={m} go={go} />)}
        <button className="btn btn-tonal" onClick={() => go("onboarding")} style={{ marginTop: 4 }}>{I("plus", { size: 20 })} Add a medication</button>
        <div className="card-tint card-pad" style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 4 }}>
          {I("building", { size: 20, style: { color: "var(--primary)", flex: "none", marginTop: 1 } })}
          <p className="t-secondary" style={{ margin: 0 }}>Your facility, {state.patient.facility}, can also add or update prescriptions remotely — new medications appear here automatically.</p>
        </div>
      </div>
    </div>
  );
}
window.MedsScreen = MedsScreen;
