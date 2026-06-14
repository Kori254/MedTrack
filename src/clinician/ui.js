// MedTrack Clinician — shared UI primitives (RN port of clinician.css components).
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Icons } from '../components/Icons';
import { FLAG } from './data';

// ---- Avatar ----
export function Avatar({ children, size = 'md', theme: t }) {
  const dims = { sm: 38, md: 46, lg: 60 }[size];
  const radius = { sm: 12, md: 15, lg: 19 }[size];
  const font = { sm: 14, md: 16, lg: 21 }[size];
  return (
    <View style={{ width: dims, height: dims, borderRadius: radius, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: font, fontWeight: '500', color: t.textOnTint, letterSpacing: -0.3 }}>{children}</Text>
    </View>
  );
}

// ---- StatTile ----
export function StatTile({ icon, tint, n, label, onPress, theme: t }) {
  const Ic = Icons[icon];
  const tintBg = { primary: t.primaryTint, amber: t.amberTint }[tint] || t.primaryTint;
  const tintColor = { primary: t.primary, amber: t.amberText }[tint] || t.primary;
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}
      style={{ flex: 1, minWidth: 0, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, padding: 14, gap: 8,
        shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }}>
      <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: tintBg, alignItems: 'center', justifyContent: 'center' }}>
        <Ic size={19} color={tintColor} />
      </View>
      <View>
        <Text style={{ fontSize: 26, fontWeight: '500', color: t.text, letterSpacing: -0.6, lineHeight: 28 }}>{n}</Text>
        <Text style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ---- FlagChip (uses existing Chip vocabulary) ----
export function FlagChip({ flag, theme: t }) {
  const f = FLAG[flag];
  if (!f) return null;
  let bg = t.surface2, color = t.text2;
  if (f.cls === 'healthy') { bg = t.primaryTint; color = t.textOnTint; }
  else if (f.cls === 'low') { bg = t.amberTint; color = t.amberText; }
  else if (f.cls === 'critical') { bg = t.coralTint; color = t.coralText; }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: bg, flexShrink: 0 }}>
      <View style={{ width: 7, height: 7, borderRadius: 50, backgroundColor: color }} />
      <Text style={{ fontSize: 12, fontWeight: '500', color }}>{f.label}</Text>
    </View>
  );
}

// ---- AlertBanner (safety / interaction) ----
export function AlertBanner({ alert, theme: t }) {
  const crit = alert.sev === 'critical';
  const ok = alert.sev === 'ok';
  const bg = crit ? t.coralTint : ok ? t.primaryTint : t.amberTint;
  const color = crit ? t.coralText : ok ? t.textOnTint : t.amberText;
  const iconName = crit ? 'alert' : ok ? 'shield' : 'info';
  const Ic = Icons[iconName];
  return (
    <View style={{ flexDirection: 'row', gap: 11, padding: 13, borderRadius: 15, backgroundColor: bg, alignItems: 'flex-start' }}>
      <View style={{ marginTop: 1 }}><Ic size={18} color={color} /></View>
      <Text style={{ flex: 1, fontSize: 13, lineHeight: 19, color }}>{alert.text}</Text>
    </View>
  );
}

// ---- FieldCard (labelled section card) ----
export function FieldCard({ label, children, style, theme: t }) {
  return (
    <View style={[{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 18, padding: 16, gap: 13,
      shadowColor: '#102820', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 } }, style]}>
      {label && <Text style={{ fontSize: 13, color: t.text2, fontWeight: '500' }}>{label}</Text>}
      {children}
    </View>
  );
}

