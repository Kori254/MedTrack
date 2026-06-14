import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { supplyStatus, supplyTextColor } from '../theme';
import { SupplyBar, StreakDots, Chip, MedTile, SectionLabel, DoseRing } from '../components/UI';
import { Icons } from '../components/Icons';

function Greeting({ state, theme: t, navigation, unread }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14, paddingTop: 6 }}>
      <View style={{ gap: 3 }}>
        <Text style={{ fontSize: 13, color: t.text2 }}>{state.today.full}</Text>
        <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Habari, {state.patient.firstName}</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}
        style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, position: 'relative' }}>
        <Icons.bell size={22} color={t.text} />
        {unread > 0 && (
          <View style={{ position: 'absolute', top: 7, right: 8, minWidth: 17, height: 17, paddingHorizontal: 3, borderRadius: 9, backgroundColor: t.coral, borderWidth: 2, borderColor: t.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '500', color: '#fff' }}>{unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

function AdherenceCard({ state, theme: t }) {
  const ok = state.adherence.message.includes('track');
  return (
    <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, gap: 16, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 11, color: t.text3 }}>This month's adherence</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
            <Text style={{ fontSize: 28, fontWeight: '500', color: t.text }}>{state.adherence.month}%</Text>
            <Text style={{ fontSize: 13, color: t.primary, fontWeight: '500' }}>on track</Text>
          </View>
        </View>
        <Icons.activity size={26} color={t.primary} />
      </View>
      <StreakDots week={state.week} theme={t} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: ok ? t.primary : t.amber }} />
        <Text style={{ fontSize: 13, color: t.text2 }}>{state.adherence.message}</Text>
      </View>
    </View>
  );
}

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

function StatusHero({ state, navigation, theme: t }) {
  const done = state.meds.filter((m) => m.todayStatus === 'taken').length;
  const total = state.meds.length;
  const lowest = [...state.meds].sort((a, b) => a.daysRemaining - b.daysRemaining)[0];
  const lst = lowest ? supplyStatus(lowest.daysRemaining) : null;
  const d = state.delivery.active;
  const pending = state.meds.find((m) => m.todayStatus === 'pending');

  return (
    <View style={{ backgroundColor: t.primaryTint, borderRadius: 22, padding: 20, gap: 18 }}>
      {/* Dose ring row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <DoseRing done={done} total={total} theme={t} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: t.text }}>Today's doses</Text>
          <Text style={{ fontSize: 13, color: t.text2 }}>{done} confirmed · {total - done} remaining</Text>
        </View>
        {pending && (
          <TouchableOpacity onPress={() => navigation.navigate('Dose', { medId: pending.id })}
            style={{ backgroundColor: t.primary, borderRadius: 12, paddingHorizontal: 16, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: t.onPrimary }}>Confirm</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 1, backgroundColor: t.primaryTint2 }} />

      {/* Supply + Refill row */}
      <View style={{ flexDirection: 'row', gap: 14 }}>
        <TouchableOpacity
          disabled={!lowest}
          onPress={() => lowest && navigation.navigate('MedDetail', { medId: lowest.id })}
          style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: t.text3 }}>Lowest supply</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: 3 }}>
            {lowest ? (
              <>
                <Text style={{ fontSize: 22, fontWeight: '500', color: supplyTextColor(lst, t) }}>{lowest.daysRemaining}d</Text>
                <Text style={{ fontSize: 13, color: t.text2 }}>{lowest.name}</Text>
              </>
            ) : (
              <Text style={{ fontSize: 22, fontWeight: '500', color: t.text2 }}>—</Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: t.primaryTint2 }} />

        <TouchableOpacity onPress={() => navigation.navigate('Delivery')} style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: t.text3 }}>Next refill</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Icons.truck size={18} color={t.primary} />
            <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>{d ? 'Tomorrow' : '—'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}


export default function HomeScreen({ navigation }) {
  const { state, theme: t } = useApp();
  const unread = state.notifications.filter((n) => n.unread).length;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <Greeting state={state} theme={t} navigation={navigation} unread={unread} />
      <View style={{ paddingHorizontal: 20, gap: 22 }}>
        <StatusHero state={state} navigation={navigation} theme={t} />
        <AdherenceCard state={state} theme={t} />
        <View>
          <SectionLabel theme={t}>Active prescriptions</SectionLabel>
          <View style={{ gap: 12 }}>
            {state.meds.map((m) => <MedCard key={m.id} med={m} navigation={navigation} theme={t} />)}
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
