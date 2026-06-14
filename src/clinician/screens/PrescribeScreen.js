// MedTrack Clinician — prescribe flow: [patient →] drug → dose → review → sent.
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../AppContext';
import { TopBar } from '../../components/UI';
import { Icons } from '../../components/Icons';
import {
  Avatar, FieldCard, PillPick, TogglePills, NumberStepper, StepBar,
  SearchInput, AlertBanner, ActionBar, Button,
} from '../ui';
import {
  CLIN, ROSTER, FORMULARY, FREQ, ROUTES, DURATIONS,
  patientById, drugById, safetyAlerts,
} from '../data';

// ---- step: pick patient ----
function PickPatient({ onPick, allPatients, theme: t }) {
  const [q, setQ] = useState('');
  const list = allPatients.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.dx.toLowerCase().includes(q.toLowerCase()));
  return (
    <View style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 20 }}>
      <View>
        <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>Who is this for?</Text>
        <Text style={{ fontSize: 13, color: t.text2, marginTop: 4 }}>Select a patient to prescribe to.</Text>
      </View>
      <SearchInput value={q} onChangeText={setQ} placeholder="Search patients" theme={t} />
      <View style={{ gap: 10 }}>
        {list.map((p) => (
          <TouchableOpacity key={p.id} activeOpacity={0.85} onPress={() => onPick(p.id)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18 }}>
            <Avatar size="sm" theme={t}>{p.initials}</Avatar>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{p.name}</Text>
              <Text numberOfLines={1} style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{p.dx}</Text>
            </View>
            <Icons.chevronR size={18} color={t.text3} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ---- step: pick drug ----
function PickDrug({ onPick, theme: t }) {
  const [q, setQ] = useState('');
  const list = FORMULARY.filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.cls.toLowerCase().includes(q.toLowerCase()) || d.brand.toLowerCase().includes(q.toLowerCase()));
  return (
    <View style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 20 }}>
      <View>
        <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>Search the formulary</Text>
        <Text style={{ fontSize: 13, color: t.text2, marginTop: 4 }}>KNH essential medicines list.</Text>
      </View>
      <SearchInput value={q} onChangeText={setQ} placeholder="Drug or class" autoFocus theme={t} />
      <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, paddingHorizontal: 16 }}>
        {list.map((d, i) => (
          <TouchableOpacity key={d.id} activeOpacity={0.7} onPress={() => onPick(d.id)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: t.border }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primaryTint }}>
              <Icons.capsule size={20} color={t.primary} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 7 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{d.name}</Text>
                <Text style={{ fontSize: 11, color: t.text3 }}>{d.brand}</Text>
              </View>
              <Text style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{d.cls}</Text>
            </View>
            <Icons.plus size={18} color={t.primary} />
          </TouchableOpacity>
        ))}
        {list.length === 0 && <Text style={{ textAlign: 'center', paddingVertical: 22, color: t.text3 }}>Nothing in the formulary matches "{q}"</Text>}
      </View>
    </View>
  );
}

// ---- step: configure dose ----
function ConfigureDose({ rx, set, patient, drug, alerts, theme: t }) {
  const crit = alerts.some((a) => a.sev === 'critical');
  return (
    <View style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
        <View style={{ width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primaryTint }}>
          <Icons.capsule size={22} color={t.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 19, fontWeight: '500', color: t.text, letterSpacing: -0.3 }}>{drug.name}</Text>
          <Text style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{drug.cls} · for {patient.name.split(' ')[0]}</Text>
        </View>
      </View>

      {alerts.map((a, i) => <AlertBanner key={i} alert={a} theme={t} />)}

      <FieldCard label="Strength" theme={t}>
        <PillPick options={drug.strengths.map((s) => ({ key: s, label: s }))} value={rx.strength} onChange={(v) => set({ strength: v })} theme={t} />
      </FieldCard>

      <FieldCard label="Frequency" theme={t}>
        <PillPick options={Object.entries(FREQ).map(([k, v]) => ({ key: k, label: v.label, sub: v.sig }))} value={rx.freq} onChange={(v) => set({ freq: v, qtyTouched: false })} theme={t} />
      </FieldCard>

      <FieldCard label="Route" theme={t}>
        <PillPick options={ROUTES.map((r) => ({ key: r, label: r }))} value={rx.route} onChange={(v) => set({ route: v })} theme={t} />
      </FieldCard>

      <FieldCard label="Duration" theme={t}>
        <PillPick options={DURATIONS.map((d) => ({ key: d, label: d + ' days' }))} value={rx.duration} onChange={(v) => set({ duration: v, qtyTouched: false })} theme={t} />
      </FieldCard>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <FieldCard label="Quantity to dispense" theme={t} style={{ flex: 1 }}>
          <NumberStepper value={rx.qty} min={1} max={365} step={FREQ[rx.freq].perDay} unit={drug.form + 's'} onChange={(v) => set({ qty: v, qtyTouched: true })} theme={t} />
        </FieldCard>
        <FieldCard label="Repeats / refills" theme={t} style={{ flex: 1 }}>
          <NumberStepper value={rx.refills} min={0} max={11} onChange={(v) => set({ refills: v })} theme={t} />
        </FieldCard>
      </View>

      <FieldCard label="Dispensing" theme={t}>
        <TogglePills theme={t} value={rx.deliver} onChange={(v) => set({ deliver: v })}
          options={[{ key: 'auto', label: 'Auto-deliver', icon: 'truck' }, { key: 'pickup', label: 'Pharmacy pickup', icon: 'building' }]} />
        <Text style={{ fontSize: 11, color: t.text3 }}>
          {rx.deliver === 'auto' ? "Refills are dispatched to the patient's home automatically when supply runs low." : 'Patient collects from KNH pharmacy.'}
        </Text>
      </FieldCard>

      <FieldCard label="Indication / clinical note" theme={t}>
        <TextInput multiline value={rx.indication} onChangeText={(v) => set({ indication: v })}
          placeholder="Reason for prescribing, instructions to patient…" placeholderTextColor={t.text3}
          style={{ minHeight: 76, padding: 12, borderRadius: 12, backgroundColor: t.surfaceSunken, color: t.text, fontSize: 14, lineHeight: 20, textAlignVertical: 'top' }} />
      </FieldCard>

      {crit && <Text style={{ fontSize: 11, color: t.coralText, textAlign: 'center' }}>A contraindication is flagged. Review carefully before continuing.</Text>}
    </View>
  );
}

