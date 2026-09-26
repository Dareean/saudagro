import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { B2BContract } from '../types';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Truck, 
  Clock, 
  CreditCard, 
  MessageSquare, 
  FileText, 
  RotateCw, 
  ShieldCheck, 
  Package,
  Layers
} from 'lucide-react';
import { WhatsAppActionModal } from './WhatsAppActionModal';

interface ContractDetailsModalProps {
  contract: B2BContract | null;
  onClose: () => void;
}

export const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({ contract, onClose }) => {
  const { 
    currentUser, 
    fulfillContractCycle, 
    payContractCycle 
  } = useApp();

  const [waModalData, setWaModalData] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientPhone: string;
    defaultMessage: string;
    actionTitle: string;
  }>({
    isOpen: false,
    recipientName: '',
    recipientPhone: '',
    defaultMessage: '',
    actionTitle: ''
  });

  if (!contract) return null;

  const isBuyer = currentUser.id === contract.buyerId;
  const isSeller = currentUser.id === contract.sellerId;
  const otherPartyName = isBuyer ? contract.sellerName : contract.buyerName;
  const otherPartyPhone = isBuyer ? contract.sellerPhone : contract.buyerPhone;

  const progressPercent = Math.round((contract.completedCycles / contract.totalCycles) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {contract.code}
              </h3>
              <span className={`badge ${contract.status === 'active' ? 'badge-success' : 'badge-info'}`}>
                {contract.status === 'active' ? '● Kontrak Berjalan Aktif' : 'Kontrak Selesai'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Akad Pasokan Rutin Telur ({contract.buyerBusiness} ↔ {contract.sellerFarmName})
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>Progres Pemenuhan Kontrak ({contract.completedCycles} dari {contract.totalCycles} Batch):</span>
            <span style={{ color: 'var(--primary-700)' }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-600), var(--primary-500))', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Contract Key Terms */}
        <div className="grid-2" style={{ marginBottom: '16px' }}>
          <div style={{ background: 'white', border: '1px solid var(--slate-200)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Volume & Jadwal Pasokan:</div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-900)', marginTop: '2px' }}>
              {contract.volumePerCycle} {contract.unitType} / {contract.frequency}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>
              Grade: {contract.eggGrade}
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--slate-200)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Harga Terkunci & Durasi:</div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-800)', marginTop: '2px' }}>
              Rp {contract.pricePerUnit.toLocaleString('id-ID')} /{contract.unitType.includes('Rak') ? 'Rak' : 'Kg'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>
              Durasi: {contract.durationMonths} Bulan ({contract.totalCycles} Kali Kirim)
            </div>
          </div>
        </div>

        {/* Delivery Schedule & Cycles (REQ-15 & REQ-16) */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} /> Jadwal & Status Tiap Siklus Pengiriman
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
            {contract.cycles.map((cyc) => {
              const isPaid = cyc.status === 'paid';
              const isDispatched = cyc.status === 'dispatched';
              const isScheduled = cyc.status === 'scheduled';
              const cycleValue = contract.volumePerCycle * contract.pricePerUnit;

              return (
                <div 
                  key={cyc.cycleNumber}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    background: isPaid ? 'var(--primary-50)' : isDispatched ? 'var(--info-bg)' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', width: '28px', height: '28px', borderRadius: '50%', background: isPaid ? 'var(--primary-600)' : 'var(--slate-200)', color: isPaid ? 'white' : 'var(--slate-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      #{cyc.cycleNumber}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-800)' }}>
                        Jadwal: {cyc.scheduledDate}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                        {cyc.volume} {contract.unitType} • Rp {cycleValue.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isPaid && (
                      <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                        <CheckCircle2 size={12} /> Selesai & Lunas
                      </span>
                    )}

                    {isDispatched && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                          <Truck size={12} /> Sedang Dikirim
                        </span>
                        {isBuyer && (
                          <button 
                            className="btn btn-sm btn-primary"
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                            onClick={() => payContractCycle(contract.id, cyc.cycleNumber)}
                          >
                            Konfirmasi & Bayar
                          </button>
                        )}
                      </div>
                    )}

                    {isScheduled && (
                      <div>
                        {isSeller ? (
                          <button 
                            className="btn btn-sm btn-harvest"
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                            onClick={() => fulfillContractCycle(contract.id, cyc.cycleNumber)}
                          >
                            Kirim Batch #{cyc.cycleNumber}
                          </button>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                            <Clock size={12} /> Terjadwal
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contract Renewal (REQ-17) & WhatsApp */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--slate-200)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
            Garansi Kualitas & Retur Rusak 24 Jam • Komisi Platform 5%
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-wa btn-sm"
              onClick={() => {
                setWaModalData({
                  isOpen: true,
                  recipientName: otherPartyName,
                  recipientPhone: otherPartyPhone,
                  defaultMessage: `Halo ${otherPartyName}, mengenai Kontrak Pasokan B2B ${contract.code} (${contract.volumePerCycle} ${contract.unitType}/${contract.frequency}) di Saudagro, koordinasi pengiriman batch selanjutnya berjalan lancar. Terima kasih!`,
                  actionTitle: `Koordinasi Kontrak dengan ${otherPartyName}`
                });
              }}
              style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.78rem' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.079-1.85-.426-1.505-.625-2.476-2.15-2.551-2.25-.074-.1-1.17-1.558-1.17-2.971 0-1.413.738-2.108 1.002-2.397.264-.289.576-.361.768-.361.192 0 .384.002.552.01.178.009.418-.068.653.498.24.577.817 1.996.889 2.14.072.145.12.313.024.505-.096.192-.144.312-.288.481-.144.168-.303.376-.433.504-.144.145-.295.302-.127.591.168.289.747 1.232 1.604 1.995 1.102.981 2.032 1.285 2.32 1.43.289.144.457.12.625-.073.168-.192.72-.842.912-1.13.192-.289.384-.24.649-.144.264.096 1.681.793 1.969.937.288.145.48.217.552.337.072.12.072.72-.072 1.125zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.399A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.15-.44-4.46-1.22l-.32-.19-2.96.83.82-2.88-.21-.34A8.16 8.16 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
              </svg>
              Chat WhatsApp ({otherPartyName})
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppActionModal 
        isOpen={waModalData.isOpen}
        onClose={() => setWaModalData(prev => ({ ...prev, isOpen: false }))}
        recipientName={waModalData.recipientName}
        recipientPhone={waModalData.recipientPhone}
        defaultMessage={waModalData.defaultMessage}
        actionTitle={waModalData.actionTitle}
      />
    </div>
  );
};
