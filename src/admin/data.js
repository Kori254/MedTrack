export const PERMISSIONS = [
  { id: 'prescribe',  name: 'Prescribe medication',   desc: 'Create and e-sign prescriptions',        icon: 'pencil' },
  { id: 'refills',    name: 'Approve refills',         desc: 'Action the refill request queue',        icon: 'inbox' },
  { id: 'viewpts',    name: 'View assigned patients',  desc: 'Open charts for their panel',            icon: 'users' },
  { id: 'allpts',     name: 'View all patients',       desc: 'Access every patient in the network',    icon: 'globe' },
  { id: 'managedoc',  name: 'Manage clinicians',       desc: 'Invite and edit other doctors',          icon: 'userPlus' },
  { id: 'facilities', name: 'Manage facilities',       desc: 'Edit clinics and assignments',           icon: 'building' },
  { id: 'export',     name: 'Export reports',          desc: 'Download patient & supply data',         icon: 'file' },
];

export const ROLES = [
  { id: 'physician',   name: 'Physician',          desc: 'Full clinical access for their panel',          grants: ['prescribe', 'refills', 'viewpts', 'export'] },
  { id: 'consultant',  name: 'Senior consultant',  desc: 'Clinical access across the facility',           grants: ['prescribe', 'refills', 'viewpts', 'allpts', 'export'] },
  { id: 'resident',    name: 'Resident',           desc: 'Supervised prescribing & charts',               grants: ['prescribe', 'viewpts'] },
  { id: 'pharmacist',  name: 'Pharmacist',         desc: 'Dispensing & refill approvals only',            grants: ['refills', 'viewpts'] },
  { id: 'facadmin',    name: 'Facility admin',     desc: 'Manage clinicians & facility settings',         grants: ['viewpts', 'managedoc', 'facilities', 'export'] },
];

export const SPECIALTIES = [
  'Infectious Disease', 'Endocrinology', 'Cardiology', 'Pulmonology · TB',
  'General Medicine', 'Neurology', 'Nephrology', 'Oncology', 'Paediatrics',
  'Obstetrics & Gynaecology', 'Psychiatry', 'Pharmacy',
];

export function roleById(id) { return ROLES.find((r) => r.id === id); }
export function permById(id) { return PERMISSIONS.find((p) => p.id === id); }

export function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function genPassword() {
  const chars = 'abcdefghjkmnpqrstuvwxy';
  let s = '';
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return 'Med' + s.charAt(0).toUpperCase() + s.slice(1) + '#' + (1000 + Math.floor(Math.random() * 9000));
}

export function initials(name) {
  const parts = name.replace(/^Dr\.?\s*/i, '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'DR';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}
