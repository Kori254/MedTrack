// MedTrack Clinician — seed data + domain helpers. "Today" = Sat 27 Jun 2026.
// Mirrors the patient app's domain; adds prescriber, roster, formulary, refill queue.
// Ported from the Claude Design clinician prototype.

export const CLIN = {
  name: 'Dr. Achieng Omondi',
  short: 'Dr. Omondi',
  initials: 'AO',
  role: 'Infectious Disease',
  reg: 'MPDB 28114',
  facility: 'Kenyatta National Hospital',
};

// supply status mirrors patient app: >14 healthy · 7–14 low · <7 critical
export function supplyStatusCL(days) {
  if (days < 7) return 'critical';
  if (days <= 14) return 'low';
  return 'healthy';
}

// ---- Patient roster ----------------------------------------------------------
export const ROSTER = [
  {
    id: 'amani', name: 'Amani Mwangi', initials: 'AM', age: 37, sex: 'F',
    mrn: 'KNH-04412', dx: 'HIV · Chronic myeloid leukaemia',
    adherence: 92, flag: 'refill', lastVisit: '30 May 2026',
    appt: '09:30', reason: 'ARV review + oncology follow-up',
    allergies: [],
    meds: [
      { name: 'Dolutegravir', strength: '50 mg', form: '1 tablet', scheduleLabel: 'Every morning · 8:00 AM', daysRemaining: 9, totalDays: 30, purpose: 'HIV antiretroviral', drugId: 'dtg' },
      { name: 'Cotrimoxazole', strength: '960 mg', form: '1 tablet', scheduleLabel: 'Every morning · 8:00 AM', daysRemaining: 22, totalDays: 30, purpose: 'Infection prophylaxis', drugId: 'ctx' },
      { name: 'Imatinib', strength: '400 mg', form: '1 tablet', scheduleLabel: 'Every evening · 9:00 PM', daysRemaining: 4, totalDays: 30, purpose: 'Oral chemotherapy · CML', drugId: 'ima' },
    ],
    notes: 'Viral load undetectable (Apr). CML in major molecular response. Continue current regimen.',
  },
  {
    id: 'david', name: 'David Otieno', initials: 'DO', age: 54, sex: 'M',
    mrn: 'KNH-03987', dx: 'Type 2 diabetes · Hypertension',
    adherence: 76, flag: 'low', lastVisit: '12 Jun 2026',
    appt: '10:00', reason: 'Glycaemic & BP review',
    allergies: ['Penicillin'],
    meds: [
      { name: 'Metformin', strength: '1000 mg', form: '1 tablet', scheduleLabel: 'Twice daily · 8 AM & 8 PM', daysRemaining: 11, totalDays: 30, purpose: 'Glycaemic control', drugId: 'met' },
      { name: 'Amlodipine', strength: '10 mg', form: '1 tablet', scheduleLabel: 'Every morning · 8:00 AM', daysRemaining: 12, totalDays: 30, purpose: 'Blood pressure', drugId: 'aml' },
    ],
    notes: 'HbA1c 8.1% — uptrending. Reinforce adherence; consider add-on if no improvement.',
  },
  {
    id: 'faith', name: 'Faith Njeri', initials: 'FN', age: 29, sex: 'F',
    mrn: 'KNH-05120', dx: 'Pulmonary TB · continuation phase',
    adherence: 96, flag: 'stable', lastVisit: '20 Jun 2026',
    appt: '10:30', reason: 'DOT continuation review',
    allergies: [],
    meds: [
      { name: 'Rifampicin / Isoniazid', strength: '150/75 mg', form: '3 tablets', scheduleLabel: 'Every morning · fasting', daysRemaining: 26, totalDays: 30, purpose: 'Anti-tuberculous', drugId: 'rhz' },
      { name: 'Pyridoxine', strength: '25 mg', form: '1 tablet', scheduleLabel: 'Every morning', daysRemaining: 26, totalDays: 30, purpose: 'Neuropathy prophylaxis', drugId: 'pyr' },
    ],
    notes: 'Month 4 of 6. Sputum negative. On track to complete therapy in August.',
  },
  {
    id: 'samuel', name: 'Samuel Kiprop', initials: 'SK', age: 61, sex: 'M',
    mrn: 'KNH-02233', dx: 'Heart failure · reduced EF',
    adherence: 61, flag: 'missed', lastVisit: '2 Jun 2026',
    appt: '11:15', reason: 'Decompensation review',
    allergies: [],
    meds: [
      { name: 'Furosemide', strength: '40 mg', form: '1 tablet', scheduleLabel: 'Every morning · 8:00 AM', daysRemaining: 6, totalDays: 30, purpose: 'Diuretic', drugId: 'fur' },
      { name: 'Enalapril', strength: '10 mg', form: '1 tablet', scheduleLabel: 'Twice daily', daysRemaining: 8, totalDays: 30, purpose: 'Afterload reduction', drugId: 'ena' },
      { name: 'Carvedilol', strength: '6.25 mg', form: '1 tablet', scheduleLabel: 'Twice daily', daysRemaining: 8, totalDays: 30, purpose: 'Beta-blockade', drugId: 'car' },
    ],
    notes: 'Missed 9 doses this month — weight up 2 kg. Counselled; flag for home visit.',
  },
  {
    id: 'grace', name: 'Grace Achieng', initials: 'GA', age: 45, sex: 'F',
    mrn: 'KNH-04790', dx: 'Primary hypothyroidism',
    adherence: 88, flag: 'refill', lastVisit: '28 May 2026',
    appt: null, reason: 'Refill request',
    allergies: [],
    meds: [
      { name: 'Levothyroxine', strength: '50 mcg', form: '1 tablet', scheduleLabel: 'Every morning · fasting', daysRemaining: 13, totalDays: 30, purpose: 'Thyroid replacement', drugId: 'lev' },
    ],
    notes: 'TSH normalised on current dose. Annual review due August.',
  },
  {
    id: 'brian', name: 'Brian Mutua', initials: 'BM', age: 33, sex: 'M',
    mrn: 'KNH-05344', dx: 'Focal epilepsy',
    adherence: 90, flag: 'stable', lastVisit: '8 Jun 2026',
    appt: null, reason: 'Seizure-free review',
    allergies: ['Sulfonamides'],
    meds: [
      { name: 'Carbamazepine', strength: '200 mg', form: '1 tablet', scheduleLabel: 'Twice daily', daysRemaining: 19, totalDays: 30, purpose: 'Anticonvulsant', drugId: 'cbz' },
    ],
    notes: 'Seizure-free 11 months. Maintain dose; recheck levels at next visit.',
  },
];

