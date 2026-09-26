import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, Wheat, Egg, Store, Star, Phone, LogOut } from 'lucide-react';

export const PersonaBanner: React.FC = () => {
  const { currentUser, assistedMode, logout } = useApp();

  return (
    <div className="identity-bar" style={{ background: 'white', borderBottom: '1px solid var(--border-subtle)', padding: '10px 0' }}>
      <div className="main-wrapper identity-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div className="identity-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              <span className="identity-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                {currentUser.role === 'CORN_FARMER' && <><Wheat size={13} style={{ color: 'var(--amber-700)' }} /> Petani Jagung</>}
                {currentUser.role === 'EGG_FARMER' && <><Egg size={13} style={{ color: 'var(--primary-700)' }} /> Peternak Ayam</>}
                {currentUser.role === 'UMKM_BUYER' && <><Store size={13} style={{ color: '#2563EB' }} /> UMKM Bakery</>}
                {currentUser.role === 'ADMIN' && <><ShieldCheck size={13} style={{ color: 'var(--slate-700)' }} /> Pusat Mediasi Sulteng</>}
              </span>
              {assistedMode && (
                <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                  Pendampingan Agen
                </span>
              )}
            </div>
            <div className="identity-location" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={12} style={{ color: 'var(--primary-600)' }} />
                {currentUser.village}, {currentUser.district}
              </span>
              {currentUser.farmCapacity && (
                <span>• Kapasitas: <strong style={{ color: 'var(--slate-700)' }}>{currentUser.farmCapacity}</strong></span>
              )}
              {currentUser.rating && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#B45309', fontWeight: 700 }}>
                  <Star size={12} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                  {currentUser.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--slate-600)', background: 'var(--slate-50)', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
            <span>Akun Terverifikasi</span>
            {currentUser.phone && <span style={{ color: 'var(--slate-400)' }}>• {currentUser.phone}</span>}
          </div>

          <button
            onClick={logout}
            className="btn btn-sm btn-outline"
            style={{ padding: '5px 12px', fontSize: '0.78rem', color: 'var(--danger-600)', borderColor: '#FCA5A5', background: '#FEF2F2' }}
            title="Keluar dari akun"
          >
            <LogOut size={13} />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
