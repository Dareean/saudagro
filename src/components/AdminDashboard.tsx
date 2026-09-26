import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  DollarSign, 
  Wheat, 
  Egg, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  MapPin, 
  FileText,
  Activity,
  Layers,
  Scale
} from 'lucide-react';
import { TransactionOrder } from '../types';

interface AdminDashboardProps {
  onSelectOrder: (order: TransactionOrder) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectOrder }) => {
  const { 
    orders, 
    contracts, 
    allUsers, 
    resolveDispute 
  } = useApp();

  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState<TransactionOrder | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Platform Metrics
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  // Corn traded
  const totalCornKg = completedOrders
    .filter(o => o.type === 'CORN')
    .reduce((acc, o) => acc + o.quantity, 0);

  // Total Corn 3% Commission
  const totalCornCommission = completedOrders
    .filter(o => o.type === 'CORN')
    .reduce((acc, o) => acc + o.commissionFee, 0);

  // Total Egg 5% Commission (orders + contracts completed cycles)
  const totalEggOrderCommission = completedOrders
    .filter(o => o.type === 'EGG_ONEOFF')
    .reduce((acc, o) => acc + o.commissionFee, 0);

  const totalContractCommission = contracts.reduce((acc, c) => {
    return acc + (c.completedCycles * c.commissionFeePerCycle);
  }, 0);

  const totalPlatformRevenue = totalCornCommission + totalEggOrderCommission + totalContractCommission;

  // Gross Merchandise Value
  const gmv = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0) + 
    contracts.reduce((acc, c) => acc + (c.completedCycles * c.volumePerCycle * c.pricePerUnit), 0);

  // Disputes
  const disputedOrders = orders.filter(o => o.status === 'disputed');

  const handleResolveDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisputeOrder) return;
    resolveDispute(selectedDisputeOrder.id, resolutionText || 'Mediasi selesai: Penjual memberikan penyesuaian timbangan/retur dan dana telah diselesaikan.');
    setSelectedDisputeOrder(null);
    setResolutionText('');
  };

  return (
    <div className="main-wrapper" style={{ marginTop: '24px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-title">
          <ShieldCheck style={{ color: '#2563eb' }} />
          Saudagro Platform Operations & Dispute Hub (Palu Center)
        </h1>
        <p className="section-desc">
          Monitoring transaksi riil rantai pasok Sulawesi Tengah, rekonsiliasi komisi 3% & 5%, dan penyelesaian sengketa mutu.
        </p>
      </div>

      {/* Financial & Trade Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card card-p" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Pendapatan Komisi Saudagro
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
            Rp {totalPlatformRevenue.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--primary-700)', marginTop: '2px' }}>
            (3% Jagung: Rp {totalCornCommission.toLocaleString('id-ID')} | 5% Telur: Rp {(totalEggOrderCommission + totalContractCommission).toLocaleString('id-ID')})
          </div>
        </div>

        <div className="card card-p" style={{ borderLeft: '4px solid var(--harvest-500)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total GMV Perdagangan
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
            Rp {gmv.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Volume sirkulasi agribisnis Sulteng
          </div>
        </div>

        <div className="card card-p" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>
            Pakan Jagung Terdistribusi Langsung
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
            {(totalCornKg / 1000).toFixed(1)} <span style={{ fontSize: '0.85rem' }}>Ton ({totalCornKg.toLocaleString()} Kg)</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Petani Sigi/Donggala $\rightarrow$ Peternak Palu
          </div>
        </div>

        <div className="card card-p" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>
            Pengguna Terverifikasi
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
            {Object.keys(allUsers).length} <span style={{ fontSize: '0.85rem' }}>Entitas</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Petani, Peternak & UMKM Terdaftar
          </div>
        </div>
      </div>

      {/* Dispute Desk (REQ-22) */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Scale style={{ color: 'var(--danger)' }} />
            Pusat Mediasi Sengketa & Keluhan Mutu (REQ-22)
          </h3>
          <span className={`badge ${disputedOrders.length > 0 ? 'badge-danger' : 'badge-success'}`}>
            {disputedOrders.length > 0 ? `${disputedOrders.length} Sengketa Terbuka` : '0 Sengketa Aktif (Kondisi Bersih)'}
          </span>
        </div>

        {disputedOrders.length === 0 ? (
          <div className="card card-p" style={{ textAlign: 'center', padding: '24px', background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
            <CheckCircle2 size={32} style={{ color: 'var(--primary-600)', margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 800, color: 'var(--primary-900)' }}>Semua Transaksi Berjalan Tertib & Aman</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>Tidak ada komplain kadar air atau telur retak yang belum terselesaikan.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {disputedOrders.map(order => (
              <div 
                key={order.id} 
                className="card card-p"
                style={{ borderLeft: '4px solid var(--danger)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)' }}>
                    {order.code} — {order.listingTitle}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                    Pembeli: {order.buyerName} | Penjual: {order.sellerName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 700, marginTop: '4px' }}>
                    Alasan Sengketa: "{order.dispute?.reason}"
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectOrder(order)}
                  >
                    Detail Transaksi
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedDisputeOrder(order)}
                  >
                    Mediasi & Selesaikan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Users Database */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users style={{ color: 'var(--primary-700)' }} />
          Direktori Anggota Agribisnis Terverifikasi (Palu, Sigi, Donggala)
        </h3>

        <div className="grid-3">
          {Object.values(allUsers).map(user => (
            <div key={user.id} className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {user.name}
                    {user.verified && <ShieldCheck size={14} style={{ color: '#2563eb' }} />}
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    {user.role}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '8px' }}>
                <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {user.village}, {user.district}
              </div>

              {user.farmCapacity && (
                <div style={{ background: 'var(--slate-50)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--slate-700)', fontWeight: 600 }}>
                  Kapasitas: {user.farmCapacity}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dispute Resolution Modal */}
      {selectedDisputeOrder && (
        <div className="modal-overlay" onClick={() => setSelectedDisputeOrder(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Mediasi & Putusan Sengketa
              </h3>
              <button className="modal-close-btn" onClick={() => setSelectedDisputeOrder(null)}>✕</button>
            </div>

            <form onSubmit={handleResolveDispute}>
              <div style={{ background: 'var(--danger-bg)', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem' }}>
                <strong>Keluhan:</strong> {selectedDisputeOrder.dispute?.reason}
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Putusan Ops Saudagro:</label>
                <textarea 
                  className="form-textarea" 
                  rows={3} 
                  value={resolutionText}
                  onChange={e => setResolutionText(e.target.value)}
                  placeholder="Contoh: Petani telah menyetujui penggantian susut bobot 50kg dan dana bersih telah diselesaikan."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedDisputeOrder(null)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Tutup Sengketa & Selesaikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
