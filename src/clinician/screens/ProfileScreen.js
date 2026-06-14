// MedTrack Clinician — prescriber profile (compact).
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../AppContext';
import { SectionLabel } from '../../components/UI';
import { Icons } from '../../components/Icons';
import { Avatar, FieldCard, Button } from '../ui';
import { CLIN, ROSTER } from '../data';

function Row({ icon, label, value, last, theme: t }) {
  const Ic = Icons[icon];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: t.border }}>
      <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface2 }}>
        <Ic size={18} color={t.text2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: t.text3 }}>{label}</Text>
        <Text style={{ fontSize: 14, fontWeight: '500', color: t.text, marginTop: 1 }}>{value}</Text>
      </View>
    </View>
  );
}

function MiniStat({ n, label, theme: t }) {
  return (
    <View style={{ flex: 1, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, padding: 14,
      shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
      <Text style={{ fontSize: 26, fontWeight: '500', color: t.text, letterSpacing: -0.6 }}>{n}</Text>
      <Text style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function ClinProfileScreen() {
  const { theme: t, isDark, actions } = useApp();
  const c = CLIN;
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
          <Text style={{ fontSize: 13, color: t.text2 }}>Account</Text>
          <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Profile</Text>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 18 }}>
          <FieldCard theme={t} style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Avatar size="lg" theme={t}>{c.initials}</Avatar>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '500', color: t.text, letterSpacing: -0.3 }}>{c.name}</Text>
              <Text style={{ fontSize: 13, color: t.text2, marginTop: 2 }}>{c.role}</Text>
            </View>
          </FieldCard>

          <View>
            <SectionLabel theme={t}>Prescriber</SectionLabel>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, paddingHorizontal: 16,
              shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
              <Row icon="shield" label="Registration" value={c.reg} theme={t} />
              <Row icon="building" label="Facility" value={c.facility} theme={t} />
              <Row icon="stethoscope" label="Specialty" value={c.role} last theme={t} />
            </View>
          </View>

          <View>
            <SectionLabel theme={t}>Preferences</SectionLabel>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, paddingHorizontal: 16,
              shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface2 }}>
                  {isDark ? <Icons.moon size={18} color={t.text2} /> : <Icons.sun size={18} color={t.text2} />}
                </View>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: t.text }}>Dark mode</Text>
                <Button label={isDark ? 'On' : 'Off'} variant="tonal" onPress={actions.toggleTheme} style={{ minHeight: 36, paddingHorizontal: 16 }} theme={t} />
              </View>
            </View>
          </View>

          <View>
            <SectionLabel theme={t}>This week</SectionLabel>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <MiniStat n={28} label="Prescriptions" theme={t} />
              <MiniStat n={19} label="Refills approved" theme={t} />
              <MiniStat n={ROSTER.length} label="Active patients" theme={t} />
            </View>
          </View>

          <Button label="Log out" icon="logout" variant="ghost" onPress={actions.logout} theme={t} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
