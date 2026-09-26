import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  Clock, 
  Bell, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  HelpCircle,
  ShieldCheck,
  Wheat,
  Egg,
  Store,
  LayoutDashboard,
  FileText,
  FileCheck2,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  onOpenAssistedRegister: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssistedRegister, onOpenNotifications }) => {
  const { 
    currentUser, 
    activeUserKey, 
    switchUser, 
    activeTab, 
    setActiveTab, 
    assistedMode, 
    setAssistedMode,
    notifications,
    resetToSeedData,
    logout
  } = useApp();

  const [witaTime, setWitaTime] = useState<string>('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now);
      setWitaTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="header-bar">
      <div className="main-wrapper header-content">
        {/* Brand */}
        <div className="brand-logo" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-icon-box" style={{ background: 'white', border: '1px solid var(--border-subtle)', padding: '3px' }}>
            <img 
              src="/logo/saudagro-icon.png" 
              alt="Saudagro" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          <div>
            <div className="brand-title">
              Saudagro
              <span className="brand-badge">Sulteng</span>
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="desktop-nav">
          <button 
            className={`nav-tab-btn ${activeTab === 'market_corn' ? 'active' : ''}`}
            onClick={() => setActiveTab('market_corn')}
          >
            <Wheat size={15} />
            Pasar Jagung
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'market_eggs' ? 'active' : ''}`}
            onClick={() => setActiveTab('market_eggs')}
          >
            <Egg size={15} />
            Pasar Telur
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            <FileCheck2 size={15} />
            Kontrak B2B
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FileText size={15} />
            Riwayat
          </button>
          <button 
            className={`nav-tab-btn ${activeTab.startsWith('dashboard') ? 'active' : ''}`}
            onClick={() => {
              if (currentUser.role === 'CORN_FARMER') setActiveTab('dashboard_farmer');
              else if (currentUser.role === 'EGG_FARMER') setActiveTab('dashboard_egg_farmer');
              else if (currentUser.role === 'UMKM_BUYER') setActiveTab('dashboard_umkm');
              else setActiveTab('admin');
            }}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </button>
        </nav>

        {/* Header Right Area */}
        <div className="header-actions">
          {/* Mode Sederhana Toggle */}
          <button 
            className={`btn btn-sm ${assistedMode ? 'btn-harvest' : 'btn-secondary'}`}
            onClick={() => {
              setAssistedMode(!assistedMode);
              if (!assistedMode) {
                document.body.classList.add('assisted-mode-active');
              } else {
                document.body.classList.remove('assisted-mode-active');
              }
            }}
            title="Mode Teks & Tombol Besar Ramah Petani"
          >
            <Sparkles size={14} />
            <span>{assistedMode ? 'Mode Besar Aktif' : 'Mode Santai'}</span>
          </button>

          {/* Assisted Register Help */}
          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenAssistedRegister}
            title="Daftar dengan bantuan tim lapangan"
          >
            <HelpCircle size={14} />
            <span>Bantuan Daftar</span>
          </button>

          {/* Notification Button */}
          <button 
            className="header-icon-btn"
            onClick={onOpenNotifications}
            title="Pusat Notifikasi"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="nav-badge-count">{unreadCount}</span>
            )}
          </button>

          {/* Profile Pill & Dropdown */}
          <div style={{ position: 'relative' }}>
            <div 
              className="header-profile-chip"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="header-profile-img"
              />
              <span className="header-profile-text">
                {currentUser.name.split(' ')[0]}
                <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
              </span>
            </div>

            {showRoleDropdown && (
              <div className="profile-dropdown-menu">
                <div style={{ padding: '6px 8px 10px 8px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--forest-900)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.village}, {currentUser.district}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--forest-700)', fontWeight: 600, marginTop: '2px' }}>{currentUser.phone}</div>
                </div>

                <div style={{ padding: '0 8px 6px 8px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Pindah Profil Simulasi:
                </div>
                
                <button
                  className={`btn btn-full btn-sm ${activeUserKey === 'pak_jufri' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', marginBottom: '5px', textAlign: 'left', borderRadius: 'var(--radius-md)' }}
                  onClick={() => {
                    switchUser('pak_jufri');
                    setShowRoleDropdown(false);
                  }}
                >
                  <Wheat size={14} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Pak Jufri Latandu</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Petani Jagung (Sigi)</div>
                  </div>
                </button>

                <button
                  className={`btn btn-full btn-sm ${activeUserKey === 'bu_rahma' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', marginBottom: '5px', textAlign: 'left', borderRadius: 'var(--radius-md)' }}
                  onClick={() => {
                    switchUser('bu_rahma');
                    setShowRoleDropdown(false);
                  }}
                >
                  <Egg size={14} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Bu Rahmawati (Berkah)</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Peternak Ayam (Palu)</div>
                  </div>
                </button>

                <button
                  className={`btn btn-full btn-sm ${activeUserKey === 'kak_dilla' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', marginBottom: '5px', textAlign: 'left', borderRadius: 'var(--radius-md)' }}
                  onClick={() => {
                    switchUser('kak_dilla');
                    setShowRoleDropdown(false);
                  }}
                >
                  <Store size={14} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Kak Dilla (Dilla Bakery)</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Pembeli B2B (Palu)</div>
                  </div>
                </button>

                <button
                  className={`btn btn-full btn-sm ${activeUserKey === 'admin_saudagro' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', marginBottom: '8px', textAlign: 'left', borderRadius: 'var(--radius-md)' }}
                  onClick={() => {
                    switchUser('admin_saudagro');
                    setShowRoleDropdown(false);
                  }}
                >
                  <ShieldCheck size={14} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Saudagro Ops Center</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Admin & Komisi</div>
                  </div>
                </button>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    className="btn btn-full btn-sm btn-secondary"
                    style={{ fontSize: '0.75rem', color: 'var(--slate-600)', borderRadius: 'var(--radius-sm)', justifyContent: 'flex-start' }}
                    onClick={() => {
                      logout();
                      setShowRoleDropdown(false);
                    }}
                  >
                    <LogOut size={13} style={{ color: 'var(--danger-600)' }} />
                    Keluar ke Landing Page
                  </button>
                  <button
                    className="btn btn-full btn-sm btn-secondary"
                    style={{ fontSize: '0.75rem', color: 'var(--slate-500)', borderRadius: 'var(--radius-sm)', justifyContent: 'flex-start' }}
                    onClick={() => {
                      if (window.confirm('Reset data simulasi ke kondisi awal?')) {
                        resetToSeedData();
                        setShowRoleDropdown(false);
                      }
                    }}
                  >
                    <RotateCcw size={12} />
                    Reset Data Simulasi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
