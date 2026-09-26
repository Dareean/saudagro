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
  Scale,
  Building2,
  ArrowRight
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

  // Total Egg 5% Commission
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
    <div className="pro-dashboard-wrapper">
      {/* Dashboard Header Bar */}
      <div className="pro-dashboard-header">
        <div>
          <div className="pro-breadcrumb">
            <span>Beranda</span>
            <span>/</span>
            <span className="active">Pusat Mediasi & Operasional Platform</span>
          </div>
          <h1 className="pro-dashboard-title">
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: '#EFF6FF', 
              color: '#2563EB', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ShieldCheck size={20} />
            </div>
            Pusat Mediasi & Monitoring Rantai Pasok Sulteng
          </h1>
          <p className="pro-dashboard-subtitle">
            Monitoring transaksi riil rantai pasok agribisnis Palu-Sigi-Donggala, rekonsiliasi komisi transparan (3%-5%), dan mediasi sengketa mutu panen.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ 
            background: '#ECFDF5', 
            border: '1px solid #A7F3D0', 
            padding: '8px 14px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '0.82rem',
            color: '#047857',
            fontWeight: 700
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
            Sistem Mediasi Escrow Aktif 100%
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="pro-kpi-grid">
        {/* KPI 1: Total Pendapatan Komisi */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Pendapatan Komisi Saudagro</span>
            <div className="pro-kpi-icon" style={{ background: '#ECFDF5', color: '#047857' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="pro-kpi-value" style={{ color: '#047857' }}>
            Rp {totalPlatformRevenue.toLocaleString('id-ID')}
          </div>
          <div className="pro-kpi-subtext">
            <span>3% Jagung & 5% Pasokan Telur</span>
          </div>
        </div>

        {/* KPI 2: Gross Merchandise Value */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #2563EB' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Total Nilai Transaksi (GMV)</span>
            <div className="pro-kpi-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="pro-kpi-value">
            Rp {gmv.toLocaleString('id-ID')}
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              Pasigala Hub
            </span>
            <span>Volume terserap pasar lokal</span>
          </div>
        </div>

        {/* KPI 3: Jagung Termediasi */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Jagung Sigi Termediasi</span>
            <div className="pro-kpi-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <Wheat size={18} />
            </div>
          </div>
          <div className="pro-kpi-value">
            {totalCornKg.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>Kg</span>
          </div>
          <div className="pro-kpi-subtext">
            <span>{(totalCornKg / 1000).toFixed(1)} Ton terserap peternak</span>
          </div>
        </div>

        {/* KPI 4: Mitra Terdaftar */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #7C3AED' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Mitra Terverifikasi</span>
            <div className="pro-kpi-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="pro-kpi-value">
            {Object.keys(allUsers).length} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>Mitra</span>
          </div>
          <div className="pro-kpi-subtext">
            <span>Petani, Peternak & UMKM Bakery</span>
          </div>
        </div>
      </div>

      {/* Disputes Alert Panel */}
      {disputedOrders.length > 0 && (
        <div style={{ 
          background: '#FEF2F2', 
          border: '1.5px solid #FECACA', 
          borderRadius: '16px', 
          padding: '18px 20px', 
          marginBottom: '28px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C', fontWeight: 800, fontSize: '0.96rem', marginBottom: '10px' }}>
            <AlertTriangle size={18} />
            Ada {disputedOrders.length} Laporan Sengketa / Dispute Menunggu Mediasi:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {disputedOrders.map(order => (
              <div 
                key={order.id} 
                className="pro-list-item" 
                style={{ background: 'white', cursor: 'pointer' }}
                onClick={() => setSelectedDisputeOrder(order)}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                    {order.code} — Pembeli: {order.buyerName} vs Penjual: {order.sellerName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#B91C1C', marginTop: '2px' }}>
                    Alasan Sengketa: "{order.dispute?.reason || 'Klaim retur mutu / selisih timbangan'}"
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" style={{ borderRadius: '8px', fontSize: '0.78rem' }}>
                  Buka Panel Arbitrase <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="pro-layout-2col">
        {/* Left Column: All Transactions */}
        <div>
          <div className="pro-card">
            <div className="pro-card-header">
              <h3 className="pro-card-title">
                <FileText size={18} style={{ color: '#047857' }} />
                Seluruh Log Transaksi Platform
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)' }}>
                Total: {orders.length} Transaksi
              </span>
            </div>

            <div className="pro-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.slice(0, 6).map(order => (
                <div 
                  key={order.id} 
                  className="pro-list-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectOrder(order)}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                      {order.code} ({order.type === 'CORN' ? '🌽 Jagung Pipil' : '🥚 Telur Segar'})
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                      {order.sellerName} → {order.buyerName} • Volume: {order.quantity.toLocaleString()} {order.unit}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--slate-900)' }}>
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </div>
                      <span className={`badge ${
                        order.status === 'completed' ? 'badge-success' :
                        order.status === 'disputed' ? 'badge-danger' : 'badge-warning'
                      }`} style={{ fontSize: '0.68rem' }}>
                        {order.status === 'completed' ? '✓ Selesai' :
                         order.status === 'disputed' ? '⚠️ Sengketa' : '⏳ Diproses'}
                      </span>
                    </div>
                    <ArrowRight size={15} style={{ color: 'var(--slate-400)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dispute Form & Platform Health */}
        <div>
          {selectedDisputeOrder && (
            <div className="pro-card" style={{ borderColor: '#FCA5A5' }}>
              <div className="pro-card-header" style={{ background: '#FEF2F2' }}>
                <h4 className="pro-card-title" style={{ fontSize: '0.92rem', color: '#B91C1C' }}>
                  <Scale size={16} />
                  Panel Putusan Arbitrase Mediasi
                </h4>
              </div>
              <div className="pro-card-body">
                <form onSubmit={handleResolveDispute}>
                  <div style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'var(--slate-700)' }}>
                    Menyelesaikan sengketa pesanan <strong>{selectedDisputeOrder.code}</strong>. Masukkan rincian musyawarah atau penyesuaian timbangan/retur:
                  </div>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Contoh: Penjual menyetujui penyesuaian timbangan selisih 50kg dan dana escrow telah diteruskan secara proporsional..."
                    value={resolutionText}
                    onChange={e => setResolutionText(e.target.value)}
                    style={{ fontSize: '0.82rem', marginBottom: '12px', borderRadius: '8px' }}
                    required
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-secondary" 
                      onClick={() => setSelectedDisputeOrder(null)}
                      style={{ flex: 1, borderRadius: '8px' }}
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-sm btn-primary" 
                      style={{ flex: 2, borderRadius: '8px' }}
                    >
                      Putuskan & Selesaikan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Platform Trust & Policy Card */}
          <div className="pro-card" style={{ background: '#F0FDF4', borderColor: '#A7F3D0' }}>
            <div className="pro-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#047857', fontSize: '0.88rem', marginBottom: '8px' }}>
                <ShieldCheck size={16} /> Kebijakan Transparansi Komisi
              </div>
              <p style={{ fontSize: '0.76rem', color: '#065F46', lineHeight: 1.55, margin: 0 }}>
                Komisi 3% pada jagung pipil dan 5% pada produk telur otomatis disalurkan untuk pemeliharaan sistem escrow, asuransi BAST, dan biaya operasional fasilitator pendamping lapangan di Palu, Sigi, & Donggala.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
