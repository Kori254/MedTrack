import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { SectionLabel } from '../components/UI';
import { Icons } from '../components/Icons';

function Toggle({ on, onPress, theme: t }) {
  return (
    <TouchableOpacity onPress={onPress}
      style={{ width: 46, height: 28, borderRadius: 99, backgroundColor: on ? t.primary : t.border2, justifyContent: 'center', paddingHorizontal: 3 }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignSelf: on ? 'flex-end' : 'flex-start', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 1.5, shadowOffset: { width: 0, height: 1 } }} />
    </TouchableOpacity>
  );
}

function SetRow({ icon, label, value, onPress, trailing, danger, last, theme: t }) {
  const RowIcon = Icons[icon];
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress && trailing === undefined}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingVertical: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: t.border }}>
      <View style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: danger ? t.coralTint : t.surface2 }}>
        <RowIcon size={20} color={danger ? t.coralText : t.text2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: danger ? t.coralText : t.text }}>{label}</Text>
        {value && <Text style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{value}</Text>}
      </View>
      {trailing !== undefined ? trailing : (onPress && <Icons.chevronR size={18} color={t.text3} />)}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const { state, theme: t, isDark, actions } = useApp();
  const handleLogout = () => actions.logout();
  const p = state.patient;
  const notifyLabel = { push: 'Push only', sms: 'SMS only', both: 'Push & SMS' }[p.notify];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 14, paddingTop: 6 }}>
        <Text style={{ fontSize: 13, color: t.text2 }}>Account</Text>
        <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Profile</Text>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 22 }}>
        {/* Identity */}
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
          <View style={{ width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primary }}>
            <Text style={{ fontSize: 22, fontWeight: '500', color: t.onPrimary }}>{p.firstName[0]}{p.lastName[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: t.text }}>{p.firstName} {p.lastName}</Text>
            <Text style={{ fontSize: 13, color: t.text2 }}>{p.facility}</Text>
          </View>
          <TouchableOpacity style={{ width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
            <Icons.edit size={19} color={t.primary} />
          </TouchableOpacity>
        </View>

        {/* Personal */}
        <View>
          <SectionLabel theme={t}>Personal</SectionLabel>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, paddingHorizontal: 18, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
            <SetRow icon="user" label="Date of birth" value={p.dob} theme={t} />
            <SetRow icon="phone" label="Phone" value={p.phone} theme={t} />
            <SetRow icon="mapPin" label="Delivery address" value={p.address} onPress={() => {}} theme={t} />
            <SetRow icon="building" label="Linked facility" value={p.facility} onPress={() => {}} last theme={t} />
          </View>
        </View>

        {/* Preferences */}
        <View>
          <SectionLabel theme={t}>Preferences</SectionLabel>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, paddingHorizontal: 18, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
            <SetRow icon={isDark ? 'moon' : 'sun'} label="Dark mode" trailing={<Toggle on={isDark} onPress={actions.toggleTheme} theme={t} />} theme={t} />
            <SetRow icon="bell" label="Notifications" value={notifyLabel} onPress={() => {}} theme={t} />
            <SetRow icon="globe" label="Language" value={`${p.language} · Kiswahili`} onPress={() => {}} last theme={t} />
          </View>
        </View>

        {/* Safety */}
        <View>
          <SectionLabel theme={t}>Safety</SectionLabel>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, paddingHorizontal: 18, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
            <SetRow icon="heartPulse" label="Emergency contact" value={`${p.emergency} · ${p.emergencyPhone}`} onPress={() => {}} theme={t} />
            <SetRow icon="shield" label="Data & privacy" value="Manage your health data" onPress={() => {}} last theme={t} />
          </View>
        </View>

        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 22, paddingHorizontal: 18, shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
          <SetRow icon="logout" label="Log out" danger onPress={handleLogout} last theme={t} />
        </View>

        <Text style={{ fontSize: 11, color: t.text3, textAlign: 'center' }}>MedTrack · v1.0 · Nairobi</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
