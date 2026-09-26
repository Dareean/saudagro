import React from 'react';
import { useApp } from '../context/AppContext';
import { Wheat, Egg, LayoutDashboard, FileCheck2, FileText, Bell } from 'lucide-react';

interface MobileNavProps {
  onOpenNotifications: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenNotifications }) => {
  const { activeTab, setActiveTab, currentUser, notifications } = useApp();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="mobile-nav-bar">
      <button 
        className={`mobile-nav-item ${activeTab === 'market_corn' ? 'active' : ''}`}
        onClick={() => setActiveTab('market_corn')}
      >
        <Wheat size={20} />
        <span>Jagung</span>
      </button>

      <button 
        className={`mobile-nav-item ${activeTab === 'market_eggs' ? 'active' : ''}`}
        onClick={() => setActiveTab('market_eggs')}
      >
        <Egg size={20} />
        <span>Telur</span>
      </button>

      <button 
        className={`mobile-nav-item ${activeTab.startsWith('dashboard') ? 'active' : ''}`}
        onClick={() => {
          if (currentUser.role === 'CORN_FARMER') setActiveTab('dashboard_farmer');
          else if (currentUser.role === 'EGG_FARMER') setActiveTab('dashboard_egg_farmer');
          else if (currentUser.role === 'UMKM_BUYER') setActiveTab('dashboard_umkm');
          else setActiveTab('admin');
        }}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </button>

      <button 
        className={`mobile-nav-item ${activeTab === 'contracts' ? 'active' : ''}`}
        onClick={() => setActiveTab('contracts')}
      >
        <FileCheck2 size={20} />
        <span>Kontrak</span>
      </button>

      <button 
        className={`mobile-nav-item ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => setActiveTab('history')}
      >
        <FileText size={20} />
        <span>Riwayat</span>
      </button>

      <button 
        className="mobile-nav-item"
        onClick={onOpenNotifications}
      >
        <Bell size={20} />
        <span>Pesan</span>
        {unreadCount > 0 && (
          <span className="nav-badge-count">{unreadCount}</span>
        )}
      </button>
    </div>
  );
};
