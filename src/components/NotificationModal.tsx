import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Check, Clock, ShieldCheck, CreditCard, Truck, MessageSquare } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} style={{ color: 'var(--primary-700)' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Pusat Notifikasi & Pembaruan
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                Update transaksi, jadwal kontrak B2B, dan pencairan dana
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
            onClick={clearAllNotifications}
          >
            <Check size={13} /> Tandai Semua Dibaca
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '30px' }}>
              Tidak ada notifikasi baru.
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-200)',
                  background: notif.isRead ? 'white' : 'var(--primary-50)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onClick={() => markNotificationAsRead(notif.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: notif.isRead ? 'var(--slate-800)' : 'var(--primary-900)' }}>
                    {notif.title}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                    {new Date(notif.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', lineHeight: '1.4' }}>
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
