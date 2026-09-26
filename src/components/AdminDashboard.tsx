import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  DollarSign, 
  Wheat, 
  Egg, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  FileText,
  Scale,
  ArrowRight,
  Activity,
  CheckCircle2,
  RefreshCw,
  Landmark,
  Building2,
  MapPin,
  Sparkles
} from 'lucide-react';
import { TransactionOrder } from '../types';
import { AnimatedTrendChart } from './AnimatedTrendChart';

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

  const platformGmvTrend = [
    { label: 'Mei', dateStr: 'Mei 2026', value: 12500000, secondaryValue: 485000 },
    { label: 'Jun', dateStr: 'Juni 2026', value: 18400000, secondaryValue: 712000 },
    { label: 'Jul', dateStr: 'Juli 2026', value: 29800000, secondaryValue: 1150000 },
    { label: 'Agu', dateStr: 'Agustus 2026', value: 38200000, secondaryValue: 1480000 },
    { label: 'Sep W1', dateStr: 'Minggu 1-2 Sep', value: 44600000, secondaryValue: 1720000 },
    { label: 'Sep Terkini', dateStr: 'Kumulatif Pasigala', value: gmv > 0 ? gmv : 53200000, secondaryValue: totalPlatformRevenue > 0 ? totalPlatformRevenue : 2056000 },
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, color: '#6D28D9', marginBottom: '8px' }}>
            <Landmark size={13} /> CONTROL TOWER & KLIRING ESCROW • KAWASAN PASIGALA SULTENG
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Pusat Pengawasan Rantai Pasok & Kliring Finansial
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            Monitoring perputaran komoditas Pasigala, rekonsiliasi komisi (3%-5%), dan mediasi sengketa mutu BAST.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', fontSize: '0.78rem', color: '#047857', fontWeight: 700 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
          Escrow & Arbitrase Aktif
        </div>
      </div>

      {/* PASIGALA COMMODITY FLOW RADAR (CONTROL TOWER HERO) */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '22px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', borderLeft: '5px solid #6D28D9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#6D28D9" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Radar Arus Komoditas Terintegrasi Pasigala
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
              Sinkronisasi real-time rantai pasok hulu ke hilir: Sentra Jagung Sigi ➔ Peternakan Palu Barat ➔ UMKM Kuliner Kota Palu
            </p>
          </div>

          <span style={{ fontSize: '0.72rem', background: '#F5F3FF', color: '#6D28D9', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
            Indeks Efisiensi Distribusi: 98.6% Stabil
          </span>
        </div>

        {/* 3-Node Regional Supply Map */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', position: 'relative' }}>
          
          {/* Node 1: Sigi */}
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                HULU: KABUPATEN SIGI
              </span>
              <span style={{ fontSize: '0.68rem', background: '#FCD34D', color: '#78350F', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                Sentra Jagung
              </span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              {totalCornKg > 0 ? (totalCornKg / 1000).toFixed(1) : '48.5'} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>Ton Diserap</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-600)', marginTop: '4px' }}>
              Gumbasa & Dolo • Rata-rata KA 13.5%
            </div>
          </div>

          {/* Node 2: Palu Barat */}
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ANTARA: PALU BARAT
              </span>
              <span style={{ fontSize: '0.68rem', background: '#6EE7B7', color: '#064E3B', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                Peternakan Layer
              </span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              12.400 <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>Rak Telur / Bln</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-600)', marginTop: '4px' }}>
              Balaroa • 180+ Rak/Hari Pasokan Segar
            </div>
          </div>

          {/* Node 3: Kota Palu */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                HILIR: KOTA PALU
              </span>
              <span style={{ fontSize: '0.68rem', background: '#93C5FD', color: '#1E3A8A', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                Sentra UMKM
              </span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              {contracts.length} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>Kontrak B2B Rutin</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-600)', marginTop: '4px' }}>
              Dilla Bakery, Toko Berkah & Industri Kue
            </div>
          </div>

        </div>
      </div>

      {/* 4-METRIC PLATFORM GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pendapatan Komisi Platform
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6D28D9', marginTop: '6px', letterSpacing: '-0.03em' }}>
            Rp {totalPlatformRevenue.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            3% Jagung Sigi & 5% Pasokan Telur
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Transaksi Pasigala (GMV)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            Rp {gmv.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Perputaran riil hulu-hilir komoditas
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Dana Escrow Kliring Aman
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '6px', letterSpacing: '-0.03em' }}>
            100% <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>Terjamin BAST</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Rilis otomatis pasca verifikasi QC
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Mitra Pasigala Terverifikasi
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {Object.keys(allUsers).length} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>Pelaku Usaha</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Petani, Peternak Layer, dan UMKM
          </div>
        </div>
      </div>

      {/* Disputes Alert Panel */}
      {disputedOrders.length > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C', fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px' }}>
            <AlertTriangle size={16} />
            Ada {disputedOrders.length} Pesanan Membutuhkan Mediasi Arbitrase:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {disputedOrders.map(order => (
              <div 
                key={order.id} 
                style={{ background: '#FFFFFF', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--slate-900)' }}>
                    {order.code} • Pembeli: {order.buyerName} vs Penjual: {order.sellerName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#B91C1C', marginTop: '2px' }}>
                    Alasan: "{order.dispute?.reason || 'Klaim penyesuaian mutu atau timbangan'}"
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDisputeOrder(order)}
                  style={{ background: '#B91C1C', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Buka Mediasi
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: Animated Chart & Transaction Logs Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Animated GMV Chart */}
          <AnimatedTrendChart 
            title="Tren Pertumbuhan GMV & Akumulasi Komisi Saudagro"
            subtitle="Nilai transaksi komoditas Pasigala beredar & bagi hasil komisi platform (3% - 5%)"
            unit="Rp"
            secondaryUnit="Rp"
            primaryLegend="GMV Transaksi"
            secondaryLegend="Komisi Platform"
            primaryColor="#047857"
            secondaryColor="#7C3AED"
            data={platformGmvTrend}
            formatValue={(v) => `Rp ${(v / 1000000).toFixed(1)} Juta`}
            formatSecondaryValue={(v) => `Rp ${(v / 1000).toFixed(0)} Ribu`}
            height={190}
          />

          {/* Transaction Ledger Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  Semua Log Transaksi Platform Pasigala
                </h2>
                <p style={{ fontSize: '0.74rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
                  Total: {orders.length} Transaksi Terdata
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>No. Pesanan</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Pihak Terlibat</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Komoditas & Vol</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Nilai Transaksi</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map(order => (
                    <tr 
                      key={order.id} 
                      onClick={() => onSelectOrder(order)}
                      style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--slate-50)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {order.code}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{order.sellerName} → {order.buyerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{order.deliveryMethod}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div>{order.type === 'CORN' ? 'Jagung Pipil' : 'Telur Segar'}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{order.quantity.toLocaleString()} {order.unit}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--slate-900)' }}>
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{ 
                          background: order.status === 'completed' ? '#ECFDF5' : order.status === 'disputed' ? '#FEF2F2' : '#EFF6FF', 
                          color: order.status === 'completed' ? '#047857' : order.status === 'disputed' ? '#B91C1C' : '#1D4ED8', 
                          padding: '3px 8px', 
                          borderRadius: '5px', 
                          fontSize: '0.72rem', 
                          fontWeight: 700 
                        }}>
                          {order.status === 'completed' ? 'Selesai' : order.status === 'disputed' ? 'Sengketa' : 'Diproses'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Dispute Form & Escrow Revenue Transparency */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {selectedDisputeOrder && (
            <div style={{ background: '#FFFFFF', border: '1px solid #FECACA', borderRadius: '12px', padding: '18px 20px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#B91C1C', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scale size={16} /> Panel Putusan Mediasi
              </div>
              <form onSubmit={handleResolveDispute}>
                <div style={{ fontSize: '0.78rem', marginBottom: '8px', color: 'var(--slate-700)' }}>
                  Menyelesaikan sengketa transaksi <strong>{selectedDisputeOrder.code}</strong>.
                </div>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Catatan hasil musyawarah mediasi..."
                  value={resolutionText}
                  onChange={e => setResolutionText(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.78rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '10px', boxSizing: 'border-box' }}
                  required
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => setSelectedDisputeOrder(null)}
                    style={{ flex: 1, padding: '6px', background: 'var(--slate-100)', color: 'var(--slate-700)', border: 'none', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    style={{ flex: 2, padding: '6px', background: 'var(--primary-700)', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Putuskan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Revenue Model Breakdown */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '12px' }}>
              Skema Bagi Hasil Transparan Escrow
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
              <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '4px' }}>
                  <span>Komoditas Jagung Pipil (Sigi)</span>
                  <span style={{ color: '#047857' }}>3% Fee</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                  97% Payout bersih ke petani • 3% operasional timbangan & uji kadar air (KA ≤14%).
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '4px' }}>
                  <span>Pasokan Telur Kontrak B2B</span>
                  <span style={{ color: '#6D28D9' }}>5% Fee</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                  95% Payout bersih ke peternak • 5% asuransi klaim retak 1x24 jam & dana talangan BAST.
                </div>
              </div>
            </div>
          </div>

          {/* Verification & SLA Summary */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
              SOP Mediasi & Arbitrase Pasigala
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.55, margin: 0 }}>
              Setiap dispute mutu diselesaikan maksimal 1x24 jam berdasarkan bukti foto fisik BAST digital. Jika terjadi telur retak di atas batas toleransi (1%), dana ganti rugi dipotong otomatis dari escrow penjual atau diganti via pool asuransi platform.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

