import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  TouchableWithoutFeedback, Platform,
} from 'react-native';

const ITEM_H = 46;
const VISIBLE = 5; // items visible in the drum
const PAD = ITEM_H * Math.floor(VISIBLE / 2); // top/bottom padding to center

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function WheelColumn({ items, selectedIndex, onSelect, width, theme: t }) {
  const ref = useRef(null);
  const lastSnapped = useRef(selectedIndex);

  useEffect(() => {
    // Scroll to current selection without animation on first mount
    setTimeout(() => {
      ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
    }, 50);
  }, []);

  function onScrollEnd(e) {
    const raw = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(Math.round(raw / ITEM_H), items.length - 1));
    if (idx !== lastSnapped.current) {
      lastSnapped.current = idx;
      onSelect(idx);
    }
  }

  return (
    <View style={{ width, height: ITEM_H * VISIBLE, overflow: 'hidden' }}>
      {/* selection highlight */}
      <View style={{
        position: 'absolute', top: PAD, height: ITEM_H,
        left: 4, right: 4, borderRadius: 12,
        backgroundColor: t.primaryTint, zIndex: 0,
      }} />
      {/* top fade */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: PAD, zIndex: 1,
        backgroundColor: t.surface, opacity: 0.72 }} pointerEvents="none" />
      {/* bottom fade */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: PAD, zIndex: 1,
        backgroundColor: t.surface, opacity: 0.72 }} pointerEvents="none" />

      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
        contentContainerStyle={{ paddingVertical: PAD }}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        scrollEventThrottle={16}
      >
        {items.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.6}
            onPress={() => {
              onSelect(i);
              ref.current?.scrollTo({ y: i * ITEM_H, animated: true });
            }}
            style={{ height: ITEM_H, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{
              fontSize: i === selectedIndex ? 17 : 15,
              fontWeight: i === selectedIndex ? '500' : '400',
              color: i === selectedIndex ? t.primary : t.text3,
              letterSpacing: -0.2,
            }}>
              {typeof item === 'number' && item < 10 ? `0${item}` : item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function DatePicker({ value, onChange, theme: t }) {
  const [open, setOpen] = useState(false);

  // Parse existing value or default to today
  const parsed = (() => {
    if (!value) return new Date();
    const d = new Date(value);
    return isNaN(d) ? new Date() : d;
  })();

  const [selDay, setSelDay] = useState(parsed.getDate());
  const [selMonth, setSelMonth] = useState(parsed.getMonth() + 1); // 1-12
  const [selYear, setSelYear] = useState(parsed.getFullYear());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // newest first
  const days = Array.from({ length: daysInMonth(selMonth, selYear) }, (_, i) => i + 1);

  // Clamp day if month/year changes makes it out of range
  const maxDay = daysInMonth(selMonth, selYear);
  const clampedDay = Math.min(selDay, maxDay);

  const dayIdx = clampedDay - 1;
  const monthIdx = selMonth - 1;
  const yearIdx = years.indexOf(selYear);

  function confirm() {
    const label = `${clampedDay} ${MONTHS[selMonth - 1]} ${selYear}`;
    onChange(label);
    setOpen(false);
  }

  const displayValue = value || 'Select date of birth';

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          minHeight: 52, paddingHorizontal: 16, borderRadius: 14,
          backgroundColor: t.surface, borderWidth: 1, borderColor: t.border2,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 15, color: value ? t.text : t.text3 }}>{displayValue}</Text>
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: t.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 15 }}>📅</Text>
        </View>
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={{ flex: 1, backgroundColor: t.scrim, justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: t.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 34 }}>
                {/* Handle */}
                <View style={{ width: 40, height: 4, borderRadius: 99, backgroundColor: t.border2, alignSelf: 'center', marginTop: 12, marginBottom: 4 }} />

                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingVertical: 14 }}>
                  <TouchableOpacity onPress={() => setOpen(false)}>
                    <Text style={{ fontSize: 15, color: t.text2 }}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: t.text }}>Date of birth</Text>
                  <TouchableOpacity onPress={confirm}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: t.primary }}>Done</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 1, backgroundColor: t.border }} />

                {/* Column labels */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4 }}>
                  <Text style={{ flex: 1, fontSize: 11, color: t.text3, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.8 }}>Day</Text>
                  <Text style={{ flex: 2, fontSize: 11, color: t.text3, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.8 }}>Month</Text>
                  <Text style={{ flex: 1.2, fontSize: 11, color: t.text3, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.8 }}>Year</Text>
                </View>

                {/* Wheels */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 4 }}>
                  {/* Day */}
                  <View style={{ flex: 1 }}>
                    <WheelColumn
                      items={days}
                      selectedIndex={dayIdx}
                      onSelect={(i) => setSelDay(i + 1)}
                      width="100%"
                      theme={t}
                    />
                  </View>
                  {/* Month */}
                  <View style={{ flex: 2 }}>
                    <WheelColumn
                      items={MONTHS}
                      selectedIndex={monthIdx}
                      onSelect={(i) => setSelMonth(i + 1)}
                      width="100%"
                      theme={t}
                    />
                  </View>
                  {/* Year */}
                  <View style={{ flex: 1.2 }}>
                    <WheelColumn
                      items={years}
                      selectedIndex={yearIdx >= 0 ? yearIdx : 25}
                      onSelect={(i) => setSelYear(years[i])}
                      width="100%"
                      theme={t}
                    />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
