import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wheat, Egg, Store, CheckCircle2, ArrowRight, ArrowLeft, Phone, User, MapPin } from 'lucide-react';
import { District } from '../types';

interface AssistedRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssistedRegisterModal: React.FC<AssistedRegisterModalProps> = ({ isOpen, onClose }) => {
  const { registerAssistedFarmer } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<'CORN_FARMER' | 'EGG_FARMER' | 'UMKM_BUYER'>('CORN_FARMER');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState<District>('Kabupaten Sigi');
  const [village, setVillage] = useState('');
  const [farmCapacity, setFarmCapacity] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !village) {
      alert('Mohon lengkapi nama, nomor WhatsApp, dan desa Anda.');
      return;
    }

    registerAssistedFarmer({
      name,
      phone,
      role: selectedRole,
      district,
      village,
      farmCapacity: farmCapacity || (selectedRole === 'CORN_FARMER' ? '2 Hektar Jagung' : selectedRole === 'EGG_FARMER' ? '3.000 Ekor Ayam' : 'Kebutuhan Harian 30 Rak')
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Pendaftaran Mudah & Didampingi
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Langkah {step} dari 3 — Khusus Petani & Pelaku Usaha Sulteng
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '6px', borderRadius: '4px', background: step >= 1 ? 'var(--primary-600)' : 'var(--slate-200)' }} />
          <div style={{ flex: 1, height: '6px', borderRadius: '4px', background: step >= 2 ? 'var(--primary-600)' : 'var(--slate-200)' }} />
          <div style={{ flex: 1, height: '6px', borderRadius: '4px', background: step >= 3 ? 'var(--primary-600)' : 'var(--slate-200)' }} />
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: 'var(--slate-800)' }}>
              1. Pilih Usaha Utama Anda:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                className={`card ${selectedRole === 'CORN_FARMER' ? 'border-primary' : ''}`}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: selectedRole === 'CORN_FARMER' ? '2px solid var(--primary-600)' : '1.5px solid var(--slate-200)',
                  background: selectedRole === 'CORN_FARMER' ? 'var(--primary-50)' : 'white'
                }}
                onClick={() => setSelectedRole('CORN_FARMER')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: 'var(--harvest-100)', color: 'var(--harvest-700)', padding: '12px', borderRadius: '12px' }}>
                    <Wheat size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)' }}>Saya Petani Jagung</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>Ingin menjual hasil panen jagung pakan langsung ke peternak dengan harga adil.</div>
                  </div>
                  {selectedRole === 'CORN_FARMER' && <CheckCircle2 size={22} style={{ color: 'var(--primary-600)' }} />}
                </div>
              </div>

              <div 
                className={`card ${selectedRole === 'EGG_FARMER' ? 'border-primary' : ''}`}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: selectedRole === 'EGG_FARMER' ? '2px solid var(--primary-600)' : '1.5px solid var(--slate-200)',
                  background: selectedRole === 'EGG_FARMER' ? 'var(--primary-50)' : 'white'
                }}
                onClick={() => setSelectedRole('EGG_FARMER')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: 'var(--egg-100)', color: 'var(--egg-600)', padding: '12px', borderRadius: '12px' }}>
                    <Egg size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)' }}>Saya Peternak Ayam Petelur</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>Ingin beli pakan jagung murah berkualitas & jual telur langsung ke toko roti/catering.</div>
                  </div>
                  {selectedRole === 'EGG_FARMER' && <CheckCircle2 size={22} style={{ color: 'var(--primary-600)' }} />}
                </div>
              </div>

              <div 
                className={`card ${selectedRole === 'UMKM_BUYER' ? 'border-primary' : ''}`}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: selectedRole === 'UMKM_BUYER' ? '2px solid var(--primary-600)' : '1.5px solid var(--slate-200)',
                  background: selectedRole === 'UMKM_BUYER' ? 'var(--primary-50)' : 'white'
                }}
                onClick={() => setSelectedRole('UMKM_BUYER')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', padding: '12px', borderRadius: '12px' }}>
                    <Store size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)' }}>Saya Pemilik Bakery / Catering / UMKM</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>Ingin pasokan telur segar harga tetap dan terjamin dari peternak lokal.</div>
                  </div>
                  {selectedRole === 'UMKM_BUYER' && <CheckCircle2 size={22} style={{ color: 'var(--primary-600)' }} />}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
                Lanjut ke Data Diri <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: 'var(--slate-800)' }}>
              2. Kontak & Nama Lengkap
            </h3>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.95rem' }}>
                <User size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Nama Lengkap Anda
              </label>
              <input 
                type="text" 
                className="form-input" 
                style={{ fontSize: '1rem', padding: '12px' }}
                placeholder="Contoh: Pak Herman Latando"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.95rem' }}>
                <Phone size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Nomor WhatsApp Aktif
              </label>
              <input 
                type="tel" 
                className="form-input" 
                style={{ fontSize: '1rem', padding: '12px' }}
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                *Kami akan mengirimkan konfirmasi pesanan dan tautan langsung ke WhatsApp ini.
              </p>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Kembali
              </button>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => {
                  if (!name || !phone) alert('Mohon isi nama dan nomor WhatsApp.');
                  else setStep(3);
                }}
              >
                Lanjut ke Lokasi <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: 'var(--slate-800)' }}>
              3. Lokasi & Kapasitas Produksi
            </h3>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.95rem' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Kabupaten / Kota di Sulawesi Tengah
              </label>
              <select 
                className="form-select" 
                style={{ fontSize: '1rem', padding: '12px' }}
                value={district}
                onChange={e => setDistrict(e.target.value as District)}
              >
                <option value="Kabupaten Sigi">Kabupaten Sigi (Sigi Biromaru, Marawola, Dolo)</option>
                <option value="Kota Palu">Kota Palu (Palu Barat, Palu Selatan, Palu Timur, Mantikulore)</option>
                <option value="Kabupaten Donggala">Kabupaten Donggala (Sindue, Banawa, Labuan)</option>
                <option value="Kabupaten Parigi Moutong">Kabupaten Parigi Moutong</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.95rem' }}>
                Nama Desa / Kelurahan & Kecamatan
              </label>
              <input 
                type="text" 
                className="form-input" 
                style={{ fontSize: '1rem', padding: '12px' }}
                placeholder="Contoh: Desa Lolu, Kec. Sigi Biromaru"
                value={village}
                onChange={e => setVillage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.95rem' }}>
                Estimasi Kapasitas Lahan / Kandang / Usaha
              </label>
              <input 
                type="text" 
                className="form-input" 
                style={{ fontSize: '1rem', padding: '12px' }}
                placeholder={
                  selectedRole === 'CORN_FARMER' 
                    ? 'Contoh: 3 Hektar Jagung (~12 Ton per Panen)' 
                    : selectedRole === 'EGG_FARMER'
                    ? 'Contoh: 4.000 Ekor Ayam (~100 Rak per Hari)'
                    : 'Contoh: Kebutuhan Telur 30 Rak per Minggu'
                }
                value={farmCapacity}
                onChange={e => setFarmCapacity(e.target.value)}
              />
            </div>

            <div style={{ background: 'var(--primary-50)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--primary-800)' }}>
              ✓ Pendaftaran langsung mendapatkan <strong>Badge Terverifikasi Lapangan</strong> dari Tim Saudagro.
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Kembali
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                Selesaikan Pendaftaran <CheckCircle2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