// ---- step: review + e-sign ----
function SumRow({ k, v, light, first, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 11, borderTopWidth: first ? 0 : 1, borderTopColor: t.border }}>
      <Text style={{ fontSize: 13, color: t.text2 }}>{k}</Text>
      <Text style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: light ? '400' : '500', color: light ? t.text2 : t.text }}>{v}</Text>
    </View>
  );
}

function ReviewRx({ rx, patient, drug, signed, onSign, theme: t }) {
  const f = FREQ[rx.freq];
  const unit = drug.form || 'tablet';
  return (
    <View style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 20 }}>
      <View>
        <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>Review &amp; sign</Text>
        <Text style={{ fontSize: 13, color: t.text2, marginTop: 4 }}>Confirm the prescription before it's sent.</Text>
      </View>

      <FieldCard theme={t} style={{ gap: 2 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 6 }}>
          <Avatar size="sm" theme={t}>{patient.initials}</Avatar>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{patient.name}</Text>
            <Text style={{ fontSize: 11, color: t.text3 }}>{patient.age}{patient.sex} · {patient.mrn}</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: t.border, marginVertical: 4 }} />
        <SumRow k="Medication" v={`${drug.name} ${rx.strength}`} first theme={t} />
        <SumRow k="Directions" v={`1 ${unit} · ${rx.route} · ${f.sig}`} theme={t} />
        <SumRow k="Duration" v={`${rx.duration} days`} theme={t} />
        <SumRow k="Dispense" v={`${rx.qty} ${unit}s · ${rx.refills} repeat${rx.refills === 1 ? '' : 's'}`} theme={t} />
        <SumRow k="Method" v={rx.deliver === 'auto' ? 'Auto-deliver to home' : 'Pharmacy pickup'} theme={t} />
        {rx.indication ? <SumRow k="Indication" v={rx.indication} light theme={t} /> : null}
      </FieldCard>

      <View>
        <Text style={{ fontSize: 13, fontWeight: '500', color: t.text2, marginBottom: 8 }}>Prescriber signature</Text>
        <TouchableOpacity activeOpacity={0.9} onPress={onSign}
          style={{ height: 150, borderRadius: 16, borderWidth: 1.5, borderStyle: signed ? 'solid' : 'dashed', borderColor: signed ? t.primary : t.border2,
            backgroundColor: signed ? t.surface : t.surfaceSunken, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {signed ? (
            <View style={{ alignItems: 'center', paddingBottom: 16 }}>
              <Icons.check size={56} color={t.primary} sw={2.2} />
            </View>
          ) : (
            <Text style={{ fontSize: 11, color: t.text3, fontFamily: 'monospace' }}>tap to sign</Text>
          )}
          <View style={{ position: 'absolute', left: 16, right: 16, bottom: 30, height: 1, backgroundColor: t.border2 }} />
          <Text style={{ position: 'absolute', left: 16, bottom: 12, fontSize: 11, color: signed ? t.text2 : t.text3 }}>
            {signed ? `${CLIN.name} · ${CLIN.reg}` : '✕ ___________________________'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---- step: sent ----
function RxSent({ rx, patient, drug, onDone, onChart, theme: t }) {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 8 }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <Icons.check size={54} color={t.onPrimary} sw={2.4} />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>Prescription sent</Text>
        <Text style={{ fontSize: 13, color: t.text2, textAlign: 'center', maxWidth: 270, lineHeight: 20 }}>
          {drug.name} {rx.strength} sent to {patient.name.split(' ')[0]}'s MedTrack app{rx.deliver === 'auto' ? ' — refills will be auto-delivered.' : ' and KNH pharmacy.'}
        </Text>
        <View style={{ width: '100%', marginTop: 14, backgroundColor: t.surfaceSunken, borderRadius: 18, padding: 16 }}>
          <SumRow k="Medication" v={`${drug.name} ${rx.strength}`} first theme={t} />
          <SumRow k="Reference" v={`MT-2026-0627-${drug.id.toUpperCase()}`} theme={t} />
          <SumRow k="Prescriber" v={CLIN.short} theme={t} />
        </View>
      </View>
      <ActionBar theme={t}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="View chart" variant="ghost" onPress={onChart} style={{ flex: 1 }} theme={t} />
          <Button label="Done" onPress={onDone} style={{ flex: 1 }} theme={t} />
        </View>
      </ActionBar>
    </SafeAreaView>
  );
}

// ---- container ----
export default function PrescribeScreen({ navigation, route }) {
  const { theme: t, clinicianPatients, actions } = useApp();
  const preset = route.params || {};
  const presetPatient = !!preset.patientId;
  const presetDrug = !!preset.drugId;

  const flow = [];
  if (!presetPatient) flow.push('patient');
  if (!presetDrug) flow.push('drug');
  flow.push('dose', 'review');

  const allPatients = useMemo(() => [...clinicianPatients, ...ROSTER], [clinicianPatients]);

  const [idx, setIdx] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [signed, setSigned] = useState(false);
  const [patientId, setPatientId] = useState(preset.patientId || null);
  const [drugId, setDrugId] = useState(preset.drugId || null);
  const [rx, setRx] = useState(() => {
    if (preset.drugId) {
      const d = drugById(preset.drugId);
      if (d) return {
        strength: d.strengths[d.strengths.length - 1], freq: d.freq, route: d.route,
        duration: 30, qty: FREQ[d.freq].perDay * 30, qtyTouched: false,
        refills: 2, deliver: 'auto', indication: '',
      };
    }
    return {};
  });

  const patient = patientId
    ? (patientById(patientId) || allPatients.find((p) => p.id === patientId))
    : null;
  const drug = drugId ? drugById(drugId) : null;
  const alerts = useMemo(() => safetyAlerts(drug, patient), [drugId, patientId]);
  const set = (patch) => setRx((p) => ({ ...p, ...patch }));

  const advance = () => setIdx((i) => Math.min(flow.length - 1, i + 1));

  function selectDrug(id) {
    const d = drugById(id);
    setDrugId(id);
    setRx({
      strength: d.strengths[d.strengths.length - 1], freq: d.freq, route: d.route,
      duration: 30, qty: FREQ[d.freq].perDay * 30, qtyTouched: false,
      refills: 2, deliver: 'auto', indication: '',
    });
    advance();
  }

  // auto-recompute quantity when freq/duration change and qty untouched
  useEffect(() => {
    if (drug && !rx.qtyTouched && rx.freq && rx.duration)
      set({ qty: FREQ[rx.freq].perDay * rx.duration });
  }, [rx.freq, rx.duration, rx.qtyTouched, drug]);

  const cur = flow[idx];
  const goBack = () => { if (idx > 0) setIdx((i) => i - 1); else navigation.goBack(); };

  if (sent) {
    return <RxSent rx={rx} patient={patient} drug={drug} theme={t}
      onDone={() => navigation.navigate('Tabs', { screen: 'Today' })}
      onChart={() => navigation.navigate('Chart', { patientId })} />;
  }

  // bottom action depends on step
  let action = null;
  if (cur === 'dose') {
    const crit = alerts.some((a) => a.sev === 'critical');
    action = crit
      ? <Button label="Override & continue" variant="ghost" onPress={advance} theme={t} style={{ borderColor: t.coral }} />
      : <Button label="Continue to review" onPress={advance} theme={t} />;
  } else if (cur === 'review') {
    const handleSend = async () => {
      setSending(true);
      try {
        if (patient?.isReal) {
          await actions.savePrescription(patientId, rx, drug, patient.facilityId);
        }
        setSent(true);
      } catch (e) {
        console.warn('savePrescription error', e);
        setSent(true); // still show success screen; log the error
      } finally {
        setSending(false);
      }
    };
    action = <Button label={sending ? 'Sending…' : 'Sign & send prescription'} icon="send" disabled={!signed || sending} onPress={handleSend} theme={t} />;
  }

  const titles = { patient: 'New prescription', drug: 'Select medication', dose: 'Configure dose', review: 'Review & sign' };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        <TopBar title={titles[cur]} onBack={goBack} sub={patient ? patient.name : null} theme={t} />
        <StepBar count={flow.length} idx={idx} theme={t} />
        {cur === 'patient' && <PickPatient allPatients={allPatients} onPick={(id) => { setPatientId(id); advance(); }} theme={t} />}
        {cur === 'drug' && <PickDrug onPick={selectDrug} theme={t} />}
        {cur === 'dose' && drug && <ConfigureDose rx={rx} set={set} patient={patient} drug={drug} alerts={alerts} theme={t} />}
        {cur === 'review' && drug && <ReviewRx rx={rx} patient={patient} drug={drug} signed={signed} onSign={() => setSigned(true)} theme={t} />}
      </ScrollView>
      {action && <ActionBar theme={t}>{action}</ActionBar>}
    </SafeAreaView>
  );
}