export const FLAG = {
  refill:  { label: 'Refill pending', cls: 'low' },
  low:     { label: 'Supply low',     cls: 'low' },
  missed:  { label: 'Missed doses',   cls: 'critical' },
  stable:  { label: 'Stable',         cls: 'healthy' },
};

// ---- Formulary ---------------------------------------------------------------
// interactsWith / allergyFlag keyed by patient's existing drugId or allergy class.
export const FORMULARY = [
  { id: 'dtg', name: 'Dolutegravir', brand: 'Tivicay', cls: 'Antiretroviral · INSTI', strengths: ['50 mg'], route: 'Oral', freq: 'od', form: 'tablet' },
  { id: 'ctx', name: 'Cotrimoxazole', brand: 'Septrin', cls: 'Antibacterial · prophylaxis', strengths: ['480 mg', '960 mg'], route: 'Oral', freq: 'od', form: 'tablet', allergyFlag: 'Sulfonamides' },
  { id: 'ima', name: 'Imatinib', brand: 'Glivec', cls: 'Antineoplastic · TKI', strengths: ['100 mg', '400 mg'], route: 'Oral', freq: 'od', form: 'tablet' },
  { id: 'rif', name: 'Rifampicin', brand: 'Rifadin', cls: 'Antimycobacterial', strengths: ['150 mg', '300 mg', '600 mg'], route: 'Oral', freq: 'od', form: 'capsule',
    interactsWith: { dtg: { sev: 'warn', text: 'Rifampicin induces UGT1A1 — reduces dolutegravir exposure. Increase DTG to 50 mg twice daily for the duration of co-therapy.' } } },
  { id: 'met', name: 'Metformin', brand: 'Glucophage', cls: 'Biguanide · antidiabetic', strengths: ['500 mg', '850 mg', '1000 mg'], route: 'Oral', freq: 'bd', form: 'tablet' },
  { id: 'aml', name: 'Amlodipine', brand: 'Norvasc', cls: 'Calcium-channel blocker', strengths: ['5 mg', '10 mg'], route: 'Oral', freq: 'od', form: 'tablet' },
  { id: 'ena', name: 'Enalapril', brand: 'Renitec', cls: 'ACE inhibitor', strengths: ['5 mg', '10 mg', '20 mg'], route: 'Oral', freq: 'bd', form: 'tablet' },
  { id: 'ato', name: 'Atorvastatin', brand: 'Lipitor', cls: 'Statin · lipid-lowering', strengths: ['10 mg', '20 mg', '40 mg'], route: 'Oral', freq: 'nocte', form: 'tablet',
    interactsWith: { ima: { sev: 'warn', text: 'Imatinib inhibits CYP3A4 — may raise atorvastatin levels and myopathy risk. Start at the lowest dose and monitor.' } } },
  { id: 'lev', name: 'Levothyroxine', brand: 'Eltroxin', cls: 'Thyroid hormone', strengths: ['25 mcg', '50 mcg', '100 mcg'], route: 'Oral', freq: 'od', form: 'tablet' },
  { id: 'amx', name: 'Amoxicillin', brand: 'Amoxil', cls: 'Penicillin antibiotic', strengths: ['250 mg', '500 mg'], route: 'Oral', freq: 'tds', form: 'capsule', allergyFlag: 'Penicillin' },
  { id: 'cbz', name: 'Carbamazepine', brand: 'Tegretol', cls: 'Anticonvulsant', strengths: ['100 mg', '200 mg'], route: 'Oral', freq: 'bd', form: 'tablet' },
  { id: 'fur', name: 'Furosemide', brand: 'Lasix', cls: 'Loop diuretic', strengths: ['20 mg', '40 mg'], route: 'Oral', freq: 'od', form: 'tablet' },
  { id: 'pcm', name: 'Paracetamol', brand: 'Panadol', cls: 'Analgesic · antipyretic', strengths: ['500 mg', '1 g'], route: 'Oral', freq: 'qds', form: 'tablet' },
  { id: 'azt', name: 'Azithromycin', brand: 'Zithromax', cls: 'Macrolide antibiotic', strengths: ['250 mg', '500 mg'], route: 'Oral', freq: 'od', form: 'tablet' },
];

