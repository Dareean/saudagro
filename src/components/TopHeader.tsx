import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Search, 
  Menu, 
  Clock,
  Wheat,
  Egg
} from 'lucide-react';

interface TopHeaderProps {
  onToggleMobileMenu: () => void;
  onOpenNotifications: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleMobileMenu,
  onOpenNotifications
}) => {
  const { notifications, currentUser } = useApp();
  const [witaTime, setWitaTime] = useState('');

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
    <header className="app-top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onToggleMobileMenu}
          className="mobile-menu-btn"
          aria-label="Buka Menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
          <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>Saudagro Hub</span>
          <span>/</span>
          <span>{currentUser.district}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Subtle Market Benchmark Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--slate-600)' }}>
          <span>Spot Jagung: <strong style={{ color: 'var(--slate-900)' }}>Rp 5.200/kg</strong></span>
          <span style={{ color: 'var(--slate-300)' }}>|</span>
          <span>Spot Telur: <strong style={{ color: 'var(--slate-900)' }}>Rp 51.500/rak</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '4px 10px', borderRadius: '6px' }}>
          <Clock size={12} />
          <span>{witaTime || '13:10'} WITA</span>
        </div>

        {/* Notifications */}
        <button 
          type="button" 
          onClick={onOpenNotifications}
          className="top-notification-btn"
          title="Notifikasi"
          aria-label="Buka Notifikasi"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="top-notif-badge">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
