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
            >
              <MessageSquare size={14} /> WhatsApp {otherPartyName.split(' ')[0]}
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