export const FREQ = {
  od:    { label: 'Once daily', sig: 'OD', perDay: 1 },
  bd:    { label: 'Twice daily', sig: 'BD', perDay: 2 },
  tds:   { label: 'Three times daily', sig: 'TDS', perDay: 3 },
  qds:   { label: 'Four times daily', sig: 'QDS', perDay: 4 },
  nocte: { label: 'At night', sig: 'nocte', perDay: 1 },
};
export const ROUTES = ['Oral', 'IV', 'IM', 'Subcutaneous', 'Topical'];
export const DURATIONS = [7, 14, 28, 30, 90];

// ---- Refill approval queue ---------------------------------------------------
export const REFILLS = [
  { id: 'r1', patientId: 'amani', med: 'Imatinib', strength: '400 mg', qty: '30 tablets', supplyDays: 4, deliver: 'Auto-deliver · home', reason: 'Auto-flagged — critical supply', when: 'Today · 07:12', priority: 'high' },
  { id: 'r2', patientId: 'grace', med: 'Levothyroxine', strength: '50 mcg', qty: '30 tablets', supplyDays: 13, deliver: 'Pickup · KNH pharmacy', reason: 'Patient requested', when: 'Today · 08:40', priority: 'normal' },
  { id: 'r3', patientId: 'david', med: 'Metformin', strength: '1000 mg', qty: '60 tablets', supplyDays: 11, deliver: 'Auto-deliver · home', reason: 'Patient requested', when: 'Yesterday · 18:05', priority: 'normal' },
];

// helpers
export function patientById(id) { return ROSTER.find((p) => p.id === id); }
export function drugById(id) { return FORMULARY.find((d) => d.id === id); }

// returns {sev, text} interaction/allergy alerts for prescribing `drug` to `patient`
export function safetyAlerts(drug, patient) {
  const out = [];
  if (!drug || !patient) return out;
  if (drug.allergyFlag && patient.allergies.includes(drug.allergyFlag))
    out.push({ sev: 'critical', text: `Documented ${drug.allergyFlag} allergy. ${drug.name} is contraindicated — confirm before overriding.` });
  if (drug.interactsWith) {
    patient.meds.forEach((m) => {
      const hit = drug.interactsWith[m.drugId];
      if (hit) out.push({ sev: hit.sev, text: hit.text });
    });
  }
  return out;
}
