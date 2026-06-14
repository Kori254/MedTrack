// MedTrack — Home dashboard. Three hero directions (A/B/C) exploring how the
// three key questions are prioritized. Shared: greeting, streak, med cards.

function Greeting({ state, go }) {
  const unread = state.notifications.filter((n) => n.unread).length;
  return (
    <div className="mt-header">
      <div className="mt-header-title">
        <span className="t-secondary">{state.today.full}</span>
        <span className="t-heading" style={{ fontSize: 24 }}>Habari, {state.patient.firstName}</span>
      </div>
      <button className="bell" onClick={() => go("notifications")} aria-label="Notifications">
        {I("bell", { size: 22 })}
        {unread > 0 && <span className="bell-badge">{unread}</span>}
      </button>
    </div>
  );
}

// circular dose progress ring (simple svg circle)
function DoseRing({ done, total, size = 64, stroke = 7 }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--primary)" strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - done / total)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .6s ease" }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 16, fontWeight: 500, fill: "var(--text)", fontFamily: "inherit" }}>{done}/{total}</text>
    </svg>
  );
}

function AdherenceCard({ state }) {
  const ok = state.adherence.message.startsWith("0") || state.adherence.message.includes("track");
  return (
    <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="t-caption">This month's adherence</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
            <span className="t-hero">{state.adherence.month}%</span>
            <span className="t-secondary c-healthy">on track</span>
          </div>
        </div>
        {I("activity", { size: 26, style: { color: "var(--primary)" } })}
      </div>
      <StreakDots week={state.week} />
      <div className="t-secondary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className={"status-dot " + (ok ? "s-healthy" : "s-low")} />
        {state.adherence.message}
      </div>
    </div>
  );
}

function MedCard({ med, go }) {
  const st = MT.supplyStatus(med.daysRemaining);
  const statusEl = {
    taken: <Chip status="healthy">{I("checkSm", { size: 14 })} Taken {med.takenAt}</Chip>,
    pending: <Chip status="low">{I("clock", { size: 13 })} Due now</Chip>,
    upcoming: <Chip>{I("clock", { size: 13 })} 9:00 PM</Chip>,
    missed: <Chip status="critical">Missed</Chip>,
  }[med.todayStatus];
  return (
    <button className="card card-pad screen-in" onClick={() => go("med", med.id)}
      style={{ display: "block", width: "100%", textAlign: "left", border: "1px solid var(--border)", cursor: "pointer", background: "var(--surface)" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <MedTile med={med} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span className="t-title">{med.name}</span>
            <span className="t-secondary">{med.strength}</span>
          </div>
          <div className="t-caption" style={{ marginTop: 2 }}>{med.scheduleLabel}</div>
          <div style={{ marginTop: 10 }}>{statusEl}</div>
        </div>
        <div style={{ textAlign: "right", flex: "none" }}>
          <div className={"t-hero c-" + st} style={{ fontSize: 26, lineHeight: 1 }}>{med.daysRemaining}</div>
          <div className="t-caption">days left</div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}><SupplyBar days={med.daysRemaining} total={med.totalDays} showLabel={false} /></div>
    </button>
  );
}

// ---- Next-action (context aware) ----
function nextActionFor(state) {
  const pending = state.meds.find((m) => m.todayStatus === "pending");
  if (pending) return { kind: "confirm", med: pending };
  if (state.delivery.active) return { kind: "delivery" };
  return { kind: "done" };
}

function NextAction({ state, go, variant }) {
  const a = nextActionFor(state);
  if (a.kind === "confirm") {
    return (
      <div className="card-tint card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="pill-tile" style={{ background: "var(--surface)", color: "var(--primary)" }}>{I("droplet", { size: 22 })}</div>
          <div style={{ flex: 1 }}>
            <div className="t-title">Confirm today's dose</div>
            <div className="t-secondary">{a.med.name} {a.med.strength} · {a.med.form}</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => go("dose", a.med.id)}>{I("check", { size: 20 })} I've taken this dose</button>
      </div>
    );
  }
  if (a.kind === "delivery") {
    const d = state.delivery.active;
    return (
      <button className="card-tint card-pad screen-in" onClick={() => go("delivery")}
        style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
        <div className="pill-tile" style={{ background: "var(--surface)", color: "var(--primary)" }}>{I("truck", { size: 22 })}</div>
        <div style={{ flex: 1 }}>
          <div className="t-title">Refill dispatched</div>
          <div className="t-secondary">{d.med} arriving {d.eta}</div>
        </div>
        {I("chevronR", { size: 20, style: { color: "var(--text-3)" } })}
      </button>
    );
  }
  return (
    <div className="card-tint card-pad" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div className="pill-tile" style={{ background: "var(--surface)", color: "var(--primary)" }}>{I("check", { size: 22 })}</div>
      <div><div className="t-title">All doses confirmed today</div><div className="t-secondary">Lovely. See you tomorrow.</div></div>
    </div>
  );
}

