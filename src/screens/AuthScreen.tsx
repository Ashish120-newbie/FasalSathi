import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, AlertCircle, Check, Phone, Mail, Lock, User, MapPin, Sprout, Globe, ChevronRight } from 'lucide-react';
import { useAuth, type FarmerProfileData } from '@/lib/auth';
import { useLang } from '@/lib/lang';
import { crops, cropName } from '@/data/crops';
import type { CropId } from '@/data/types';
import { languages, type Language } from '@/data/i18n';
import { getAllStates, getDistricts } from 'india-state-district';
import { LocationSelector, type LocationSelection } from '@/components/LocationSelector';

type AuthTab = 'login' | 'signup';
type LoginMode = 'password' | 'otp';
type OtpPhase = 'phone' | 'verify';

export function AuthScreen() {
  const { t, lang, setLang } = useLang();
  const { signInWithEmail, signInWithPhone, verifyOtp, signUpWithEmail } = useAuth();
  const [tab, setTab] = useState<AuthTab>('login');

  // ── Login state ──
  const [loginMode, setLoginMode] = useState<LoginMode>('password');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpPhase, setOtpPhase] = useState<OtpPhase>('phone');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpRefs, setOtpRefs] = useState<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ── Signup state ──
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState<LocationSelection | null>(null);
  const [village, setVillage] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<CropId[]>([]);
  const [landSize, setLandSize] = useState('');
  const [preferredLang, setPreferredLang] = useState<Language>(lang);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const states = useMemo(() => getAllStates().sort((a, b) => a.name.localeCompare(b.name)), []);
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const districts = useMemo(() => {
    if (!selectedStateCode) return [];
    return getDistricts(selectedStateCode).sort((a, b) => a.localeCompare(b));
  }, [selectedStateCode]);

  // ── Resend cooldown ──
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // ── OTP digit handlers ──
  function handleOtpChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[idx] = digit;
    setOtpDigits(next);
    if (digit && idx < 5 && otpRefs[idx + 1]) {
      otpRefs[idx + 1]?.focus();
    }
  }

  function handleOtpKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0 && otpRefs[idx - 1]) {
      otpRefs[idx - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const next = pasted.split('').concat(Array(6 - pasted.length).fill(''));
      setOtpDigits(next);
      const lastIdx = Math.min(pasted.length, 5);
      otpRefs[lastIdx]?.focus();
    }
  }

  // ── Login handlers ──
  async function handleLoginPassword() {
    setLoginError('');
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your mobile number or email.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }
    setLoginLoading(true);
    const isEmail = loginIdentifier.includes('@');
    const { error } = isEmail
      ? await signInWithEmail(loginIdentifier.trim(), loginPassword)
      : await signInWithEmail(loginIdentifier.trim(), loginPassword);
    setLoginLoading(false);
    if (error) {
      setLoginError(error.includes('Invalid login') ? 'Wrong number/email or password. Please try again.' : error);
    }
  }

  async function handleSendOtp() {
    setLoginError('');
    if (!/^\d{10}$/.test(otpPhone)) {
      setLoginError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoginLoading(true);
    const { error } = await signInWithPhone(`+91${otpPhone}`);
    setLoginLoading(false);
    if (error) {
      setLoginError(error);
    } else {
      setOtpPhase('verify');
      setResendCooldown(30);
    }
  }

  async function handleVerifyOtp() {
    setLoginError('');
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setLoginError('Please enter the 6-digit code.');
      return;
    }
    setLoginLoading(true);
    const { error } = await verifyOtp(`+91${otpPhone}`, code);
    setLoginLoading(false);
    if (error) {
      setLoginError(error.includes('Invalid') || error.includes('expired') ? 'The code is wrong or expired. Please try again.' : error);
    }
  }

  function handleResendOtp() {
    if (resendCooldown > 0) return;
    setOtpDigits(['', '', '', '', '', '']);
    handleSendOtp();
  }

  function resetOtp() {
    setOtpPhase('phone');
    setOtpDigits(['', '', '', '', '', '']);
    setLoginError('');
  }

  // ── Signup handlers ──
  function toggleCrop(id: CropId) {
    setSelectedCrops((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }

  async function handleSignup() {
    setSignupError('');
    if (!fullName.trim()) { setSignupError('Please enter your full name.'); return; }
    if (!/^\d{10}$/.test(mobile)) { setSignupError('Please enter a valid 10-digit mobile number.'); return; }
    if (password.length < 6) { setSignupError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setSignupError('Passwords do not match.'); return; }
    if (!location?.stateCode || !location?.district) { setSignupError('Please select your state and district.'); return; }
    if (selectedCrops.length === 0) { setSignupError('Please select at least one crop you grow.'); return; }
    if (!landSize || Number(landSize) <= 0) { setSignupError('Please enter your land size in acres.'); return; }

    setSignupLoading(true);
    const profileData: FarmerProfileData = {
      display_name: fullName.trim(),
      mobile,
      state: location.stateName,
      district: location.district,
      village: village.trim() || undefined,
      crops: selectedCrops,
      land_size_acres: Number(landSize),
      preferred_language: preferredLang,
    };

    const signupEmail = email.trim() || `${mobile}@fasalsathi.app`;
    const { error } = await signUpWithEmail(signupEmail, password, profileData);
    setSignupLoading(false);
    if (error) {
      setSignupError(error.includes('already') ? 'An account with this mobile number or email already exists. Please login instead.' : error);
    }
  }

  // ── Shared ──
  function switchTab(newTab: AuthTab) {
    setTab(newTab);
    setLoginError('');
    setSignupError('');
  }

  return (
    <section className="screen-container animate-fade-in px-4">
      {/* Logo */}
      <div className="flex flex-col items-center pt-10 pb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-forest-600 text-white shadow-sm">
          <Sprout size={28} />
        </div>
        <h1 className="mt-3 text-[22px] font-bold tracking-tight text-forest-900">Fasal<span className="text-amber-600">Sathi</span></h1>
        <p className="mt-1 text-[13px] text-forest-400">Fasal Ki Pehchan, Sahi Samadhan</p>
      </div>

      {/* Tab toggle */}
      <div className="mx-auto max-w-md">
        <div className="grid grid-cols-2 gap-1 rounded-[12px] border border-forest-100 bg-forest-50 p-1">
          <button
            onClick={() => switchTab('login')}
            className={`rounded-[10px] py-2 text-sm font-semibold transition-colors ${tab === 'login' ? 'bg-white text-forest-800 shadow-sm' : 'text-forest-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => switchTab('signup')}
            className={`rounded-[10px] py-2 text-sm font-semibold transition-colors ${tab === 'signup' ? 'bg-white text-forest-800 shadow-sm' : 'text-forest-500'}`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Login panel */}
      {tab === 'login' && (
        <div className="mx-auto mt-6 max-w-md">
          {/* Login mode toggle */}
          <div className="mb-5 flex gap-2">
            <button
              onClick={() => { setLoginMode('password'); setLoginError(''); }}
              className={`flex-1 rounded-[10px] border py-2 text-sm font-medium transition-colors ${loginMode === 'password' ? 'border-forest-500 bg-forest-50 text-forest-800' : 'border-forest-100 text-forest-500'}`}
            >
              Password
            </button>
            <button
              onClick={() => { setLoginMode('otp'); setLoginError(''); resetOtp(); }}
              className={`flex-1 rounded-[10px] border py-2 text-sm font-medium transition-colors ${loginMode === 'otp' ? 'border-forest-500 bg-forest-50 text-forest-800' : 'border-forest-100 text-forest-500'}`}
            >
              OTP
            </button>
          </div>

          {loginMode === 'password' && (
            <>
              <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Mobile number or email</label>
              <div className="relative mb-4">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400">
                  {loginIdentifier.includes('@') ? <Mail size={17} /> : <Phone size={17} />}
                </div>
                <input
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="input-field pl-11"
                  placeholder="9876543210 or you@email.com"
                  inputMode={loginIdentifier.includes('@') ? 'email' : 'tel'}
                />
              </div>

              <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Password</label>
              <div className="relative mb-2">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400">
                  <Lock size={17} />
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="Your password"
                />
              </div>
              <button className="mb-5 text-[13px] font-medium text-forest-600 hover:text-forest-700">
                Forgot password?
              </button>

              {loginError && <ErrorBanner message={loginError} />}

              <button
                onClick={handleLoginPassword}
                disabled={loginLoading}
                className="btn-amber flex w-full items-center justify-center gap-2 disabled:opacity-70"
              >
                {loginLoading ? <Loader2 size={19} className="animate-spin" /> : <><Check size={18} /> Login</>}
              </button>
            </>
          )}

          {loginMode === 'otp' && otpPhase === 'phone' && (
            <>
              <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Mobile number</label>
              <div className="relative mb-4">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400">
                  <Phone size={17} />
                </div>
                <input
                  value={otpPhone}
                  onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="input-field pl-11"
                  placeholder="9876543210"
                  inputMode="tel"
                />
              </div>

              {loginError && <ErrorBanner message={loginError} />}

              <button
                onClick={handleSendOtp}
                disabled={loginLoading}
                className="btn-amber flex w-full items-center justify-center gap-2 disabled:opacity-70"
              >
                {loginLoading ? <Loader2 size={19} className="animate-spin" /> : <>Send OTP</>}
              </button>
            </>
          )}

          {loginMode === 'otp' && otpPhase === 'verify' && (
            <>
              <p className="mb-1 text-[13px] text-forest-500">Enter the 6-digit code sent to</p>
              <p className="mb-4 text-[15px] font-semibold text-forest-800">+91 {otpPhone}</p>

              <div className="mb-5 flex gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpRefs[idx] = el; }}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="h-12 w-12 rounded-[10px] border border-forest-200 bg-white text-center text-lg font-bold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent"
                    inputMode="numeric"
                    maxLength={1}
                  />
                ))}
              </div>

              {loginError && <ErrorBanner message={loginError} />}

              <button
                onClick={handleVerifyOtp}
                disabled={loginLoading}
                className="btn-amber flex w-full items-center justify-center gap-2 disabled:opacity-70"
              >
                {loginLoading ? <Loader2 size={19} className="animate-spin" /> : <><Check size={18} /> Verify & Login</>}
              </button>

              <div className="mt-4 flex items-center justify-between">
                <button onClick={resetOtp} className="text-[13px] font-medium text-forest-500 hover:text-forest-700">
                  Change number
                </button>
                <button
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className="text-[13px] font-medium text-forest-600 hover:text-forest-700 disabled:text-forest-300"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Signup panel */}
      {tab === 'signup' && (
        <div className="mx-auto mt-6 max-w-md">
          <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Full name</label>
          <div className="relative mb-4">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400"><User size={17} /></div>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field pl-11" placeholder="Your full name" />
          </div>

          <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Mobile number <span className="text-forest-400">(10 digits)</span></label>
          <div className="relative mb-4">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400"><Phone size={17} /></div>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="input-field pl-11"
              placeholder="9876543210"
              inputMode="tel"
            />
          </div>

          <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Email <span className="text-forest-400">(optional)</span></label>
          <div className="relative mb-4">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400"><Mail size={17} /></div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-11" placeholder="you@email.com" inputMode="email" />
          </div>

          <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Password <span className="text-forest-400">(min 6 characters)</span></label>
          <div className="relative mb-4">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400"><Lock size={17} /></div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-11" placeholder="Create a password" />
          </div>

          <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Confirm password</label>
          <div className="relative mb-5">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400"><Lock size={17} /></div>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field pl-11" placeholder="Re-enter password" />
          </div>

          {/* State + District */}
          <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-forest-700"><MapPin size={14} className="text-forest-500" /> State</label>
          <select
            value={selectedStateCode}
            onChange={(e) => {
              setSelectedStateCode(e.target.value);
              const state = states.find((s) => s.code === e.target.value);
              setLocation(e.target.value ? { country: 'India', stateCode: e.target.value, stateName: state?.name ?? '', district: '' } : null);
            }}
            className="select-field mb-4"
          >
            <option value="">Select state...</option>
            {states.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>

          <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-forest-700"><MapPin size={14} className="text-forest-500" /> District</label>
          <select
            value={location?.district ?? ''}
            onChange={(e) => {
              if (!selectedStateCode || !e.target.value) return;
              const state = states.find((s) => s.code === selectedStateCode);
              setLocation({ country: 'India', stateCode: selectedStateCode, stateName: state?.name ?? '', district: e.target.value });
            }}
            className="select-field mb-4"
            disabled={!selectedStateCode}
          >
            <option value="">{selectedStateCode ? 'Select district...' : 'Select state first'}</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Village <span className="text-forest-400">(optional)</span></label>
          <input value={village} onChange={(e) => setVillage(e.target.value)} className="input-field mb-5" placeholder="Your village name" />

          {/* Crops multi-select */}
          <label className="mb-2 block text-[13px] font-semibold text-forest-700">Primary crop(s) you grow</label>
          <div className="scrollbar-hide -mx-1 flex flex-wrap gap-2 px-1 pb-1 mb-5">
            {crops.map((crop) => {
              const selected = selectedCrops.includes(crop.id);
              return (
                <button
                  key={crop.id}
                  onClick={() => toggleCrop(crop.id)}
                  className={`flex items-center gap-1.5 rounded-[10px] border px-3 py-2 text-[13px] font-medium transition-colors ${selected ? 'border-forest-500 bg-forest-50 text-forest-800' : 'border-forest-100 bg-white text-forest-500 hover:border-forest-200 hover:bg-forest-50'}`}
                >
                  <span className="text-base leading-none">{crop.emoji}</span>
                  {cropName(crop.id, lang)}
                  {selected && <Check size={13} className="text-forest-600" />}
                </button>
              );
            })}
          </div>

          {/* Land size */}
          <label className="mb-1.5 block text-[13px] font-semibold text-forest-700">Land size (acres)</label>
          <input
            value={landSize}
            onChange={(e) => setLandSize(e.target.value.replace(/[^\d.]/g, ''))}
            className="input-field mb-5"
            placeholder="e.g. 2.5"
            inputMode="decimal"
          />

          {/* Preferred language */}
          <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-forest-700"><Globe size={14} className="text-forest-500" /> Preferred language</label>
          <select
            value={preferredLang}
            onChange={(e) => {
              const newLang = e.target.value as Language;
              setPreferredLang(newLang);
              setLang(newLang);
            }}
            className="select-field mb-5"
          >
            {languages.map((l) => <option key={l.id} value={l.id}>{l.label} ({l.nativeLabel})</option>)}
          </select>

          {signupError && <ErrorBanner message={signupError} />}

          <button
            onClick={handleSignup}
            disabled={signupLoading}
            className="btn-amber flex w-full items-center justify-center gap-2 disabled:opacity-70"
          >
            {signupLoading ? <Loader2 size={19} className="animate-spin" /> : <><Check size={18} /> Create account</>}
          </button>

          <p className="mt-4 text-center text-[12px] text-forest-400">
            By signing up, you agree to use FasalSathi for farming assistance only.
          </p>
        </div>
      )}
    </section>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2.5 text-sm text-error-800">
      <AlertCircle size={17} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
