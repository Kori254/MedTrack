import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminApp } from '../AdminContext';
import { EntityRow, AdminAvatar, SectionLabel, StatusPill, BackBar, MetaRow, PermissionRow, SearchBox, SegmentedControl, PatientFlagChip, InfoBanner } from '../ui';
import { Icons } from '../../components/Icons';
import { PERMISSIONS, ROLES } from '../data';

const FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'active',    label: 'Active' },
  { id: 'invited',   label: 'Pending' },
  { id: 'suspended', label: 'Suspended' },
];

export function CliniciansListScreen({ navigation, route }) {
  const { theme: t, clinicians, patients, setClinicianStatus } = useAdminApp();
  const [filter, setFilter] = useState(route?.params?.filter || 'all');
  const [q, setQ] = useState('');

  let list = clinicians;
  if (filter !== 'all') list = list.filter((d) => d.status === filter);
  if (q) list = list.filter((d) =>
    d.name?.toLowerCase().includes(q.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(q.toLowerCase()) ||
    d.reg?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 13, color: t.text2 }}>{clinicians.length} in the network</Text>
            <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Clinicians</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('AdminProfile')}
            style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: t.border }}>
            <Icons.user size={20} color={t.textOnTint} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          <SearchBox value={q} onChangeText={setQ} placeholder="Search name, specialty or reg. no." theme={t} />
          <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} theme={t} />

          <View style={{ gap: 10 }}>
            {list.map((d) => (
              <EntityRow key={d.id}
                who={<AdminAvatar who={d} theme={t} />}
                sub={<>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{d.name}</Text>
                  <Text style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>{d.specialty}</Text>
                </>}
                trailing={<StatusPill status={d.status} theme={t} />}
                onPress={() => navigation.navigate('DoctorDetail', { doctorId: d.id })}
                theme={t}
              />
            ))}
            {list.length === 0 && (
              <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 18, padding: 32, alignItems: 'center', gap: 8 }}>
                <Icons.users size={28} color={t.text3} />
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>No clinicians here</Text>
                <Text style={{ fontSize: 13, color: t.text3, textAlign: 'center' }}>{q ? `Nothing matches "${q}".` : 'No one with this status yet.'}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('AddDoctor')}
        style={{ position: 'absolute', right: 18, bottom: 90, flexDirection: 'row', alignItems: 'center', gap: 9,
          height: 56, paddingHorizontal: 22, borderRadius: 18, backgroundColor: t.primary, zIndex: 40,
          shadowColor: t.primary, shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } }}>
        <Icons.userPlus size={20} color={t.onPrimary} />
        <Text style={{ fontSize: 15, fontWeight: '500', color: t.onPrimary }}>Add</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export function DoctorDetailScreen({ navigation, route }) {
  const { theme: t, clinicians, patients, setClinicianStatus } = useAdminApp();
  const { doctorId } = route.params;
  const [sheet, setSheet] = useState(false);

  const d = clinicians.find((x) => x.id === doctorId);
  if (!d) return null;

  const role = ROLES.find((r) => r.id === d.role);
  const grants = role ? role.grants : (d.permissions || []);
  const myPatients = patients.filter((p) => p.doctor_id === d.id);
  const invited = d.status === 'invited';
  const suspended = d.status === 'suspended';

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <BackBar title="Clinician" onBack={() => navigation.goBack()}
        trailing={<TouchableOpacity onPress={() => setSheet(true)}
          style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
          <Icons.dots size={20} color={t.text} />
        </TouchableOpacity>}
        theme={t}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 20, gap: 22 }}>
          {/* Hero */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 8 }}>
            <AdminAvatar who={d} size="lg" theme={t} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 21, fontWeight: '500', color: t.text }}>{d.name}</Text>
              <Text style={{ fontSize: 13, color: t.text2, marginTop: 3 }}>{d.specialty}</Text>
            </View>
            <StatusPill status={d.status} theme={t} />
          </View>

          {/* Invited banner */}
          {invited && (
            <View style={{ backgroundColor: t.amberTint, borderRadius: 18, padding: 16, gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.key size={18} color={t.amberText} />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: t.amberText }}>Login created · not signed in</Text>
                  <Text style={{ fontSize: 11, color: t.amberText, opacity: 0.85, marginTop: 1 }}>{d.lastActive}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {invited ? (
              <TouchableOpacity style={[btnStyle(t, true), { flex: 1 }]} onPress={() => setSheet(true)}>
                <Icons.sliders size={18} color={t.onPrimary} />
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.onPrimary }}>Manage</Text>
              </TouchableOpacity>
            ) : suspended ? (
              <>
                <TouchableOpacity style={[btnStyle(t, true), { flex: 1 }]} onPress={() => { setClinicianStatus(d.id, 'active'); navigation.goBack(); }}>
                  <Icons.shieldCheck size={18} color={t.onPrimary} />
                  <Text style={{ fontSize: 15, fontWeight: '500', color: t.onPrimary }}>Reactivate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[btnStyle(t, false), { flex: 1 }]} onPress={() => setSheet(true)}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>More</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={[btnStyle(t, true), { flex: 1 }]}
                  onPress={() => navigation.navigate('AssignPatients', { doctorId: d.id })}>
                  <Icons.userPlus size={18} color={t.onPrimary} />
                  <Text style={{ fontSize: 15, fontWeight: '500', color: t.onPrimary }}>Assign patients</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[btnStyle(t, false), { flex: 1 }]} onPress={() => setSheet(true)}>
                  <Icons.sliders size={18} color={t.text} />
                  <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>Manage</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Details */}
          <View>
            <SectionLabel theme={t}>Details</SectionLabel>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, paddingHorizontal: 16 }}>
              <MetaRow icon="building" label="Facility" value={d.facility_name || d.facility || '—'} theme={t} />
              <MetaRow icon="idBadge" label="Registration no." value={d.reg || '—'} theme={t} />
              <MetaRow icon="shield" label="Role" value={role?.name || '—'} theme={t} />
              <MetaRow icon="mail" label="Email" value={d.email || '—'} theme={t} />
              <MetaRow icon="phone" label="Phone" value={d.phone || '—'} theme={t} />
              <MetaRow icon="calendar" label={invited ? 'Status' : 'Joined'} value={d.joined || d.lastActive || '—'} last theme={t} />
            </View>
          </View>

          {/* Permissions */}
          <View>
            <SectionLabel theme={t}>Permissions</SectionLabel>
            <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, overflow: 'hidden' }}>
              {PERMISSIONS.map((p) => (
                <PermissionRow key={p.id} perm={p} on={grants.includes(p.id)} locked theme={t} />
              ))}
            </View>
          </View>

          {/* Assigned patients */}
          {!invited && (
            <View>
              <SectionLabel action={myPatients.length ? 'Manage' : null} onAction={() => navigation.navigate('AssignPatients', { doctorId: d.id })} theme={t}>
                Assigned patients · {myPatients.length}
              </SectionLabel>
              {myPatients.length > 0 ? (
                <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, overflow: 'hidden' }}>
                  {myPatients.map((p, i) => (
                    <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14,
                      borderTopWidth: i === 0 ? 0 : 1, borderTopColor: t.border }}>
                      <AdminAvatar who={p} size="sm" theme={t} />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>{p.name}</Text>
                        <Text style={{ fontSize: 12, color: t.text3, marginTop: 1 }}>{p.dx}</Text>
                      </View>
                      {p.flag ? <PatientFlagChip flag={p.flag} theme={t} /> : null}
                    </View>
                  ))}
                </View>
              ) : (
                <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 18, padding: 20, alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 14, color: t.text3 }}>No patients assigned yet</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('AssignPatients', { doctorId: d.id })}>
                    <Text style={{ fontSize: 13, color: t.primary, fontWeight: '500' }}>Assign patients</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action sheet */}
      <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={() => setSheet(false)} />
        <View style={{ backgroundColor: t.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: t.border2, alignSelf: 'center', marginBottom: 16 }} />
          <Text style={{ fontSize: 13, fontWeight: '500', color: t.text3, marginBottom: 4 }}>{d.name}</Text>
          {!invited && <SheetBtn icon="userPlus" label="Assign patients" onPress={() => { setSheet(false); navigation.navigate('AssignPatients', { doctorId: d.id }); }} t={t} />}
          {invited && <SheetBtn icon="eye" label="Preview the doctor's login" onPress={() => setSheet(false)} t={t} />}
          {d.status === 'active' && <SheetBtn icon="ban" label="Suspend access" danger onPress={() => { setSheet(false); setClinicianStatus(d.id, 'suspended'); }} t={t} />}
          {suspended && <SheetBtn icon="shieldCheck" label="Reactivate access" onPress={() => { setSheet(false); setClinicianStatus(d.id, 'active'); }} t={t} />}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SheetBtn({ icon, label, onPress, danger, t }) {
  const Ic = Icons[icon];
  return (
    <TouchableOpacity onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, borderTopWidth: 1, borderTopColor: t.border }}>
      <View style={{ width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
        backgroundColor: danger ? t.coralTint : t.surface2 }}>
        {Ic && <Ic size={18} color={danger ? t.coralText : t.text2} />}
      </View>
      <Text style={{ fontSize: 15, fontWeight: '500', color: danger ? t.coralText : t.text }}>{label}</Text>
    </TouchableOpacity>
  );
}

function btnStyle(t, primary) {
  return {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 48, borderRadius: 14,
    backgroundColor: primary ? t.primary : t.surface,
    borderWidth: primary ? 0 : 1, borderColor: t.border,
  };
}
