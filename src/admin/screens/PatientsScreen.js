import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminApp } from '../AdminContext';
import { EntityRow, AdminAvatar, SectionLabel, PatientFlagChip, BackBar, SearchBox, SegmentedControl } from '../ui';
import { Icons } from '../../components/Icons';

const FILTERS = [
  { id: 'all',        label: 'All' },
  { id: 'unassigned', label: 'Unassigned' },
  { id: 'flagged',    label: 'Flagged' },
];

export function PatientsListScreen({ navigation, route }) {
  const { theme: t, patients, clinicians } = useAdminApp();
  const [filter, setFilter] = useState(route?.params?.filter || 'all');
  const [q, setQ] = useState('');

  let list = patients;
  if (filter === 'unassigned') list = list.filter((p) => !p.doctor_id);
  if (filter === 'flagged') list = list.filter((p) => p.flag === 'missed' || p.flag === 'low' || p.flag === 'refill');
  if (q) list = list.filter((p) =>
    p.name?.toLowerCase().includes(q.toLowerCase()) ||
    p.dx?.toLowerCase().includes(q.toLowerCase()) ||
    p.mrn?.toLowerCase().includes(q.toLowerCase())
  );

  function docName(doctorId) {
    const d = clinicians.find((x) => x.id === doctorId);
    return d ? d.name : null;
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 13, color: t.text2 }}>{patients.length} across the network</Text>
            <Text style={{ fontSize: 24, fontWeight: '500', color: t.text, letterSpacing: -0.5 }}>Patients</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('AdminProfile')}
            style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: t.border }}>
            <Icons.user size={20} color={t.textOnTint} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          <SearchBox value={q} onChangeText={setQ} placeholder="Search name, condition or MRN" theme={t} />
          <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} theme={t} />

          <View style={{ gap: 10 }}>
            {list.map((p) => {
              const dn = docName(p.doctor_id);
              return (
                <EntityRow key={p.id}
                  who={<AdminAvatar who={p} theme={t} />}
                  sub={<>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{p.name}</Text>
                      {p.age ? <Text style={{ fontSize: 12, color: t.text3 }}>{p.age}</Text> : null}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                      {dn ? (
                        <>
                          <Icons.stethoscope size={13} color={t.text3} />
                          <Text style={{ fontSize: 12, color: t.text3 }}>{dn.replace('Dr. ', 'Dr ')}</Text>
                        </>
                      ) : (
                        <>
                          <Icons.alert size={13} color={t.amberText} />
                          <Text style={{ fontSize: 12, color: t.amberText, fontWeight: '500' }}>Unassigned</Text>
                        </>
                      )}
                    </View>
                  </>}
                  trailing={p.flag ? <PatientFlagChip flag={p.flag} theme={t} /> : <Icons.chevronR size={18} color={t.text3} />}
                  onPress={() => navigation.navigate('PatientDetail', { patientId: p.id })}
                  theme={t}
                />
              );
            })}
            {list.length === 0 && (
              <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 18, padding: 32, alignItems: 'center', gap: 8 }}>
                <Icons.users size={28} color={t.text3} />
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>No patients</Text>
                <Text style={{ fontSize: 13, color: t.text3 }}>Nothing matches this view.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function PatientDetailScreen({ navigation, route }) {
  const { theme: t, patients, clinicians, assignPatient } = useAdminApp();
  const { patientId } = route.params;
  const [sheet, setSheet] = useState(false);

  const p = patients.find((x) => x.id === patientId);
  if (!p) return null;

  const activeDocs = clinicians.filter((d) => d.status === 'active');
  const assignedDoc = clinicians.find((d) => d.id === p.doctor_id);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <BackBar title="Patient" onBack={() => navigation.goBack()} theme={t} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 22 }}>
        {/* Hero */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <AdminAvatar who={p} size="lg" theme={t} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 21, fontWeight: '500', color: t.text }}>{p.name}</Text>
            <Text style={{ fontSize: 13, color: t.text2, marginTop: 3 }}>{[p.age, p.sex === 'F' ? 'Female' : p.sex === 'M' ? 'Male' : null, p.mrn].filter(Boolean).join(' · ')}</Text>
          </View>
          {p.flag ? <PatientFlagChip flag={p.flag} theme={t} /> : null}
        </View>

        {/* KPI mini */}
        {p.adherence != null && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, padding: 16 }}>
              <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icons.activity size={19} color={t.primary} />
              </View>
              <Text style={{ fontSize: 26, fontWeight: '500', color: t.text }}>{p.adherence}%</Text>
              <Text style={{ fontSize: 12, color: t.text2, marginTop: 4 }}>Adherence (30d)</Text>
            </View>
            {p.facility_city && (
              <View style={{ flex: 1, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, padding: 16 }}>
                <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: t.surface2, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icons.building size={19} color={t.text2} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '500', color: t.text, lineHeight: 24 }}>{p.facility_city}</Text>
                <Text style={{ fontSize: 12, color: t.text2, marginTop: 4 }}>{p.facility_type}</Text>
              </View>
            )}
          </View>
        )}

        {/* Clinical info */}
        <View>
          <SectionLabel theme={t}>Clinical</SectionLabel>
          <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, paddingHorizontal: 16 }}>
            {p.dx && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: t.border }}>
                <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: t.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.heartPulse size={18} color={t.text2} />
                </View>
                <View>
                  <Text style={{ fontSize: 11.5, color: t.text3 }}>Diagnosis</Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: t.text, marginTop: 1 }}>{p.dx}</Text>
                </View>
              </View>
            )}
            {p.mrn && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13 }}>
                <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: t.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.idBadge size={18} color={t.text2} />
                </View>
                <View>
                  <Text style={{ fontSize: 11.5, color: t.text3 }}>Medical record no.</Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: t.text, marginTop: 1 }}>{p.mrn}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Assigned clinician */}
        <View>
          <SectionLabel theme={t}>Assigned clinician</SectionLabel>
          {assignedDoc ? (
            <TouchableOpacity activeOpacity={0.85} onPress={() => setSheet(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 14,
                backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18 }}>
              <AdminAvatar who={assignedDoc} theme={t} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{assignedDoc.name}</Text>
                <Text style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>{assignedDoc.specialty}</Text>
              </View>
              <Text style={{ fontSize: 13, color: t.primary, fontWeight: '500' }}>Change</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.85} onPress={() => setSheet(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 14,
                backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderStyle: 'dashed', borderRadius: 18 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.amberTint, alignItems: 'center', justifyContent: 'center' }}>
                <Icons.userPlus size={20} color={t.amberText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>Assign a clinician</Text>
                <Text style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>This patient isn't being monitored yet</Text>
              </View>
              <Icons.chevronR size={18} color={t.text3} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Assign sheet */}
      <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={() => setSheet(false)} />
        <View style={{ backgroundColor: t.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8, maxHeight: '65%' }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: t.border2, alignSelf: 'center', marginBottom: 16 }} />
          <Text style={{ fontSize: 15, fontWeight: '500', color: t.text, marginBottom: 4 }}>Assign clinician</Text>
          <ScrollView>
            {p.doctor_id && (
              <TouchableOpacity onPress={() => { assignPatient(p.id, null); setSheet(false); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.border }}>
                <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: t.coralTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.ban size={18} color={t.coralText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>Unassign</Text>
                  <Text style={{ fontSize: 12, color: t.text3 }}>Remove the current clinician</Text>
                </View>
              </TouchableOpacity>
            )}
            {activeDocs.map((d) => {
              const sel = d.id === p.doctor_id;
              return (
                <TouchableOpacity key={d.id} onPress={() => { assignPatient(p.id, d.id); setSheet(false); }}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.border }}>
                  <AdminAvatar who={d} size="sm" theme={t} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: sel ? t.primary : t.text }}>{d.name}</Text>
                    <Text style={{ fontSize: 12, color: t.text3 }}>{d.specialty}</Text>
                  </View>
                  {sel && <Icons.check size={19} color={t.primary} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export function AssignPatientsScreen({ navigation, route }) {
  const { theme: t, patients, clinicians, bulkAssignPatients } = useAdminApp();
  const { doctorId } = route.params;
  const d = clinicians.find((x) => x.id === doctorId);
  const [sel, setSel] = useState(patients.filter((p) => p.doctor_id === doctorId).map((p) => p.id));
  const [q, setQ] = useState('');

  let list = patients.filter((p) => p.doctor_id === doctorId || !p.doctor_id);
  if (q) list = list.filter((p) => p.name?.toLowerCase().includes(q.toLowerCase()) || p.dx?.toLowerCase().includes(q.toLowerCase()));

  const toggle = (id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <BackBar title="Assign patients" sub={d ? `to ${d.name}` : ''} onBack={() => navigation.goBack()} theme={t} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 14 }}>
        <SearchBox value={q} onChangeText={setQ} placeholder="Search patients" theme={t} />
        <Text style={{ fontSize: 12, color: t.text3 }}>Showing this clinician's patients plus anyone currently unassigned.</Text>

        <View style={{ gap: 10 }}>
          {list.map((p) => {
            const on = sel.includes(p.id);
            return (
              <TouchableOpacity key={p.id} activeOpacity={0.85} onPress={() => toggle(p.id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 14,
                  backgroundColor: on ? t.primaryTint : t.surface, borderWidth: 1,
                  borderColor: on ? t.primary : t.border, borderRadius: 18 }}>
                <AdminAvatar who={p} theme={t} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{p.name}</Text>
                  <Text style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>{p.dx}</Text>
                </View>
                <View style={{ width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: on ? t.primary : t.surface, borderWidth: 1.5,
                  borderColor: on ? t.primary : t.border2 }}>
                  {on && <Icons.check size={15} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
          {list.length === 0 && (
            <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 18, padding: 32, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: t.text3 }}>No patients to assign.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36,
        backgroundColor: t.appBg, borderTopWidth: 1, borderTopColor: t.border }}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => { bulkAssignPatients(doctorId, sel); navigation.goBack(); }}
          style={{ height: 54, borderRadius: 16, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10,
            shadowColor: t.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
          <Icons.check size={18} color={t.onPrimary} />
          <Text style={{ fontSize: 16, fontWeight: '500', color: t.onPrimary }}>
            Assign {sel.length} patient{sel.length === 1 ? '' : 's'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
