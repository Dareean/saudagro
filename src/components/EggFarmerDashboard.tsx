import React from 'react';
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
  ExternalLink
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

  const eggProductionTrend = [
    { label: 'Sen', dateStr: 'Senin, 22 Sep', value: 165, secondaryValue: 780 },
    { label: 'Sel', dateStr: 'Selasa, 23 Sep', value: 172, secondaryValue: 800 },
    { label: 'Rab', dateStr: 'Rabu, 24 Sep', value: 168, secondaryValue: 790 },
    { label: 'Kam', dateStr: 'Kamis, 25 Sep', value: 175, secondaryValue: 820 },
    { label: 'Jum', dateStr: 'Jumat, 26 Sep', value: 180, secondaryValue: 830 },
    { label: 'Sab', dateStr: 'Sabtu, 27 Sep', value: 178, secondaryValue: 810 },
    { label: 'Hari Ini', dateStr: 'Hari Ini (Balaroa)', value: 182, secondaryValue: 840 },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Ringkasan Rantai Pasok Pakan & Penjualan Telur
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            {currentUser.name} • {currentUser.village}, {currentUser.district} (6.000 Layer Hen)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_corn')}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', fontWeight: 600, padding: '8px 14px', borderRadius: '8px' }}
          >
            Pesan Pakan Jagung
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_eggs')}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Kelola Pasokan Telur
          </button>
        </div>
      </div>

      {/* Clean 4-Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pakan Terbeli
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {totalFeedProcuredKg > 0 ? totalFeedProcuredKg.toLocaleString() : '5.500'} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Langsung dari petani Sigi (KA ≤14%)
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Kontrak Pasokan B2B
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {activeContractsCount > 0 ? activeContractsCount : 1} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>Mitra</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Jadwal pengiriman rutin mingguan
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Produksi Harian
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            160-180 <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>rak/hari</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Grade A Segar (Balaroa, Palu Barat)
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Omzet Telur
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '6px', letterSpacing: '-0.03em' }}>
            Rp {totalEggRevenue > 0 ? totalEggRevenue.toLocaleString('id-ID') : '42.800.000'}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Terlindungi rekening bersama BAST
          </div>
        </div>
      </div>

      {/* 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px' }}>
        {/* Left: Animated Chart, Contracts & Feed Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Animated Chart */}
          <AnimatedTrendChart 
            title="Produksi Telur Harian & Rasio Konsumsi Pakan"
            subtitle="Output panen telur (rak/hari) vs rasio asupan ransum pakan jagung mandiri"
            unit="rak"
            secondaryUnit="kg"
            primaryLegend="Produksi Telur"
            secondaryLegend="Asupan Pakan Harian"
            primaryColor="#047857"
            secondaryColor="#D97706"
            data={eggProductionTrend}
            formatValue={(v) => `${v} rak`}
            formatSecondaryValue={(v) => `${v} kg`}
            height={200}
          />

          {/* Active B2B Contracts Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Kontrak Pasokan Rutin B2B Aktif
              </h2>
              <button 
                type="button" 
                onClick={() => setActiveTab('contracts')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Semua Kontrak ({myContracts.length})
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Mitra UMKM</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Frekuensi & Volume</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Harga Terkunci</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Progres Siklus</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {myContracts.map(contract => (
                    <tr key={contract.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{contract.buyerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{contract.code}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div>{contract.volumePerCycle} {contract.unitType} / Batch</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{contract.frequency}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#047857' }}>
                        Rp {contract.pricePerUnit.toLocaleString('id-ID')} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--slate-500)' }}>/rak</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '0.74rem', color: 'var(--slate-700)', marginBottom: '4px' }}>
                          {contract.completedCycles} dari {contract.totalCycles} Batch
                        </div>
                        <div style={{ width: '100px', height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(contract.completedCycles / contract.totalCycles) * 100}%`, height: '100%', background: 'var(--primary-600)' }} />
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => onSelectContract(contract)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px' }}
                          >
                            BAST
                          </button>
                          {contract.status === 'active' && contract.completedCycles < contract.totalCycles && (
                            <button
                              type="button"
                              onClick={() => fulfillContractCycle(contract.id, contract.completedCycles + 1)}
                              className="btn btn-primary"
                              style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Truck size={12} /> Kirim #{contract.completedCycles + 1}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Corn Feed Orders (Purchases) Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Pengadaan Pakan Jagung Pipil (Petani Sigi)
              </h2>
              <button 
                type="button" 
                onClick={() => setActiveTab('market_corn')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                + Beli Baru
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>No. Pesanan</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Petani Sigi</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Volume</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Total Biaya</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myFeedOrders.map(order => (
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
                        <div>{order.sellerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{order.deliveryMethod}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {order.quantity.toLocaleString()} kg
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--slate-900)' }}>
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{ 
                          background: order.status === 'completed' ? '#ECFDF5' : '#EFF6FF', 
                          color: order.status === 'completed' ? '#047857' : '#1D4ED8', 
                          padding: '3px 8px', 
                          borderRadius: '5px', 
                          fontSize: '0.72rem', 
                          fontWeight: 700 
                        }}>
                          {order.status === 'completed' ? 'Diterima di Kandang' : 'Dalam Pengiriman'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Price Benchmarks */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '12px' }}>
              Acuan Pasar Telur & Pakan Sulteng
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Telur Rak Grade A (Kota Palu)</span>
                <strong style={{ color: '#047857' }}>Rp 51.500 /rak</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Jagung Pipil Sigi (KA ≤14%)</span>
                <strong style={{ color: 'var(--slate-900)' }}>Rp 5.200 /kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Hemat Biaya Pakan Mandiri</span>
                <strong style={{ color: '#047857' }}>+14.2% Efisiensi</strong>
              </div>
            </div>
          </div>

          {/* Quality Assurance Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
              Standar Kualitas Telur Segar
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-600)', lineHeight: 1.55, margin: '0 0 8px 0' }}>
              • Sortir bersih dari kotoran & retak sebelum dimuat ke armada mitra.<br />
              • Penggantian 1x24 jam untuk klaim retak di perjalanan.<br />
              • Faktur digital resmi B2B untuk kebutuhan audit UMKM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
