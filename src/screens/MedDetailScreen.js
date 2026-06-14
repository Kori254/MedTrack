import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { supplyStatus, supplyTextColor, supplyTintColor, STATUS_LABEL } from '../theme';
import { SupplyBar, MedTile, TopBar, SectionLabel, Chip } from '../components/UI';
import { Icons } from '../components/Icons';

function Cal30({ med, theme: t }) {
  const todayIdx = 26;
  const startOffset = 2;
  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push(<View key={`b${i}`} style={{ aspectRatio: 1 }} />);
  }

  for (let i = 0; i < 30; i++) {
    let bg = t.surface2, color = t.text3;
    let borderStyle = {};

    if (i < todayIdx) {
      if (med.missedDays.includes(i)) { bg = t.coralTint; color = t.coralText; }
      else { bg = t.primary; color = t.onPrimary; }
    } else if (i === todayIdx) {
      bg = 'transparent';
      color = t.primary;
      borderStyle = { borderWidth: 1.5, borderColor: t.primary };
    } else {
      bg = t.surface2; color = t.text3;
    }

    cells.push(
      <View key={i} style={[{ aspectRatio: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }, borderStyle]}>
        <Text style={{ fontSize: 12, color, fontWeight: i === todayIdx ? '500' : '400' }}>{i + 1}</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', marginBottom: 7 }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', paddingBottom: 4 }}>
            <Text style={{ fontSize: 10, color: t.text3, textTransform: 'uppercase', letterSpacing: 1 }}>{d}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
        {cells}
      </View>
    </View>
  );
}

export default function MedDetailScreen({ navigation, route }) {
  const { medId } = route.params;
  const { state, theme: t } = useApp();
  const med = state.meds.find((m) => m.id === medId) || state.meds[0];

  if (!med) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
        <TopBar title="Medication" onBack={() => navigation.goBack()} theme={t} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 14, color: t.text2 }}>This medication is no longer available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const st = supplyStatus(med.daysRemaining);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
      <TopBar
        title={med.name}
        sub={`${med.strength} · ${med.purpose}`}
        onBack={() => navigation.goBack()}
        theme={t}
        trailing={
          <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
            <Icons.info size={20} color={t.text} />
          </TouchableOpacity>
        }
      />

      <View style={{ paddingHorizontal: 20, gap: 20 }}>
        {/* Schedule + countdown */}
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
          <MedTile med={med} size={52} theme={t} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: t.text2 }}>{med.scheduleLabel}</Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: t.text, marginTop: 2 }}>Next dose {med.nextDoseIn}</Text>
          </View>
          {med.todayStatus === 'pending' ? (
            <TouchableOpacity onPress={() => navigation.navigate('Dose', { medId: med.id })}
              style={{ backgroundColor: t.primary, borderRadius: 12, paddingHorizontal: 16, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: t.onPrimary }}>Confirm</Text>
            </TouchableOpacity>
          ) : med.todayStatus === 'taken' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: t.primaryTint }}>
              <Icons.checkSm size={14} color={t.textOnTint} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: t.textOnTint }}>Taken</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: t.surface2 }}>
              <Icons.clock size={13} color={t.text3} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: t.text2 }}>Later</Text>
            </View>
          )}
        </View>

        {/* Supply */}
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <View>
              <Text style={{ fontSize: 11, color: t.text3 }}>Days of medication left</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <Text style={{ fontSize: 28, fontWeight: '500', color: supplyTextColor(st, t) }}>{med.daysRemaining}</Text>
                <Text style={{ fontSize: 13, color: t.text2 }}>of {med.totalDays}</Text>
              </View>
            </View>
            <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: supplyTintColor(st, t), justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: supplyTextColor(st, t) }}>{STATUS_LABEL[st]}</Text>
            </View>
          </View>
          <SupplyBar days={med.daysRemaining} total={med.totalDays} showLabel={false} height={10} theme={t} />
          {med.refillState === 'dispatched' && (
            <TouchableOpacity onPress={() => navigation.navigate('Delivery')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingVertical: 12, borderTopWidth: 1, borderTopColor: t.border, marginTop: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primaryTint }}>
                <Icons.truck size={20} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>Refill on the way</Text>
                <Text style={{ fontSize: 11, color: t.text3 }}>Arriving tomorrow · 28 Jun</Text>
              </View>
              <Icons.chevronR size={18} color={t.text3} />
            </TouchableOpacity>
          )}
        </View>

        {/* Calendar */}
        <View>
          <SectionLabel theme={t}>Last 30 days</SectionLabel>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
            <Cal30 med={med} theme={t} />
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              {[['taken', 'Taken', t.primary], ['missed', 'Missed', t.coral], ['future', 'Upcoming', t.border2]].map(([k, l, c]) => (
                <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 11, height: 11, borderRadius: 4, backgroundColor: c }} />
                  <Text style={{ fontSize: 11, color: t.text3 }}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Refill history */}
        <View>
          <SectionLabel theme={t}>Refill history</SectionLabel>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 20, paddingHorizontal: 18, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
            {med.refills.map((r, i) => {
              const isFailed = r.method.startsWith('Failed');
              const RefillIcon = isFailed ? Icons.alert : r.method === 'Pickup' ? Icons.building : Icons.truck;
              return (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingVertical: 12, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: t.border }}>
                  <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface2 }}>
                    <RefillIcon size={20} color={t.text2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: t.text }}>{r.date}</Text>
                    <Text style={{ fontSize: 11, color: t.text3 }}>{r.method === 'Pickup' ? 'Collected at facility' : r.method}</Text>
                  </View>
                  {!isFailed && <Icons.checkSm size={18} color={t.primary} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Prescriber */}
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, gap: 12, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
          {[['Prescribing facility', med.facility], ['Clinician', med.clinician], ['Last pickup', med.lastPickup]].map(([label, val], i) => (
            <React.Fragment key={label}>
              {i > 0 && <View style={{ height: 1, backgroundColor: t.border }} />}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: t.text2 }}>{label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: t.text, maxWidth: 200, textAlign: 'right' }}>{val}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.coralTint, borderRadius: 16, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          <Icons.flag size={18} color={t.coralText} />
          <Text style={{ fontSize: 16, fontWeight: '500', color: t.coralText }}>Report a problem</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
