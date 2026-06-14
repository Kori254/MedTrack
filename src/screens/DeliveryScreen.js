import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { SectionLabel, Chip } from '../components/UI';
import { Icons } from '../components/Icons';

function DeliveryTracker({ d, theme: t }) {
  const steps = ['Dispatched', 'In transit', 'Delivered'];
  const stepIcons = ['package', 'truck', 'home'];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      {steps.map((s, i) => {
        const StepIcon = Icons[stepIcons[i]];
        return (
        <View key={s} style={{ flex: 1, alignItems: 'center', gap: 8, position: 'relative' }}>
          {i < steps.length - 1 && (
            <View style={{ position: 'absolute', top: 16, left: '50%', right: '-50%', height: 2, backgroundColor: i < d.step ? t.primary : t.border, zIndex: 0 }} />
          )}
          <View style={{
            width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', zIndex: 1,
            backgroundColor: i < d.step ? t.primary : i === d.step ? t.surface : t.surface2,
            borderWidth: 2,
            borderColor: i < d.step ? t.primary : i === d.step ? t.primary : t.border,
            ...(i === d.step ? { shadowColor: t.primary, shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 0 } } : {}),
          }}>
            <StepIcon size={16} color={i < d.step ? t.onPrimary : i === d.step ? t.primary : t.text3} />
          </View>
          <Text style={{ fontSize: 11, color: i === d.step ? t.text : t.text2, fontWeight: i === d.step ? '500' : '400', textAlign: 'center' }}>{s}</Text>
        </View>
        );
      })}
    </View>
  );
}

export default function DeliveryScreen({ navigation }) {
  const { state, theme: t } = useApp();
  const d = state.delivery.active;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 14, paddingTop: 6 }}>
        <Text style={{ fontSize: 13, color: t.text2 }}>Track your medication</Text>
        <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Delivery</Text>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 22 }}>
        {/* Active delivery */}
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, gap: 20, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primaryTint }}>
              <Icons.package size={22} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: t.text }}>{d.med}</Text>
              <Text style={{ fontSize: 11, color: t.text3 }}>{d.quantity}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: t.amberTint }}>
              <Icons.truck size={13} color={t.amberText} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: t.amberText }}>In transit</Text>
            </View>
          </View>

          <DeliveryTracker d={d} theme={t} />

          <View style={{ backgroundColor: t.primaryTint, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Icons.clock size={20} color={t.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>Estimated arrival {d.eta}</Text>
              <Text style={{ fontSize: 11, color: t.text3 }}>{d.window}</Text>
            </View>
          </View>
        </View>

        {/* Map placeholder */}
        <View>
          <SectionLabel theme={t}>Live location</SectionLabel>
          <View style={{ height: 168, borderRadius: 18, overflow: 'hidden', backgroundColor: t.surfaceSunken, borderWidth: 1, borderColor: t.border, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ position: 'absolute', top: 14, left: 16 }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 10, color: t.text3 }}>// agent en route · 4.2 km away</Text>
            </View>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Icons.truck size={18} color="#fff" />
            </View>
            <View style={{ position: 'absolute', bottom: 14, right: 16 }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 10, color: t.text3 }}>Kileleshwa →</Text>
            </View>
          </View>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primaryTint }}>
              <Icons.user size={20} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>{d.agent}</Text>
              <Text style={{ fontSize: 11, color: t.text3 }}>Your delivery agent · ref {d.ref}</Text>
            </View>
            <TouchableOpacity style={{ width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
              <Icons.phone size={20} color={t.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Past deliveries */}
        <View>
          <SectionLabel theme={t}>Past deliveries</SectionLabel>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 20, paddingHorizontal: 18, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
            {state.delivery.past.map((p, i) => {
              const failed = p.status === 'Failed';
              const PastIcon = failed ? Icons.alert : Icons.package;
              return (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingVertical: 12, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: t.border }}>
                  <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: failed ? t.coralTint : t.surface2 }}>
                    <PastIcon size={20} color={failed ? t.coralText : t.text2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>{p.med}</Text>
                    <Text style={{ fontSize: 11, color: t.text3 }}>{p.date}</Text>
                  </View>
                  <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: failed ? t.coralTint : t.primaryTint, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: failed ? t.coralText : t.textOnTint }}>{failed ? p.note : 'Delivered'}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
