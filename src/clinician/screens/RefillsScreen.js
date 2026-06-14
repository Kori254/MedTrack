// MedTrack Clinician — refill approvals queue.
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../AppContext';
import { Chip } from '../../components/UI';
import { Icons } from '../../components/Icons';
import { Avatar, FieldCard, Button } from '../ui';
import { REFILLS, patientById, supplyStatusCL } from '../data';

function InfoLine({ icon, text, theme: t }) {
  const Ic = Icons[icon];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <Ic size={16} color={t.text3} />
      <Text style={{ fontSize: 13, color: t.text2 }}>{text}</Text>
    </View>
  );
}

function RefillCard({ r, resolved, onResolve, theme: t }) {
  const p = patientById(r.patientId);
  const st = supplyStatusCL(r.supplyDays);
  if (resolved) {
    const ok = resolved === 'approved';
    const ResultIcon = ok ? Icons.check : Icons.x;
    return (
      <FieldCard theme={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, opacity: 0.85 }}>
        <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: ok ? t.primaryTint : t.surface2 }}>
          <ResultIcon size={18} color={ok ? t.primary : t.text2} sw={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>{r.med} {r.strength}</Text>
          <Text style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{p.name} · {ok ? 'Approved — dispatched' : 'Declined'}</Text>
        </View>
      </FieldCard>
    );
  }
  return (
    <FieldCard theme={t} style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', gap: 13, alignItems: 'flex-start' }}>
        <Avatar size="sm" theme={t}>{p.initials}</Avatar>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{r.med}</Text>
            <Text style={{ fontSize: 13, color: t.text2 }}>{r.strength}</Text>
          </View>
          <Text style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{p.name} · {r.when}</Text>
        </View>
        <Chip status={st} theme={t}>{`${r.supplyDays}d left`}</Chip>
      </View>

      <View style={{ gap: 7 }}>
        <InfoLine icon="package" text={r.qty} theme={t} />
        <InfoLine icon={r.deliver.startsWith('Auto') ? 'truck' : 'building'} text={r.deliver} theme={t} />
        <InfoLine icon="info" text={r.reason} theme={t} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button label="Decline" variant="ghost" onPress={() => onResolve('declined')} style={{ flex: 1, minHeight: 44 }} theme={t} />
        <Button label="Approve" icon="check" onPress={() => onResolve('approved')} style={{ flex: 1, minHeight: 44 }} theme={t} />
      </View>
    </FieldCard>
  );
}

export default function RefillsScreen({ navigation }) {
  const { theme: t } = useApp();
  const [resolved, setResolved] = useState({});
  const pending = REFILLS.filter((r) => !resolved[r.id]).length;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 13, color: t.text2 }}>Approvals</Text>
            <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Refill requests</Text>
          </View>
          <View style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
            <Icons.inbox size={22} color={t.text} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: pending ? t.amber : t.primary }} />
            <Text style={{ fontSize: 13, color: t.text2 }}>
              {pending ? `${pending} request${pending === 1 ? '' : 's'} awaiting your approval` : 'All caught up — no pending requests'}
            </Text>
          </View>
          <View style={{ gap: 12 }}>
            {REFILLS.map((r) => (
              <RefillCard key={r.id} r={r} resolved={resolved[r.id]} theme={t}
                onResolve={(v) => setResolved((p) => ({ ...p, [r.id]: v }))} />
            ))}
          </View>
          {pending === 0 && (
            <Button label="Back to today" variant="tonal" onPress={() => navigation.navigate('Today')} style={{ marginTop: 4 }} theme={t} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
