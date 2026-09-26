import React from 'react';
import { X, Send, Phone, MessageSquare, Copy, Check } from 'lucide-react';

interface WhatsAppActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientPhone: string;
  defaultMessage: string;
  actionTitle: string;
}

export const WhatsAppActionModal: React.FC<WhatsAppActionModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientPhone,
  defaultMessage,
  actionTitle
}) => {
  const [copied, setCopied] = React.useState(false);
  const [message, setMessage] = React.useState(defaultMessage);

  React.useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  if (!isOpen) return null;

  const handleOpenWhatsApp = () => {
    // Clean phone number (replace leading 0 with 62)
    let formattedPhone = recipientPhone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1);
    }
    const encodedText = encodeURIComponent(message);
    const url = `https://wa.me/${formattedPhone}?text=${encodedText}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#075E54', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.079-1.85-.426-1.505-.625-2.476-2.15-2.551-2.25-.074-.1-1.17-1.558-1.17-2.971 0-1.413.738-2.108 1.002-2.397.264-.289.576-.361.768-.361.192 0 .384.002.552.01.178.009.418-.068.653.498.24.577.817 1.996.889 2.14.072.145.12.313.024.505-.096.192-.144.312-.288.481-.144.168-.303.376-.433.504-.144.145-.295.302-.127.591.168.289.747 1.232 1.604 1.995 1.102.981 2.032 1.285 2.32 1.43.289.144.457.12.625-.073.168-.192.72-.842.912-1.13.192-.289.384-.24.649-.144.264.096 1.681.793 1.969.937.288.145.48.217.552.337.072.12.072.72-.072 1.125zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.399A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.15-.44-4.46-1.22l-.32-.19-2.96.83.82-2.88-.21-.34A8.16 8.16 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {actionTitle}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Hubungi langsung via WhatsApp resmi ke {recipientName}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ background: 'var(--slate-50)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Kontak Tujuan:</div>
            <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{recipientName}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={13} /> {recipientPhone}
            </div>
          </div>
          <span className="badge badge-success">Terhubung Langsung</span>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Pesan Otomatis Siap Kirim:</label>
            <button 
              type="button" 
              onClick={handleCopy} 
              style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Tersalin!' : 'Salin Pesan'}
            </button>
          </div>
          <textarea 
            className="form-textarea" 
            rows={5} 
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{ fontSize: '0.9rem', lineHeight: '1.4' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Batal
          </button>
          <button 
            className="btn btn-wa" 
            style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={handleOpenWhatsApp}
          >
            <Send size={16} /> Buka Chat WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
