import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { District } from '../types';
import { 
  X, 
  Wheat, 
  Egg, 
  Store, 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  CheckCircle2, 
  Phone, 
  User, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  Check, 
  Building2, 
  KeyRound, 
  MessageCircle, 
  AlertCircle, 
  ChevronDown,
  FileText
} from 'lucide-react';
import { TermsModal } from './TermsModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onOpenAssistedRegister?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onOpenAssistedRegister
}) => {
  const { allUsers, loginAs, registerUser } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Sync initialMode when modal opens
  useEffect(() => {
    setAuthMode(initialMode);
    setFormError(null);
    setOtpSent(false);
  }, [initialMode, isOpen]);

  // Login Form State
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Register Form State
  const [regRole, setRegRole] = useState<'CORN_FARMER' | 'EGG_FARMER' | 'UMKM_BUYER'>('CORN_FARMER');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDistrict, setRegDistrict] = useState<District>('Kabupaten Sigi');
  const [regVillage, setRegVillage] = useState('');
  const [regBusiness, setRegBusiness] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regConfirmPin, setRegConfirmPin] = useState('');
  const [regAgreed, setRegAgreed] = useState(true);

  // UI / Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setFormError('Silakan masukkan nomor WhatsApp aktif yang valid (minimal 9 digit).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
      setOtpCountdown(60);
      setTimeout(() => {
        setOtpCode(['5', '8', '2', '4']);
      }, 1200);
    }, 600);
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setFormError('Silakan masukkan nomor WhatsApp / ponsel terdaftar Anda.');
      return;
    }

    if (loginMethod === 'password' && !loginPin) {
      setFormError('Silakan masukkan PIN transaksi / kata sandi Anda.');
      return;
    }

    if (loginMethod === 'otp' && otpCode.join('').length < 4) {
      setFormError('Silakan masukkan 4-digit kode OTP yang telah dikirimkan ke WhatsApp Anda.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const userEntries = Object.entries(allUsers);
      const found = userEntries.find(([_, u]) => {
        const uPhone = (u.phone || '').replace(/\D/g, '');
        return uPhone.includes(cleanPhone) || cleanPhone.includes(uPhone);
      });

      if (found) {
        loginAs(found[0]);
      } else {
        if (cleanPhone.endsWith('1') || cleanPhone.includes('811')) {
          loginAs('pak_jufri');
        } else if (cleanPhone.endsWith('2') || cleanPhone.includes('812')) {
          loginAs('bu_rahma');
        } else if (cleanPhone.endsWith('3') || cleanPhone.includes('813')) {
          loginAs('kak_dilla');
        } else if (cleanPhone.includes('admin') || cleanPhone.endsWith('9')) {
          loginAs('admin_saudagro');
        } else {
          loginAs('pak_jufri');
        }
      }

      onClose();
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!regName.trim()) {
      setFormError('Nama lengkap penanggung jawab usaha wajib diisi.');
      return;
    }
    const cleanPhone = regPhone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setFormError('Nomor WhatsApp aktif wajib diisi (minimal 9 digit).');
      return;
    }
    if (!regVillage.trim()) {
      setFormError('Nama Desa / Kelurahan / Lokasi panen wajib diisi.');
      return;
    }
    if (regPin.length < 4) {
      setFormError('PIN Transaksi minimal 4-6 digit angka untuk verifikasi pesanan.');
      return;
    }
    if (regConfirmPin && regPin !== regConfirmPin) {
      setFormError('Konfirmasi PIN tidak cocok dengan PIN yang dimasukkan.');
      return;
    }
    if (!regAgreed) {
      setFormError('Anda harus menyetujui Ketentuan Layanan & Transparansi Saudagro.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      registerUser({
        name: regName.trim(),
        phone: regPhone.trim(),
        role: regRole,
        district: regDistrict,
        village: regVillage.trim(),
        businessName: regBusiness.trim() || undefined
      });
      onClose();
    }, 700);
  };

  const roleOptions = [
    {
      id: 'CORN_FARMER' as const,
      title: 'Petani Jagung',
      desc: 'Penjual Panen Pipil Kering',
      region: 'Sigi & Donggala',
      icon: Wheat,
      color: '#D97706',
      bgColor: '#FFFBEB',
      activeBg: '#FEF3C7',
      borderColor: '#FDE68A'
    },
    {
      id: 'EGG_FARMER' as const,
      title: 'Peternak Ayam',
      desc: 'Beli Pakan & Jual Telur',
      region: 'Palu & Sigi',
      icon: Egg,
      color: '#059669',
      bgColor: '#F0FDF4',
      activeBg: '#DCFCE7',
      borderColor: '#A7F3D0'
    },
    {
      id: 'UMKM_BUYER' as const,
      title: 'UMKM Bakery',
      desc: 'Pembeli Telur Rutin B2B',
      region: 'Kota Palu',
      icon: Store,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      activeBg: '#DBEAFE',
      borderColor: '#BFDBFE'
    }
  ];

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{ 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)', 
        background: 'rgba(15, 23, 42, 0.65)',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      <div 
        className={`auth-modal-card ${authMode === 'login' ? 'login-mode' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ 
          padding: '20px 24px 16px 24px', 
          borderBottom: '1px solid var(--border-subtle)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'white', 
              border: '1px solid var(--border-subtle)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '4px', 
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.05)', 
              flexShrink: 0 
            }}>
              <img 
                src="/logo/saudagro-icon.png" 
                alt="Saudagro" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
                  {authMode === 'login' ? 'Masuk ke Platform' : 'Pendaftaran Akun Mitra'}
                </h3>
                <span style={{ 
                  background: '#ECFDF5', 
                  color: '#047857', 
                  border: '1px solid #A7F3D0', 
                  padding: '2px 7px', 
                  borderRadius: '6px', 
                  fontSize: '0.65rem', 
                  fontWeight: 800,
                  letterSpacing: '0.02em'
                }}>
                  RESMI SULTENG
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px', margin: 0 }}>
                Pusat Mediasi & Rantai Pasok Agribisnis Terpercaya
              </p>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Tutup Modal"
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'var(--slate-100)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--slate-500)', 
              transition: 'background 0.2s',
              flexShrink: 0
            }}
          >
            <X size={17} />
          </button>
        </div>

        <div style={{ padding: '20px 24px 24px 24px' }}>
          {/* Segmented Tab Switcher */}
          <div style={{ 
            display: 'flex', 
            background: 'var(--slate-100)', 
            padding: '4px', 
            borderRadius: '12px', 
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button 
              type="button" 
              onClick={() => {
                setAuthMode('login');
                setFormError(null);
              }}
              style={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '9px',
                fontSize: '0.86rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: authMode === 'login' ? 'white' : 'transparent',
                color: authMode === 'login' ? 'var(--primary-700)' : 'var(--slate-600)',
                boxShadow: authMode === 'login' ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <LogIn size={15} /> 
              <span>Masuk Akun</span>
            </button>
            <button 
              type="button" 
              onClick={() => {
                setAuthMode('register');
                setFormError(null);
              }}
              style={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '9px',
                fontSize: '0.86rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: authMode === 'register' ? 'white' : 'transparent',
                color: authMode === 'register' ? 'var(--primary-700)' : 'var(--slate-600)',
                boxShadow: authMode === 'register' ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <UserPlus size={15} /> 
              <span>Daftar Akun Baru</span>
            </button>
          </div>

          {/* Inline Error Alert */}
          {formError && (
            <div style={{ 
              background: '#FEF2F2', 
              border: '1px solid #FECACA', 
              color: '#B91C1C', 
              padding: '10px 14px', 
              borderRadius: '10px', 
              fontSize: '0.82rem', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '9px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{formError}</span>
            </div>
          )}

          {authMode === 'login' ? (
            /* ================================================================
               LOGIN FORM
               ================================================================ */
            <div>
              {/* Login Method Subtabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setOtpSent(false);
                    setFormError(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '9px',
                    border: loginMethod === 'password' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                    background: loginMethod === 'password' ? '#ECFDF5' : 'white',
                    color: loginMethod === 'password' ? 'var(--primary-700)' : 'var(--slate-600)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <KeyRound size={14} /> PIN / Kata Sandi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setFormError(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '9px',
                    border: loginMethod === 'otp' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                    background: loginMethod === 'otp' ? '#ECFDF5' : 'white',
                    color: loginMethod === 'otp' ? 'var(--primary-700)' : 'var(--slate-600)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MessageCircle size={14} /> OTP WhatsApp
                </button>
              </div>

              {loginMethod === 'password' ? (
                <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '5px' }}>
                      Nomor WhatsApp / Ponsel
                    </label>
                    <div className="auth-input-wrapper">
                      <div className="auth-phone-prefix">
                        <Phone size={14} style={{ color: 'var(--primary-600)' }} />
                        <span>+62</span>
                      </div>
                      <input 
                        type="tel" 
                        className="auth-input" 
                        placeholder="812-3456-7890" 
                        style={{ paddingLeft: '72px' }}
                        value={loginPhone}
                        onChange={e => setLoginPhone(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', margin: 0 }}>
                        PIN Masuk / Kata Sandi
                      </label>
                      <a 
                        href="https://wa.me/6281145001234?text=Halo%20Admin%20Saudagro%2C%20saya%20butuh%20bantuan%20reset%20PIN%20akun%20saya."
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.74rem', color: 'var(--primary-700)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        Lupa PIN?
                      </a>
                    </div>
                    <div className="auth-input-wrapper">
                      <div className="auth-input-icon">
                        <Lock size={15} />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="auth-input" 
                        placeholder="Masukkan 6-digit PIN atau kata sandi" 
                        style={{ paddingLeft: '36px', paddingRight: '40px' }}
                        value={loginPin}
                        onChange={e => setLoginPin(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ 
                          position: 'absolute', 
                          right: '12px', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          color: 'var(--slate-400)',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 6px 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={e => setRememberMe(e.target.checked)}
                        style={{ accentColor: 'var(--primary-600)', width: '15px', height: '15px' }}
                      />
                      <span>Ingat sesi perangkat ini</span>
                    </label>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-400)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} style={{ color: 'var(--primary-600)' }} /> Keamanan 256-bit
                    </span>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-full" 
                    disabled={isSubmitting}
                    style={{ height: '46px', fontWeight: 700, fontSize: '0.92rem', borderRadius: '10px' }}
                  >
                    {isSubmitting ? (
                      <span>Memverifikasi Akun...</span>
                    ) : (
                      <>
                        <LogIn size={16} /> Masuk Sekarang
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* OTP Verification Mode */
                <form onSubmit={otpSent ? handleStandardLogin : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '5px' }}>
                      Nomor WhatsApp untuk Terima OTP
                    </label>
                    <div className="auth-input-wrapper">
                      <div className="auth-phone-prefix">
                        <Phone size={14} style={{ color: 'var(--primary-600)' }} />
                        <span>+62</span>
                      </div>
                      <input 
                        type="tel" 
                        className="auth-input" 
                        placeholder="812-3456-7890" 
                        style={{ paddingLeft: '72px' }}
                        value={loginPhone}
                        onChange={e => setLoginPhone(e.target.value)}
                        disabled={otpSent}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                          Masukkan 4-Digit Kode OTP:
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700 }}>
                          Terkirim ke WhatsApp
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
                        {otpCode.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newOtp = [...otpCode];
                              newOtp[idx] = val;
                              setOtpCode(newOtp);
                              if (val && idx < 3) {
                                const next = document.getElementById(`otp-input-${idx + 1}`);
                                if (next) next.focus();
                              }
                            }}
                            style={{
                              width: '46px',
                              height: '48px',
                              textAlign: 'center',
                              fontSize: '1.25rem',
                              fontWeight: 800,
                              borderRadius: '10px',
                              border: '1.5px solid var(--primary-600)',
                              background: 'white',
                              color: 'var(--slate-900)'
                            }}
                          />
                        ))}
                      </div>

                      <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                        {otpCountdown > 0 ? (
                          <span>Kirim ulang kode dalam <strong>{otpCountdown}s</strong></span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                          >
                            Kirim Ulang Kode OTP Sekarang
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-full" 
                    disabled={isSubmitting}
                    style={{ height: '46px', fontWeight: 700, fontSize: '0.92rem', borderRadius: '10px' }}
                  >
                    {isSubmitting ? (
                      <span>Memproses...</span>
                    ) : otpSent ? (
                      <>
                        <CheckCircle2 size={16} /> Verifikasi & Masuk Akun
                      </>
                    ) : (
                      <>
                        <MessageCircle size={16} /> Kirim Kode OTP WhatsApp
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* ================================================================
               REGISTER FORM (REDESIGNED GRID & SPACING)
               ================================================================ */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Sector / Role Selector */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', margin: 0 }}>
                    Pilih Sektor Usaha Agribisnis:
                  </label>
                  <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                    Area Palu, Sigi, Donggala
                  </span>
                </div>
                
                <div className="auth-role-grid">
                  {roleOptions.map((opt) => {
                    const isSelected = regRole === opt.id;
                    const IconComp = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setRegRole(opt.id)}
                        className={`auth-role-card ${isSelected ? 'active' : ''}`}
                        style={{
                          borderColor: isSelected ? opt.color : 'var(--border-subtle)',
                          background: isSelected ? opt.activeBg : '#FFFFFF'
                        }}
                      >
                        {isSelected && (
                          <div style={{ 
                            position: 'absolute', 
                            top: '8px', 
                            right: '8px', 
                            width: '18px', 
                            height: '18px', 
                            borderRadius: '50%', 
                            background: opt.color, 
                            color: 'white', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                        <div style={{ 
                          width: '38px', 
                          height: '38px', 
                          borderRadius: '10px', 
                          background: isSelected ? 'white' : opt.bgColor, 
                          color: opt.color, 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginBottom: '8px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                        }}>
                          <IconComp size={20} />
                        </div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.2, marginBottom: '2px' }}>
                          {opt.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', lineHeight: 1.3 }}>
                          {opt.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 1: Penanggung Jawab & WhatsApp */}
              <div className="auth-form-grid-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '5px' }}>
                    Nama Lengkap Penanggung Jawab:
                  </label>
                  <div className="auth-input-wrapper">
                    <div className="auth-input-icon">
                      <User size={15} />
                    </div>
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="Contoh: Jufri Latandu" 
                      style={{ paddingLeft: '36px' }}
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '5px' }}>
                    Nomor WhatsApp Aktif:
                  </label>
                  <div className="auth-input-wrapper">
                    <div className="auth-phone-prefix">
                      <Phone size={14} style={{ color: 'var(--primary-600)' }} />
                      <span>+62</span>
                    </div>
                    <input 
                      type="tel" 
                      className="auth-input" 
                      placeholder="812-3456-7890" 
                      style={{ paddingLeft: '72px' }}
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Wilayah Kabupaten & Desa */}
              <div className="auth-form-grid-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '5px' }}>
                    Kabupaten / Kota:
                  </label>
                  <div className="auth-input-wrapper">
                    <select 
                      className="auth-input" 
                      style={{ appearance: 'none', paddingRight: '36px', cursor: 'pointer' }}
                      value={regDistrict}
                      onChange={e => setRegDistrict(e.target.value as District)}
                    >
                      <option value="Kabupaten Sigi">Kabupaten Sigi</option>
                      <option value="Kota Palu">Kota Palu</option>
                      <option value="Kabupaten Donggala">Kabupaten Donggala</option>
                    </select>
                    <div style={{ position: 'absolute', right: '12px', color: 'var(--slate-400)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '5px' }}>
                    Desa / Kelurahan / Lokasi Panen:
                  </label>
                  <div className="auth-input-wrapper">
                    <div className="auth-input-icon">
                      <MapPin size={15} />
                    </div>
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="Contoh: Desa Lolu / Balaroa" 
                      style={{ paddingLeft: '36px' }}
                      value={regVillage}
                      onChange={e => setRegVillage(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Nama Usaha / Gapoktan / Bakery */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '5px' }}>
                  Nama Kelompok Tani / Usaha / Bakery <span style={{ color: 'var(--slate-400)', fontWeight: 500 }}>(Opsional)</span>:
                </label>
                <div className="auth-input-wrapper">
                  <div className="auth-input-icon">
                    <Building2 size={15} />
                  </div>
                  <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="Contoh: Kelompok Tani Makmur / Dilla Bakery Palu" 
                    style={{ paddingLeft: '36px' }}
                    value={regBusiness}
                    onChange={e => setRegBusiness(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 4: PIN Security */}
              <div className="auth-form-grid-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '5px' }}>
                    Buat PIN Transaksi (6 Angka):
                  </label>
                  <div className="auth-input-wrapper">
                    <div className="auth-input-icon">
                      <Lock size={15} />
                    </div>
                    <input 
                      type="password" 
                      maxLength={6}
                      className="auth-input" 
                      placeholder="6 digit angka" 
                      style={{ paddingLeft: '36px', letterSpacing: '2px' }}
                      value={regPin}
                      onChange={e => setRegPin(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '5px' }}>
                    Ulangi PIN Transaksi:
                  </label>
                  <div className="auth-input-wrapper">
                    <div className="auth-input-icon">
                      <Lock size={15} />
                    </div>
                    <input 
                      type="password" 
                      maxLength={6}
                      className="auth-input" 
                      placeholder="Ketik ulang PIN" 
                      style={{ paddingLeft: '36px', letterSpacing: '2px' }}
                      value={regConfirmPin}
                      onChange={e => setRegConfirmPin(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Akad & Ketentuan Transparan */}
              <div style={{ 
                background: 'var(--slate-50)', 
                padding: '12px 14px', 
                borderRadius: '10px', 
                border: '1px solid var(--border-subtle)',
                marginTop: '2px'
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', cursor: 'pointer', fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.45 }}>
                  <input 
                    type="checkbox" 
                    checked={regAgreed} 
                    onChange={e => setRegAgreed(e.target.checked)}
                    style={{ accentColor: 'var(--primary-600)', width: '15px', height: '15px', marginTop: '2px', flexShrink: 0 }}
                  />
                  <span>
                    Saya menyatakan data yang dimasukkan benar dan menyetujui{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowTermsModal(true);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'var(--primary-700)',
                        fontWeight: 800,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: 'inherit',
                        fontFamily: 'inherit'
                      }}
                    >
                      Ketentuan Layanan Saudagro
                    </button>
                    , transparansi komisi (3%-5%), serta garansi mutu panen regional.
                  </span>
                </label>
              </div>

              {/* Row 6: Submit CTA Button */}
              <button 
                type="submit" 
                className="btn btn-primary btn-full" 
                disabled={isSubmitting}
                style={{ 
                  height: '46px', 
                  fontWeight: 800, 
                  fontSize: '0.94rem', 
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
                  marginTop: '4px'
                }}
              >
                {isSubmitting ? (
                  <span>Mendaftarkan Akun Mitra...</span>
                ) : (
                  <>
                    <CheckCircle2 size={17} /> Daftar Akun & Mulai Transaksi
                  </>
                )}
              </button>
            </form>
          )}

          {/* Assisted Registration Callout Banner */}
          {onOpenAssistedRegister && (
            <div style={{ 
              marginTop: '16px', 
              paddingTop: '14px', 
              borderTop: '1px dashed var(--border-subtle)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              fontSize: '0.78rem',
              color: 'var(--slate-600)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={15} style={{ color: 'var(--primary-600)' }} />
                Petani / peternak butuh bantuan pendaftaran?
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAssistedRegister();
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--primary-700)', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem'
                }}
              >
                <span>Daftar Lewat Fasilitator Lapangan</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Terms of Service & Transparent Agreement Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setRegAgreed(true);
          setShowTermsModal(false);
        }}
      />
    </div>
  );
};
