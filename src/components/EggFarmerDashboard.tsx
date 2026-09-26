import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Egg, 
  Wheat, 
  FileCheck2, 
  Truck, 
  ArrowRight, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Star,
  Package,
  Layers,
  Store,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Phone,
  Calendar
} from 'lucide-react';
import { TransactionOrder, B2BContract } from '../types';

interface EggFarmerDashboardProps {
  onSelectOrder: (order: TransactionOrder) => void;
  onSelectContract: (contract: B2BContract) => void;
}

export const EggFarmerDashboard: React.FC<EggFarmerDashboardProps> = ({ 
  onSelectOrder, 
  onSelectContract 
}) => {
  const { 
    currentUser, 
    orders, 
    contracts, 
    setActiveTab, 
    fulfillContractCycle 
  } = useApp();

  // Buy side: Corn Feed Purchases
  const myFeedOrders = orders.filter(o => o.buyerId === currentUser.id && o.type === 'CORN');
  const totalFeedProcuredKg = myFeedOrders
    .filter(o => o.status === 'completed')
    .reduce((acc, o) => acc + o.quantity, 0);

  // Sell side: Egg Contracts & One-off Orders
  const myEggOrders = orders.filter(o => o.sellerId === currentUser.id);
  const myContracts = contracts.filter(c => c.sellerId === currentUser.id);
  const activeContractsCount = myContracts.filter(c => c.status === 'active').length;

  const totalEggRevenue = myEggOrders
    .filter(o => o.status === 'completed')
    .reduce((acc, o) => acc + o.sellerNetRevenue, 0) +
    myContracts.reduce((acc, c) => acc + (c.completedCycles * c.volumePerCycle * c.pricePerUnit * 0.95), 0);

  return (
    <div className="pro-dashboard-wrapper">
      {/* Header Bar */}
      <div className="pro-dashboard-header">
        <div>
          <div className="pro-breadcrumb">
            <span>Beranda</span>
            <span>/</span>
            <span className="active">Dashboard Peternak Ayam</span>
          </div>
          <h1 className="pro-dashboard-title">
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: '#ECFDF5', 
              color: '#047857', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Egg size={20} />
            </div>
            Dashboard Rantai Pasok Pakan & Penjualan Telur
          </h1>
          <p className="pro-dashboard-subtitle">
            Pusat integrasi ganda: Pengadaan pakan jagung langsung dari petani Sigi & Penjualan pasokan telur kontrak B2B ke UMKM Palu.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setActiveTab('market_corn')}
            style={{ padding: '9px 16px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '10px' }}
          >
            <Wheat size={15} style={{ color: '#D97706' }} /> Pesan Pakan Jagung
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveTab('market_eggs')}
            style={{ padding: '9px 18px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '10px' }}
          >
            <PlusCircle size={16} /> Kelola Pasokan Telur
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="pro-kpi-grid">
        {/* KPI 1: Pakan Terbeli */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Pakan Jagung Terbeli</span>
            <div className="pro-kpi-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <Wheat size={18} />
            </div>
          </div>
          <div className="pro-kpi-value">
            {totalFeedProcuredKg > 0 ? totalFeedProcuredKg.toLocaleString() : '5.500'} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>Kg</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <ShieldCheck size={12} /> KA ≤ 14%
            </span>
            <span>Langsung dari petani Sigi</span>
          </div>
        </div>

        {/* KPI 2: Kontrak B2B Aktif */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Kontrak Pasokan B2B</span>
            <div className="pro-kpi-icon" style={{ background: '#ECFDF5', color: '#047857' }}>
              <FileCheck2 size={18} />
            </div>
          </div>
          <div className="pro-kpi-value" style={{ color: '#047857' }}>
            {activeContractsCount > 0 ? activeContractsCount : 1} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>Mitra UMKM</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#ECFDF5', color: '#047857' }}>
              <Store size={12} /> Dilla Bakery Palu
            </span>
            <span>Pasokan rutin mingguan</span>
          </div>
        </div>

        {/* KPI 3: Kapasitas Produksi */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #2563EB' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Produksi Harian Layer</span>
            <div className="pro-kpi-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <Egg size={18} />
            </div>
          </div>
          <div className="pro-kpi-value">
            150-180 <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>Rak/Hari</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              Grade A
            </span>
            <span>6.000 Ekor Layer Hen Balaroa</span>
          </div>
        </div>

        {/* KPI 4: Omzet Telur Terlindungi */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Omzet Terlindungi Escrow</span>
            <div className="pro-kpi-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="pro-kpi-value" style={{ color: 'var(--slate-900)' }}>
            Rp {totalEggRevenue > 0 ? totalEggRevenue.toLocaleString('id-ID') : '42.800.000'}
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#FFFBEB', color: '#B45309' }}>
              <Star size={12} fill="#B45309" /> 4.95 Rating
            </span>
            <span>Pencairan dana tepat waktu</span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="pro-layout-2col">
        {/* Left Column: Contracts & Feed Orders */}
        <div>
          {/* Panel 1: Active B2B Contracts */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h3 className="pro-card-title">
                <FileCheck2 size={18} style={{ color: '#047857' }} />
                Kontrak Pasokan Rutin ke UMKM Bakery
              </h3>
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => setActiveTab('contracts')}
                style={{ fontSize: '0.78rem', borderRadius: '8px' }}
              >
                Semua Kontrak ({myContracts.length})
              </button>
            </div>

            <div className="pro-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {myContracts.map(contract => (
                <div key={contract.id} className="pro-list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--slate-900)' }}>
                          {contract.buyerName}
                        </span>
                        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                          Kontrak Aktif
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        Kode: <strong>{contract.code}</strong> • Jadwal: <strong>{contract.frequency} ({contract.volumePerCycle} {contract.unitType}/Batch)</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#047857' }}>
                        Rp {contract.pricePerUnit.toLocaleString('id-ID')} <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)' }}>/Rak</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                        Total Nilai: Rp {contract.estimatedTotalValue.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {/* Cycle Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '6px', color: 'var(--slate-600)' }}>
                      <span>Realisasi Pengiriman: <strong>{contract.completedCycles} dari {contract.totalCycles} Batch</strong></span>
                      <span>Next Delivery: <strong>{contract.nextDeliveryDate}</strong></span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${(contract.completedCycles / contract.totalCycles) * 100}%`, 
                          height: '100%', 
                          background: 'var(--primary-600)', 
                          borderRadius: '4px' 
                        }} 
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--slate-100)' }}>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => onSelectContract(contract)}
                      style={{ fontSize: '0.78rem', borderRadius: '8px' }}
                    >
                      Lihat Detail BAST
                    </button>
                    {contract.status === 'active' && contract.completedCycles < contract.totalCycles && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => fulfillContractCycle(contract.id, contract.completedCycles + 1)}
                        style={{ fontSize: '0.78rem', borderRadius: '8px', gap: '6px' }}
                      >
                        <Truck size={14} /> Kirim Batch #{contract.completedCycles + 1}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2: Corn Feed Orders (Purchases) */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h3 className="pro-card-title">
                <Wheat size={18} style={{ color: '#D97706' }} />
                Pengadaan Pakan Jagung Pipil dari Petani Sigi
              </h3>
              <button 
                className="btn btn-sm btn-harvest"
                onClick={() => setActiveTab('market_corn')}
                style={{ fontSize: '0.78rem', borderRadius: '8px' }}
              >
                + Beli Jagung Pipil Baru
              </button>
            </div>

            <div className="pro-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myFeedOrders.map(order => (
                <div 
                  key={order.id} 
                  className="pro-list-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectOrder(order)}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                      {order.sellerName} (Petani Sigi)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                      {order.code} • {order.quantity.toLocaleString()} Kg • {order.deliveryMethod}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#D97706' }}>
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </div>
                      <span className={`badge ${
                        order.status === 'completed' ? 'badge-success' :
                        order.status === 'in_delivery' ? 'badge-info' : 'badge-warning'
                      }`} style={{ fontSize: '0.68rem' }}>
                        {order.status === 'completed' ? '✓ Diterima' :
                         order.status === 'in_delivery' ? '🚚 Sedang Kirim' : '⏳ Diproses'}
                      </span>
                    </div>
                    <ArrowRight size={15} style={{ color: 'var(--slate-400)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Market Spot & QC Guarantees */}
        <div>
          {/* Widget 1: Bulletin Harga Pasar Telur & Jagung Sulteng */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h4 className="pro-card-title" style={{ fontSize: '0.92rem' }}>
                <TrendingUp size={16} style={{ color: '#047857' }} />
                Bulletin Pasar Telur & Pakan Sulteng
              </h4>
            </div>
            <div className="pro-card-body" style={{ padding: '14px 20px' }}>
              <div className="pro-table-row">
                <span style={{ color: 'var(--slate-600)' }}>🥚 Telur Rak Grade A (Kota Palu)</span>
                <strong style={{ color: '#047857' }}>Rp 51.000 - 52.000</strong>
              </div>
              <div className="pro-table-row">
                <span style={{ color: 'var(--slate-600)' }}>🌽 Jagung Pipil Sigi (KA ≤14%)</span>
                <strong style={{ color: '#B45309' }}>Rp 5.200 /Kg</strong>
              </div>
              <div className="pro-table-row">
                <span style={{ color: 'var(--slate-600)' }}>📈 Margin Efisiensi Pakan Mandiri</span>
                <strong style={{ color: '#2563EB' }}>+14.2% Hemat</strong>
              </div>
            </div>
          </div>

          {/* Widget 2: Standar Mutu Telur Segar Grade A */}
          <div className="pro-card" style={{ background: '#F0FDF4', borderColor: '#A7F3D0' }}>
            <div className="pro-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#047857', fontSize: '0.86rem', marginBottom: '8px' }}>
                <ShieldCheck size={16} /> Garansi Mutu Telur Saudagro
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.74rem', color: '#065F46', lineHeight: 1.55 }}>
                <li>Sortir bersih dari kotoran dan telur retak sebelum dimuat.</li>
                <li>Garansi ganti rugi 1x24 jam jika ada telur retak di perjalanan.</li>
                <li>Faktur B2B resmi untuk keperluan pembukuan UMKM.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
