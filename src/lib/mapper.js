// Converts Supabase row shapes → the app's internal state shape.

export function mapProfile(row) {
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    dob: row.dob ?? '',
    phone: row.phone ?? '',
    address: row.address ?? '',
    facility: row.facility?.name ?? '',
    facilityId: row.facility_id ?? null,
    emergency: row.emergency_contact ?? '',
    emergencyPhone: row.emergency_phone ?? '',
    language: row.language ?? 'English',
    notify: row.notify_preference ?? 'both',
  };
}

export function mapMedication(row, todayLogs) {
  const today = new Date().toISOString().split('T')[0];
  const log = todayLogs?.find((l) => l.medication_id === row.id);

  let todayStatus = 'upcoming';
  let takenAt = null;
  let skipReason = null;

  if (log) {
    todayStatus = log.status;
    takenAt = log.taken_at
      ? new Date(log.taken_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : null;
    skipReason = log.skip_reason ?? null;
  } else {
    // Determine pending vs upcoming based on schedule time
    const [h, m] = (row.schedule_time ?? '08:00').split(':').map(Number);
    const scheduled = new Date();
    scheduled.setHours(h, m, 0, 0);
    todayStatus = new Date() >= scheduled ? 'pending' : 'upcoming';
  }

  const [h, m] = (row.schedule_time ?? '08:00').split(':').map(Number);
  const schedDate = new Date();
  schedDate.setHours(h, m, 0, 0);
  const diff = schedDate - new Date();
  let nextDoseIn = 'due now';
  if (diff > 0) {
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    nextDoseIn = hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m`;
  } else if (todayStatus === 'taken') {
    nextDoseIn = 'tomorrow 8:00 AM';
  }

  return {
    id: row.id,
    name: row.name,
    strength: row.strength,
    form: row.form ?? '1 tablet',
    purpose: row.purpose ?? '',
    scheduleTime: row.schedule_time,
    scheduleLabel: row.schedule_label,
    totalDays: row.total_days,
    daysRemaining: row.days_remaining,
    facility: row.facility?.name ?? '',
    clinician: row.clinician ?? '',
    lastPickup: row.last_pickup ?? '',
    refillState: row.refill_state === 'dispatched' ? 'dispatched' : null,
    todayStatus,
    takenAt,
    skipReason,
    nextDoseIn,
    missedDays: [],
    refills: [],
  };
}

export function mapDelivery(active, past) {
  const mapStatus = (s) => {
    if (s === 'in_transit') return 'in_transit';
    if (s === 'delivered') return 'Delivered';
    if (s === 'failed') return 'Failed';
    return s;
  };

  return {
    active: active ? {
      med: active.medication
        ? `${active.medication.name} ${active.medication.strength}`
        : 'Medication',
      step: active.step ?? 0,
      eta: active.eta ?? '',
      window: active.delivery_window ?? '',
      agent: active.agent_name ?? '',
      dispatchedOn: active.dispatched_on ?? '',
      ref: active.ref_number ?? '',
      quantity: active.quantity ?? '',
    } : null,
    past: (past ?? []).map((p) => ({
      med: p.medication
        ? `${p.medication.name} ${p.medication.strength}`
        : 'Medication',
      date: p.dispatched_on
        ? new Date(p.dispatched_on).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '',
      status: p.status === 'delivered' ? 'Delivered' : 'Failed',
      note: p.fail_reason ?? 'Rescheduled',
    })),
  };
}

export function mapNotifications(rows) {
  const todayStr = new Date().toDateString();
  const yesterStr = new Date(Date.now() - 86400000).toDateString();

  return (rows ?? []).map((n) => {
    const d = new Date(n.created_at);
    const ds = d.toDateString();
    const when = ds === todayStr ? 'Today' : ds === yesterStr ? 'Yesterday' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return { id: n.id, type: n.type, title: n.title, body: n.body, unread: n.unread, when, time };
  });
}

export function mapRealPatient(profile, meds = [], adherence = 100) {
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  const dob = profile.dob;
  const age = dob ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000)) : null;

  let flag = 'stable';
  if (adherence < 70) flag = 'missed';
  else if (adherence < 85) flag = 'low';

  return {
    id: profile.id,
    name: `${firstName} ${lastName}`.trim() || 'Unknown Patient',
    initials: `${(firstName[0] || '?').toUpperCase()}${(lastName[0] || '?').toUpperCase()}`,
    age: age || '—',
    sex: '—',
    mrn: `PT-${profile.id.slice(0, 6).toUpperCase()}`,
    dx: 'See patient records',
    adherence,
    flag,
    lastVisit: '—',
    appt: null,
    reason: '',
    allergies: [],
    meds: meds.map((m) => ({
      name: m.name,
      strength: m.strength,
      form: m.form || 'tablet',
      scheduleLabel: m.schedule_label || '',
      daysRemaining: m.days_remaining ?? m.total_days,
      totalDays: m.total_days,
      purpose: m.purpose || '',
      drugId: m.name.toLowerCase().replace(/\s+/g, '').slice(0, 3),
    })),
    notes: '',
    isReal: true,
    facilityId: profile.facility_id,
    phone: profile.phone,
  };
}

export function mapWeek(weekLogs) {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));

  const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return DAYS.map((d, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const log = weekLogs.find((l) => l.scheduled_date === dateStr);

    let s = 'future';
    if (dateStr === todayStr) s = log?.status === 'taken' ? 'taken' : log?.status === 'missed' ? 'missed' : 'today';
    else if (date < today) s = log?.status === 'taken' ? 'taken' : log?.status === 'missed' ? 'missed' : 'future';

    return { d, s };
  });
}
