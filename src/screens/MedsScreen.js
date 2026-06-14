import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { supplyStatus, supplyTextColor } from '../theme';
import { SupplyBar, MedTile } from '../components/UI';
import { Icons } from '../components/Icons';

function MedCard({ med, navigation, theme: t }) {
  const st = supplyStatus(med.daysRemaining);
  const dayColor = supplyTextColor(st, t);

  let statusEl;
  if (med.todayStatus === 'taken') {
    statusEl = (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: t.primaryTint }}>
        <Icons.checkSm size={14} color={t.textOnTint} />
        <Text style={{ fontSize: 12, fontWeight: '500', color: t.textOnTint }}>Taken {med.takenAt}</Text>
      </View>
    );
  } else if (med.todayStatus === 'pending') {
    statusEl = (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: t.amberTint }}>
        <Icons.clock size={13} color={t.amberText} />
        <Text style={{ fontSize: 12, fontWeight: '500', color: t.amberText }}>Due now</Text>
      </View>
    );
  } else if (med.todayStatus === 'upcoming') {
    statusEl = (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: t.surface2 }}>
        <Icons.clock size={13} color={t.text3} />
        <Text style={{ fontSize: 12, fontWeight: '500', color: t.text2 }}>9:00 PM</Text>
      </View>
    );
  } else {
    statusEl = (
      <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: t.coralTint, justifyContent: 'center' }}>
        <Text style={{ fontSize: 12, fontWeight: '500', color: t.coralText }}>Missed</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate('MedDetail', { medId: med.id })}
      style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
        <MedTile med={med} theme={t} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: t.text }}>{med.name}</Text>
            <Text style={{ fontSize: 13, color: t.text2 }}>{med.strength}</Text>
          </View>
          <Text style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>{med.scheduleLabel}</Text>
          <View style={{ marginTop: 10 }}>{statusEl}</View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 26, fontWeight: '500', color: dayColor, lineHeight: 26 }}>{med.daysRemaining}</Text>
          <Text style={{ fontSize: 11, color: t.text3 }}>days left</Text>
        </View>
      </View>
      <View style={{ marginTop: 14 }}>
        <SupplyBar days={med.daysRemaining} total={med.totalDays} showLabel={false} theme={t} />
      </View>
    </TouchableOpacity>
  );
}

export default function MedsScreen({ navigation }) {
  const { state, theme: t } = useApp();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 14, paddingTop: 6 }}>
        <Text style={{ fontSize: 13, color: t.text2 }}>{state.meds.length} active prescriptions</Text>
        <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Medications</Text>
      </View>
      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        {state.meds.map((m) => <MedCard key={m.id} med={m} navigation={navigation} theme={t} />)}
        <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}
          style={{ backgroundColor: t.primaryTint, borderRadius: 16, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 4 }}>
          <Icons.plus size={20} color={t.textOnTint} />
          <Text style={{ fontSize: 16, fontWeight: '500', color: t.textOnTint }}>Add a medication</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: t.primaryTint, borderRadius: 22, padding: 18, flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginTop: 4 }}>
          <Icons.building size={20} color={t.primary} />
          <Text style={{ flex: 1, fontSize: 13, color: t.text2, lineHeight: 19 }}>Your facility, {state.patient.facility}, can also add or update prescriptions remotely — new medications appear here automatically.</Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
