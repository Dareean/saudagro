import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { B2BContract } from '../types';
import { 
  FileCheck2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowRight, 
  Egg, 
  Sparkles, 
  PlusCircle 
} from 'lucide-react';

interface B2BContractsViewProps {
  onSelectContract: (contract: B2BContract) => void;
}

export const B2BContractsView: React.FC<B2BContractsViewProps> = ({ onSelectContract }) => {
  const { contracts, currentUser, setActiveTab } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const filteredContracts = contracts.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="main-wrapper" style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h1 className="section-title">
            <FileCheck2 style={{ color: 'var(--primary-700)' }} />
            Pusat Kontrak Pasokan Rutin B2B (REQ-14 & 15)
          </h1>
          <p className="section-desc">
            Manajemen akad pasokan telur antara Peternak dan Bakery/Catering dengan kepastian volume dan harga terkunci.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setActiveTab('market_eggs')}>
          <PlusCircle size={18} /> Buat Kontrak Pasokan Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button 
          className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('all')}
        >
          Semua Kontrak ({contracts.length})
        </button>
        <button 
          className={`btn btn-sm ${filterStatus === 'active' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('active')}
        >
          ● Kontrak Berjalan ({contracts.filter(c => c.status === 'active').length})
        </button>
        <button 
          className={`btn btn-sm ${filterStatus === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('completed')}
        >
          ✓ Kontrak Selesai ({contracts.filter(c => c.status === 'completed').length})
        </button>
      </div>

      {/* Contracts Grid */}
      <div className="grid-2">
        {filteredContracts.map(contract => {
          const isParticipant = currentUser.id === contract.buyerId || currentUser.id === contract.sellerId;
          const progress = Math.round((contract.completedCycles / contract.totalCycles) * 100);

          return (
            <div 
              key={contract.id} 
              className="card card-p"
              style={{ cursor: 'pointer', borderTop: '4px solid var(--primary-600)' }}
              onClick={() => onSelectContract(contract)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--slate-900)' }}>
                    {contract.buyerBusiness} ↔ {contract.sellerFarmName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    {contract.code} • Mulai: {contract.startDate}
                  </div>
                </div>
                <span className={`badge ${contract.status === 'active' ? 'badge-success' : 'badge-info'}`}>
                  {contract.status === 'active' ? 'Aktif Berjalan' : 'Selesai'}
                </span>
              </div>

              <div style={{ background: 'var(--slate-50)', padding: '12px', borderRadius: 'var(--radius-md)', margin: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--slate-600)' }}>Komoditas:</span>
                  <strong>{contract.eggGrade}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--slate-600)' }}>Volume Rutin:</span>
                  <strong>{contract.volumePerCycle} {contract.unitType} / {contract.frequency}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--slate-600)' }}>Harga Terkunci:</span>
                  <strong style={{ color: 'var(--primary-800)' }}>Rp {contract.pricePerUnit.toLocaleString('id-ID')} / {contract.unitType.includes('Rak') ? 'Rak' : 'Kg'}</strong>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Progres Pemenuhan:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-800)' }}>{contract.completedCycles} / {contract.totalCycles} Siklus ({progress}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-600)' }} />
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                  Jadwal Kirim Berikutnya: <strong>{contract.nextDeliveryDate}</strong>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Buka Kalender Pasokan <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
