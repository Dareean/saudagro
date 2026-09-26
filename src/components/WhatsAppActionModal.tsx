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
            <div style={{ background: '#25D366', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex' }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {actionTitle}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Hubungi langsung via WhatsApp ke {recipientName}
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
