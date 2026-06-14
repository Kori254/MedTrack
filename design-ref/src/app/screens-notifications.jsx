// MedTrack — Notifications. Chronological, distinct accent per type.
function NotificationsScreen({ state, back, actions, go }) {
  const NoteIcon = { dose: "droplet", refill: "refresh", delivery: "truck", facility: "message" };
  const grouped = state.notifications.reduce((a, n) => { (a[n.when] = a[n.when] || []).push(n); return a; }, {});
  return (
    <div className="mt-scroll">
      <div className="mt-safe-top" />
      <TopBar title="Notifications" onBack={back}
        trailing={<button className="btn-text" style={{ padding: 0, fontSize: 12 }} onClick={actions.markAllRead}>Read all</button>} />
      <div className="mt-pad" style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 30 }}>
        {Object.entries(grouped).map(([when, items]) => (
          <div key={when}>
            <SectionLabel>{when}</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((n) => (
                <button key={n.id} onClick={() => { if (n.type === "delivery") go("delivery"); else if (n.type === "dose") go("home"); }}
                  className="card card-pad" style={{ width: "100%", textAlign: "left", cursor: "pointer", background: n.unread ? "var(--surface)" : "var(--surface)", display: "flex", gap: 13, alignItems: "flex-start", opacity: n.unread ? 1 : 0.82 }}>
                  <div className={"note-ic note-" + n.type}>{I(NoteIcon[n.type], { size: 20 })}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="t-body t-med" style={{ flex: 1 }}>{n.title}</span>
                      {n.unread && <span className="status-dot s-healthy" style={{ background: "var(--primary)" }} />}
                    </div>
                    <div className="t-secondary" style={{ marginTop: 2 }}>{n.body}</div>
                    <div className="t-caption" style={{ marginTop: 6 }}>{n.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
window.NotificationsScreen = NotificationsScreen;