// ---------- HERO B — unified status card ----------
function StatusHero({ state, go }) {
  const done = state.meds.filter((m) => m.todayStatus === "taken").length;
  const total = state.meds.length;
  const lowest = [...state.meds].sort((a, b) => a.daysRemaining - b.daysRemaining)[0];
  const lst = MT.supplyStatus(lowest.daysRemaining);
  const d = state.delivery.active;
  return (
    <div className="card-tint card-pad" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <DoseRing done={done} total={total} />
        <div style={{ flex: 1 }}>
          <div className="t-title">Today's doses</div>
          <div className="t-secondary">{done} confirmed · {total - done} remaining</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => go("dose", state.meds.find((m) => m.todayStatus === "pending")?.id)}>Confirm</button>
      </div>
      <div className="hr" style={{ background: "var(--primary-tint-2)" }} />
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div className="t-caption">Lowest supply</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 3 }}>
            <span className={"t-hero c-" + lst} style={{ fontSize: 22 }}>{lowest.daysRemaining}d</span>
            <span className="t-secondary">{lowest.name}</span>
          </div>
        </div>
        <div style={{ width: 1, background: "var(--primary-tint-2)" }} />
        <button onClick={() => go("delivery")} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <div className="t-caption">Next refill</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            {I("truck", { size: 18, style: { color: "var(--primary)" } })}
            <span className="t-body t-med" style={{ color: "var(--text)" }}>{d ? "Tomorrow" : "—"}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// ---------- HERO C — triage tiles ----------
function TriageTiles({ state, go }) {
  const done = state.meds.filter((m) => m.todayStatus === "taken").length;
  const total = state.meds.length;
  const lowest = [...state.meds].sort((a, b) => a.daysRemaining - b.daysRemaining)[0];
  const lst = MT.supplyStatus(lowest.daysRemaining);
  const pending = state.meds.find((m) => m.todayStatus === "pending");
  const Tile = ({ onClick, children }) => (
    <button onClick={onClick} className="card" style={{ flex: 1, padding: "14px 13px", textAlign: "left", cursor: "pointer", background: "var(--surface)", display: "flex", flexDirection: "column", gap: 9, minWidth: 0 }}>{children}</button>
  );
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <Tile onClick={() => pending && go("dose", pending.id)}>
        <DoseRing done={done} total={total} size={38} stroke={5} />
        <div><div className="t-caption">Today's dose</div><div className="t-body t-med" style={{ color: pending ? "var(--amber-text)" : "var(--primary)" }}>{pending ? "1 to take" : "Done"}</div></div>
      </Tile>
      <Tile onClick={() => go("med", lowest.id)}>
        {I("droplet", { size: 22, style: { color: "var(--" + (lst === "healthy" ? "primary" : lst === "low" ? "amber" : "coral") + ")" } })}
        <div><div className="t-caption">Lowest supply</div><div className={"t-body t-med c-" + lst}>{lowest.daysRemaining} days</div></div>
      </Tile>
      <Tile onClick={() => go("delivery")}>
        {I("truck", { size: 22, style: { color: "var(--primary)" } })}
        <div><div className="t-caption">Next refill</div><div className="t-body t-med" style={{ color: "var(--text)" }}>Tomorrow</div></div>
      </Tile>
    </div>
  );
}

function HomeScreen({ state, go, dir }) {
  return (
    <div className="mt-scroll screen-in" key={dir}>
      <div className="mt-safe-top" />
      <Greeting state={state} go={go} />
      <div className="mt-pad" style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 24 }}>
        {dir === "A" && (
          <>
            <NextAction state={state} go={go} />
            <AdherenceCard state={state} />
          </>
        )}
        {dir === "B" && (
          <>
            <StatusHero state={state} go={go} />
            <AdherenceCard state={state} />
          </>
        )}
        {dir === "C" && (
          <>
            <TriageTiles state={state} go={go} />
            <AdherenceCard state={state} />
          </>
        )}
        <div>
          <SectionLabel>Active prescriptions</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {state.meds.map((m) => <MedCard key={m.id} med={m} go={go} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, MedCard, AdherenceCard, NextAction, nextActionFor, DoseRing });
