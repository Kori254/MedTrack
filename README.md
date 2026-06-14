# MedTrack

A React Native mobile app for HIV and cancer patients in Nairobi to manage their medications, track adherence, and coordinate home delivery of prescriptions. Clinicians get a companion view to manage their patient roster, approve refills, and write prescriptions.

---

## Features

### Patient App
- **Medication tracking** — view all active prescriptions with dosage, schedule, and supply levels
- **Dose logging** — confirm or skip doses with a reason; streak and adherence stats update in real time
- **Home delivery** — track active prescription deliveries with live status updates
- **Notifications** — in-app alerts for missed doses, low supply, and delivery updates
- **Onboarding** — new patients set up their profile and link to a Nairobi facility on first sign-in

### Clinician App
- **Patient roster** — today's schedule plus full patient list with adherence flags
- **Patient charts** — full medication history, adherence breakdown, and clinical notes per patient
- **Prescribe** — write new prescriptions with drug interaction and allergy checking against the patient's current medications
- **Refill queue** — approve or reject pending refill requests with one tap
- **Role-based login** — clinician accounts are created by an administrator; patients self-register

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 56 · React Native 0.85 |
| Navigation | React Navigation 7 (native stack + bottom tabs) |
| Backend | Supabase (Postgres + Auth + RLS) |
| Icons | react-native-svg (custom outline set) |
| Fonts | Plus Jakarta Sans via @expo-google-fonts |
| State | React Context (AppContext) |

---

## Project Structure

```
MedTrack/
├── App.js                        # Entry point — fonts, SafeAreaProvider, AppProvider
├── src/
│   ├── AppContext.js              # Global state, auth actions, theme toggle
│   ├── theme.js                  # Light/dark token objects
│   ├── data.js                   # Seed / fallback data
│   ├── components/
│   │   ├── Icons.js              # SVG icon set
│   │   ├── UI.js                 # Shared components (MedTile, SupplyBar, BottomSheet…)
│   │   └── DatePicker.js
│   ├── navigation/
│   │   └── AppNavigator.js       # Root navigator — branches on auth + role
│   ├── screens/                  # Patient screens
│   │   ├── LoginScreen.js        # Phone OTP (patient) + email/password (clinician)
│   │   ├── OnboardingScreen.js
│   │   ├── HomeScreen.js
│   │   ├── MedsScreen.js
│   │   ├── MedDetailScreen.js
│   │   ├── DoseScreen.js
│   │   ├── DeliveryScreen.js
│   │   ├── NotificationsScreen.js
│   │   └── ProfileScreen.js
│   ├── clinician/                # Clinician app
│   │   ├── ClinicianNavigator.js
│   │   ├── data.js               # Roster, formulary, refill queue seed data
│   │   ├── ui.js                 # Clinician-specific components
│   │   └── screens/
│   │       ├── RosterScreen.js
│   │       ├── ChartScreen.js
│   │       ├── PrescribeScreen.js
│   │       ├── RefillsScreen.js
│   │       └── ProfileScreen.js
│   └── lib/
│       ├── supabase.js           # Supabase client
│       ├── db.js                 # All database query functions
│       ├── mapper.js             # DB row → app model mappers
│       └── database.types.ts     # Generated TypeScript types
```

---

## Database Schema

All tables have Row Level Security enabled. Users can only access their own rows.

| Table | Description |
|---|---|
| `facilities` | Nairobi hospitals and clinics (seeded) |
| `profiles` | Patient profile — one row per auth user |
| `medications` | Active prescriptions per patient |
| `dose_logs` | Taken/missed dose record per medication per day |
| `deliveries` | Active and past prescription deliveries |
| `notifications` | In-app alerts per patient |
| `clinician_profiles` | Clinician details — created by admin |

### Key RPCs
- `demo_auth(p_phone)` — creates or retrieves a patient auth user by phone (demo mode)
- `get_user_role(p_user_id)` — returns `'patient'` or `'clinician'` based on which profile table the user appears in
- `demo_clinician_setup(...)` — creates a clinician auth user and profile (admin/dev use)

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go on your phone or an iOS/Android simulator
- A Supabase project (see Environment Variables)

### Install

```bash
git clone https://github.com/Kori254/MedTrack.git
cd MedTrack
npm install
```

### Environment Variables

Create a `.env` file in the root (never commit this):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These are read in `src/lib/supabase.js`.

### Run

```bash
npx expo start
```

Then press `i` for iOS simulator, `a` for Android, or scan the QR code with Expo Go.

---

## Authentication

### Patients
Sign in with a phone number. A 4-digit OTP is sent via SMS (Twilio — in demo mode the OTP is hardcoded as `4729`). New patients complete a short onboarding flow to set up their profile and link to a facility.

### Clinicians
Sign in with an email and password on the same login screen — tap the **Clinician** toggle at the top. Clinician accounts are created by an administrator; patients cannot self-register as clinicians.

To create a clinician account, run this in the Supabase SQL editor:

```sql
SELECT demo_clinician_setup(
  'doctor@hospital.go.ke',
  'SecurePassword123',
  'First Name',
  'Last Name',
  'Specialty',
  'Registration Number'
);
```

---

## Design

- **Primary colour** — `#0F6E56` teal
- **Urgency** — `#EF9F27` amber
- **Critical** — `#E05546` coral
- **Type scale** — 11 / 13 / 14 / 16 / 20 / 28 px, max weight 600
- Full light and dark mode support via `src/theme.js`

---

## Roadmap

- [ ] Live Twilio SMS OTP for patient auth
- [ ] Connect clinician screens to Supabase (currently uses seed data)
- [ ] Admin panel for creating and managing clinician accounts
- [ ] Push notifications for dose reminders
- [ ] Delivery tracking map view
- [ ] Offline mode with sync

---

## License

MIT
