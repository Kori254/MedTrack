import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { light, dark } from './theme';
import * as db from './lib/db';
import { mapProfile, mapMedication, mapDelivery, mapNotifications, mapWeek, mapRealPatient } from './lib/mapper';

const AppContext = createContext(null);

const EMPTY_STATE = {
  patient: { firstName: '', lastName: '', dob: '', phone: '', address: '', facility: '', facilityId: null, emergency: '', emergencyPhone: '', language: 'English', notify: 'both' },
  today: { dow: '', date: '', full: '' },
  adherence: { month: 100, message: "You're on track this week" },
  week: [{ d: 'M', s: 'future' }, { d: 'T', s: 'future' }, { d: 'W', s: 'future' }, { d: 'T', s: 'future' }, { d: 'F', s: 'future' }, { d: 'S', s: 'future' }, { d: 'S', s: 'future' }],
  meds: [],
  delivery: { active: null, past: [] },
  notifications: [],
};

function todayLabel() {
  const d = new Date();
  return {
    dow: d.toLocaleDateString('en-US', { weekday: 'long' }),
    date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }),
    full: d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }),
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState({ ...EMPTY_STATE, today: todayLabel() });
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'patient' | 'clinician'
  const [clinicianPatients, setClinicianPatients] = useState([]);
  const theme = isDark ? dark : light;

  // Restore session on app launch
  useEffect(() => {
    db.getSession()
      .then(async (session) => {
        if (!session?.user) return;
        const uid = session.user.id;
        const role = await db.getUserRole(uid);
        if (role === 'clinician') {
          setUserId(uid);
          setUserRole('clinician');
          setIsLoggedIn(true);
          loadClinicianData();
        } else if (role === 'patient') {
          await loadUserData(uid);
        }
      })
      .catch((e) => console.warn('Session restore error:', e));
  }, []);

  const loadUserData = useCallback(async (uid) => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      const [profile, meds, todayLogs, weekLogs, activeDelivery, pastDeliveries, notifications, monthPct] = await Promise.all([
        db.getProfile(uid),
        db.getMedications(uid),
        db.getDoseLogsRange(uid, today, today),
        db.getWeekLogs(uid),
        db.getActiveDelivery(uid),
        db.getPastDeliveries(uid),
        db.getNotifications(uid),
        db.getMonthAdherence(uid),
      ]);

      const week = mapWeek(weekLogs);
      const missedThisWeek = week.filter((d) => d.s === 'missed').length;
      const adherenceMsg = missedThisWeek === 0
        ? "You're on track this week"
        : `${missedThisWeek} dose${missedThisWeek > 1 ? 's' : ''} missed this week`;

      setState({
        patient: mapProfile(profile),
        today: todayLabel(),
        adherence: { month: monthPct, message: adherenceMsg },
        week,
        meds: meds.map((m) => mapMedication(m, todayLogs)),
        delivery: mapDelivery(activeDelivery, pastDeliveries),
        notifications: mapNotifications(notifications),
      });

      setUserId(uid);
      setUserRole('patient');
      setIsLoggedIn(true);
    } catch (e) {
      console.error('loadUserData error', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadClinicianData = useCallback(async () => {
    try {
      const profiles = await db.getAllPatientProfiles();
      const patients = await Promise.all(
        profiles.map(async (profile) => {
          const [meds, adherence] = await Promise.all([
            db.getPatientMedicationsClinic(profile.id),
            db.getMonthAdherence(profile.id),
          ]);
          return mapRealPatient(profile, meds, adherence);
        })
      );
      setClinicianPatients(patients);
    } catch (e) {
      console.warn('loadClinicianData error', e);
    }
  }, []);

  const actions = {
    // Called by LoginScreen after OTP verified — checks profile exists
    async loginWithPhone(phone) {
      const session = await db.demoSignIn(phone);
      const uid = session.user.id;
      const exists = await db.profileExists(uid);
      if (!exists) throw new Error('NO_PROFILE');
      await loadUserData(uid);
    },

    // Called by Signup → Onboarding path — just signs in, no profile check
    async signUpWithPhone(phone) {
      const session = await db.demoSignIn(phone);
      setUserId(session.user.id);
      // Don't set isLoggedIn yet — onboarding must complete first
    },

    async clinicianLogin(email, password) {
      const session = await db.clinicianSignIn(email, password);
      const uid = session.user.id;
      const role = await db.getUserRole(uid);
      if (role !== 'clinician') throw new Error('NOT_CLINICIAN');
      setUserId(uid);
      setUserRole('clinician');
      setIsLoggedIn(true);
      loadClinicianData();
    },

    async savePrescription(patientId, rx, drug, facilityId) {
      const FREQ_LABEL = { od: 'Once daily', bd: 'Twice daily', tds: 'Three times daily', qds: 'Four times daily', nocte: 'At night' };
      await db.savePrescription({
        patientId,
        name: drug.name,
        strength: rx.strength,
        form: drug.form,
        purpose: rx.indication || drug.cls,
        freq: rx.freq,
        scheduleLabel: `${FREQ_LABEL[rx.freq] || rx.freq} · ${rx.route}`,
        totalDays: rx.duration,
        facilityId: facilityId || null,
      });
      loadClinicianData();
    },

    // Called at end of Onboarding with the filled-in profile data
    async completeOnboarding({ firstName, lastName, dob, address, facilityId, phone }) {
      if (!userId) throw new Error('No user session');
      await db.saveProfile({ userId, firstName, lastName, dob, phone, address, facilityId });
      await loadUserData(userId);
    },

    logout() {
      db.signOut();
      setIsLoggedIn(false);
      setUserId(null);
      setUserRole(null);
      setClinicianPatients([]);
      setState({ ...EMPTY_STATE, today: todayLabel() });
    },

    toggleTheme() { setIsDark((d) => !d); },

    async confirmDose(medId) {
      if (userId) {
        try { await db.confirmDose(medId, userId); } catch (e) { console.warn('confirmDose DB error', e); }
      }
      setState((p) => {
        const meds = p.meds.map((m) => m.id !== medId ? m : {
          ...m, todayStatus: 'taken',
          takenAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        });
        const wi = p.week.findIndex((w) => w.s === 'today');
        const week = wi >= 0 ? p.week.map((w, i) => i === wi ? { ...w, s: 'taken' } : w) : p.week;
        const missedCount = week.filter((d) => d.s === 'missed').length;
        return {
          ...p, meds, week,
          adherence: { ...p.adherence, message: missedCount === 0 ? "You're on track this week" : `${missedCount} dose${missedCount > 1 ? 's' : ''} missed this week` },
          notifications: p.notifications.map((n) => n.type === 'dose' && n.unread ? { ...n, unread: false } : n),
        };
      });
    },

    async skipDose(medId, reason) {
      if (userId) {
        try { await db.skipDose(medId, userId, reason); } catch (e) { console.warn('skipDose DB error', e); }
      }
      setState((p) => {
        const meds = p.meds.map((m) => m.id !== medId ? m : { ...m, todayStatus: 'missed', skipReason: reason });
        const wi = p.week.findIndex((w) => w.s === 'today');
        const week = wi >= 0 ? p.week.map((w, i) => i === wi ? { ...w, s: 'missed' } : w) : p.week;
        const missedCount = week.filter((d) => d.s === 'missed').length;
        return { ...p, meds, week, adherence: { ...p.adherence, message: `${missedCount} dose${missedCount > 1 ? 's' : ''} missed this week` } };
      });
    },

    async markAllRead() {
      if (userId) {
        try { await db.markAllNotificationsRead(userId); } catch (e) { console.warn('markAllRead DB error', e); }
      }
      setState((p) => ({ ...p, notifications: p.notifications.map((n) => ({ ...n, unread: false })) }));
    },
  };

  return (
    <AppContext.Provider value={{ state, theme, isDark, isLoggedIn, isLoading, userId, userRole, clinicianPatients, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
