import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminApp } from '../AdminContext';
import { EntityRow, AdminAvatar, SectionLabel, StatusPill, BackBar, MetaRow } from '../ui';
import { Icons } from '../../components/Icons';
import { PERMISSIONS, ROLES } from '../data';

function MenuRow({ icon, label, sub, onPress, danger, t }) {
  const Ic = Icons[icon];
  return (
    <TouchableOpacity onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14,
        borderTopWidth: 1, borderTopColor: t.border }}>
      <View style={{ width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
        backgroundColor: danger ? t.coralTint : t.surface2 }}>
        {Ic && <Ic size={18} color={danger ? t.coralText : t.text2} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: danger ? t.coralText : t.text }}>{label}</Text>
        {sub && <Text style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>{sub}</Text>}
      </View>
      <Icons.chevronR size={18} color={t.text3} />
    </TouchableOpacity>
  );
}

export function MoreHubScreen({ navigation }) {
  const { theme: t, adminProfile, clinicians, facilities } = useAdminApp();
  const a = adminProfile || {};

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
          <Text style={{ fontSize: 13, color: t.text2 }}>Settings</Text>
          <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>More</Text>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 22 }}>
          {/* Admin profile card */}
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('AdminProfile')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 14,
              backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18,
              shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
            <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '500', color: t.textOnTint }}>{a.initials || 'A'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: t.text }}>{a.name || 'Administrator'}</Text>
              <Text style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>Network administrator · {a.org || ''}</Text>
            </View>
            <Icons.chevronR size={18} color={t.text3} />
          </TouchableOpacity>

          {/* Network section */}
          <View>
            <SectionLabel theme={t}>Network</SectionLabel>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, paddingHorizontal: 16 }}>
              <MenuRow icon="building" label="Facilities" sub={`${(facilities || []).length} hospitals & clinics`}
                onPress={() => navigation.navigate('AdminFacilities')} t={t} />
              <MenuRow icon="shield" label="Roles & permissions" sub={`${ROLES.length} roles defined`}
                onPress={() => navigation.navigate('AdminRoles')} t={t} />
              <MenuRow icon="userPlus" label="Invite a clinician" sub="Add a new doctor to the network"
                onPress={() => navigation.navigate('AddDoctor')} t={t} />
            </View>
          </View>

          {/* Data section */}
          <View>
            <SectionLabel theme={t}>Data</SectionLabel>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, paddingHorizontal: 16 }}>
              <MenuRow icon="file" label="Export network report" sub="Clinicians, patients & adherence" onPress={() => {}} t={t} />
              <MenuRow icon="activity" label="Activity log" sub="Account & access changes" onPress={() => {}} t={t} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function FacilitiesScreen({ navigation }) {
  const { theme: t, facilities, clinicians } = useAdminApp();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <BackBar title="Facilities" sub={`${(facilities || []).length} in the network`} onBack={() => navigation.goBack()} theme={t} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 10 }}>
        {(facilities || []).map((fc) => {
          const activeDocs = clinicians.filter((d) => d.facility_id === fc.id && d.status === 'active').length;
          const HUE = { teal: t.primaryTint, amber: t.amberTint, coral: t.coralTint, slate: t.surface2 };
          const hueColor = HUE[fc.hue] || t.primaryTint;
          return (
            <TouchableOpacity key={fc.id} activeOpacity={0.85}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 14,
                backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18,
                shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
              <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: hueColor, alignItems: 'center', justifyContent: 'center' }}>
                <Icons.building size={22} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{fc.name}</Text>
                <Text style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>{fc.type} · {fc.city}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: t.text }}>{activeDocs}</Text>
                <Text style={{ fontSize: 11, color: t.text3 }}>clinicians</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

export function RolesScreen({ navigation }) {
  const { theme: t } = useAdminApp();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <BackBar title="Roles & permissions" onBack={() => navigation.goBack()} theme={t} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 22 }}>
        <Text style={{ fontSize: 14, color: t.text2, lineHeight: 21 }}>
          Each role grants a default set of permissions when you invite a clinician. You can fine-tune permissions per person.
        </Text>
        {ROLES.map((r) => (
          <View key={r.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                <Icons.shield size={18} color={t.primary} />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{r.name}</Text>
                <Text style={{ fontSize: 12, color: t.text3, marginTop: 1 }}>{r.desc}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, overflow: 'hidden' }}>
              {PERMISSIONS.map((p) => {
                const on = r.grants.includes(p.id);
                const Ic = Icons[p.icon];
                return (
                  <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14,
                    opacity: on ? 1 : 0.5, borderTopWidth: PERMISSIONS.indexOf(p) === 0 ? 0 : 1, borderTopColor: t.border }}>
                    <View style={{ width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: on ? t.primaryTint : t.surface2 }}>
                      {Ic && <Ic size={17} color={on ? t.primary : t.text2} />}
                    </View>
                    <Text style={{ flex: 1, fontSize: 13.5, fontWeight: '500', color: t.text }}>{p.name}</Text>
                    {on ? <Icons.check size={18} color={t.primary} /> : <Icons.minus size={16} color={t.text3} />}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export function AdminProfileScreen({ navigation }) {
  const { theme: t, adminProfile, isDark, setIsDark, signOut } = useAdminApp();
  const a = adminProfile || {};

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <BackBar title="Profile" onBack={() => navigation.goBack()} theme={t} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 22 }}>
        {/* Hero */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 60, height: 60, borderRadius: 19, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: '500', color: t.textOnTint }}>{a.initials || 'A'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '500', color: t.text }}>{a.name || 'Administrator'}</Text>
            <Text style={{ fontSize: 13, color: t.text2, marginTop: 3 }}>{a.role || 'Network Administrator'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 24, paddingHorizontal: 9, borderRadius: 8, backgroundColor: t.primaryTint }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.textOnTint }} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: t.textOnTint }}>Administrator</Text>
          </View>
        </View>

        {/* Account */}
        <View>
          <SectionLabel theme={t}>Account</SectionLabel>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, paddingHorizontal: 16 }}>
            <MetaRow icon="building" label="Organisation" value={a.org || '—'} theme={t} />
            <MetaRow icon="mail" label="Email" value={a.email || '—'} theme={t} />
            <MetaRow icon="shield" label="Access" value="Full network administrator" last theme={t} />
          </View>
        </View>

        {/* Appearance */}
        <View>
          <SectionLabel theme={t}>Appearance</SectionLabel>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: t.surface2, alignItems: 'center', justifyContent: 'center' }}>
                {isDark ? <Icons.moon size={18} color={t.text2} /> : <Icons.sun size={18} color={t.text2} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>Dark mode</Text>
                <Text style={{ fontSize: 12, color: t.text3, marginTop: 1 }}>{isDark ? 'On' : 'Off'}</Text>
              </View>
              <Switch value={isDark} onValueChange={setIsDark} trackColor={{ false: t.border2, true: t.primary }} />
            </View>
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={{ height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10,
          backgroundColor: t.surface, borderWidth: 1, borderColor: t.coralTint }}
          onPress={signOut}>
          <Icons.logout size={18} color={t.coralText} />
          <Text style={{ fontSize: 15, fontWeight: '500', color: t.coralText }}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
