import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Icons } from '../components/Icons';

export function StatusPill({ status, theme: t }) {
  const MAP = {
    active:    { label: 'Active',    bg: t.primaryTint, color: t.textOnTint },
    invited:   { label: 'Pending',   bg: t.amberTint,   color: t.amberText },
    suspended: { label: 'Suspended', bg: t.coralTint,   color: t.coralText },
  };
  const s = MAP[status];
  if (!s) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 24, paddingHorizontal: 9, borderRadius: 8, backgroundColor: s.bg }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: s.color }} />
      <Text style={{ fontSize: 12, fontWeight: '500', color: s.color }}>{s.label}</Text>
    </View>
  );
}

export function PatientFlagChip({ flag, theme: t }) {
  const MAP = {
    refill: { label: 'Refill pending', bg: t.amberTint,   color: t.amberText },
    low:    { label: 'Supply low',     bg: t.amberTint,   color: t.amberText },
    missed: { label: 'Missed doses',   bg: t.coralTint,   color: t.coralText },
    stable: { label: 'Stable',         bg: t.primaryTint, color: t.textOnTint },
  };
  const f = MAP[flag];
  if (!f) return null;
  return (
    <View style={{ height: 24, paddingHorizontal: 9, borderRadius: 8, backgroundColor: f.bg, justifyContent: 'center' }}>
      <Text style={{ fontSize: 12, fontWeight: '500', color: f.color }}>{f.label}</Text>
    </View>
  );
}

export function AdminAvatar({ who, size = 'md', theme: t }) {
  const HUE = {
    teal:  { bg: t.primaryTint, color: t.textOnTint },
    amber: { bg: t.amberTint,   color: t.amberText },
    coral: { bg: t.coralTint,   color: t.coralText },
    slate: { bg: t.surface2,    color: t.text2 },
  };
  const hue = HUE[who?.hue || 'teal'];
  const dims = size === 'lg' ? 60 : size === 'sm' ? 36 : 46;
  const radius = size === 'lg' ? 19 : size === 'sm' ? 12 : 15;
  const fs = size === 'lg' ? 21 : size === 'sm' ? 13 : 16;
  return (
    <View style={{ width: dims, height: dims, borderRadius: radius, backgroundColor: hue.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={{ fontSize: fs, fontWeight: '500', color: hue.color }}>{who?.initials || '?'}</Text>
    </View>
  );
}

export function KpiCard({ icon, tintColor, n, label, delta, onPress, theme: t }) {
  const Ic = Icons[icon];
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}
      style={{ flex: 1, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 20, padding: 16, gap: 12,
        shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: tintColor + '22', alignItems: 'center', justifyContent: 'center' }}>
          {Ic && <Ic size={19} color={tintColor} />}
        </View>
        {delta ? <Text style={{ fontSize: 11, fontWeight: '500', color: t.text3 }}>{delta}</Text> : null}
      </View>
      <View>
        <Text style={{ fontSize: 30, fontWeight: '500', color: t.text, letterSpacing: -0.03 * 30 }}>{n}</Text>
        <Text style={{ fontSize: 12.5, color: t.text2, marginTop: 4 }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function EntityRow({ who, sub, trailing, onPress, theme: t }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 14,
        backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18,
        shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
      {who}
      <View style={{ flex: 1, minWidth: 0 }}>{sub}</View>
      {trailing || <Icons.chevronR size={18} color={t.text3} />}
    </TouchableOpacity>
  );
}

export function SectionLabel({ children, action, onAction, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <Text style={{ fontSize: 11, fontWeight: '500', color: t.text3, textTransform: 'uppercase', letterSpacing: 0.6 }}>{children}</Text>
      {action && <TouchableOpacity onPress={onAction}><Text style={{ fontSize: 13, color: t.primary, fontWeight: '500' }}>{action}</Text></TouchableOpacity>}
    </View>
  );
}

export function BackBar({ title, sub, onBack, trailing, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10 }}>
      <TouchableOpacity onPress={onBack} style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
        <Icons.left size={22} color={t.text} />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{title}</Text>
        {sub && <Text style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{sub}</Text>}
      </View>
      <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'flex-end' }}>{trailing}</View>
    </View>
  );
}

export function MetaRow({ icon, label, value, last, theme: t }) {
  const Ic = Icons[icon];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, borderBottomWidth: last ? 0 : 1, borderBottomColor: t.border }}>
      <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: t.surface2, alignItems: 'center', justifyContent: 'center' }}>
        {Ic && <Ic size={18} color={t.text2} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11.5, color: t.text3 }}>{label}</Text>
        <Text style={{ fontSize: 14, fontWeight: '500', color: t.text, marginTop: 1 }}>{value}</Text>
      </View>
    </View>
  );
}

