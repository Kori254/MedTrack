import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminApp } from '../AdminContext';
import { BackBar, PermissionRow, RoleOption, InfoBanner, CopyField, PwStrengthMeter, SumRow } from '../ui';
import { Icons } from '../../components/Icons';
import { PERMISSIONS, ROLES, SPECIALTIES, roleById, pwStrength, genPassword, initials } from '../data';

const STEPS = ['Identity', 'Professional', 'Permissions', 'Login', 'Review'];

export default function AddDoctorScreen({ navigation }) {
  const { theme: t, createClinician } = useAdminApp();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    name: '', email: '', phone: '',
    specialty: '', facility: '', reg: '', role: 'physician',
    perms: roleById('physician').grants.slice(),
    password: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showSpecialty, setShowSpecialty] = useState(false);
  const [done, setDone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (patch) => setF((s) => ({ ...s, ...patch }));
  const pickRole = (rid) => set({ role: rid, perms: roleById(rid).grants.slice() });
  const togglePerm = (pid) => set({ perms: f.perms.includes(pid) ? f.perms.filter((x) => x !== pid) : [...f.perms, pid] });

  const pwStr = pwStrength(f.password);
  const pwOk = pwStr >= 3 && f.password.length >= 8;

  const valid = [
    f.name.trim().length > 2 && /\S+@\S+/.test(f.email),
    !!f.specialty && f.reg.trim().length > 2 && !!f.role,
    true,
    pwOk,
    true,
  ];

  async function submit() {
    setLoading(true);
    setError('');
    try {
      const doc = await createClinician({
        name: f.name.startsWith('Dr') ? f.name : 'Dr. ' + f.name,
        email: f.email,
        phone: f.phone,
        specialty: f.specialty,
        reg: f.reg,
        role: f.role,
        permissions: f.perms,
        password: f.password,
      });
      setDone({ email: f.email, password: f.password, doc });
    } catch (e) {
      setError(e.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  const next = () => { if (step < STEPS.length - 1) setStep(step + 1); else submit(); };
  const prev = () => { if (step > 0) setStep(step - 1); else navigation.goBack(); };

  if (done) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40, gap: 22 }}>
          <View style={{ alignItems: 'center', gap: 12 }}>
            <View style={{ width: 88, height: 88, borderRadius: 28, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center',
              shadowColor: t.primary, shadowOpacity: 0.4, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } }}>
              <Icons.check size={44} color={t.onPrimary} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Login created</Text>
            <Text style={{ fontSize: 14, color: t.text2, textAlign: 'center', lineHeight: 21, maxWidth: 280 }}>
              {done.doc.name} can now sign in to MedTrack as {roleById(f.role)?.name}.
            </Text>
          </View>

          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 20, padding: 18, gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Icons.key size={20} color={t.onPrimary} />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>Sign-in details</Text>
                <Text style={{ fontSize: 12, color: t.text3, marginTop: 1 }}>Share these with the clinician</Text>
              </View>
            </View>
            <CopyField value={done.email} label="Email" theme={t} />
            <CopyField value={done.password} label="Password" theme={t} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Icons.info size={15} color={t.text3} />
              <Text style={{ flex: 1, fontSize: 12, color: t.text3, lineHeight: 18 }}>
                The doctor signs in with these on the MedTrack app. They can change the password from their profile once inside.
              </Text>
            </View>
          </View>

          <TouchableOpacity style={{ height: 54, borderRadius: 16, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: t.text }}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <BackBar title="Add a clinician" sub={`${STEPS[step]} · ${step + 1} of ${STEPS.length}`} onBack={prev} theme={t} />

      {/* Step dots */}
      <View style={{ flexDirection: 'row', gap: 5, paddingHorizontal: 20, paddingBottom: 16 }}>
        {STEPS.map((s, i) => (
          <View key={s} style={{ flex: 1, height: 4, borderRadius: 2,
            backgroundColor: i < step ? t.primary : i === step ? t.primary : t.border2,
            opacity: i < step ? 0.4 : 1 }} />
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 20 }}>

        {step === 0 && (
          <>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>Who are you adding?</Text>
              <Text style={{ fontSize: 14, color: t.text2, marginTop: 5, lineHeight: 20 }}>Their name and contact details. They'll sign in with this email address.</Text>
            </View>
            <Field label="Full name" theme={t}>
              <TextInput style={inputStyle(t)} placeholder="e.g. Mary Wanjala" placeholderTextColor={t.text3}
                value={f.name} onChangeText={(v) => set({ name: v })} />
            </Field>
            <Field label="Work email" theme={t}>
              <TextInput style={inputStyle(t)} placeholder="name@facility.go.ke" placeholderTextColor={t.text3}
                keyboardType="email-address" autoCapitalize="none"
                value={f.email} onChangeText={(v) => set({ email: v })} />
            </Field>
            <Field label="Phone" hint="Used for account recovery and dose alerts." theme={t}>
              <TextInput style={inputStyle(t)} placeholder="+254 7…" placeholderTextColor={t.text3}
                keyboardType="phone-pad"
                value={f.phone} onChangeText={(v) => set({ phone: v })} />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>Professional details</Text>
              <Text style={{ fontSize: 14, color: t.text2, marginTop: 5, lineHeight: 20 }}>Where they practise and the licence we verify against the regulator.</Text>
            </View>

            <Field label="Specialty" theme={t}>
              <TouchableOpacity style={[inputStyle(t), { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => setShowSpecialty(true)}>
                <Text style={{ color: f.specialty ? t.text : t.text3, fontSize: 15 }}>{f.specialty || 'Choose a specialty'}</Text>
                <Icons.down size={18} color={t.text3} />
              </TouchableOpacity>
            </Field>

            <Field label="Registration / licence no." hint="Kenya Medical Practitioners & Dentists Board." theme={t}>
              <TextInput style={inputStyle(t)} placeholder="MPDB 00000" placeholderTextColor={t.text3}
                value={f.reg} onChangeText={(v) => set({ reg: v })} />
            </Field>

            <Field label="Role" theme={t}>
              <View style={{ gap: 10 }}>
                {ROLES.map((r) => (
                  <RoleOption key={r.id} role={r} selected={f.role === r.id} onSelect={() => pickRole(r.id)} theme={t} />
                ))}
              </View>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>Permissions</Text>
              <Text style={{ fontSize: 14, color: t.text2, marginTop: 5, lineHeight: 20 }}>
                Defaults follow the <Text style={{ fontWeight: '600' }}>{roleById(f.role)?.name}</Text> role. Toggle to customise.
              </Text>
            </View>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, overflow: 'hidden' }}>
              {PERMISSIONS.map((p) => (
                <PermissionRow key={p.id} perm={p} on={f.perms.includes(p.id)} onToggle={() => togglePerm(p.id)} theme={t} />
              ))}
            </View>
            <InfoBanner text={`${f.perms.length} permission${f.perms.length === 1 ? '' : 's'} granted. You can change these any time from the clinician's profile.`} theme={t} />
          </>
        )}

        {step === 3 && (
          <>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>Create their login</Text>
              <Text style={{ fontSize: 14, color: t.text2, marginTop: 5, lineHeight: 20 }}>
                {f.name ? f.name.split(' ')[0] : 'The clinician'} signs in with their email and the password you set here.
              </Text>
            </View>

            <Field label="Email" hint="From the previous step — this is their username." theme={t}>
              <TextInput style={[inputStyle(t), { color: t.text2 }]} value={f.email || '—'} editable={false} />
            </Field>

            <Field label="Password" theme={t}>
              <View style={{ position: 'relative' }}>
                <TextInput style={[inputStyle(t), { paddingRight: 52, fontFamily: f.password ? 'monospace' : undefined }]}
                  placeholder="Set a password" placeholderTextColor={t.text3}
                  secureTextEntry={!showPw}
                  value={f.password} onChangeText={(v) => set({ password: v })} />
                <TouchableOpacity onPress={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', paddingHorizontal: 6 }}>
                  {showPw ? <Icons.eyeOff size={19} color={t.text3} /> : <Icons.eye size={19} color={t.text3} />}
                </TouchableOpacity>
              </View>
              <PwStrengthMeter strength={pwStr} theme={t} />
            </Field>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
              height: 38, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}
              onPress={() => { set({ password: genPassword() }); setShowPw(true); }}>
              <Icons.refresh size={16} color={t.text} />
              <Text style={{ fontSize: 13, fontWeight: '500', color: t.text }}>Generate a strong password</Text>
            </TouchableOpacity>

            <View style={{ gap: 8 }}>
              {[
                { ok: f.password.length >= 8, text: 'At least 8 characters' },
                { ok: /[A-Z]/.test(f.password), text: 'One uppercase letter' },
                { ok: /[0-9]/.test(f.password), text: 'One number' },
              ].map((r, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: r.ok ? t.primaryTint : t.surface2 }}>
                    {r.ok ? <Icons.check size={11} color={t.primary} /> : <Icons.minus size={11} color={t.text3} />}
                  </View>
                  <Text style={{ fontSize: 13, color: r.ok ? t.text : t.text3 }}>{r.text}</Text>
                </View>
              ))}
            </View>

            <InfoBanner text="Share this password with the clinician securely. They can change it once they sign in." theme={t} />
          </>
        )}

        {step === 4 && (
          <>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>Review & create</Text>
              <Text style={{ fontSize: 14, color: t.text2, marginTop: 5, lineHeight: 20 }}>Confirm the details before we create this login.</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ width: 60, height: 60, borderRadius: 19, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 21, fontWeight: '500', color: t.textOnTint }}>{initials(f.name) || 'Dr'}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 19, fontWeight: '500', color: t.text }}>{f.name.startsWith('Dr') ? f.name : 'Dr. ' + (f.name || '—')}</Text>
                <Text style={{ fontSize: 13, color: t.text2, marginTop: 3 }}>{f.specialty || '—'}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, padding: 16 }}>
              <SumRow label="Email"       value={f.email || '—'}              first theme={t} />
              <SumRow label="Phone"       value={f.phone || '—'}                    theme={t} />
              <SumRow label="Registration" value={f.reg || '—'}                    theme={t} />
              <SumRow label="Role"        value={roleById(f.role)?.name || '—'}    theme={t} />
              <SumRow label="Permissions" value={`${f.perms.length} granted`}      theme={t} />
              <SumRow label="Password"    value={'•'.repeat(Math.min(f.password.length, 10)) || '—'} theme={t} />
            </View>
            {error ? <Text style={{ fontSize: 13, color: t.coralText }}>{error}</Text> : null}
          </>
        )}

      </ScrollView>

      {/* Bottom action bar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36,
        backgroundColor: t.appBg, borderTopWidth: 1, borderTopColor: t.border }}>
        <TouchableOpacity activeOpacity={valid[step] ? 0.8 : 1}
          onPress={valid[step] && !loading ? next : null}
          style={{ height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 10, flexDirection: 'row',
            backgroundColor: valid[step] ? t.primary : t.surface2,
            shadowColor: valid[step] ? t.primary : 'transparent', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
          {step === STEPS.length - 1 ? (
            <>
              <Icons.userPlus size={18} color={valid[step] ? t.onPrimary : t.text3} />
              <Text style={{ fontSize: 16, fontWeight: '500', color: valid[step] ? t.onPrimary : t.text3 }}>
                {loading ? 'Creating…' : 'Create login'}
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '500', color: valid[step] ? t.onPrimary : t.text3 }}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Specialty picker modal */}
      <Modal visible={showSpecialty} transparent animationType="slide" onRequestClose={() => setShowSpecialty(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={() => setShowSpecialty(false)} />
        <View style={{ backgroundColor: t.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: '70%' }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: t.border2, alignSelf: 'center', margin: 12 }} />
          <Text style={{ fontSize: 15, fontWeight: '500', color: t.text, paddingHorizontal: 20, marginBottom: 8 }}>Choose a specialty</Text>
          <ScrollView>
            {SPECIALTIES.map((s) => (
              <TouchableOpacity key={s} onPress={() => { set({ specialty: s }); setShowSpecialty(false); }}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20,
                  borderTopWidth: 1, borderTopColor: t.border }}>
                <Text style={{ fontSize: 15, color: f.specialty === s ? t.primary : t.text }}>{s}</Text>
                {f.specialty === s && <Icons.check size={19} color={t.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Field({ label, hint, children, theme: t }) {
  return (
    <View style={{ gap: 7 }}>
      {label && <Text style={{ fontSize: 13, fontWeight: '500', color: t.text2 }}>{label}</Text>}
      {children}
      {hint && <Text style={{ fontSize: 12, color: t.text3 }}>{hint}</Text>}
    </View>
  );
}

function inputStyle(t) {
  return { height: 50, paddingHorizontal: 16, borderRadius: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, color: t.text, fontSize: 15 };
}
