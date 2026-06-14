// MedTrack — Onboarding: welcome · phone · OTP · profile · prescription.
function Onboarding({ state, actions, onDone }) {
  const [step, setStep] = useState(0);
  const total = 5;
  const next = () => setStep((s) => Math.min(total - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  // form state
  const [phone, setPhone] = useState("+254 712 084 559");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("Amani Mwangi");
  const [dob, setDob] = useState("14 March 1989");
  const [address, setAddress] = useState("Apartment 4B, Kileleshwa, Nairobi");
  const [facility, setFacility] = useState("Kenyatta National Hospital");
  const [facSheet, setFacSheet] = useState(false);
  const [facQuery, setFacQuery] = useState("");
  const [rxMode, setRxMode] = useState("facility"); // facility | manual
  const [accepted, setAccepted] = useState(false);

  const Header = () => (
    <div style={{ padding: "6px 16px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        {step > 0
          ? <button className="bell" style={{ width: 40, height: 40, borderRadius: 13 }} onClick={prev} aria-label="Back">{I("left", { size: 20 })}</button>
          : <div style={{ width: 40 }} />}
        <div className="steps" style={{ flex: 1 }}>
          {Array.from({ length: total }).map((_, i) => <i key={i} className={i <= step ? "on" : ""} />)}
        </div>
        <button className="btn-text" style={{ padding: 0, fontSize: 13, color: "var(--text-3)" }} onClick={onDone}>Skip</button>
      </div>
    </div>
  );

  const Foot = ({ label, on = true, onClick }) => (
    <div className="mt-pad" style={{ paddingBottom: 26, paddingTop: 10 }}>
      <button className="btn btn-primary" disabled={!on} onClick={onClick}>{label} {I("arrowRight", { size: 18 })}</button>
    </div>
  );

  // ---- steps ----
  function Welcome() {
    return (
      <>
        <div className="mt-pad" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div className="ph" style={{ height: 260, marginTop: 8, flexDirection: "column", gap: 8 }}>
            <span>illustration</span><span style={{ opacity: .7 }}>calm patient at home</span>
          </div>
          <div style={{ marginTop: "auto", paddingBottom: 8 }}>
            <div className="rev-logo" style={{ width: 48, height: 48, borderRadius: 15, marginBottom: 18, fontSize: 22 }}>✚</div>
            <h1 className="t-hero" style={{ fontSize: 30, margin: 0, lineHeight: 1.2 }}>Your medication,<br />handled calmly.</h1>
            <p className="t-body muted" style={{ marginTop: 12, fontSize: 15 }}>Track every dose, never run out, and have refills delivered to your door — all in one quiet place.</p>
          </div>
        </div>
        <Foot label="Get started" onClick={next} />
      </>
    );
  }

  function Phone() {
    return (
      <>
        <div className="mt-pad" style={{ flex: 1 }}>
          <h2 className="t-heading" style={{ marginTop: 10 }}>What's your number?</h2>
          <p className="t-secondary" style={{ marginTop: 6 }}>We'll text you a 4-digit code to confirm it's you.</p>
          <div className="field" style={{ marginTop: 26 }}>
            <label>Mobile number</label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          </div>
          <div className="card-tint card-pad" style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "flex-start" }}>
            {I("lock", { size: 18, style: { color: "var(--primary)", flex: "none", marginTop: 1 } })}
            <span className="t-secondary">Your number is only used for secure sign-in and refill alerts.</span>
          </div>
        </div>
        <Foot label="Send code" on={phone.length > 6} onClick={next} />
      </>
    );
  }

  function Otp() {
    const digits = otp.padEnd(4, " ").split("");
    return (
      <>
        <div className="mt-pad" style={{ flex: 1 }}>
          <h2 className="t-heading" style={{ marginTop: 10 }}>Enter your code</h2>
          <p className="t-secondary" style={{ marginTop: 6 }}>Sent to {phone}</p>
          <div className="otp" style={{ marginTop: 26 }}>
            {digits.map((d, i) => (
              <div key={i} className={"otp-box" + (d.trim() ? " filled" : "") + (i === otp.length ? " active" : "")}>{d.trim()}</div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
            <button className="btn-text" style={{ padding: 0 }} onClick={() => setOtp("4729")}>Autofill demo code</button>
            <span className="t-caption">Resend in 0:24</span>
          </div>
        </div>
        <Foot label="Verify" on={otp.length === 4} onClick={next} />
      </>
    );
  }

  function Profile() {
    const filtered = MT.FACILITIES.filter((f) => f.toLowerCase().includes(facQuery.toLowerCase()));
    return (
      <>
        <div className="mt-scroll" style={{ flex: 1 }}>
          <div className="mt-pad" style={{ paddingBottom: 12 }}>
            <h2 className="t-heading" style={{ marginTop: 10 }}>Set up your profile</h2>
            <p className="t-secondary" style={{ marginTop: 6, marginBottom: 22 }}>This helps your facility reach you and deliver to the right place.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field"><label>Full name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="field"><label>Date of birth</label><input className="input" value={dob} onChange={(e) => setDob(e.target.value)} /></div>
              <div className="field">
                <label>Delivery address</label>
                <div style={{ position: "relative" }}>
                  <input className="input" style={{ paddingRight: 46 }} value={address} onChange={(e) => setAddress(e.target.value)} />
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--primary)" }}>{I("mapPin", { size: 20 })}</span>
                </div>
                <div className="map-ph" style={{ height: 96, marginTop: 4 }}>
                  <div className="map-pin" style={{ width: 32, height: 32 }}>{I("mapPin", { size: 15, style: { color: "#fff" } })}</div>
                  <span className="map-tag" style={{ bottom: 8, left: 12 }}>// drag pin to set GPS location</span>
                </div>
              </div>
              <div className="field">
                <label>Linked healthcare facility</label>
                <button className="input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }} onClick={() => setFacSheet(true)}>
                  <span>{facility}</span>{I("down", { size: 18, style: { color: "var(--text-3)" } })}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Foot label="Continue" on={name.length > 1} onClick={next} />
        <Sheet open={facSheet} onClose={() => setFacSheet(false)} title="Choose your facility">
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input className="input input-flat" style={{ paddingLeft: 42 }} placeholder="Search facilities" value={facQuery} onChange={(e) => setFacQuery(e.target.value)} />
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}>{I("search", { size: 18 })}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxHeight: 240, overflowY: "auto" }}>
            {filtered.map((f) => (
              <button key={f} className="row" style={{ background: "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", textAlign: "left", width: "100%" }} onClick={() => { setFacility(f); setFacSheet(false); setFacQuery(""); }}>
                <div className="row-icon">{I("building", { size: 20 })}</div>
                <span className="t-body" style={{ flex: 1 }}>{f}</span>
                {facility === f && <span className="c-healthy">{I("checkSm", { size: 18 })}</span>}
              </button>
            ))}
          </div>
        </Sheet>
      </>
    );
  }

  function Rx() {
    return (
      <>
        <div className="mt-scroll" style={{ flex: 1 }}>
          <div className="mt-pad" style={{ paddingBottom: 12 }}>
            <h2 className="t-heading" style={{ marginTop: 10 }}>Add your medication</h2>
            <p className="t-secondary" style={{ marginTop: 6, marginBottom: 18 }}>Your facility may have already sent it — or add it yourself.</p>
            <div className="seg" style={{ marginBottom: 18 }}>
              <button className={rxMode === "facility" ? "on" : ""} onClick={() => setRxMode("facility")}>From my facility</button>
              <button className={rxMode === "manual" ? "on" : ""} onClick={() => setRxMode("manual")}>Add manually</button>
            </div>

            {rxMode === "facility" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="card-tint card-pad" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  {I("building", { size: 18, style: { color: "var(--primary)", flex: "none", marginTop: 1 } })}
                  <span className="t-secondary">{facility} sent 1 prescription for you to confirm.</span>
                </div>
                <div className={"card card-pad" + (accepted ? "" : "")} style={{ display: "flex", flexDirection: "column", gap: 14, borderColor: accepted ? "var(--primary)" : "var(--border)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="pill-tile">{I("capsule", { size: 22 })}</div>
                    <div style={{ flex: 1 }}><div className="t-title">Dolutegravir 50 mg</div><div className="t-caption">1 tablet · every morning 8:00 AM</div></div>
                  </div>
                  <div className="hr" />
                  <div style={{ display: "flex", gap: 20 }}>
                    <div><div className="t-caption">Quantity</div><div className="t-body t-med">30 tablets</div></div>
                    <div><div className="t-caption">Last pickup</div><div className="t-body t-med">28 May 2026</div></div>
                  </div>
                  <button className={"btn " + (accepted ? "btn-tonal" : "btn-primary")} onClick={() => setAccepted(true)}>
                    {accepted ? <>{I("checkSm", { size: 18 })} Added to your meds</> : "Confirm this prescription"}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="field"><label>Medication name</label><input className="input" placeholder="e.g. Imatinib" /></div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="field" style={{ flex: 1 }}><label>Dosage</label><input className="input" placeholder="400 mg" /></div>
                  <div className="field" style={{ flex: 1 }}><label>Quantity</label><input className="input" placeholder="30" inputMode="numeric" /></div>
                </div>
                <div className="field"><label>Dosing schedule</label><input className="input" placeholder="Once daily · 9:00 PM" /></div>
                <div className="field"><label>Date of last pickup</label><input className="input" placeholder="30 May 2026" /></div>
                <button className="btn btn-tonal" onClick={() => setAccepted(true)}>{I("plus", { size: 18 })} Add medication</button>
              </div>
            )}
          </div>
        </div>
        <Foot label="Finish setup" on={accepted} onClick={onDone} />
      </>
    );
  }

  const steps = [Welcome, Phone, Otp, Profile, Rx];
  const Cur = steps[step];
  return (
    <div className="mt-app" style={{ position: "absolute", inset: 0, background: "var(--app-bg)", display: "flex", flexDirection: "column" }}>
      <div className="mt-safe-top" />
      <Header />
      <div className="screen-in" key={step} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}><Cur /></div>
    </div>
  );
}
window.Onboarding = Onboarding;