export function PermissionRow({ perm, on, onToggle, locked, theme: t }) {
  const Ic = Icons[perm.icon];
  return (
    <TouchableOpacity activeOpacity={locked ? 1 : 0.7} onPress={locked ? null : onToggle}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, opacity: locked ? 0.5 : 1 }}>
      <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: on ? t.primaryTint : t.surface2, alignItems: 'center', justifyContent: 'center' }}>
        {Ic && <Ic size={17} color={on ? t.primary : t.text2} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: t.text }}>{perm.name}</Text>
        <Text style={{ fontSize: 12, color: t.text3, marginTop: 1, lineHeight: 17 }}>{perm.desc}</Text>
      </View>
      <View style={{
        width: 44, height: 26, borderRadius: 13, backgroundColor: on ? t.primary : t.surface2,
        padding: 2, justifyContent: 'center', alignItems: on ? 'flex-end' : 'flex-start',
      }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: on ? '#fff' : t.text3 }} />
      </View>
    </TouchableOpacity>
  );
}

export function RoleOption({ role, selected, onSelect, theme: t }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onSelect}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderWidth: 1,
        borderColor: selected ? t.primary : t.border2, borderRadius: 16,
        backgroundColor: selected ? t.primaryTint : t.surface }}>
      <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2,
        borderColor: selected ? t.primary : t.border2, alignItems: 'center', justifyContent: 'center' }}>
        {selected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.primary }} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{role.name}</Text>
        <Text style={{ fontSize: 12.5, color: t.text2, marginTop: 2 }}>{role.desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function InfoBanner({ text, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', gap: 11, padding: 13, borderRadius: 15, backgroundColor: t.primaryTint, alignItems: 'flex-start' }}>
      <Icons.shieldCheck size={18} color={t.primary} />
      <Text style={{ flex: 1, fontSize: 13, color: t.text2, lineHeight: 19 }}>{text}</Text>
    </View>
  );
}

export function CopyField({ value, label, theme: t }) {
  const [copied, setCopied] = React.useState(false);
  function copy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return (
    <View>
      {label && <Text style={{ fontSize: 12, color: t.text3, marginBottom: 7 }}>{label}</Text>}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13, borderRadius: 14, backgroundColor: t.surfaceSunken, borderWidth: 1, borderColor: t.border }}>
        <Text style={{ flex: 1, fontFamily: 'monospace', fontSize: 13, color: t.text }} numberOfLines={1}>{value}</Text>
        <TouchableOpacity onPress={copy}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 12, borderRadius: 10,
            backgroundColor: copied ? t.primaryTint : t.primary }}>
          {copied ? <Icons.check size={14} color={t.textOnTint} sw={2} /> : <Icons.copy size={14} color={t.onPrimary} />}
          <Text style={{ fontSize: 13, fontWeight: '500', color: copied ? t.textOnTint : t.onPrimary }}>{copied ? 'Copied' : 'Copy'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function PwStrengthMeter({ strength, theme: t }) {
  const colors = ['transparent', t.coralText, t.amberText, t.primary, t.primary];
  return (
    <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
      {[0, 1, 2, 3].map((n) => (
        <View key={n} style={{ flex: 1, height: 5, borderRadius: 99, backgroundColor: n < strength ? colors[strength] : t.border2 }} />
      ))}
    </View>
  );
}

export function SearchBox({ value, onChangeText, placeholder, theme: t }) {
  return (
    <View style={{ position: 'relative' }}>
      <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
        <Icons.search size={18} color={t.text3} />
      </View>
      <TextInput
        value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor={t.text3}
        style={{ height: 46, paddingLeft: 42, paddingRight: 16, borderRadius: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, color: t.text, fontSize: 14 }}
      />
    </View>
  );
}

export function SegmentedControl({ options, value, onChange, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: t.surface2, borderRadius: 12, padding: 3, gap: 2 }}>
      {options.map((o) => (
        <TouchableOpacity key={o.id} onPress={() => onChange(o.id)}
          style={{ flex: 1, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
            backgroundColor: value === o.id ? t.surface : 'transparent' }}>
          <Text style={{ fontSize: 13, fontWeight: '500', color: value === o.id ? t.text : t.text3 }}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function SumRow({ label, value, first, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 12, borderTopWidth: first ? 0 : 1, borderTopColor: t.border, alignItems: 'baseline' }}>
      <Text style={{ fontSize: 13, color: t.text2 }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: '500', color: t.text, textAlign: 'right', flex: 1 }}>{value}</Text>
    </View>
  );
}

export function AdminFab({ label, icon, onPress, theme: t }) {
  const Ic = Icons[icon];
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}
      style={{ position: 'absolute', right: 18, bottom: 90, zIndex: 40, flexDirection: 'row', alignItems: 'center', gap: 9,
        height: 56, paddingHorizontal: 22, borderRadius: 18, backgroundColor: t.primary,
        shadowColor: t.primary, shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } }}>
      {Ic && <Ic size={20} color={t.onPrimary} />}
      <Text style={{ fontSize: 15, fontWeight: '500', color: t.onPrimary, letterSpacing: -0.2 }}>{label}</Text>
    </TouchableOpacity>
  );
}