// ---- PillPick (single-select chips) ----
export function PillPick({ options, value, onChange, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const sel = o.key === value;
        return (
          <TouchableOpacity key={String(o.key)} activeOpacity={0.8} onPress={() => onChange(o.key)}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1,
              borderColor: sel ? t.primary : t.border2, backgroundColor: sel ? t.primary : t.surface }}>
            <Text style={{ fontSize: 14, fontWeight: '500', letterSpacing: -0.1, color: sel ? t.onPrimary : t.text2 }}>{o.label}</Text>
            {o.sub && <Text style={{ fontSize: 11, marginLeft: 5, color: sel ? t.onPrimary : t.text2, opacity: 0.7 }}>{o.sub}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ---- TogglePills (icon + label, two-up) ----
export function TogglePills({ options, value, onChange, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {options.map((o) => {
        const sel = o.key === value;
        const Ic = Icons[o.icon];
        return (
          <TouchableOpacity key={o.key} activeOpacity={0.8} onPress={() => onChange(o.key)}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 11, borderRadius: 12, borderWidth: 1,
              borderColor: sel ? t.primary : t.border2, backgroundColor: sel ? t.primary : t.surface }}>
            <Ic size={16} color={sel ? t.onPrimary : t.text2} />
            <Text style={{ fontSize: 14, fontWeight: '500', color: sel ? t.onPrimary : t.text2 }}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ---- NumberStepper ----
export function NumberStepper({ value, min = 0, max = 999, step = 1, unit, onChange, theme: t }) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  const btn = (disabled) => ({ width: 48, height: 50, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.4 : 1 });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: t.border2, borderRadius: 14, overflow: 'hidden', backgroundColor: t.surface }}>
      <TouchableOpacity disabled={value <= min} onPress={dec} style={btn(value <= min)}>
        <Icons.minus size={18} color={t.text} />
      </TouchableOpacity>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
        <Text style={{ fontSize: 17, fontWeight: '500', color: t.text }}>{value}</Text>
        {unit && <Text style={{ fontSize: 12, color: t.text3, marginLeft: 3 }}>{unit}</Text>}
      </View>
      <TouchableOpacity disabled={value >= max} onPress={inc} style={btn(value >= max)}>
        <Icons.plus size={18} color={t.text} />
      </TouchableOpacity>
    </View>
  );
}

// ---- StepBar (progress dots) ----
export function StepBar({ count, idx, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginBottom: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ flex: 1, height: 4, borderRadius: 99, backgroundColor: i <= idx ? t.primary : t.border2 }} />
      ))}
    </View>
  );
}

// ---- SearchInput ----
export function SearchInput({ value, onChangeText, placeholder, autoFocus, theme: t }) {
  return (
    <View style={{ position: 'relative', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', left: 15, zIndex: 1 }}><Icons.search size={18} color={t.text3} /></View>
      <TextInput
        value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={t.text3} autoFocus={autoFocus}
        style={{ minHeight: 50, paddingLeft: 44, paddingRight: 16, borderRadius: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border2, color: t.text, fontSize: 15 }}
      />
    </View>
  );
}

// ---- ActionBar (sticky bottom) ----
export function ActionBar({ children, theme: t }) {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24, backgroundColor: t.tabbarBg, borderTopWidth: 1, borderTopColor: t.hairline }}>
      {children}
    </View>
  );
}

// ---- Button (matches patient app vocabulary) ----
export function Button({ label, icon, onPress, variant = 'primary', disabled, style, theme: t }) {
  const Ic = icon ? Icons[icon] : null;
  let bg = t.primary, color = t.onPrimary, border = 'transparent';
  if (variant === 'tonal') { bg = t.primaryTint; color = t.textOnTint; }
  else if (variant === 'ghost') { bg = 'transparent'; color = t.text; border = t.border2; }
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} disabled={disabled}
      style={[{ minHeight: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
        backgroundColor: bg, borderWidth: variant === 'ghost' ? 1 : 0, borderColor: border, opacity: disabled ? 0.5 : 1, paddingHorizontal: 16 }, style]}>
      {Ic && <Ic size={20} color={color} />}
      <Text style={{ fontSize: 16, fontWeight: '500', color }}>{label}</Text>
    </TouchableOpacity>
  );
}
