// MedTrack — app shell: navigation, tab bar, theme, state mutations, review panel.
const { useState: useS, useEffect: useE, useMemo } = React;

const clone = (o) => JSON.parse(JSON.stringify(o));

const TABS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "meds", label: "Meds", icon: "capsule" },
  { id: "delivery", label: "Delivery", icon: "truck" },
  { id: "profile", label: "Profile", icon: "user" },
];

function TabBar({ tab, go, unread }) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button key={t.id} className={"tab" + (tab === t.id ? " active" : "")} onClick={() => go(t.id)}>
          {I(t.icon, { size: 24 })}
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

// Fallback for screens not yet wired
function Stub({ name, onBack }) {
  return (
    <div className="mt-scroll"><div className="mt-safe-top" />
      <TopBar title={name} onBack={onBack} />
      <div className="mt-pad" style={{ paddingTop: 40, textAlign: "center", color: "var(--text-3)" }}>Screen in progress</div>
    </div>
  );
}

function App() {
  const [state, setState] = useS(() => clone(MT.INITIAL));
  const [theme, setTheme] = useS("light");
  const [dir, setDir] = useS("A");
  const [stack, setStack] = useS([{ name: "home" }]);
  const view = stack[stack.length - 1];
  const tab = ["home", "meds", "delivery", "profile"].includes(view.name) ? view.name : view._tab || "home";
  const unread = state.notifications.filter((n) => n.unread).length;

  // navigation
  const go = (name, param) => {
    if (["home", "meds", "delivery", "profile"].includes(name)) setStack([{ name }]);
    else setStack((s) => [...s, { name, param, _tab: tab }]);
  };
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const reset = (name) => setStack([{ name }]);

  // mutations
  const actions = {
    confirmDose(medId) {
      setState((p) => {
        const n = clone(p);
        const m = n.meds.find((x) => x.id === medId);
        if (m) { m.todayStatus = "taken"; m.takenAt = "8:12 AM"; }
        const ti = n.week.findIndex((w) => w.s === "today");
        if (ti >= 0) n.week[ti].s = "taken";
        n.adherence.message = "You're on track this week";
        n.notifications = n.notifications.map((x) => (x.type === "dose" && x.unread ? { ...x, unread: false } : x));
        return n;
      });
    },
    skipDose(medId, reason) {
      setState((p) => {
        const n = clone(p);
        const m = n.meds.find((x) => x.id === medId);
        if (m) { m.todayStatus = "missed"; m.skipReason = reason; }
        const ti = n.week.findIndex((w) => w.s === "today");
        if (ti >= 0) n.week[ti].s = "missed";
        n.adherence.message = "1 dose skipped today";
        return n;
      });
    },
    markAllRead() { setState((p) => ({ ...p, notifications: p.notifications.map((x) => ({ ...x, unread: false })) })); },
    setPatient(patch) { setState((p) => ({ ...p, patient: { ...p.patient, ...patch } })); },
    addMed(med) { setState((p) => ({ ...p, meds: [...p.meds, med] })); },
  };

  const screenProps = { state, go, back, actions, dir };

  function render() {
    switch (view.name) {
      case "home": return <HomeScreen {...screenProps} />;
      case "meds": return window.MedsScreen ? <MedsScreen {...screenProps} /> : <Stub name="Medications" onBack={() => go("home")} />;
      case "delivery": return window.DeliveryScreen ? <DeliveryScreen {...screenProps} /> : <Stub name="Delivery" onBack={() => go("home")} />;
      case "profile": return window.ProfileScreen ? <ProfileScreen {...screenProps} reset={reset} setTheme={setTheme} theme={theme} /> : <Stub name="Profile" onBack={() => go("home")} />;
      case "med": return window.MedDetailScreen ? <MedDetailScreen {...screenProps} medId={view.param} /> : <Stub name="Medication" onBack={back} />;
      case "dose": return window.DoseScreen ? <DoseScreen {...screenProps} medId={view.param} /> : <Stub name="Confirm dose" onBack={back} />;
      case "notifications": return window.NotificationsScreen ? <NotificationsScreen {...screenProps} /> : <Stub name="Notifications" onBack={back} />;
      case "onboarding": return window.Onboarding ? <Onboarding {...screenProps} onDone={() => reset("home")} /> : <Stub name="Onboarding" onBack={() => go("home")} />;
      default: return <HomeScreen {...screenProps} />;
    }
  }

  const showTabs = ["home", "meds", "delivery", "profile"].includes(view.name);
  const fullBleed = view.name === "dose" || view.name === "onboarding";

  return (
    <div className="stage">
      <ReviewPanel {...{ theme, setTheme, dir, setDir, view, go, reset }} />
      <div className="device-wrap">
        <IOSDevice dark={theme === "dark"} width={390} height={844}>
          <div className="mt-app" data-theme={theme}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }} key={view.name + (view.param || "")}>
              {render()}
            </div>
            {showTabs && !fullBleed && <TabBar tab={tab} go={go} unread={unread} />}
          </div>
        </IOSDevice>
      </div>
    </div>
  );
}

// ---- Review panel (reviewer aid, sits beside the phone) ----
function ReviewPanel({ theme, setTheme, dir, setDir, view, go, reset }) {
  const jumps = [
    ["Onboarding", () => reset("onboarding")],
    ["Home", () => reset("home")],
    ["Medications", () => reset("meds")],
    ["Med detail", () => go("med", "dtg")],
    ["Confirm dose", () => go("dose", "dtg")],
    ["Delivery", () => reset("delivery")],
    ["Notifications", () => go("notifications")],
    ["Profile", () => reset("profile")],
  ];
  const cur = view.name;
  return (
    <aside className="rev">
      <div className="rev-brand"><span className="rev-logo">✚</span><div><div className="rev-name">MedTrack</div><div className="rev-sub">Patient app · prototype</div></div></div>

      <div className="rev-block">
        <div className="rev-h">Appearance</div>
        <div className="rev-seg">
          <button className={theme === "light" ? "on" : ""} onClick={() => setTheme("light")}>☀ Light</button>
          <button className={theme === "dark" ? "on" : ""} onClick={() => setTheme("dark")}>☾ Dark</button>
        </div>
      </div>

      <div className="rev-block">
        <div className="rev-h">Home layout <span className="rev-tag">3 directions</span></div>
        <div className="rev-seg rev-seg-3">
          {[["A", "Stacked"], ["B", "Status hero"], ["C", "Triage tiles"]].map(([k, lbl]) => (
            <button key={k} className={dir === k ? "on" : ""} onClick={() => { setDir(k); reset("home"); }}>{lbl}</button>
          ))}
        </div>
        <p className="rev-note">{dir === "A" ? "Single-column priority — the one next action leads." : dir === "B" ? "One unified card answers all three questions at a glance." : "Three triage tiles: dose · supply · refill."}</p>
      </div>

      <div className="rev-block">
        <div className="rev-h">Jump to screen</div>
        <div className="rev-jumps">
          {jumps.map(([lbl, fn]) => (
            <button key={lbl} className={"rev-jump" + (cur === lbl.toLowerCase().split(" ")[0] ? " active" : "")} onClick={fn}>{lbl}</button>
          ))}
        </div>
      </div>
      <p className="rev-foot">Tap through the phone like a real device — the bottom tabs and every card are live. Confirming a dose updates the streak and next-action card.</p>
    </aside>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
