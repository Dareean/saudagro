import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wheat, 
  Plus, 
  ArrowRight, 
  Check, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Truck,
  ExternalLink,
  Phone
} from 'lucide-react';
import { TransactionOrder } from '../types';
import { AnimatedTrendChart } from './AnimatedTrendChart';

interface FarmerDashboardProps {
  onSelectOrder: (order: TransactionOrder) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onSelectOrder }) => {
  const { currentUser, cornListings, orders, setActiveTab } = useApp();

  const myCornListings = cornListings.filter(l => l.farmerId === currentUser.id);
  const mySalesOrders = orders.filter(o => o.sellerId === currentUser.id);

  const totalSoldKg = mySalesOrders
    .filter(o => o.status === 'completed' || o.status === 'in_delivery')
    .reduce((acc, o) => acc + o.quantity, 0);

  const totalRevenue = mySalesOrders
    .filter(o => o.status === 'completed')
    .reduce((acc, o) => acc + o.sellerNetRevenue, 0);

  const totalStockKg = myCornListings.reduce((acc, l) => acc + l.remainingKg, 0);

  const pendingRequests = mySalesOrders.filter(
    o => o.status === 'pending_confirmation' || (o.negotiation && o.negotiation.status === 'pending')
  );

  const cornTrendData = [
    { label: 'Mei', dateStr: 'Mei 2026', value: 4850, secondaryValue: 900 },
    { label: 'Jun', dateStr: 'Juni 2026', value: 4950, secondaryValue: 1200 },
    { label: 'Jul', dateStr: 'Juli 2026', value: 5100, secondaryValue: 1450 },
    { label: 'Agu', dateStr: 'Agustus 2026', value: 5050, secondaryValue: 1600 },
    { label: 'Sep 10', dateStr: '10 September 2026', value: 5150, secondaryValue: 1850 },
    { label: 'Sep 20', dateStr: '20 September 2026', value: 5180, secondaryValue: 2100 },
    { label: 'Hari Ini', dateStr: 'Harga Spot Realisasi Sigi', value: 5200, secondaryValue: 2400 },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Top Header & Primary Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Ringkasan Penjualan & Panen Jagung
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            {currentUser.name} • {currentUser.village}, {currentUser.district}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_corn')}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', fontWeight: 600, padding: '8px 14px', borderRadius: '8px' }}
          >
            Katalog Pasar Jagung
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_corn')}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Pasang Stok Panen
          </button>
        </div>
      </div>

      {/* Clean 4-Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Jagung Terjual
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {totalSoldKg.toLocaleString()} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Terserap langsung peternak ayam
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pendapatan Bersih
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '6px', letterSpacing: '-0.03em' }}>
            Rp {totalRevenue > 0 ? totalRevenue.toLocaleString('id-ID') : '10.400.000'}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Pencairan rekening amanah
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Stok Siap Kirim
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {totalStockKg > 0 ? totalStockKg.toLocaleString() : '3.000'} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Gudang Desa Lolu, Sigi (KA ≤14%)
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Skor Kemitraan
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {currentUser.rating ? currentUser.rating.toFixed(1) : '4.9'} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F59E0B' }}>★</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Dari {currentUser.reviewCount || 38} transaksi selesai
          </div>
        </div>
      </div>

      {/* Action Required: Pending Orders Alert */}
      {pendingRequests.length > 0 && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 700, color: '#B45309' }}>
              <Clock size={16} />
              <span>Ada {pendingRequests.length} pesanan baru menunggu konfirmasi pengiriman Anda</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {pendingRequests.map(o => (
                <button
                  key={o.id}
                  onClick={() => onSelectOrder(o)}
                  style={{ background: '#B45309', color: 'white', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Tinjau {o.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Main Section: Real Data Tables & Regional Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px' }}>
        {/* Left: Active Lots & Order History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Animated Trend Chart */}
          <AnimatedTrendChart 
            title="Tren Harga Spot & Penyerapan Jagung Sigi"
            subtitle="Pergerakan harga realisasi petani ke peternak ayam dan volume terserap per periode"
            unit="Rp"
            secondaryUnit="kg"
            primaryLegend="Harga Realisasi (/kg)"
            secondaryLegend="Volume Terserap"
            primaryColor="#047857"
            secondaryColor="#0284C7"
            data={cornTrendData}
            formatValue={(v) => `Rp ${v.toLocaleString('id-ID')}/kg`}
            formatSecondaryValue={(v) => `${v.toLocaleString('id-ID')} kg`}
            height={200}
          />

          {/* Active Corn Lots */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Daftar Stok Panen Aktif
              </h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                {myCornListings.length} Lot Siap Dipesan
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Kode Lot</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Bentuk & Kadar Air</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Sisa Stok</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Harga / Kg</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myCornListings.map(lot => (
                    <tr key={lot.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {lot.code}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div>{lot.cornForm}</div>
                        <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>KA {lot.moistureLevel}% (Standar Pakan)</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {lot.remainingKg.toLocaleString()} kg / <span style={{ color: 'var(--slate-400)' }}>{lot.quantityKg.toLocaleString()} kg</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--slate-900)' }}>
                        Rp {lot.pricePerKg.toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{ background: '#ECFDF5', color: '#047857', padding: '3px 8px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 700 }}>
                          Tersedia
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Riwayat Transaksi Penjualan
              </h2>
              <button 
                type="button" 
                onClick={() => setActiveTab('history')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Lihat Semua ({mySalesOrders.length})
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>No. Pesanan</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Peternak Pembeli</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Volume</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Nilai Bersih</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mySalesOrders.slice(0, 5).map(order => (
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
                        <div>{order.buyerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{order.deliveryMethod}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {order.quantity.toLocaleString()} kg
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#047857' }}>
                        Rp {order.sellerNetRevenue.toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{ 
                          background: order.status === 'completed' ? '#ECFDF5' : '#FFFBEB', 
                          color: order.status === 'completed' ? '#047857' : '#B45309', 
                          padding: '3px 8px', 
                          borderRadius: '5px', 
                          fontSize: '0.72rem', 
                          fontWeight: 700 
                        }}>
                          {order.status === 'completed' ? 'Selesai & Cair' : 'Menunggu Konfirmasi'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Market Benchmark & Facilitator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Price Benchmark Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '12px' }}>
              Acuan Harga Spot Sulteng
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Sigi Biromaru (Gudang)</span>
                <strong style={{ color: 'var(--slate-900)' }}>Rp 5.200 /kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Palu Barat (Pakan Layer)</span>
                <strong style={{ color: 'var(--slate-900)' }}>Rp 5.350 /kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Sindue, Donggala</span>
                <strong style={{ color: 'var(--slate-900)' }}>Rp 5.150 /kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--slate-400)' }}>
                <span>Acuan HET Bapanas</span>
                <span>Rp 5.000 /kg</span>
              </div>
            </div>
          </div>

          {/* Facilitator Contact Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
              Fasilitator Wilayah Sigi
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '12px' }}>
              Butuh kalibrasi timbangan tera atau uji kadar air sebelum pengiriman ke peternak Palu?
            </p>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '2px' }}>
              Bapak Ilham Syafei, S.P.
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
              Pendamping Lapangan Sigi Biromaru
            </div>
            <a 
              href="https://wa.me/6281245678901?text=Halo%20Pak%20Ilham%2C%20saya%20petani%20Sigi%20butuh%20pendampingan%20timbang%20Saudagro."
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '8px', background: 'var(--slate-100)', color: 'var(--slate-700)', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
            >
              <Phone size={13} /> Chat Fasilitator WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
