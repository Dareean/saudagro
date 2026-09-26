import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  MapPin, 
  Wheat, 
  Egg, 
  Store, 
  Star, 
  Phone, 
  LogOut, 
  ChevronDown,
  UserCheck,
  RefreshCw
} from 'lucide-react';

export const PersonaBanner: React.FC = () => {
  const { currentUser, assistedMode, logout, switchUser, activeUserKey } = useApp();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  return (
    <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)', padding: '8px 0' }}>
      <div className="main-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        {/* Left: User Identity Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-600)' }} 
            />
            {currentUser.verified && (
              <ShieldCheck 
                size={14} 
                style={{ position: 'absolute', bottom: -1, right: -1, color: '#2563eb', background: 'white', borderRadius: '50%' }} 
              />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--slate-900)' }}>
                {currentUser.name}
              </span>
              
              {/* Role Chip */}
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px', 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '6px',
                background: 
                  currentUser.role === 'CORN_FARMER' ? '#FEF3C7' :
                  currentUser.role === 'EGG_FARMER' ? '#ECFDF5' :
                  currentUser.role === 'UMKM_BUYER' ? '#EFF6FF' : '#F8FAFC',
                color:
                  currentUser.role === 'CORN_FARMER' ? '#B45309' :
                  currentUser.role === 'EGG_FARMER' ? '#047857' :
                  currentUser.role === 'UMKM_BUYER' ? '#2563EB' : 'var(--slate-700)',
                border: `1px solid ${
                  currentUser.role === 'CORN_FARMER' ? '#FDE68A' :
                  currentUser.role === 'EGG_FARMER' ? '#A7F3D0' :
                  currentUser.role === 'UMKM_BUYER' ? '#BFDBFE' : 'var(--border-subtle)'
                }`
              }}>
                {currentUser.role === 'CORN_FARMER' && <><Wheat size={12} /> Petani Jagung Sigi</>}
                {currentUser.role === 'EGG_FARMER' && <><Egg size={12} /> Peternak Ayam Palu</>}
                {currentUser.role === 'UMKM_BUYER' && <><Store size={12} /> Owner UMKM Bakery</>}
                {currentUser.role === 'ADMIN' && <><ShieldCheck size={12} /> Pusat Mediasi Sulteng</>}
              </span>

              {assistedMode && (
                <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                  Pendampingan Agen
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={12} style={{ color: 'var(--primary-600)' }} />
                {currentUser.village}, {currentUser.district}
              </span>
              {currentUser.farmCapacity && (
                <span>• {currentUser.farmCapacity}</span>
              )}
              {currentUser.rating && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#B45309', fontWeight: 700 }}>
                  • <Star size={11} fill="#F59E0B" color="#F59E0B" />
                  {currentUser.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Verified Badge, Role Quick Switcher & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Demo Role Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSwitchMenu(!showSwitchMenu)}
              className="btn btn-sm btn-secondary"
              style={{ padding: '5px 10px', fontSize: '0.76rem', fontWeight: 700, borderRadius: '8px', gap: '5px' }}
              title="Ganti persona peran demo"
            >
              <RefreshCw size={12} />
              <span>Ganti Peran</span>
              <ChevronDown size={12} />
            </button>

            {showSwitchMenu && (
              <div 
                style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: '100%', 
                  marginTop: '4px', 
                  background: 'white', 
                  borderRadius: '10px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)', 
                  border: '1px solid var(--border-subtle)', 
                  zIndex: 100, 
                  minWidth: '220px',
                  padding: '6px'
                }}
              >
                {[
                  { key: 'pak_jufri', label: 'Pak Jufri (Petani Jagung Sigi)', role: 'CORN_FARMER' },
                  { key: 'bu_rahma', label: 'Bu Rahma (Peternak Ayam Palu)', role: 'EGG_FARMER' },
                  { key: 'kak_dilla', label: 'Kak Dilla (UMKM Bakery Palu)', role: 'UMKM_BUYER' },
                  { key: 'admin_saudagro', label: 'Admin Pusat Mediasi', role: 'ADMIN' }
                ].map(p => (
                  <div
                    key={p.key}
                    onClick={() => {
                      switchUser(p.key as any);
                      setShowSwitchMenu(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: activeUserKey === p.key ? 800 : 500,
                      background: activeUserKey === p.key ? 'var(--primary-50)' : 'transparent',
                      color: activeUserKey === p.key ? 'var(--primary-700)' : 'var(--slate-700)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{p.label}</span>
                    {activeUserKey === p.key && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-600)' }} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--slate-600)', background: 'var(--slate-50)', padding: '5px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            <span>Terverifikasi</span>
            {currentUser.phone && <span style={{ color: 'var(--slate-400)' }}>• {currentUser.phone}</span>}
          </div>

          <button
            onClick={logout}
            className="btn btn-sm btn-outline"
            style={{ padding: '5px 10px', fontSize: '0.76rem', color: 'var(--danger-600)', borderColor: '#FCA5A5', background: '#FEF2F2', borderRadius: '8px' }}
            title="Keluar dari akun"
          >
            <LogOut size={12} />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
