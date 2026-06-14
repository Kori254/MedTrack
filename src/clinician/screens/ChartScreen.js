// MedTrack Clinician — patient chart: header, adherence, current meds, notes, history.
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../AppContext';
import { TopBar, SectionLabel, SupplyBar, MedTile } from '../../components/UI';
import { Icons } from '../../components/Icons';
import { supplyColor } from '../../theme';
import { Avatar, FieldCard, ActionBar, Button } from '../ui';
import { CLIN, patientById, ROSTER, supplyStatusCL } from '../data';

// deterministic 14-day adherence strip from an adherence %
function adherenceStrip(pct, missedSeed) {
  const days = 14;
  const missCount = Math.round((days * (100 - pct)) / 100);
  const missed = new Set();
  let s = missedSeed;
  while (missed.size < missCount) { s = (s * 9301 + 49297) % 233280; missed.add(2 + (s % (days - 3))); }
  return Array.from({ length: days }, (_, i) => (missed.has(i) ? 'missed' : 'taken'));
}

function PatientHeaderCard({ p, theme: t }) {
  return (
    <FieldCard theme={t} style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <Avatar size="lg" theme={t}>{p.initials}</Avatar>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontSize: 21, fontWeight: '500', color: t.text, letterSpacing: -0.4 }}>{p.name}</Text>
          <Text style={{ fontSize: 13, color: t.text2, marginTop: 2 }}>{p.age} yrs · {p.sex === 'F' ? 'Female' : 'Male'} · {p.mrn}</Text>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: t.border }} />
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Text style={{ width: 78, fontSize: 11, color: t.text3, paddingTop: 1 }}>Diagnosis</Text>
          <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: t.text }}>{p.dx}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Text style={{ width: 78, fontSize: 11, color: t.text3, paddingTop: 1 }}>Allergies</Text>
          {p.allergies.length ? (
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1 }}>
              {p.allergies.map((a) => (
                <View key={a} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: t.coralTint }}>
                  <Icons.alert size={12} color={t.coralText} />
                  <Text style={{ fontSize: 12, fontWeight: '500', color: t.coralText }}>{a}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ flex: 1, fontSize: 14, color: t.text2 }}>No known allergies</Text>
          )}
        </View>
      </View>
    </FieldCard>
  );
}

function AdherenceMini({ p, theme: t }) {
  const strip = adherenceStrip(p.adherence, p.id.length * 37 + p.age);
  const st = p.adherence >= 85 ? 'healthy' : p.adherence >= 70 ? 'low' : 'critical';
  const accent = supplyColor(st, t);
  const heroColor = st === 'critical' ? t.coralText : st === 'low' ? t.amberText : t.primary;
  return (
    <FieldCard theme={t} style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 11, color: t.text3 }}>30-day adherence</Text>
          <Text style={{ fontSize: 28, fontWeight: '500', color: heroColor, marginTop: 2, letterSpacing: -0.6 }}>{p.adherence}%</Text>
        </View>
        <Icons.activity size={24} color={accent} />
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {strip.map((s, i) => (
          <View key={i} style={{ flex: 1, height: 26, borderRadius: 6, backgroundColor: s === 'taken' ? t.primary : t.coralTint }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: accent }} />
        <Text style={{ fontSize: 13, color: t.text2 }}>
          {st === 'healthy' ? 'Adherent — last 14 days shown' : st === 'low' ? 'Some missed doses — last 14 days' : 'Poor adherence — needs counselling'}
        </Text>
      </View>
    </FieldCard>
  );
}

function ChartMedRow({ med, onRenew, theme: t }) {
  return (
    <FieldCard theme={t} style={{ gap: 13 }}>
      <View style={{ flexDirection: 'row', gap: 13, alignItems: 'flex-start' }}>
        <MedTile med={med} theme={t} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{med.name}</Text>
            <Text style={{ fontSize: 13, color: t.text2 }}>{med.strength}</Text>
          </View>
          <Text style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>{med.scheduleLabel}</Text>
          <Text style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{med.purpose}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.85} onPress={onRenew}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 12, borderRadius: 11, backgroundColor: t.primaryTint }}>
          <Icons.refresh size={15} color={t.textOnTint} />
          <Text style={{ fontSize: 13, fontWeight: '500', color: t.textOnTint }}>Renew</Text>
        </TouchableOpacity>
      </View>
      <SupplyBar days={med.daysRemaining} total={med.totalDays} showLabel={false} theme={t} />
    </FieldCard>
  );
}

function ActivityRow({ icon, tint, title, sub, theme: t }) {
  const Ic = Icons[icon];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 }}>
      <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: tint ? t.primaryTint : t.surface2 }}>
        <Ic size={18} color={tint ? t.primary : t.text2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>{title}</Text>
        <Text style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{sub}</Text>
      </View>
    </View>
  );
}

export default function ChartScreen({ navigation, route }) {
  const { theme: t } = useApp();
  const p = patientById(route.params?.patientId) || ROSTER[0];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <TopBar title="Patient chart" onBack={() => navigation.goBack()} theme={t}
          trailing={<Icons.dots size={20} color={t.text} />} />
        <View style={{ paddingHorizontal: 20, gap: 18 }}>
          <PatientHeaderCard p={p} theme={t} />
          <AdherenceMini p={p} theme={t} />

          <View>
            <SectionLabel theme={t}>Current medications</SectionLabel>
            <View style={{ gap: 12 }}>
              {p.meds.map((m, i) => (
                <ChartMedRow key={i} med={m} theme={t}
                  onRenew={() => navigation.navigate('PrescribeFlow', { patientId: p.id, drugId: m.drugId, renew: true })} />
              ))}
            </View>
          </View>

          <View>
            <SectionLabel theme={t}>Clinical note</SectionLabel>
            <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 18, padding: 16 }}>
              <Text style={{ fontSize: 14, color: t.text2, lineHeight: 22 }}>{p.notes}</Text>
              <Text style={{ fontSize: 11, color: t.text3, marginTop: 10 }}>{CLIN.short} · last visit {p.lastVisit}</Text>
            </View>
          </View>

          <View>
            <SectionLabel theme={t}>Recent activity</SectionLabel>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, paddingHorizontal: 16,
              shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
              <ActivityRow icon="pencil" tint title="Prescription reviewed" sub={`${p.meds[0].name} ${p.meds[0].strength} · ${p.lastVisit}`} theme={t} />
              <View style={{ height: 1, backgroundColor: t.border }} />
              <ActivityRow icon="truck" tint title="Refill delivered" sub={`${p.meds[p.meds.length - 1].name} · home delivery`} theme={t} />
              <View style={{ height: 1, backgroundColor: t.border }} />
              <ActivityRow icon="stethoscope" title="Clinic visit" sub={`${p.reason || 'Routine review'} · ${p.lastVisit}`} theme={t} />
            </View>
          </View>
        </View>
      </ScrollView>
      <ActionBar theme={t}>
        <Button label={`New prescription for ${p.name.split(' ')[0]}`} icon="plus" theme={t}
          onPress={() => navigation.navigate('PrescribeFlow', { patientId: p.id })} />
      </ActionBar>
    </SafeAreaView>
  );
}
