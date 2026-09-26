import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Egg, 
  Wheat, 
  Truck, 
  Plus, 
  Clock, 
  Check, 
  FileText,
  Phone,
  Store,
  ExternalLink,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Package,
  Sparkles
} from 'lucide-react';
import { TransactionOrder, B2BContract } from '../types';
import { AnimatedTrendChart } from './AnimatedTrendChart';

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

  const [activeDispatchTab, setActiveDispatchTab] = useState<'outbound' | 'inbound'>('outbound');

  // Inbound side: Corn Feed Purchases
  const myFeedOrders = orders.filter(o => o.buyerId === currentUser.id && o.type === 'CORN');
  const totalFeedProcuredKg = myFeedOrders
    .filter(o => o.status === 'completed')
    .reduce((acc, o) => acc + o.quantity, 0);

  // Outbound side: Egg Contracts & One-off Orders
  const myEggOrders = orders.filter(o => o.sellerId === currentUser.id);
  const myContracts = contracts.filter(c => c.sellerId === currentUser.id);
  const activeContracts = myContracts.filter(c => c.status === 'active');
  const activeContractsCount = activeContracts.length;

  const totalEggRevenue = myEggOrders
    .filter(o => o.status === 'completed')
    .reduce((acc, o) => acc + o.sellerNetRevenue, 0) +
    myContracts.reduce((acc, c) => acc + (c.completedCycles * c.volumePerCycle * c.pricePerUnit * 0.95), 0);

  // Feed Silo calculation (6.000 layer hens = ~660kg corn/day, 3200kg stock = ~4.8 days)
  const currentFeedStockKg = 3200;
  const dailyFlockConsumptionKg = 660;
  const daysOfFeedRemaining = (currentFeedStockKg / dailyFlockConsumptionKg).toFixed(1);

  const eggProductionTrend = [
    { label: 'Sen', dateStr: 'Senin, 22 Sep', value: 165, secondaryValue: 660 },
    { label: 'Sel', dateStr: 'Selasa, 23 Sep', value: 172, secondaryValue: 660 },
    { label: 'Rab', dateStr: 'Rabu, 24 Sep', value: 168, secondaryValue: 660 },
    { label: 'Kam', dateStr: 'Kamis, 25 Sep', value: 175, secondaryValue: 660 },
    { label: 'Jum', dateStr: 'Jumat, 26 Sep', value: 180, secondaryValue: 660 },
    { label: 'Sab', dateStr: 'Sabtu, 27 Sep', value: 178, secondaryValue: 660 },
    { label: 'Hari Ini', dateStr: 'Hari Ini (Balaroa)', value: 182, secondaryValue: 660 },
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Top Header & Fast Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, color: '#047857', marginBottom: '8px' }}>
            <Egg size={13} /> HUB PETERNAKAN AYAM LAYER • BALAROA, PALU BARAT
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Dual-Hub Produksi Telur & Pasokan Pakan
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            {currentUser.name} • Populasi 6.000 Ekor Layer Aktif • Pasokan Rutin B2B UMKM Palu
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_corn')}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', fontWeight: 700, padding: '8px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Wheat size={14} color="#D97706" /> Beli Pakan Jagung Sigi
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('contracts')}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={14} /> Kelola Kontrak B2B ({myContracts.length})
          </button>
        </div>
      </div>

      {/* DUAL-ENGINE SUMMARY CARDS (Distinct from single-commodity) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Card 1: Outbound Revenue */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px', borderTop: '4px solid #047857' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Omzet Penjualan Telur
            </span>
            <span style={{ fontSize: '0.7rem', background: '#ECFDF5', color: '#047857', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              95% Net Payout
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '6px', letterSpacing: '-0.03em' }}>
            Rp {totalEggRevenue > 0 ? totalEggRevenue.toLocaleString('id-ID') : '42.800.000'}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            {activeContractsCount} Kontrak Rutin Aktif • Terlindungi BAST Escrow
          </div>
        </div>

        {/* Card 2: Silo Pakan & Day Remaining */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px', borderTop: '4px solid #D97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Stok Pakan Jagung Kandang
            </span>
            <span style={{ fontSize: '0.7rem', background: '#FEF3C7', color: '#B45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              {daysOfFeedRemaining} Hari Aman
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {currentFeedStockKg.toLocaleString()} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Konsumsi 660 kg/hari • KA Jagung Sigi ≤14.0%
          </div>
        </div>

        {/* Card 3: Produksi Harian Grade A */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px', borderTop: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Output Panen Hari Ini
            </span>
            <span style={{ fontSize: '0.7rem', background: '#EFF6FF', color: '#1D4ED8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              99.6% Utuh
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            182 <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>rak / hari</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            5.460 Butir Grade A (Standar 58-65g per butir)
          </div>
        </div>

        {/* Card 4: FCR Efficiency Metric */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px', borderTop: '4px solid #8B5CF6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Efisiensi Ransum Mandiri
            </span>
            <span style={{ fontSize: '0.7rem', background: '#F5F3FF', color: '#6D28D9', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              FCR 2.18
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6D28D9', marginTop: '6px', letterSpacing: '-0.03em' }}>
            +14.2% <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>Margin</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Penghematan pakan vs pakan pabrikan komersial
          </div>
        </div>
      </div>

      {/* DUAL-HUB MAIN WORKSPACE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Pasokan Telur Keluar (Outbound B2B Fulfillment) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Outbound B2B Dispatch Engine */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#047857' }} />
                  <h2 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                    Kalender Pengiriman Pasokan Telur B2B ke UMKM
                  </h2>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: '2px 0 0 16px' }}>
                  Jadwal rutin mingguan dengan harga terkunci & jaminan dana escrow BAST
                </p>
              </div>

              <button 
                type="button" 
                onClick={() => setActiveTab('contracts')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Lihat Kontrak ({myContracts.length})
              </button>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {myContracts.map(contract => {
                const nextCycleNumber = contract.completedCycles + 1;
                const isComplete = contract.completedCycles >= contract.totalCycles;
                const cycleProgressPercent = Math.round((contract.completedCycles / contract.totalCycles) * 100);

                return (
                  <div 
                    key={contract.id}
                    style={{ 
                      border: '1px solid var(--border-subtle)', 
                      borderRadius: '10px', 
                      padding: '16px',
                      background: isComplete ? 'var(--slate-50)' : '#FFFFFF',
                      transition: 'border-color 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--slate-900)' }}>
                            {contract.buyerName}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                            {contract.code}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                          Jadwal: <strong>{contract.frequency}</strong> • Volume: <strong>{contract.volumePerCycle} {contract.unitType} / batch</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#047857' }}>
                          Rp {contract.pricePerUnit.toLocaleString('id-ID')} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--slate-500)' }}>/rak</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                          Nilai Batch: Rp {(contract.volumePerCycle * contract.pricePerUnit).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Batch Counter */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--slate-600)', marginBottom: '5px' }}>
                        <span>Realisasi Siklus Kontrak:</span>
                        <strong style={{ color: 'var(--slate-900)' }}>
                          {contract.completedCycles} dari {contract.totalCycles} Batch Terkirim ({cycleProgressPercent}%)
                        </strong>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${cycleProgressPercent}%`, 
                            height: '100%', 
                            background: isComplete ? '#10B981' : 'var(--primary-600)',
                            transition: 'width 0.4s ease'
                          }} 
                        />
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => onSelectContract(contract)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <FileText size={13} /> Dokumen BAST & Surat Jalan
                      </button>

                      {!isComplete ? (
                        <button
                          type="button"
                          onClick={() => fulfillContractCycle(contract.id, nextCycleNumber)}
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700, borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Truck size={14} /> Kirim Batch #{nextCycleNumber} ({contract.volumePerCycle} Rak)
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Seluruh Siklus Kontrak Selesai
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Production & Ration Chart */}
          <AnimatedTrendChart 
            title="Monitoring Panen Telur vs Asupan Ransum Pakan"
            subtitle="Output panen harian (rak/hari) vs rasio asupan jagung pipil mandiri dari Sigi"
            unit="rak"
            secondaryUnit="kg"
            primaryLegend="Produksi Telur"
            secondaryLegend="Asupan Pakan Harian"
            primaryColor="#047857"
            secondaryColor="#D97706"
            data={eggProductionTrend}
            formatValue={(v) => `${v} rak`}
            formatSecondaryValue={(v) => `${v} kg`}
            height={190}
          />
        </div>

        {/* RIGHT COLUMN: Inbound Pakan Jagung Sigi & Kandang Operational Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Silo & Ration Calculator Widget */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Wheat size={18} color="#D97706" />
              <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Kalkulator Ransum & Kebutuhan Jagung
              </h2>
            </div>

            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#92400E', marginBottom: '6px' }}>
                <span>Populasi Ayam:</span>
                <strong>6.000 Ekor</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#92400E', marginBottom: '6px' }}>
                <span>Standar Pakan Harian:</span>
                <strong>110 gram / ekor / hari</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#92400E', marginBottom: '6px' }}>
                <span>Komposisi Jagung Pipil:</span>
                <strong>55% Formulasi Ransum</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#92400E', borderTop: '1px solid #FCD34D', paddingTop: '6px', fontWeight: 800 }}>
                <span>Kebutuhan Jagung Harian:</span>
                <span>363 kg / hari</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('market_corn')}
              style={{
                width: '100%',
                padding: '9px',
                background: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} /> Pesan Jagung Sigi (KA ≤14%)
            </button>
          </div>

          {/* Inbound Feed Procurement History */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Pengadaan Jagung Sigi Terakhir
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                {myFeedOrders.length} Pembelian
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {myFeedOrders.map(order => (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  style={{
                    padding: '12px 18px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--slate-50)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--slate-900)' }}>
                        {order.sellerName}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', fontFamily: 'monospace' }}>
                        {order.code}
                      </div>
                    </div>
                    <span style={{ 
                      background: order.status === 'completed' ? '#ECFDF5' : '#EFF6FF', 
                      color: order.status === 'completed' ? '#047857' : '#1D4ED8', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '0.68rem', 
                      fontWeight: 700 
                    }}>
                      {order.status === 'completed' ? 'Diterima' : 'Armada Jalan'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--slate-600)' }}>
                    <span>{order.quantity.toLocaleString()} kg Jagung</span>
                    <strong style={{ color: 'var(--slate-900)' }}>Rp {order.totalAmount.toLocaleString('id-ID')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOP Quality Guarantee */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#047857" /> Standar BAST & Garansi Telur B2B
            </div>
            <ul style={{ fontSize: '0.74rem', color: 'var(--slate-600)', margin: 0, paddingLeft: '16px', lineHeight: 1.55 }}>
              <li>Sortir kerabang bersih bebas feses & retak sebelum muat armada.</li>
              <li>Penyusunan maksimal 5 tingkat tray egg crate berlapis busa.</li>
              <li>Jaminan ganti rugi 1x24 jam jika ada klaim retak di pihak UMKM.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

