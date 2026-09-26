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
  Plus 
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Pusat Kontrak Pasokan Rutin B2B
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            {currentUser.role === 'UMKM_BUYER'
              ? 'Kelola jadwal langganan pasokan telur mingguan Anda dengan harga terkunci dan jaminan retur BAST.'
              : currentUser.role === 'EGG_FARMER'
              ? 'Manajemen pengiriman pasokan telur rutin ke UMKM mitra dan pemantauan pencairan dana escrow per batch.'
              : 'Manajemen akad pasokan komoditas Pasigala antara produsen dan mitra bisnis dengan harga terkunci.'}
          </p>
        </div>

        {currentUser.role === 'UMKM_BUYER' && (
          <button 
            className="btn btn-primary" 
            onClick={() => setActiveTab('market_eggs')}
            style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Buat Kontrak Pasokan Baru
          </button>
        )}

        {currentUser.role === 'EGG_FARMER' && (
          <button 
            className="btn btn-secondary" 
            onClick={() => setActiveTab('market_eggs')}
            style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Egg size={16} /> Lihat Etalase Telur Saya
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button 
          className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('all')}
          style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '6px' }}
        >
          Semua Kontrak ({contracts.length})
        </button>
        <button 
          className={`btn btn-sm ${filterStatus === 'active' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('active')}
          style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '6px' }}
        >
          Kontrak Berjalan ({contracts.filter(c => c.status === 'active').length})
        </button>
        <button 
          className={`btn btn-sm ${filterStatus === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('completed')}
          style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '6px' }}
        >
          Kontrak Selesai ({contracts.filter(c => c.status === 'completed').length})
        </button>
      </div>

      {/* Contracts Table Layout */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Kode & Durasi</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Mitra Transaksi</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Volume & Jadwal</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Harga Terkunci</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Realisasi Batch</th>
                <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map(contract => {
                const progress = Math.round((contract.completedCycles / contract.totalCycles) * 100);

                return (
                  <tr 
                    key={contract.id}
                    onClick={() => onSelectContract(contract)}
                    style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--slate-50)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                        {contract.code}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        Durasi: {contract.durationMonths} Bulan ({contract.startDate})
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                        {contract.buyerBusiness}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        Suplier: {contract.sellerFarmName} ({contract.sellerName})
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                        {contract.volumePerCycle} {contract.unitType}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        {contract.frequency} • {contract.eggGrade}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.88rem' }}>
                        Rp {contract.pricePerUnit.toLocaleString('id-ID')} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--slate-500)' }}>/{contract.unitType}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        Next: <strong>{contract.nextDeliveryDate}</strong>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-700)', marginBottom: '4px' }}>
                        {contract.completedCycles} dari {contract.totalCycles} Batch ({progress}%)
                      </div>
                      <div style={{ width: '110px', height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-600)' }} />
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '5px 12px', fontSize: '0.74rem', borderRadius: '6px', fontWeight: 600 }}
                      >
                        Faktur BAST
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
