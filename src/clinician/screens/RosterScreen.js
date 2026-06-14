import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../AppContext';
import { SectionLabel } from '../../components/UI';
import { Icons } from '../../components/Icons';
import { Avatar, StatTile, FlagChip, SearchInput, Button } from '../ui';
import { CLIN, ROSTER, REFILLS } from '../data';

function RosterRow({ p, onPress, showTime, theme: t }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18,
        shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
      {showTime && <Text style={{ width: 46, textAlign: 'center', fontSize: 13, fontWeight: '500', color: t.text, letterSpacing: -0.3 }}>{p.appt}</Text>}
      <Avatar size="sm" theme={t}>{p.initials}</Avatar>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 7 }}>
          <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{p.name}</Text>
          <Text style={{ fontSize: 11, color: t.text3 }}>{p.age}{p.sex && p.sex !== '—' ? p.sex : ''}</Text>
        </View>
        <Text numberOfLines={1} style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>{p.dx}</Text>
      </View>
      <FlagChip flag={p.flag} theme={t} />
    </TouchableOpacity>
  );
}

export default function RosterScreen({ navigation }) {
  const { theme: t, clinicianPatients } = useApp();
  const [q, setQ] = useState('');

  const today = ROSTER.filter((p) => p.appt);
  const pendingRefills = REFILLS.length;

  // Merge real DB patients + seed patients. Real patients come first.
  const allPatients = useMemo(() => [...clinicianPatients, ...ROSTER], [clinicianPatients]);

  const filtered = useMemo(() => allPatients.filter((p) =>
    !q ||
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.dx.toLowerCase().includes(q.toLowerCase()) ||
    p.mrn.toLowerCase().includes(q.toLowerCase())
  ), [allPatients, q]);

  const openChart = (id) => navigation.navigate('Chart', { patientId: id });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 13, color: t.text2 }}>Saturday, 27 June</Text>
            <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Good morning, {CLIN.short}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar theme={t}>{CLIN.initials}</Avatar>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 22 }}>
          {/* Stat tiles */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <StatTile icon="users" tint="primary" n={allPatients.length} label="Total patients" onPress={() => {}} theme={t} />
            <StatTile icon="inbox" tint="amber" n={pendingRefills} label="Refills to approve" onPress={() => navigation.navigate('Refills')} theme={t} />
            <StatTile icon="pencil" tint="primary" n={today.length} label="Appts today" onPress={() => {}} theme={t} />
          </View>

          <Button label="New prescription" icon="plus" onPress={() => navigation.navigate('PrescribeFlow')} theme={t} />

          {/* Today's schedule — seed patients only */}
          {today.length > 0 && (
            <View>
              <SectionLabel theme={t}>Today's schedule</SectionLabel>
              <View style={{ gap: 10 }}>
                {today.map((p) => <RosterRow key={p.id} p={p} showTime onPress={() => openChart(p.id)} theme={t} />)}
              </View>
            </View>
          )}

          {/* All patients — real + seed */}
          <View>
            <SectionLabel theme={t}>All patients ({allPatients.length})</SectionLabel>
            <View style={{ marginBottom: 12 }}>
              <SearchInput value={q} onChangeText={setQ} placeholder="Search name, condition or MRN" theme={t} />
            </View>
            <View style={{ gap: 10 }}>
              {filtered.map((p) => <RosterRow key={p.id} p={p} onPress={() => openChart(p.id)} theme={t} />)}
              {filtered.length === 0 && (
                <Text style={{ textAlign: 'center', paddingVertical: 20, color: t.text3 }}>No patients match "{q}"</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
