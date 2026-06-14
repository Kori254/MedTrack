import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import * as db from '../lib/db';
import { initials } from './data';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const { theme, isDark, actions } = useApp();
  const [adminProfile, setAdminProfile] = useState(null);
  const [clinicians, setClinicians] = useState([]);
  const [patients, setPatients] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, docs, pts, facs] = await Promise.all([
        db.getAdminProfile(),
        db.getAllClinicians(),
        db.getNetworkPatients(),
        db.getFacilities(),
      ]);
      if (profile) {
        setAdminProfile({ ...profile, initials: initials(profile.name || ''), hue: 'teal' });
      }
      setClinicians(docs.map((d) => ({ ...d, initials: initials(d.name || ''), hue: d.hue || 'teal' })));
      setPatients(pts.map((p) => ({ ...p, initials: initials(p.name || ''), hue: p.hue || 'slate' })));
      setFacilities(facs);
    } catch (e) {
      console.warn('AdminContext loadAll error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  async function createClinician(fields) {
    const doc = await db.adminCreateClinician(fields);
    const mapped = { ...doc, initials: initials(doc.name || ''), hue: 'teal', status: 'invited' };
    setClinicians((prev) => [...prev, mapped]);
    return mapped;
  }

  async function setClinicianStatus(clinicianId, status) {
    await db.adminSetClinicianStatus(clinicianId, status);
    setClinicians((prev) => prev.map((d) => d.id === clinicianId ? { ...d, status } : d));
  }

  async function assignPatient(patientId, doctorId) {
    await db.adminAssignPatient(patientId, doctorId);
    setPatients((prev) => prev.map((p) => p.id === patientId ? { ...p, doctor_id: doctorId } : p));
  }

  async function bulkAssignPatients(doctorId, patientIds) {
    const existing = patients.filter((p) => p.doctor_id === doctorId).map((p) => p.id);
    const toRemove = existing.filter((id) => !patientIds.includes(id));
    const toAdd    = patientIds.filter((id) => !existing.includes(id));

    await Promise.all([
      ...toAdd.map((id) => db.adminAssignPatient(id, doctorId)),
      ...toRemove.map((id) => db.adminAssignPatient(id, null)),
    ]);
    setPatients((prev) => prev.map((p) => {
      if (toAdd.includes(p.id))    return { ...p, doctor_id: doctorId };
      if (toRemove.includes(p.id)) return { ...p, doctor_id: null };
      return p;
    }));
  }

  const value = {
    theme,
    isDark,
    setIsDark: (v) => { if (v !== isDark) actions.toggleTheme(); },
    adminProfile,
    clinicians,
    patients,
    facilities,
    loading,
    createClinician,
    setClinicianStatus,
    assignPatient,
    bulkAssignPatients,
    signOut: actions.logout,
    reload: loadAll,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminApp() { return useContext(AdminContext); }
