import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { BottomSheet } from '../components/UI';
import { Icons } from '../components/Icons';
import DatePicker from '../components/DatePicker';
import { FACILITIES } from '../data';

export default function OnboardingScreen({ route }) {
  const { theme: t, actions } = useApp();
  const phone = route?.params?.phone ?? '';
  const [step, setStep] = useState(0);
  const total = 2;

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  async function finish() {
    setSaving(true);
    setSaveError('');
    try {
      const nameParts = name.trim().split(/\s+/);
      await actions.completeOnboarding({
        firstName: nameParts[0] ?? '',
        lastName: nameParts.slice(1).join(' ') || (nameParts[0] ?? ''),
        dob,
        address,
        facilityId: null, // TODO: pass facility UUID once facility picker returns IDs
        phone,
      });
    } catch (e) {
      setSaveError('Could not save your profile. Please try again.');
      console.error('completeOnboarding error', e);
    } finally {
      setSaving(false);
    }
  }

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [facility, setFacility] = useState('');
  const [facSheet, setFacSheet] = useState(false);
  const [facQuery, setFacQuery] = useState('');

  const [rxMode, setRxMode] = useState('facility');
  const [accepted, setAccepted] = useState(false);

  const filteredFacilities = FACILITIES.filter((f) =>
    f.toLowerCase().includes(facQuery.toLowerCase())
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Progress bar */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            {step > 0
              ? <TouchableOpacity onPress={() => setStep(s => s - 1)}
                  style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
                  <Icons.left size={20} color={t.text} />
                </TouchableOpacity>
              : <View style={{ width: 40 }} />
            }
            <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
              {Array.from({ length: total }).map((_, i) => (
                <View key={i} style={{ flex: 1, height: 4, borderRadius: 99, backgroundColor: i <= step ? t.primary : t.border2 }} />
              ))}
            </View>
            <View style={{ width: 40 }} />
          </View>
        </View>

        {/* Step 0 — Profile */}
        {step === 0 && (
          <>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, marginTop: 4, letterSpacing: -0.4 }}>Set up your profile</Text>
              <Text style={{ fontSize: 13, color: t.text2, marginTop: 6, marginBottom: 22, lineHeight: 19 }}>
                This helps your facility reach you and deliver to the right place.
              </Text>

              <View style={{ gap: 16 }}>
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, color: t.text2, fontWeight: '500' }}>Full name</Text>
                  <TextInput
                    value={name} onChangeText={setName}
                    placeholder="e.g. Amani Mwangi" placeholderTextColor={t.text3}
                    style={{ minHeight: 52, paddingHorizontal: 16, borderRadius: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border2, color: t.text, fontSize: 15 }}
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, color: t.text2, fontWeight: '500' }}>Date of birth</Text>
                  <DatePicker value={dob} onChange={setDob} theme={t} />
                </View>

                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, color: t.text2, fontWeight: '500' }}>Delivery address</Text>
                  <TextInput
                    value={address} onChangeText={setAddress}
                    placeholder="e.g. Apt 4B, Kileleshwa, Nairobi" placeholderTextColor={t.text3}
                    style={{ minHeight: 52, paddingHorizontal: 16, borderRadius: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border2, color: t.text, fontSize: 15 }}
                  />
                  <View style={{ height: 88, borderRadius: 16, backgroundColor: t.surfaceSunken, borderWidth: 1, borderColor: t.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'monospace', fontSize: 10, color: t.text3 }}>// drag pin to set GPS location</Text>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, color: t.text2, fontWeight: '500' }}>Linked healthcare facility</Text>
                  <TouchableOpacity
                    onPress={() => setFacSheet(true)}
                    style={{ minHeight: 52, paddingHorizontal: 16, borderRadius: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Text style={{ fontSize: 15, color: facility ? t.text : t.text3 }}>{facility || 'Choose your facility'}</Text>
                    <Icons.down size={18} color={t.text3} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={{ paddingHorizontal: 20, paddingBottom: 34, paddingTop: 10 }}>
              <TouchableOpacity
                onPress={() => setStep(1)}
                disabled={name.length < 2}
                style={{ backgroundColor: name.length < 2 ? t.border2 : t.primary, borderRadius: 16, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, opacity: name.length < 2 ? 0.5 : 1, shadowColor: name.length < 2 ? 'transparent' : t.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500', color: name.length < 2 ? t.text3 : t.onPrimary }}>Continue</Text>
                <Icons.arrowRight size={18} color={name.length < 2 ? t.text3 : t.onPrimary} />
              </TouchableOpacity>
            </View>

            <BottomSheet open={facSheet} onClose={() => setFacSheet(false)} title="Choose your facility" theme={t}>
              <View style={{ position: 'relative', marginBottom: 12 }}>
                <TextInput
                  value={facQuery} onChangeText={setFacQuery}
                  placeholder="Search facilities" placeholderTextColor={t.text3}
                  style={{ minHeight: 52, paddingHorizontal: 16, paddingLeft: 42, borderRadius: 14, backgroundColor: t.surface2, color: t.text, fontSize: 15 }}
                />
                <View style={{ position: 'absolute', left: 14, top: 16 }}><Icons.search size={18} color={t.text3} /></View>
              </View>
              <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
                {filteredFacilities.map((f) => (
                  <TouchableOpacity key={f} onPress={() => { setFacility(f); setFacSheet(false); setFacQuery(''); }}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.border }}>
                    <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface2 }}>
                      <Icons.building size={20} color={t.text2} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 14, color: t.text }}>{f}</Text>
                    {facility === f && <Icons.checkSm size={18} color={t.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </BottomSheet>
          </>
        )}

        {/* Step 1 — Prescription */}
        {step === 1 && (
          <>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, marginTop: 4, letterSpacing: -0.4 }}>Add your medication</Text>
              <Text style={{ fontSize: 13, color: t.text2, marginTop: 6, marginBottom: 18, lineHeight: 19 }}>
                Your facility may have already sent it — or you can add it yourself.
              </Text>

              <View style={{ flexDirection: 'row', gap: 3, padding: 3, borderRadius: 13, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.border, marginBottom: 18 }}>
                {[['facility', 'From my facility'], ['manual', 'Add manually']].map(([k, l]) => (
                  <TouchableOpacity key={k} onPress={() => setRxMode(k)}
                    style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: rxMode === k ? t.surface : 'transparent' }}>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: rxMode === k ? t.text : t.text2 }}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {rxMode === 'facility' ? (
                <View style={{ gap: 12 }}>
                  <View style={{ backgroundColor: t.primaryTint, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                    <Icons.building size={18} color={t.primary} />
                    <Text style={{ flex: 1, fontSize: 13, color: t.text2, lineHeight: 19 }}>
                      {facility || 'Your facility'} sent 1 prescription for you to confirm.
                    </Text>
                  </View>
                  <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: accepted ? t.primary : t.border, borderRadius: 22, padding: 18, gap: 14 }}>
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                      <View style={{ width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primaryTint }}>
                        <Icons.capsule size={22} color={t.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: t.text }}>Dolutegravir 50 mg</Text>
                        <Text style={{ fontSize: 11, color: t.text3 }}>1 tablet · every morning 8:00 AM</Text>
                      </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: t.border }} />
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                      <View><Text style={{ fontSize: 11, color: t.text3 }}>Quantity</Text><Text style={{ fontSize: 14, fontWeight: '500', color: t.text, marginTop: 2 }}>30 tablets</Text></View>
                      <View><Text style={{ fontSize: 11, color: t.text3 }}>Last pickup</Text><Text style={{ fontSize: 14, fontWeight: '500', color: t.text, marginTop: 2 }}>28 May 2026</Text></View>
                    </View>
                    <TouchableOpacity onPress={() => setAccepted(true)}
                      style={{ backgroundColor: accepted ? t.primaryTint : t.primary, borderRadius: 14, minHeight: 48, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 }}>
                      {accepted && <Icons.checkSm size={18} color={t.textOnTint} />}
                      <Text style={{ fontSize: 15, fontWeight: '500', color: accepted ? t.textOnTint : t.onPrimary }}>
                        {accepted ? 'Added to your meds' : 'Confirm this prescription'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{ gap: 14 }}>
                  {[['Medication name', 'e.g. Imatinib'], ['Dosage', '400 mg'], ['Dosing schedule', 'Once daily · 9:00 PM'], ['Date of last pickup', '30 May 2026']].map(([label, ph]) => (
                    <View key={label} style={{ gap: 8 }}>
                      <Text style={{ fontSize: 13, color: t.text2, fontWeight: '500' }}>{label}</Text>
                      <TextInput
                        placeholder={ph} placeholderTextColor={t.text3}
                        style={{ minHeight: 52, paddingHorizontal: 16, borderRadius: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border2, color: t.text, fontSize: 15 }}
                      />
                    </View>
                  ))}
                  <TouchableOpacity onPress={() => setAccepted(true)}
                    style={{ backgroundColor: t.primaryTint, borderRadius: 14, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
                    <Icons.plus size={18} color={t.textOnTint} />
                    <Text style={{ fontSize: 15, fontWeight: '500', color: t.textOnTint }}>Add medication</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            <View style={{ paddingHorizontal: 20, paddingBottom: 34, paddingTop: 10 }}>
              <TouchableOpacity
                onPress={finish}
                disabled={!accepted || saving}
                style={{ backgroundColor: (!accepted || saving) ? t.border2 : t.primary, borderRadius: 16, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, opacity: (!accepted || saving) ? 0.6 : 1, shadowColor: (!accepted || saving) ? 'transparent' : t.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500', color: (!accepted || saving) ? t.text3 : t.onPrimary }}>
                  {saving ? 'Setting up…' : 'Go to my dashboard'}
                </Text>
                {!saving && <Icons.arrowRight size={18} color={!accepted ? t.text3 : t.onPrimary} />}
              </TouchableOpacity>
              {saveError ? <Text style={{ fontSize: 12, color: t.coralText, textAlign: 'center', marginTop: 8 }}>{saveError}</Text> : null}
            </View>
          </>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
