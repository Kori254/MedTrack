import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  TouchableWithoutFeedback, Animated, ScrollView,
} from 'react-native';
import { supplyStatus, supplyColor, supplyTextColor, supplyTintColor } from '../theme';
import { Icons } from './Icons';

// ---- SupplyBar ----
export function SupplyBar({ days, total, showLabel = true, height = 8, theme: t }) {
  const st = supplyStatus(days);
  const pct = Math.max(4, Math.min(100, (days / total) * 100));
  const fillColor = supplyColor(st, t);
  return (
    <View>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 13, color: t.text2 }}>Supply remaining</Text>
          <Text style={{ fontSize: 13, color: supplyTextColor(st, t), fontWeight: '500' }}>{days} days</Text>
        </View>
      )}
      <View style={{ height, borderRadius: 99, backgroundColor: t.surface2, overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height, borderRadius: 99, backgroundColor: fillColor }} />
      </View>
    </View>
  );
}

// ---- StreakDots ----
export function StreakDots({ week, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {week.map((d, i) => {
        let bgColor = t.surface2;
        let borderStyle = {};
        let iconEl = null;
        if (d.s === 'taken') { bgColor = t.primary; }
        else if (d.s === 'missed') { bgColor = t.coralTint; }
        else if (d.s === 'today') { bgColor = t.surface; borderStyle = { borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.primary }; }
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center', gap: 7 }}>
            <View style={[{ width: 30, height: 30, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, { backgroundColor: bgColor }, borderStyle]}>
              {d.s === 'taken' && <Icons.checkSm size={15} color={t.onPrimary} />}
              {d.s === 'missed' && <Icons.x size={13} color={t.coralText} sw={2} />}
              {d.s === 'today' && <View style={{ width: 7, height: 7, borderRadius: 9, backgroundColor: t.primary }} />}
            </View>
            <Text style={{ fontSize: 11, color: t.text3 }}>{d.d}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ---- Chip ----
export function Chip({ status, children, theme: t }) {
  let bg = t.surface2, color = t.text2;
  if (status === 'healthy') { bg = t.primaryTint; color = t.textOnTint; }
  else if (status === 'low') { bg = t.amberTint; color = t.amberText; }
  else if (status === 'critical') { bg = t.coralTint; color = t.coralText; }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: bg }}>
      {status && <View style={{ width: 7, height: 7, borderRadius: 50, backgroundColor: color }} />}
      {typeof children === 'string'
        ? <Text style={{ fontSize: 12, fontWeight: '500', color }}>{children}</Text>
        : React.Children.map(children, c => typeof c === 'string' ? <Text style={{ fontSize: 12, fontWeight: '500', color }}>{c}</Text> : c)
      }
    </View>
  );
}

// ---- MedTile ----
export function MedTile({ med, size = 46, theme: t }) {
  const st = supplyStatus(med.daysRemaining);
  let bg = t.primaryTint, color = t.primary;
  if (st === 'low') { bg = t.amberTint; color = t.amberText; }
  if (st === 'critical') { bg = t.coralTint; color = t.coralText; }
  return (
    <View style={{ width: size, height: size, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }}>
      <Icons.capsule size={22} color={color} />
    </View>
  );
}

// ---- TopBar ----
export function TopBar({ title, onBack, trailing, sub, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingBottom: 12, paddingTop: 6 }}>
      <TouchableOpacity onPress={onBack} style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
        <Icons.left size={22} color={t.text} />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: t.text, letterSpacing: -0.3 }}>{title}</Text>
        {sub && <Text style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{sub}</Text>}
      </View>
      <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        {trailing}
      </View>
    </View>
  );
}

// ---- SectionLabel ----
export function SectionLabel({ children, action, onAction, theme: t }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: t.text3, fontWeight: '500' }}>{children}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ fontSize: 13, color: t.primary, fontWeight: '500' }}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---- BottomSheet ----
export function BottomSheet({ open, onClose, children, title, theme: t }) {
  if (!open) return null;
  return (
    <Modal transparent animationType="slide" visible={open} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: t.scrim, justifyContent: 'flex-end' }}>
          <TouchableWithoutFeedback>
            <View style={{ backgroundColor: t.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: 40 }}>
              <View style={{ width: 40, height: 4, borderRadius: 99, backgroundColor: t.border2, alignSelf: 'center', marginBottom: 16 }} />
              {title && <Text style={{ fontSize: 16, fontWeight: '500', color: t.text, marginBottom: 14 }}>{title}</Text>}
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ---- DoseRing ----
export function DoseRing({ done, total, size = 64, stroke = 7, theme: t }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = done / total;
  // Approximate with a simple arc view
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: stroke, borderColor: t.surface2, position: 'absolute' }} />
      <View style={{ position: 'absolute' }}>
        <Text style={{ fontSize: size === 38 ? 13 : 16, fontWeight: '500', color: t.text, textAlign: 'center' }}>{done}/{total}</Text>
      </View>
      {/* Teal arc overlay - simplified */}
      {pct > 0 && (
        <View style={{
          position: 'absolute', width: size, height: size, borderRadius: size / 2,
          borderWidth: stroke, borderColor: 'transparent',
          borderTopColor: t.primary,
          transform: [{ rotate: `-90deg` }],
          opacity: Math.min(1, pct + 0.1),
        }} />
      )}
    </View>
  );
}
