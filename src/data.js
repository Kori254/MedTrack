export const INITIAL_STATE = {
  patient: {
    firstName: 'Amani',
    lastName: 'Mwangi',
    dob: '14 March 1989',
    phone: '+254 712 084 559',
    address: 'Apartment 4B, Kileleshwa, Nairobi',
    facility: 'Kenyatta National Hospital',
    emergency: 'Grace Mwangi',
    emergencyPhone: '+254 720 113 477',
    language: 'English',
    notify: 'both',
  },
  today: { dow: 'Saturday', date: '27 June', full: 'Saturday, 27 June' },
  adherence: { month: 92, message: '1 dose missed this week' },
  week: [
    { d: 'M', s: 'taken' }, { d: 'T', s: 'taken' }, { d: 'W', s: 'taken' },
    { d: 'T', s: 'missed' }, { d: 'F', s: 'taken' }, { d: 'S', s: 'today' }, { d: 'S', s: 'future' },
  ],
  meds: [
    {
      id: 'dtg', name: 'Dolutegravir', strength: '50 mg', form: '1 tablet',
      purpose: 'HIV antiretroviral', scheduleTime: '08:00', scheduleLabel: 'Every morning · 8:00 AM',
      daysRemaining: 9, totalDays: 30, todayStatus: 'pending',
      facility: 'Kenyatta National Hospital', clinician: 'Dr. A. Omondi',
      lastPickup: '28 May 2026', nextDoseIn: 'due now',
      refills: [
        { date: '28 May 2026', method: 'Delivered' },
        { date: '27 Apr 2026', method: 'Pickup' },
        { date: '28 Mar 2026', method: 'Delivered' },
      ],
      missedDays: [10],
    },
    {
      id: 'ctx', name: 'Cotrimoxazole', strength: '960 mg', form: '1 tablet',
      purpose: 'Infection prophylaxis', scheduleTime: '08:00', scheduleLabel: 'Every morning · 8:00 AM',
      daysRemaining: 22, totalDays: 30, todayStatus: 'taken', takenAt: '8:04 AM',
      facility: 'Kenyatta National Hospital', clinician: 'Dr. A. Omondi',
      lastPickup: '5 June 2026', nextDoseIn: 'tomorrow 8:00 AM',
      refills: [
        { date: '5 Jun 2026', method: 'Delivered' },
        { date: '6 May 2026', method: 'Delivered' },
        { date: '15 Apr 2026', method: 'Failed — rescheduled' },
      ],
      missedDays: [],
    },
    {
      id: 'ima', name: 'Imatinib', strength: '400 mg', form: '1 tablet',
      purpose: 'Oral chemotherapy · CML', scheduleTime: '21:00', scheduleLabel: 'Every evening · 9:00 PM',
      daysRemaining: 4, totalDays: 30, todayStatus: 'upcoming',
      facility: 'Kenyatta National Hospital', clinician: 'Dr. L. Wanjiku',
      lastPickup: '30 May 2026', nextDoseIn: 'in 6h 20m',
      refillState: 'dispatched',
      refills: [
        { date: '30 May 2026', method: 'Delivered' },
        { date: '2 May 2026', method: 'Delivered' },
        { date: '3 Apr 2026', method: 'Delivered' },
      ],
      missedDays: [4, 18],
    },
  ],
  delivery: {
    active: {
      med: 'Imatinib 400 mg',
      step: 1,
      eta: 'Tomorrow · 28 Jun',
      window: '9:00 AM – 12:00 PM',
      agent: 'Joseph K.',
      dispatchedOn: '26 Jun',
      ref: 'MT-2026-0627-IMA',
      quantity: '30 tablets · 30-day supply',
    },
    past: [
      { med: 'Dolutegravir 50 mg', date: '28 May 2026', status: 'Delivered' },
      { med: 'Imatinib 400 mg', date: '2 May 2026', status: 'Delivered' },
      { med: 'Cotrimoxazole 960 mg', date: '15 Apr 2026', status: 'Failed', note: 'Rescheduled' },
    ],
  },
  notifications: [
    { id: 'n1', type: 'dose', title: 'Time to take Dolutegravir 50 mg', body: 'Your 8:00 AM dose is ready to confirm.', when: 'Today', time: '8:00 AM', unread: true },
    { id: 'n2', type: 'delivery', title: 'Your medication is on the way', body: 'Imatinib 400 mg arriving tomorrow, 28 Jun.', when: 'Today', time: '7:12 AM', unread: true },
    { id: 'n3', type: 'dose', title: 'Dose confirmed', body: 'Cotrimoxazole 960 mg logged at 8:04 AM.', when: 'Today', time: '8:04 AM', unread: false },
    { id: 'n4', type: 'refill', title: 'Imatinib supply is running low', body: 'A refill has been dispatched to your home automatically.', when: 'Yesterday', time: '6:40 PM', unread: false },
    { id: 'n5', type: 'facility', title: 'Dr. Omondi updated your prescription', body: 'Dolutegravir dosing schedule confirmed for 8:00 AM.', when: '24 Jun', time: '11:05 AM', unread: false },
  ],
};

export const FACILITIES = [
  'Kenyatta National Hospital',
  'Mbagathi Hospital',
  'Aga Khan University Hospital, Nairobi',
  'The Nairobi Hospital',
  'Mama Lucy Kibaki Hospital',
  'Kenyatta University Referral Hospital',
  'Coptic Hospital, Nairobi',
];

export const SKIP_REASONS = ['Forgot', 'Side effects', 'Ran out', 'Other'];
