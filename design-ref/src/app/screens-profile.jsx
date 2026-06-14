// MedTrack — Profile & settings.
function Toggle({ on, onClick }) { return <div className={"switch" + (on ? " on" : "")} onClick={onClick} role="switch" aria-checked={on} />; }

function SetRow({ icon, label, value, onClick, trailing, danger, last }) {
  return (
    <button onClick={onClick} className="row" style={{ width: "100%", background: "none", border: "none", borderTop: "none", cursor: onClick ? "pointer" : "default", textAlign: "left", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div className="row-icon" style={danger ? { background: "var(--coral-tint)", color: "var(--coral-text)" } : null}>{I(icon, { size: 20 })}</div>
      <div style={{ flex: 1 }}><div className="t-body t-med" style={danger ? { color: "var(--coral-text)" } : null}>{label}</div>{value && <div className="t-caption">{value}</div>}</div>
      {trailing !== undefined ? trailing : (onClick && I("chevronR", { size: 18, style: { color: "var(--text-3)" } }))}
    </button>
  );
}

function ProfileScreen({ state, theme, setTheme, reset, actions }) {
  const p = state.patient;
  const notify = { push: "Push only", sms: "SMS only", both: "Push & SMS" }[p.notify];
  return (
    <div className="mt-scroll">
      <div className="mt-safe-top" />
      <div className="mt-header"><div className="mt-header-title"><span className="t-secondary">Account</span><span className="t-heading" style={{ fontSize: 24 }}>Profile</span></div></div>
      <div className="mt-pad" style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 30 }}>

        {/* identity */}
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="pill-tile" style={{ width: 56, height: 56, borderRadius: 18, fontSize: 22, background: "var(--primary)", color: "var(--on-primary)", fontWeight: 500 }}>{p.firstName[0]}{p.lastName[0]}</div>
          <div style={{ flex: 1 }}>
            <div className="t-title" style={{ fontSize: 18 }}>{p.firstName} {p.lastName}</div>
            <div className="t-secondary">{p.facility}</div>
          </div>
          <button className="bell" style={{ width: 42, height: 42, borderRadius: 13, color: "var(--primary)" }} aria-label="Edit">{I("edit", { size: 19 })}</button>
        </div>

        <div>
          <SectionLabel>Personal</SectionLabel>
          <div className="card" style={{ padding: "4px 18px" }}>
            <SetRow icon="user" label="Date of birth" value={p.dob} />
            <SetRow icon="phone" label="Phone" value={p.phone} />
            <SetRow icon="mapPin" label="Delivery address" value={p.address} onClick={() => {}} />
            <SetRow icon="building" label="Linked facility" value={p.facility} onClick={() => {}} last />
          </div>
        </div>

        <div>
          <SectionLabel>Preferences</SectionLabel>
          <div className="card" style={{ padding: "4px 18px" }}>
            <SetRow icon={theme === "dark" ? "moon" : "sun"} label="Dark mode" trailing={<Toggle on={theme === "dark"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />} />
            <SetRow icon="bell" label="Notifications" value={notify} onClick={() => {}} />
            <SetRow icon="globe" label="Language" value={p.language + " · Kiswahili"} onClick={() => {}} last />
          </div>
        </div>

        <div>
          <SectionLabel>Safety</SectionLabel>
          <div className="card" style={{ padding: "4px 18px" }}>
            <SetRow icon="heartPulse" label="Emergency contact" value={p.emergency + " · " + p.emergencyPhone} onClick={() => {}} />
            <SetRow icon="shield" label="Data & privacy" value="Manage your health data" onClick={() => {}} last />
          </div>
        </div>

        <div className="card" style={{ padding: "4px 18px" }}>
          <SetRow icon="refresh" label="Replay onboarding" onClick={() => reset("onboarding")} />
          <SetRow icon="logout" label="Log out" danger onClick={() => {}} last />
        </div>
        <p className="t-caption" style={{ textAlign: "center", margin: 0 }}>MedTrack · v1.0 · Nairobi</p>
      </div>
    </div>
  );
}
window.ProfileScreen = ProfileScreen;
