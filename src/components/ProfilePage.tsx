import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Building2, 
  Star, 
  CheckCircle2, 
  Lock, 
  Save, 
  Layers,
  Calendar,
  FileText,
  Award,
  Bell,
  TrendingUp,
  BarChart3,
  Activity,
  Wheat,
  Egg,
  Store,
  DollarSign,
  PackageCheck
} from 'lucide-react';
import { AnimatedTrendChart } from './AnimatedTrendChart';

export const ProfilePage: React.FC = () => {
  const { currentUser, setActiveTab } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'info' | 'analytics' | 'bank' | 'security'>('info');
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: currentUser.name,
    phone: currentUser.phone || '0812-4567-8901',
    email: `${currentUser.name.toLowerCase().replace(/\s+/g, '.')}@saudagro.id`,
    village: currentUser.village || 'Desa Lolu',
    district: currentUser.district || 'Kec. Sigi Biromaru',
    regency: 'Kabupaten Sigi, Sulawesi Tengah',
    address: 'Jl. Palu-Kulawi KM 14, Dusun II RT 03 / RW 01, Desa Lolu',
    bankName: 'Bank Sulteng (BPD Sulawesi Tengah)',
    bankAccount: '102-0948-28491-0',
    accountHolder: currentUser.name,
    whatsappNotification: true,
    capacityNote: currentUser.role === 'CORN_FARMER' 
      ? 'Gudang Pengeringan Surya: Kapasitas 20 Ton Pipil Kering' 
      : currentUser.role === 'EGG_FARMER' 
      ? 'Kandang Layer Semi-Close House: 6.000 Ekor Ayam Produktif' 
      : 'Kapasitas Kebutuhan Produksi Bakery: 120-150 Rak Telur/Bulan',
    nik: '7201041508820003',
  });

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'CORN_FARMER':
        return { label: 'Petani Jagung Terverifikasi', color: '#047857', bg: '#ECFDF5' };
      case 'EGG_FARMER':
        return { label: 'Peternak Ayam Layer Terverifikasi', color: '#B45309', bg: '#FEF3C7' };
      case 'UMKM_BUYER':
        return { label: 'Mitra Industri Olahan Pangan / UMKM', color: '#1D4ED8', bg: '#EFF6FF' };
      case 'ADMIN':
        return { label: 'Pusat Mediasi Pasigala Hub', color: '#7C3AED', bg: '#F5F3FF' };
      default:
        return { label: 'Mitra Terdaftar', color: '#047857', bg: '#ECFDF5' };
    }
  };

  const badge = getRoleBadge();

  // Role-Specific Profile Analytics Data
  const getProfileChartData = () => {
    switch (currentUser.role) {
      case 'CORN_FARMER':
        return {
          title: 'Tren Produktivitas Panen & Mutu Kadar Air (KA)',
          subtitle: 'Rekam jejak volume panen pipil kering (Ton) vs tingkat kepatuhan kadar air standar SNI (≤14%)',
          unit: 'Ton',
          secondaryUnit: '%',
          primaryLegend: 'Volume Panen (Ton)',
          secondaryLegend: 'Kadar Air Rata-rata (%)',
          primaryColor: '#047857',
          secondaryColor: '#D97706',
          formatValue: (v: number) => `${v} Ton`,
          formatSecondaryValue: (v: number) => `KA ${v}%`,
          data: [
            { label: 'Mei', dateStr: 'Mei 2026', value: 6.2, secondaryValue: 13.8 },
            { label: 'Jun', dateStr: 'Juni 2026', value: 7.1, secondaryValue: 13.5 },
            { label: 'Jul', dateStr: 'Juli 2026', value: 8.4, secondaryValue: 13.2 },
            { label: 'Agu', dateStr: 'Agustus 2026', value: 7.8, secondaryValue: 13.4 },
            { label: 'Sep', dateStr: 'September 2026', value: 8.5, secondaryValue: 13.5 },
            { label: 'Okt (Est)', dateStr: 'Target Oktober', value: 9.2, secondaryValue: 13.3 },
          ]
        };
      case 'EGG_FARMER':
        return {
          title: 'Efisiensi Produksi Telur Harian & Konversi Pakan (FCR)',
          subtitle: 'Output telur harian kandang (rak/hari) vs rasio asupan pakan jagung pipil mandiri',
          unit: 'rak',
          secondaryUnit: 'kg',
          primaryLegend: 'Produksi Telur (Rak/Hari)',
          secondaryLegend: 'Konsumsi Pakan (Kg/Hari)',
          primaryColor: '#047857',
          secondaryColor: '#3B82F6',
          formatValue: (v: number) => `${v} rak`,
          formatSecondaryValue: (v: number) => `${v} kg`,
          data: [
            { label: 'Mei', dateStr: 'Mei 2026', value: 145, secondaryValue: 620 },
            { label: 'Jun', dateStr: 'Juni 2026', value: 158, secondaryValue: 640 },
            { label: 'Jul', dateStr: 'Juli 2026', value: 168, secondaryValue: 660 },
            { label: 'Agu', dateStr: 'Agustus 2026', value: 175, secondaryValue: 660 },
            { label: 'Sep', dateStr: 'September 2026', value: 182, secondaryValue: 660 },
            { label: 'Okt (Est)', dateStr: 'Target Oktober', value: 188, secondaryValue: 660 },
          ]
        };
      case 'UMKM_BUYER':
        return {
          title: 'Penyerapan Bahan Baku Telur & Akumulasi Penghematan HPP',
          subtitle: 'Realisasi pasokan telur mingguan (rak) vs akumulasi efisiensi biaya dibanding pasar eceran',
          unit: 'rak',
          secondaryUnit: 'Rp',
          primaryLegend: 'Penerimaan Telur (Rak)',
          secondaryLegend: 'Akumulasi Hemat Biaya',
          primaryColor: '#1D4ED8',
          secondaryColor: '#047857',
          formatValue: (v: number) => `${v} rak`,
          formatSecondaryValue: (v: number) => `Rp ${(v / 1000).toFixed(0)} Ribu`,
          data: [
            { label: 'Mei', dateStr: 'Mei 2026', value: 110, secondaryValue: 880000 },
            { label: 'Jun', dateStr: 'Juni 2026', value: 125, secondaryValue: 1880000 },
            { label: 'Jul', dateStr: 'Juli 2026', value: 135, secondaryValue: 2960000 },
            { label: 'Agu', dateStr: 'Agustus 2026', value: 140, secondaryValue: 4080000 },
            { label: 'Sep', dateStr: 'September 2026', value: 150, secondaryValue: 5280000 },
            { label: 'Okt (Est)', dateStr: 'Proyeksi Oktober', value: 160, secondaryValue: 6560000 },
          ]
        };
      case 'ADMIN':
      default:
        return {
          title: 'Pertumbuhan Nilai Transaksi & Akumulasi Kliring Pasigala',
          subtitle: 'Volume perputaran komoditas terintegrasi dan bagi hasil ekosistem regional',
          unit: 'Rp',
          secondaryUnit: 'Rp',
          primaryLegend: 'GMV Komoditas (Juta)',
          secondaryLegend: 'Komisi Platform (Ribu)',
          primaryColor: '#6D28D9',
          secondaryColor: '#047857',
          formatValue: (v: number) => `Rp ${(v / 1000000).toFixed(1)} Jt`,
          formatSecondaryValue: (v: number) => `Rp ${(v / 1000).toFixed(0)} Rb`,
          data: [
            { label: 'Mei', dateStr: 'Mei 2026', value: 12500000, secondaryValue: 485000 },
            { label: 'Jun', dateStr: 'Juni 2026', value: 18400000, secondaryValue: 712000 },
            { label: 'Jul', dateStr: 'Juli 2026', value: 29800000, secondaryValue: 1150000 },
            { label: 'Agu', dateStr: 'Agustus 2026', value: 38200000, secondaryValue: 1480000 },
            { label: 'Sep', dateStr: 'September 2026', value: 53200000, secondaryValue: 2056000 },
            { label: 'Okt (Est)', dateStr: 'Target Oktober', value: 68000000, secondaryValue: 2650000 },
          ]
        };
    }
  };

  const chartConfig = getProfileChartData();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Breadcrumb & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
          <span 
            onClick={() => {
              if (currentUser.role === 'CORN_FARMER') setActiveTab('dashboard_farmer');
              else if (currentUser.role === 'EGG_FARMER') setActiveTab('dashboard_egg_farmer');
              else if (currentUser.role === 'UMKM_BUYER') setActiveTab('dashboard_umkm');
              else setActiveTab('admin');
            }}
            style={{ cursor: 'pointer', color: 'var(--primary-700)', fontWeight: 600 }}
          >
            Dashboard
          </span>
          <span>/</span>
          <span style={{ color: 'var(--slate-800)', fontWeight: 700 }}>Profil & Analitik Akun</span>
        </div>
      </div>

      {/* Profile Header Banner */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: '#047857',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFFFFF'
            }}>
              <CheckCircle2 size={14} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0, letterSpacing: '-0.02em' }}>
                {currentUser.name}
              </h1>
              <span style={{
                background: badge.bg,
                color: badge.color,
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '6px'
              }}>
                {badge.label}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} style={{ color: 'var(--slate-400)' }} />
                {currentUser.village}, {currentUser.district}
              </span>
              <span>•</span>
              <span>ID Anggota: <strong>SDG-{currentUser.id.toUpperCase()}</strong></span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: 700 }}>
                <Star size={13} fill="#D97706" /> {currentUser.rating ? currentUser.rating.toFixed(1) : '4.9'} ({currentUser.reviewCount || 38} Ulasan)
              </span>
            </div>
          </div>
        </div>

        {/* Verification Status Card */}
        <div style={{
          background: 'var(--slate-50)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '12px 16px',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Status Keanggotaan
          </div>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#047857', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
            <ShieldCheck size={16} /> Terverifikasi BAST Sulteng
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Escrow Aktif & Terlindungi
          </div>
        </div>
      </div>

      {/* Profile Subtabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('info')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'info' ? '2px solid var(--primary-700)' : '2px solid transparent',
            color: activeSubTab === 'info' ? 'var(--primary-700)' : 'var(--slate-500)',
            fontWeight: activeSubTab === 'info' ? 700 : 500,
            fontSize: '0.86rem',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-1px',
            whiteSpace: 'nowrap'
          }}
        >
          <User size={16} /> Identitas & Lokasi Usaha
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('analytics')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'analytics' ? '2px solid var(--primary-700)' : '2px solid transparent',
            color: activeSubTab === 'analytics' ? 'var(--primary-700)' : 'var(--slate-500)',
            fontWeight: activeSubTab === 'analytics' ? 700 : 500,
            fontSize: '0.86rem',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-1px',
            whiteSpace: 'nowrap'
          }}
        >
          <BarChart3 size={16} /> Statistik & Kinerja Historis
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('bank')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'bank' ? '2px solid var(--primary-700)' : '2px solid transparent',
            color: activeSubTab === 'bank' ? 'var(--primary-700)' : 'var(--slate-500)',
            fontWeight: activeSubTab === 'bank' ? 700 : 500,
            fontSize: '0.86rem',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-1px',
            whiteSpace: 'nowrap'
          }}
        >
          <CreditCard size={16} /> Rekening Bank Escrow
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('security')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'security' ? '2px solid var(--primary-700)' : '2px solid transparent',
            color: activeSubTab === 'security' ? 'var(--primary-700)' : 'var(--slate-500)',
            fontWeight: activeSubTab === 'security' ? 700 : 500,
            fontSize: '0.86rem',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-1px',
            whiteSpace: 'nowrap'
          }}
        >
          <Lock size={16} /> Keamanan & Preferensi
        </button>
      </div>


      {/* Save Success Alert */}
      {isSaved && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#047857',
          fontSize: '0.82rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} />
          Perubahan profil dan pengaturan akun Anda berhasil disimpan ke database platform.
        </div>
      )}

      {/* Content Form */}
      <form onSubmit={handleSave}>
        {activeSubTab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '24px' }}>
            {/* Left Column: Form Fields */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px' }}>
              <h2 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 18px 0' }}>
                Informasi Kontak & Biodata Resmi
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                    Nama Lengkap Pemilik Akun
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                      Nomor Telepon / WhatsApp
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                      Alamat Email
                    </label>
                    <input 
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                      Nomor Induk Kependudukan (NIK)
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      value={formData.nik}
                      onChange={e => setFormData({ ...formData, nik: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                      disabled
                    />
                    <span style={{ fontSize: '0.68rem', color: 'var(--slate-400)', marginTop: '3px', display: 'block' }}>
                      Telah terverifikasi Dinas Kependudukan & Bapanas Sulteng
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                      Kecamatan / Kabupaten
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      value={`${formData.district}, ${formData.regency}`}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                    Alamat Lengkap Gudang / Lokasi Serah Terima
                  </label>
                  <textarea 
                    rows={2}
                    className="form-textarea"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                    Spesifikasi Kapasitas Agribisnis
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={formData.capacityNote}
                    onChange={e => setFormData({ ...formData, capacityNote: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Verification & Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 12px 0' }}>
                  Sertifikasi & Kemitraan
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}>
                    <CheckCircle2 size={16} style={{ color: '#047857' }} />
                    <span>Uji Tera Timbangan Metrologi Legal</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}>
                    <CheckCircle2 size={16} style={{ color: '#047857' }} />
                    <span>Standar Kadar Air Jagung Pipil ≤ 14%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}>
                    <CheckCircle2 size={16} style={{ color: '#047857' }} />
                    <span>Akun Terhubung Rekening Bersama BAST</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                  Butuh Bantuan Update Data Resmi?
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
                  Perubahan nama kelompok tani atau legalitas sertifikasi lahan dapat didampingi oleh fasilitator lapangan wilayah setempat.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'analytics' && (

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 3 KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {currentUser.role === 'CORN_FARMER' && (
                <>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Total Panen Terserap</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>48.5 <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Ton</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Terserap langsung ke peternak layer</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Kepatuhan SNI Kadar Air</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>99.4% <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Lolos Uji</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Rata-rata KA 13.4% (SNI ≤14.0%)</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Total Payout Escrow</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>Rp 245.5 <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Juta</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Pencairan 100% amanah tanpa calo</div>
                  </div>
                </>
              )}

              {currentUser.role === 'EGG_FARMER' && (
                <>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Distribusi Telur Kumulatif</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>12.400 <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Rak</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Pasokan rutin ke UMKM & resto</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>On-Time Delivery SLA</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>100% <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Tepat Waktu</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Seluruh jadwal B2B terpenuhi</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Efisiensi FCR Pakan</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#6D28D9', marginTop: '4px' }}>2.15 <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Ratio</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Formulasi jagung pipil mandiri Sigi</div>
                  </div>
                </>
              )}

              {currentUser.role === 'UMKM_BUYER' && (
                <>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Bahan Baku Diterima</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1D4ED8', marginTop: '4px' }}>820 <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Rak</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Grade A Segar (24.600 Butir)</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Efisiensi Biaya Pokok</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>+8.2% <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Margin</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Penghematan vs harga pasar eceran</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Akumulasi Hemat Biaya</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>Rp 5.28 <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Juta</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Terproteksi kontrak B2B harga tetap</div>
                  </div>
                </>
              )}

              {currentUser.role === 'ADMIN' && (
                <>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Gross Merchandise Value</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#6D28D9', marginTop: '4px' }}>Rp 53.2 <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Juta</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Nilai transaksi komoditas beredar</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Tingkat Mediasi Selesai</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>100% <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Tuntas</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Musyawarah arbitrase transparan</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Mitra Terverifikasi</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>4 <span style={{ fontSize: '0.84rem', color: 'var(--slate-400)' }}>Pelaku Usaha</span></div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>Rantai Pasok Pasigala Aktif</div>
                  </div>
                </>
              )}
            </div>

            {/* Main Interactive Chart */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
              <AnimatedTrendChart 
                title={chartConfig.title}
                subtitle={chartConfig.subtitle}
                unit={chartConfig.unit}
                secondaryUnit={chartConfig.secondaryUnit}
                primaryLegend={chartConfig.primaryLegend}
                secondaryLegend={chartConfig.secondaryLegend}
                primaryColor={chartConfig.primaryColor}
                secondaryColor={chartConfig.secondaryColor}
                data={chartConfig.data}
                formatValue={chartConfig.formatValue}
                formatSecondaryValue={chartConfig.formatSecondaryValue}
                height={220}
              />
            </div>

            {/* Quality & Audit Certification Row */}
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Audit Integritas Data & Standar Mutu Komoditas
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                  Seluruh data transaksi dan pengujian mutu telah divalidasi oleh Berita Acara Serah Terima (BAST) digital.
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#047857', fontWeight: 700 }}>
                <CheckCircle2 size={16} /> Data Tervalidasi Resmi
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'bank' && (
          <div style={{ maxWidth: '680px', background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 8px 0' }}>
              Rekening Penampungan & Pencairan Dana Escrow
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: '0 0 20px 0' }}>
              Dana hasil penjualan otomatis dicairkan ke rekening ini setelah Berita Acara Serah Terima (BAST) terkonfirmasi.
            </p>


            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  Nama Bank
                </label>
                <select 
                  className="form-input"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                >
                  <option value="Bank Sulteng (BPD Sulawesi Tengah)">Bank Sulteng (BPD Sulawesi Tengah)</option>
                  <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="Bank Negara Indonesia (BNI)">Bank Negara Indonesia (BNI)</option>
                  <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  Nomor Rekening
                </label>
                <input 
                  type="text"
                  className="form-input"
                  value={formData.bankAccount}
                  onChange={e => setFormData({ ...formData, bankAccount: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  Nama Pemilik Rekening (Sesuai Buku Tabungan)
                </label>
                <input 
                  type="text"
                  className="form-input"
                  value={formData.accountHolder}
                  onChange={e => setFormData({ ...formData, accountHolder: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontSize: '0.76rem', fontWeight: 700 }}>
                <CheckCircle2 size={16} />
                Rekening telah terverifikasi amanah untuk transaksi tanpa tengkulak di platform Saudagro.
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'security' && (
          <div style={{ maxWidth: '680px', background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 16px 0' }}>
              Keamanan Akun & Notifikasi
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  Ubah Kata Sandi Baru
                </label>
                <input 
                  type="password"
                  placeholder="Masukkan kata sandi baru (min. 8 karakter)..."
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ padding: '14px 16px', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--slate-900)' }}>
                    Notifikasi WhatsApp Real-time
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                    Terima info pesanan masuk, jadwal kirim armada, dan konfirmasi pencairan dana via WA.
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.whatsappNotification}
                  onChange={e => setFormData({ ...formData, whatsappNotification: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#047857' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginTop: '24px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '9px 24px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={15} /> Simpan Perubahan Profil
          </button>
        </div>
      </form>
    </div>
  );
};
