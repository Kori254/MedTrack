import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Animated, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { Icons } from '../components/Icons';

const DEMO_OTP = '4729';

// mode='login'  → sign in existing patient   → calls onLogin(phone)
// mode='signup' → create new patient account → calls onLogin(phone) (caller routes to Onboarding)
// onClinicianLogin(email, password) — clinician path, login mode only
export default function LoginScreen({ onLogin, onClinicianLogin, onNewUser, mode = 'login' }) {
  const { theme: t } = useApp();
  const isSignup = mode === 'signup';

  // Role toggle — only shown in login mode (signup is always patient)
  const [role, setRole] = useState('patient'); // 'patient' | 'clinician'

  // Patient state
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  // Clinician state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const otpRef = useRef(null);
  const shake = useRef(new Animated.Value(0)).current;

  function triggerShake() {
    Animated.sequence([
      Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function switchRole(r) {
    setRole(r);
    setError('');
    setStep('phone');
    setOtp('');
  }

  // ── Patient handlers ──────────────────────────────────────────────────────
  function sendCode() {
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Enter a valid phone number');
      triggerShake();
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setTimeout(() => otpRef.current?.focus(), 100);
    }, 800);
  }

  async function verifyOtp() {
    if (otp !== DEMO_OTP) {
      setError('Incorrect code — try ' + DEMO_OTP);
      triggerShake();
      setOtp('');
      return;
    }
    setLoading(true);
    try {
      await onLogin(phone);
    } catch (e) {
      triggerShake();
      setOtp('');
      if (e?.message === 'NO_PROFILE') {
        setError('No account found. Tap "Get started" to sign up.');
        setStep('phone');
      } else {
        setError(e?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Clinician handler ─────────────────────────────────────────────────────
  async function clinicianSignIn() {
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      await onClinicianLogin(email.trim().toLowerCase(), password);
    } catch (e) {
      triggerShake();
      if (e?.message === 'NOT_CLINICIAN') {
        setError('No clinician account found for this email.');
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  }

  const digits = otp.padEnd(4, ' ').split('');
  const isClinician = !isSignup && role === 'clinician';

  // ── Header copy ───────────────────────────────────────────────────────────
  function headerTitle() {
    if (isClinician) return 'Clinician sign in.';
    if (isSignup) return 'Create your account.';
    return step === 'phone' ? 'Welcome back.' : 'Check your messages.';
  }
  function headerSub() {
    if (isClinician) return 'Sign in with your MedTrack clinician credentials.';
    if (isSignup) return 'Enter your number to get a one-time code and create your account.';
    return step === 'phone'
      ? 'Enter your phone number to sign in.'
      : `We sent a 4-digit code to ${phone}.`;
  }

  // ── Primary button ────────────────────────────────────────────────────────
  function primaryLabel() {
    if (loading) return isClinician ? 'Signing in…' : (step === 'phone' ? 'Sending…' : 'Verifying…');
    if (isClinician) return 'Sign in';
    if (step === 'otp') return isSignup ? 'Create account' : 'Sign in';
    return 'Send code';
  }

  function primaryDisabled() {
    if (loading) return true;
    if (isClinician) return !email.trim() || !password;
    if (step === 'phone') return phone.length < 6;
    return otp.length < 4;
  }

  function primaryAction() {
    if (isClinician) return clinicianSignIn();
    if (step === 'phone') return sendCode();
    return verifyOtp();
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.appBg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ paddingTop: 24, paddingHorizontal: 28, paddingBottom: 32 }}>
            <View style={{
              width: 52, height: 52, borderRadius: 16, backgroundColor: t.primary,
              alignItems: 'center', justifyContent: 'center', marginBottom: 24,
              shadowColor: t.primary, shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 6 },
            }}>
              <Text style={{ fontSize: 24, color: '#fff' }}>✚</Text>
            </View>

            {/* Role toggle — login mode only */}
            {!isSignup && (
              <View style={{ flexDirection: 'row', backgroundColor: t.surface2, borderRadius: 14, padding: 4, marginBottom: 20, alignSelf: 'flex-start' }}>
                {['patient', 'clinician'].map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => switchRole(r)}
                    style={{
                      paddingHorizontal: 18, paddingVertical: 8, borderRadius: 11,
                      backgroundColor: role === r ? t.surface : 'transparent',
                      shadowColor: role === r ? '#102820' : 'transparent',
                      shadowOpacity: role === r ? 0.08 : 0,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 2 },
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '500', color: role === r ? t.text : t.text3, textTransform: 'capitalize' }}>
                      {r === 'clinician' ? 'Clinician' : 'Patient'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={{ fontSize: 28, fontWeight: '500', color: t.text, letterSpacing: -0.5, lineHeight: 34 }}>
              {headerTitle()}
            </Text>
            <Text style={{ fontSize: 15, color: t.text2, marginTop: 8, lineHeight: 22 }}>
              {headerSub()}
            </Text>
          </View>

          {/* Form */}
          <View style={{ flex: 1, paddingHorizontal: 28 }}>
            {isClinician ? (
              /* ── Clinician: email + password ── */
              <Animated.View style={{ transform: [{ translateX: shake }], gap: 12 }}>
                {/* Email */}
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: t.text2 }}>Email address</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      value={email}
                      onChangeText={(v) => { setEmail(v); setError(''); }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="you@hospital.go.ke"
                      placeholderTextColor={t.text3}
                      autoFocus
                      returnKeyType="next"
                      style={{
                        minHeight: 56, paddingHorizontal: 16, paddingLeft: 48,
                        borderRadius: 16, backgroundColor: t.surface,
                        borderWidth: 1, borderColor: error ? t.coral : t.border2,
                        color: t.text, fontSize: 16,
                      }}
                    />
                    <View style={{ position: 'absolute', left: 16, top: 18 }}>
                      <Icons.mail size={20} color={error ? t.coral : t.text3} />
                    </View>
                  </View>
                </View>

                {/* Password */}
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: t.text2 }}>Password</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      value={password}
                      onChangeText={(v) => { setPassword(v); setError(''); }}
                      secureTextEntry={!showPassword}
                      placeholder="Your password"
                      placeholderTextColor={t.text3}
                      returnKeyType="done"
                      onSubmitEditing={clinicianSignIn}
                      style={{
                        minHeight: 56, paddingHorizontal: 16, paddingLeft: 48, paddingRight: 48,
                        borderRadius: 16, backgroundColor: t.surface,
                        borderWidth: 1, borderColor: error ? t.coral : t.border2,
                        color: t.text, fontSize: 16,
                      }}
                    />
                    <View style={{ position: 'absolute', left: 16, top: 18 }}>
                      <Icons.lock size={20} color={error ? t.coral : t.text3} />
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowPassword((s) => !s)}
                      style={{ position: 'absolute', right: 14, top: 16 }}
                    >
                      <Icons.eye size={22} color={t.text3} />
                    </TouchableOpacity>
                  </View>
                </View>

                {error ? <Text style={{ fontSize: 12, color: t.coralText }}>{error}</Text> : null}

                <View style={{ backgroundColor: t.primaryTint, borderRadius: 18, padding: 16, flexDirection: 'row', gap: 10, marginTop: 4 }}>
                  <Icons.shield size={17} color={t.primary} />
                  <Text style={{ flex: 1, fontSize: 13, color: t.text2, lineHeight: 19 }}>
                    Clinician accounts are created by your facility administrator.
                  </Text>
                </View>
              </Animated.View>
            ) : step === 'phone' ? (
              /* ── Patient: phone entry ── */
              <Animated.View style={{ transform: [{ translateX: shake }] }}>
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: t.text2 }}>Mobile number</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      value={phone}
                      onChangeText={(v) => { setPhone(v); setError(''); }}
                      keyboardType="phone-pad"
                      placeholder="+254 700 000 000"
                      placeholderTextColor={t.text3}
                      autoFocus
                      onSubmitEditing={sendCode}
                      returnKeyType="done"
                      style={{
                        minHeight: 56, paddingHorizontal: 16, paddingLeft: 48,
                        borderRadius: 16, backgroundColor: t.surface,
                        borderWidth: 1, borderColor: error ? t.coral : t.border2,
                        color: t.text, fontSize: 16,
                      }}
                    />
                    <View style={{ position: 'absolute', left: 16, top: 18 }}>
                      <Icons.phone size={20} color={error ? t.coral : t.text3} />
                    </View>
                  </View>
                  {error ? <Text style={{ fontSize: 12, color: t.coralText }}>{error}</Text> : null}
                </View>
                <View style={{ backgroundColor: t.primaryTint, borderRadius: 18, padding: 16, flexDirection: 'row', gap: 10, marginTop: 16 }}>
                  <Icons.lock size={17} color={t.primary} />
                  <Text style={{ flex: 1, fontSize: 13, color: t.text2, lineHeight: 19 }}>
                    {isSignup
                      ? 'No password needed. We use a one-time code to verify your number.'
                      : "We'll send a one-time code. No password needed."}
                  </Text>
                </View>
              </Animated.View>
            ) : (
              /* ── Patient: OTP entry ── */
              <Animated.View style={{ transform: [{ translateX: shake }] }}>
                <TextInput
                  ref={otpRef}
                  value={otp}
                  onChangeText={(v) => { if (v.length <= 4) { setOtp(v.replace(/\D/g, '')); setError(''); } }}
                  keyboardType="number-pad"
                  maxLength={4}
                  onSubmitEditing={verifyOtp}
                  style={{ position: 'absolute', opacity: 0, height: 0 }}
                />
                <TouchableOpacity onPress={() => otpRef.current?.focus()} activeOpacity={1}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {digits.map((d, i) => (
                      <View key={i} style={{
                        flex: 1, height: 66, borderRadius: 16,
                        backgroundColor: t.surface,
                        borderWidth: 1.5,
                        borderColor: error ? t.coral : (d.trim() ? t.primary : (i === otp.length ? t.primary : t.border2)),
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Text style={{ fontSize: 28, fontWeight: '500', color: t.text }}>{d.trim()}</Text>
                        {!d.trim() && i === otp.length && (
                          <View style={{ width: 2, height: 22, borderRadius: 1, backgroundColor: t.primary, position: 'absolute' }} />
                        )}
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
                {error ? <Text style={{ fontSize: 12, color: t.coralText, marginTop: 8 }}>{error}</Text> : null}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
                  <TouchableOpacity onPress={() => { setStep('phone'); setOtp(''); setError(''); }}>
                    <Text style={{ fontSize: 13, color: t.text2 }}>Wrong number?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 13, color: t.primary, fontWeight: '500' }}>Resend code</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Bottom actions */}
          <View style={{ paddingHorizontal: 28, paddingBottom: 40, paddingTop: 24, gap: 12 }}>
            <TouchableOpacity
              onPress={primaryAction}
              disabled={primaryDisabled()}
              style={{
                backgroundColor: t.primary, borderRadius: 16, minHeight: 54,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
                opacity: primaryDisabled() ? 0.55 : 1,
                shadowColor: t.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: t.onPrimary }}>{primaryLabel()}</Text>
              {!loading && <Icons.arrowRight size={18} color={t.onPrimary} />}
            </TouchableOpacity>

            {!isSignup && !isClinician && onNewUser && (
              <TouchableOpacity onPress={onNewUser} style={{ alignItems: 'center', paddingVertical: 10 }}>
                <Text style={{ fontSize: 14, color: t.text2 }}>
                  New patient?{'  '}<Text style={{ color: t.primary, fontWeight: '500' }}>Get started</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
