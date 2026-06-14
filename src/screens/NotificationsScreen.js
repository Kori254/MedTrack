import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { TopBar, SectionLabel } from '../components/UI';
import { Icons } from '../components/Icons';

const NOTE_ICON = { dose: 'droplet', refill: 'refresh', delivery: 'truck', facility: 'message' };
const NOTE_BG = (type, t) => {
  if (type === 'dose' || type === 'delivery') return t.primaryTint;
  if (type === 'refill') return t.amberTint;
  return t.surface2;
};
const NOTE_COLOR = (type, t) => {
  if (type === 'dose' || type === 'delivery') return t.primary;
  if (type === 'refill') return t.amberText;
  return t.text2;
};

export default function NotificationsScreen({ navigation }) {
  const { state, theme: t, actions } = useApp();

  const grouped = state.notifications.reduce((a, n) => {
    (a[n.when] = a[n.when] || []).push(n);
    return a;
  }, {});

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
      <TopBar
        title="Notifications"
        onBack={() => navigation.goBack()}
        theme={t}
        trailing={
          <TouchableOpacity onPress={actions.markAllRead}>
            <Text style={{ fontSize: 12, color: t.primary, fontWeight: '500' }}>Read all</Text>
          </TouchableOpacity>
        }
      />
      <View style={{ paddingHorizontal: 20, gap: 22 }}>
        {Object.entries(grouped).map(([when, items]) => (
          <View key={when}>
            <SectionLabel theme={t}>{when}</SectionLabel>
            <View style={{ gap: 10 }}>
              {items.map((n) => {
                const NoteIc = Icons[NOTE_ICON[n.type]];
                return (
                <TouchableOpacity key={n.id}
                  onPress={() => { if (n.type === 'delivery') navigation.navigate('Delivery'); else navigation.navigate('Home'); }}
                  style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, flexDirection: 'row', gap: 13, alignItems: 'flex-start', opacity: n.unread ? 1 : 0.82, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
                  <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: NOTE_BG(n.type, t) }}>
                    <NoteIc size={20} color={NOTE_COLOR(n.type, t)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: t.text }}>{n.title}</Text>
                      {n.unread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.primary }} />}
                    </View>
                    <Text style={{ fontSize: 13, color: t.text2, marginTop: 2 }}>{n.body}</Text>
                    <Text style={{ fontSize: 11, color: t.text3, marginTop: 6 }}>{n.time}</Text>
                  </View>
                </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
