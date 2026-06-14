import { supabase } from './supabase';

// ─── Auth ─────────────────────────────────────────────────────────────────────

// Demo auth: creates/retrieves a Supabase user keyed by phone, then signs in.
// Swap the RPC call for supabase.auth.signInWithOtp({ phone }) once Twilio is set up.
export async function demoSignIn(phone) {
  const { data: rpc, error: rpcErr } = await supabase.rpc('demo_auth', { p_phone: phone });
  if (rpcErr) throw rpcErr;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: rpc.email,
    password: rpc.password,
  });
  if (error) throw error;
  return data.session;
}

// Clinician sign in: email + password created by admin.
export async function clinicianSignIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

// Returns 'patient' | 'clinician' | 'admin' | null
export async function getUserRole(userId) {
  const { data, error } = await supabase.rpc('get_user_role', { p_user_id: userId });
  if (error) throw error;
  return data;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAdminProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) return null;
  return data;
}

export async function getAllClinicians() {
  const { data, error } = await supabase
    .from('clinician_profiles')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getNetworkPatients() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, doctor_id, facility:facilities(id,name,location)')
    .order('first_name');
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id,
    name: [p.first_name, p.last_name].filter(Boolean).join(' '),
    doctor_id: p.doctor_id,
    facility_name: p.facility?.name,
    facility_city: p.facility?.location,
  }));
}

export async function getFacilities() {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function adminCreateClinician({ name, email, phone, specialty, reg, role, permissions, password }) {
  const { data, error } = await supabase.rpc('admin_create_clinician', {
    p_name: name,
    p_email: email,
    p_phone: phone || '',
    p_specialty: specialty,
    p_reg: reg,
    p_role: role,
    p_permissions: permissions,
    p_password: password,
  });
  if (error) throw error;
  return data;
}

export async function adminAssignPatient(patientId, doctorId) {
  const { error } = await supabase.rpc('admin_assign_patient', {
    p_patient_id: patientId,
    p_doctor_id: doctorId,
  });
  if (error) throw error;
}

export async function adminSetClinicianStatus(clinicianId, status) {
  const { error } = await supabase.rpc('admin_set_clinician_status', {
    p_clinician_id: clinicianId,
    p_status: status,
  });
  if (error) throw error;
}

// ─── Clinician — patient data ──────────────────────────────────────────────────

export async function getAllPatientProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, facility:facilities(id,name)')
    .order('first_name');
  if (error) throw error;
  return data ?? [];
}

export async function getPatientMedicationsClinic(patientId) {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('patient_id', patientId)
    .eq('active', true)
    .order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function savePrescription({ patientId, name, strength, form, purpose, freq, scheduleLabel, totalDays, facilityId }) {
  const freqToTime = { od: '08:00', bd: '08:00', tds: '08:00', qds: '08:00', nocte: '21:00' };
  const { data, error } = await supabase
    .from('medications')
    .insert({
      patient_id: patientId,
      name,
      strength,
      form: form || 'tablet',
      purpose: purpose || '',
      schedule_time: freqToTime[freq] || '08:00',
      schedule_label: scheduleLabel,
      total_days: totalDays,
      days_remaining: totalDays,
      facility_id: facilityId || null,
      active: true,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getClinicianProfile(userId) {
  const { data, error } = await supabase
    .from('clinician_profiles')
    .select('*, facility:facilities(id,name)')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function profileExists(userId) {
  const { data } = await supabase.rpc('profile_exists', { p_user_id: userId });
  return !!data;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, facility:facilities(id,name)')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function saveProfile({ userId, firstName, lastName, dob, phone, address, facilityId }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      dob,
      phone: phone.replace(/\s/g, ''),
      address,
      facility_id: facilityId || null,
    }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, patch) {
  const { error } = await supabase.from('profiles').update(patch).eq('id', userId);
  if (error) throw error;
}

// ─── Medications ──────────────────────────────────────────────────────────────

export async function getMedications(patientId) {
  const { data, error } = await supabase
    .from('medications')
    .select('*, facility:facilities(id,name)')
    .eq('patient_id', patientId)
    .eq('active', true)
    .order('created_at');
  if (error) throw error;
  return data;
}

export async function saveMedication(med) {
  const { data, error } = await supabase
    .from('medications')
    .upsert(med, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Dose logs ────────────────────────────────────────────────────────────────

export async function getDoseLogsRange(patientId, from, to) {
  const { data, error } = await supabase
    .from('dose_logs')
    .select('*')
    .eq('patient_id', patientId)
    .gte('scheduled_date', from)
    .lte('scheduled_date', to)
    .order('scheduled_date');
  if (error) throw error;
  return data ?? [];
}

export async function confirmDose(medicationId, patientId) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('dose_logs')
    .upsert({
      medication_id: medicationId,
      patient_id: patientId,
      scheduled_date: today,
      status: 'taken',
      taken_at: new Date().toISOString(),
    }, { onConflict: 'medication_id,scheduled_date' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function skipDose(medicationId, patientId, reason) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('dose_logs')
    .upsert({
      medication_id: medicationId,
      patient_id: patientId,
      scheduled_date: today,
      status: 'missed',
      skip_reason: reason,
    }, { onConflict: 'medication_id,scheduled_date' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Deliveries ───────────────────────────────────────────────────────────────

export async function getActiveDelivery(patientId) {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*, medication:medications(name,strength)')
    .eq('patient_id', patientId)
    .in('status', ['dispatched', 'in_transit'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPastDeliveries(patientId) {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*, medication:medications(name,strength)')
    .eq('patient_id', patientId)
    .in('status', ['delivered', 'failed'])
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(patientId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function markAllNotificationsRead(patientId) {
  const { error } = await supabase
    .from('notifications')
    .update({ unread: false })
    .eq('patient_id', patientId)
    .eq('unread', true);
  if (error) throw error;
}

// ─── Adherence ────────────────────────────────────────────────────────────────

export async function getMonthAdherence(patientId) {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const to = now.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('dose_logs')
    .select('status')
    .eq('patient_id', patientId)
    .gte('scheduled_date', from)
    .lte('scheduled_date', to)
    .in('status', ['taken', 'missed']);
  if (error) throw error;

  const total = data?.length ?? 0;
  const taken = data?.filter((d) => d.status === 'taken').length ?? 0;
  return total > 0 ? Math.round((taken / total) * 100) : 100;
}

export async function getWeekLogs(patientId) {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return getDoseLogsRange(
    patientId,
    monday.toISOString().split('T')[0],
    sunday.toISOString().split('T')[0],
  );
}
