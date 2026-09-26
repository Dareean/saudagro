import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Wheat, 
  Egg, 
  FileCheck2, 
  FileText, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  User, 
  ChevronRight,
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAssistedRegister?: () => void;
  onOpenTermsModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
  onOpenAssistedRegister,
  onOpenTermsModal
}) => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    logout 
  } = useApp();

  const getRoleLabel = () => {
    switch (currentUser.role) {
      case 'CORN_FARMER': return 'Petani Jagung';
      case 'EGG_FARMER': return 'Peternak Ayam';
      case 'UMKM_BUYER': return 'UMKM Bakery';
      case 'ADMIN': return 'Admin Mediasi';
      default: return 'Mitra';
    }
  };

  const getNavLinks = () => {
    switch (currentUser.role) {
      case 'CORN_FARMER':
        return [
          { id: 'dashboard', label: 'Silo & Panen Jagung', icon: LayoutDashboard },
          { id: 'market_corn', label: 'Jual Jagung Pipil', icon: Wheat },
          { id: 'market_eggs', label: 'Info Acuan Telur', icon: Egg },
          { id: 'history', label: 'Riwayat Penjualan', icon: FileText }
        ];
      case 'EGG_FARMER':
        return [
          { id: 'dashboard', label: 'Dual-Hub Pakan & Telur', icon: LayoutDashboard },
          { id: 'market_corn', label: 'Beli Pakan Jagung Sigi', icon: Wheat },
          { id: 'market_eggs', label: 'Jual Pasokan Telur', icon: Egg },
          { id: 'contracts', label: 'Kontrak Pasokan B2B', icon: FileCheck2 },
          { id: 'history', label: 'Riwayat Transaksi', icon: FileText }
        ];
      case 'UMKM_BUYER':
        return [
          { id: 'dashboard', label: 'Pengadaan & QC Telur', icon: LayoutDashboard },
          { id: 'market_eggs', label: 'Pengadaan Pasokan Telur', icon: Egg },
          { id: 'contracts', label: 'Jadwal Kontrak Langganan', icon: FileCheck2 },
          { id: 'history', label: 'Riwayat Faktur BAST', icon: FileText }
        ];
      case 'ADMIN':
      default:
        return [
          { id: 'dashboard', label: 'Control Tower Pasigala', icon: LayoutDashboard },
          { id: 'market_corn', label: 'Katalog Pasar Jagung', icon: Wheat },
          { id: 'market_eggs', label: 'Katalog Pasar Telur', icon: Egg },
          { id: 'contracts', label: 'Kliring Kontrak B2B', icon: FileCheck2 },
          { id: 'history', label: 'Semua Log Transaksi', icon: FileText }
        ];
    }
  };

  const navLinks = getNavLinks();


  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
        />
      )}

      <aside className={`app-sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div style={{ padding: '20px 20px 16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/logo/saudagro-icon.png" 
              alt="Saudagro" 
              style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--slate-900)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Saudagro
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', marginTop: '3px' }}>
                Pasigala Agribisnis B2B
              </div>
            </div>
          </div>

          {isOpenMobile && (
            <button 
              onClick={onCloseMobile}
              style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--slate-400)', letterSpacing: '0.04em', padding: '4px 10px', textTransform: 'uppercase' }}>
            Menu Platform
          </div>

          {navLinks.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'dashboard' && activeTab.startsWith('dashboard'));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'dashboard') {
                    if (currentUser.role === 'CORN_FARMER') setActiveTab('dashboard_farmer');
                    else if (currentUser.role === 'EGG_FARMER') setActiveTab('dashboard_egg_farmer');
                    else if (currentUser.role === 'UMKM_BUYER') setActiveTab('dashboard_umkm');
                    else setActiveTab('admin');
                  } else {
                    setActiveTab(item.id);
                  }
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
              >
                <IconComp size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--slate-400)', letterSpacing: '0.04em', padding: '16px 10px 4px 10px', textTransform: 'uppercase' }}>
            Bantuan & Layanan
          </div>

          {onOpenAssistedRegister && (
            <button
              type="button"
              onClick={() => {
                onOpenAssistedRegister();
                if (onCloseMobile) onCloseMobile();
              }}
              className="sidebar-nav-link"
            >
              <HelpCircle size={16} />
              <span>Fasilitator Lapangan</span>
            </button>
          )}

          {onOpenTermsModal && (
            <button
              type="button"
              onClick={() => {
                onOpenTermsModal();
                if (onCloseMobile) onCloseMobile();
              }}
              className="sidebar-nav-link"
            >
              <ShieldCheck size={16} />
              <span>Akad & Ketentuan</span>
            </button>
          )}
        </nav>

        {/* User Profile Card at Bottom - Navigates directly to Profile Page */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--slate-50)' }}>
          <div 
            onClick={() => {
              setActiveTab('profile');
              if (onCloseMobile) onCloseMobile();
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: activeTab === 'profile' ? '#FFFFFF' : 'transparent',
              border: activeTab === 'profile' ? '1px solid var(--border-subtle)' : '1px solid transparent',
              boxShadow: activeTab === 'profile' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              if (activeTab !== 'profile') (e.currentTarget.style.background = '#FFFFFF');
            }}
            onMouseLeave={e => {
              if (activeTab !== 'profile') (e.currentTarget.style.background = 'transparent');
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--slate-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                  {getRoleLabel()} • {currentUser.district}
                </div>
              </div>
            </div>

            <ChevronRight size={15} style={{ color: activeTab === 'profile' ? 'var(--primary-700)' : 'var(--slate-400)', flexShrink: 0 }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> Terhubung
            </span>

            <button
              type="button"
              onClick={logout}
              style={{ background: 'none', border: 'none', color: 'var(--slate-500)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
            >
              <LogOut size={12} /> Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
