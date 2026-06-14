import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminApp } from '../AdminContext';
import { KpiCard, EntityRow, AdminAvatar, SectionLabel, PatientFlagChip } from '../ui';
import { Icons } from '../../components/Icons';

export default function OverviewScreen({ navigation }) {
  const { theme: t, clinicians, patients, facilities, adminProfile } = useAdminApp();

  const active    = clinicians.filter((d) => d.status === 'active');
  const invited   = clinicians.filter((d) => d.status === 'invited');
  const suspended = clinicians.filter((d) => d.status === 'suspended');
  const unassigned = patients.filter((p) => !p.doctor_id);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  const firstName = adminProfile?.name?.split(' ')[0] || 'Admin';

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 13, color: t.text2 }}>{today}</Text>
            <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Good morning, {firstName}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('AdminProfile')}
            style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: t.border }}>
            <Text style={{ fontSize: 15, fontWeight: '500', color: t.textOnTint }}>{adminProfile?.initials || 'A'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 22 }}>
          {/* KPI Grid */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <KpiCard icon="stethoscope" tintColor={t.primary} n={active.length} label="Active clinicians" delta="+2 this month"
              onPress={() => navigation.navigate('AdminClinicians')} theme={t} />
            <KpiCard icon="key" tintColor={t.amberText} n={invited.length} label="Pending logins" delta="awaiting sign-in"
              onPress={() => navigation.navigate('AdminClinicians', { filter: 'invited' })} theme={t} />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <KpiCard icon="users" tintColor={t.primary} n={patients.length} label="Patients" delta={`${unassigned.length} unassigned`}
              onPress={() => navigation.navigate('AdminPatients')} theme={t} />
            <KpiCard icon="building" tintColor={t.primary} n={facilities.length} label="Facilities"
              onPress={() => navigation.navigate('AdminFacilities')} theme={t} />
          </View>

          {/* Add doctor CTA */}
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('AddDoctor')}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, height: 54, borderRadius: 16, backgroundColor: t.primary,
              shadowColor: t.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
            <Icons.userPlus size={20} color={t.onPrimary} />
            <Text style={{ fontSize: 16, fontWeight: '500', color: t.onPrimary }}>Add a clinician</Text>
          </TouchableOpacity>

          {/* Awaiting first sign-in */}
          {invited.length > 0 && (
            <View>
              <SectionLabel action="See all" onAction={() => navigation.navigate('AdminClinicians', { filter: 'invited' })} theme={t}>
                Awaiting first sign-in
              </SectionLabel>
              <View style={{ gap: 10 }}>
                {invited.map((d) => (
                  <EntityRow key={d.id}
                    who={<AdminAvatar who={d} theme={t} />}
                    sub={<>
                      <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{d.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                        <Icons.key size={13} color={t.text3} />
                        <Text style={{ fontSize: 11, color: t.text3 }}>Login created · not signed in</Text>
                      </View>
                    </>}
                    onPress={() => navigation.navigate('DoctorDetail', { doctorId: d.id })}
                    theme={t}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Needs attention */}
          <View>
            <SectionLabel theme={t}>Needs attention</SectionLabel>
            <View style={{ gap: 10 }}>
              {unassigned.length > 0 && (
                <EntityRow
                  who={<View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.amberTint, alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.users size={20} color={t.amberText} />
                  </View>}
                  sub={<>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{unassigned.length} patients unassigned</Text>
                    <Text style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>Assign a clinician to begin monitoring</Text>
                  </>}
                  onPress={() => navigation.navigate('AdminPatients', { filter: 'unassigned' })}
                  theme={t}
                />
              )}
              {suspended.map((d) => (
                <EntityRow key={d.id}
                  who={<View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.coralTint, alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.ban size={20} color={t.coralText} />
                  </View>}
                  sub={<>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{d.name} suspended</Text>
                    <Text style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>{d.lastActive} · review access</Text>
                  </>}
                  onPress={() => navigation.navigate('DoctorDetail', { doctorId: d.id })}
                  theme={t}
                />
              ))}
              {unassigned.length === 0 && suspended.length === 0 && (
                <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 18, padding: 20, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: t.text3 }}>All clear — nothing needs attention</Text>
                </View>
              )}
            </View>
          </View>

          {/* Recently active */}
          <View>
            <SectionLabel action="All clinicians" onAction={() => navigation.navigate('AdminClinicians')} theme={t}>
              Recently active
            </SectionLabel>
            <View style={{ gap: 10 }}>
              {active.slice(0, 3).map((d) => (
                <EntityRow key={d.id}
                  who={<AdminAvatar who={d} theme={t} />}
                  sub={<>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{d.name}</Text>
                    <Text style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>{d.specialty} · {d.lastActive}</Text>
                  </>}
                  onPress={() => navigation.navigate('DoctorDetail', { doctorId: d.id })}
                  theme={t}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
