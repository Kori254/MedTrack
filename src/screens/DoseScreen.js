import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { BottomSheet } from '../components/UI';
import { Icons } from '../components/Icons';
import { SKIP_REASONS } from '../data';

export default function DoseScreen({ navigation, route }) {
  const { medId } = route.params;
  const { state, theme: t, actions } = useApp();
  const med = state.meds.find((m) => m.id === medId) || state.meds[0];
  const [phase, setPhase] = useState(med.todayStatus === 'taken' ? 'done' : 'confirm');
  const [skipOpen, setSkipOpen] = useState(false);
  const [reason, setReason] = useState(null);

  function confirm() {
    actions.confirmDose(med.id);
    setPhase('done');
    setTimeout(() => navigation.goBack(), 1700);
  }

  function doSkip() {
    if (!reason) return;
    actions.skipDose(med.id, reason);
    setSkipOpen(false);
    navigation.goBack();
  }

  if (phase === 'done') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26, padding: 32, backgroundColor: t.appBg }}>
        <View style={{ width: 116, height: 116, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 116, height: 116, borderRadius: 58, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Icons.check size={56} color={t.onPrimary} sw={2.4} />
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '500', color: t.text }}>Dose confirmed</Text>
          <Text style={{ fontSize: 13, color: t.text2, marginTop: 4 }}>{med.name} {med.strength} · logged at 8:12 AM</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}
            style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
            <Icons.x size={22} color={t.text} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, paddingHorizontal: 20, paddingBottom: 30 }}>
          <View style={{ width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primaryTint }}>
            <Icons.capsule size={42} color={t.primary} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: t.text3 }}>{med.scheduleLabel}</Text>
            <Text style={{ fontSize: 32, fontWeight: '500', color: t.text, marginTop: 8, letterSpacing: -0.5 }}>{med.name}</Text>
            <Text style={{ fontSize: 20, color: t.text2, marginTop: 2 }}>{med.strength} · {med.form}</Text>
          </View>
          <View style={{ backgroundColor: t.primaryTint, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'center' }}>
            <Icons.info size={18} color={t.primary} />
            <Text style={{ fontSize: 13, color: t.text2 }}>Take with a full glass of water</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, gap: 8, paddingBottom: 34 }}>
        <TouchableOpacity onPress={confirm}
          style={{ backgroundColor: t.primary, borderRadius: 16, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          <Icons.check size={20} color={t.onPrimary} />
          <Text style={{ fontSize: 16, fontWeight: '500', color: t.onPrimary }}>I've taken this dose</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSkipOpen(true)} style={{ alignItems: 'center', padding: 10 }}>
          <Text style={{ fontSize: 14, color: t.text2 }}>Skip this dose</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet open={skipOpen} onClose={() => setSkipOpen(false)} title="Why are you skipping this dose?" theme={t}>
        <View style={{ gap: 8 }}>
          {SKIP_REASONS.map((r) => (
            <TouchableOpacity key={r} onPress={() => setReason(r)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderWidth: 1, borderColor: reason === r ? t.primary : t.border2, borderRadius: 15, backgroundColor: reason === r ? t.primaryTint : t.surface }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: reason === r ? t.primary : t.border2, alignItems: 'center', justifyContent: 'center' }}>
                {reason === r && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.primary }} />}
              </View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={doSkip} disabled={!reason}
          style={{ backgroundColor: reason ? t.primary : t.border2, borderRadius: 16, minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: 16, opacity: reason ? 1 : 0.5 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: reason ? t.onPrimary : t.text3 }}>Confirm skip</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 11, color: t.text3, textAlign: 'center', marginTop: 12 }}>Your facility is notified so they can follow up if needed.</Text>
      </BottomSheet>
    </SafeAreaView>
  );
}
