import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Egg, 
  Truck, 
  Plus, 
  Clock, 
  Check, 
  Store,
  Phone,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { TransactionOrder, B2BContract } from '../types';
import { AnimatedTrendChart } from './AnimatedTrendChart';

interface UMKMDashboardProps {
  onSelectOrder: (order: TransactionOrder) => void;
  onSelectContract: (contract: B2BContract) => void;
}

export const UMKMDashboard: React.FC<UMKMDashboardProps> = ({ 
  onSelectOrder, 
  onSelectContract 
}) => {
  const { 
    currentUser, 
    contracts, 
    orders, 
    setActiveTab, 
    payContractCycle 
  } = useApp();

  const myContracts = contracts.filter(c => c.buyerId === currentUser.id);
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);

  const totalEggsReceived = myOrders
    .filter(o => o.status === 'completed' && o.type === 'EGG_ONEOFF')
    .reduce((acc, o) => acc + o.quantity, 0) + 
    myContracts.reduce((acc, c) => acc + (c.completedCycles * c.volumePerCycle), 0);

  const umkmSupplyTrend = [
    { label: 'Batch 1', dateStr: '01 Sep 2026', value: 25, secondaryValue: 1275000 },
    { label: 'Batch 2', dateStr: '08 Sep 2026', value: 25, secondaryValue: 2550000 },
    { label: 'Batch 3', dateStr: '15 Sep 2026', value: 30, secondaryValue: 4080000 },
    { label: 'Batch 4', dateStr: '22 Sep 2026', value: 30, secondaryValue: 5610000 },
    { label: 'Batch 5', dateStr: '29 Sep (Jadwal)', value: 30, secondaryValue: 7140000 },
    { label: 'Batch 6', dateStr: '06 Okt (Jadwal)', value: 35, secondaryValue: 8925000 },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Pengadaan Pasokan Telur & Jadwal Kontrak B2B
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            {currentUser.name} • {currentUser.village}, {currentUser.district}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_eggs')}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', fontWeight: 600, padding: '8px 14px', borderRadius: '8px' }}
          >
            Katalog Pasar Telur
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_eggs')}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Buat Kontrak Baru
          </button>
        </div>
      </div>

      {/* Clean 4-Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Telur Diterima
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {totalEggsReceived > 0 ? totalEggsReceived : 150} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>rak</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Grade A Segar (4.500 Butir)
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Kontrak Aktif
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {myContracts.filter(c => c.status === 'active').length || 1} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>Peternak</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Jadwal pengiriman terjadwal mingguan
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Harga Terkunci
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            Rp 51.000 <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>/rak</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: '#047857', marginTop: '4px', fontWeight: 600 }}>
            Hemat ~8% dibanding pasar eceran
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Garansi Kualitas
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            1x24 <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>jam SLA</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Jaminan ganti rugi telur retak
          </div>
        </div>
      </div>

      {/* 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px' }}>
        {/* Left: Animated Chart, Contracts & Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Animated Chart */}
          <AnimatedTrendChart 
            title="Volume Pasokan Telur & Akumulasi Pengeluaran Bahan Baku"
            subtitle="Penerimaan pasokan mingguan dan total realisasi belanja terlindungi BAST"
            unit="rak"
            secondaryUnit="Rp"
            primaryLegend="Pasokan (Rak)"
            secondaryLegend="Total Belanja Terkunci"
            primaryColor="#047857"
            secondaryColor="#2563EB"
            data={umkmSupplyTrend}
            formatValue={(v) => `${v} rak`}
            formatSecondaryValue={(v) => `Rp ${v.toLocaleString('id-ID')}`}
            height={200}
          />

          {/* Contracts Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Daftar Kontrak Langganan Pasokan Rutin
              </h2>
              <button 
                type="button" 
                onClick={() => setActiveTab('contracts')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Detail Kontrak ({myContracts.length})
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Mitra Peternak</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Volume / Batch</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Harga Terkunci</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Siklus Berjalan</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {myContracts.map(contract => {
                    const dispatchedCycle = contract.cycles.find(c => c.status === 'dispatched');
                    return (
                      <tr key={contract.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{contract.sellerFarmName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{contract.sellerName} • {contract.code}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div>{contract.volumePerCycle} {contract.unitType}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{contract.frequency}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#047857' }}>
                          Rp {contract.pricePerUnit.toLocaleString('id-ID')} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--slate-500)' }}>/rak</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontSize: '0.74rem', color: 'var(--slate-700)', marginBottom: '4px' }}>
                            {contract.completedCycles} dari {contract.totalCycles} Siklus Selesai
                          </div>
                          <div style={{ width: '100px', height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(contract.completedCycles / contract.totalCycles) * 100}%`, height: '100%', background: 'var(--primary-600)' }} />
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {dispatchedCycle && (
                              <button
                                type="button"
                                onClick={() => payContractCycle(contract.id, dispatchedCycle.cycleNumber)}
                                className="btn btn-primary"
                                style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <CheckCircle2 size={12} /> Terima Batch #{dispatchedCycle.cycleNumber}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onSelectContract(contract)}
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px' }}
                            >
                              Faktur BAST
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Spot Orders Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Pesanan Spot Telur Tambahan
              </h2>
              <button 
                type="button" 
                onClick={() => setActiveTab('market_eggs')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                + Pesan Spot
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>No. Pesanan</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Peternak</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Volume</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Total Biaya</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.filter(o => o.type === 'EGG_ONEOFF').map(order => (
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
                        {order.quantity} {order.unit}
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
                          {order.status === 'completed' ? 'Selesai & Lunas' : 'Terkonfirmasi'}
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
          {/* Cost Savings Overview */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '4px' }}>
              Efisiensi Biaya Bahan Baku
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#047857', margin: '8px 0 4px 0' }}>
              Hemat Rp 4.800.000 <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-500)' }}>/tahun</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
              Dengan mengunci harga kontrak <strong>Rp 51.000/rak</strong> langsung dari peternak Palu Barat, margin biaya produksi roti Anda terlindungi dari volatilitas pasar eceran.
            </p>
          </div>

          {/* Farm Contact Direct */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
              Kontak Cepat Peternak Mitra
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '2px' }}>
              Bu Rahmawati, S.Pt.
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
              Peternakan Ayam Berkah Palu Barat
            </div>
            <a 
              href="https://wa.me/6285233445566?text=Halo%20Bu%20Rahma%2C%20saya%20Dilla%20Bakery%20ingin%20koordinasi%20jadwal%20kirim%20telur."
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '8px', background: 'var(--slate-100)', color: 'var(--slate-700)', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
            >
              <Phone size={13} /> Chat WhatsApp Peternak
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
