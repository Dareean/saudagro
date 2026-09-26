import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wheat, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Truck,
  Droplets,
  CreditCard,
  Phone,
  Scale,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { TransactionOrder } from '../types';

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
  const totalCapacityKg = myCornListings.reduce((acc, l) => acc + l.quantityKg, 0) || 3000;

  const pendingRequests = mySalesOrders.filter(
    o => o.status === 'pending_confirmation' || (o.negotiation && o.negotiation.status === 'pending')
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Header Petani */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 700 }}>
              🌾 Sentra Jagung Sigi Biromaru
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--slate-400)' }}>• Kelompok Tani Subur Makmur</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Workspace Panen & Penjualan Jagung Pipil
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            Pengelolaan stok gudang Desa Lolu, monitoring kadar air standar pakan, dan pencairan hasil panen tanpa tengkulak.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_corn')}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Pasang Lot Panen Baru
          </button>
        </div>
      </div>

      {/* SPECIALIZED WIDGET: Status Silo Gudang & Dompet Escrow (2-Box Split) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Silo & Moisture Meter Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Gudang Penyimpanan Desa Lolu
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
                {totalStockKg.toLocaleString()} <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--slate-400)' }}>kg siap dipesan</span>
              </div>
            </div>

            {/* Moisture Level Badge */}
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '8px 12px', textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#047857', fontWeight: 800, fontSize: '0.88rem' }}>
                <Droplets size={15} /> KA 13.5%
              </div>
              <div style={{ fontSize: '0.68rem', color: '#065F46', marginTop: '2px', fontWeight: 600 }}>
                Standar Pakan Aman (≤14%)
              </div>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--slate-500)', marginBottom: '6px' }}>
              <span>Kapasitas Tersedia: <strong>{((totalStockKg / totalCapacityKg) * 100).toFixed(0)}%</strong></span>
              <span>Total Lot: <strong>{totalCapacityKg.toLocaleString()} kg</strong></span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(totalStockKg / totalCapacityKg) * 100}%`, height: '100%', background: '#047857', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Escrow Payout Wallet Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Dompet Hasil Panen (Escrow BAST)
              </div>
              <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700, background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                Bank Sulteng Terverifikasi
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
              Rp {totalRevenue > 0 ? totalRevenue.toLocaleString('id-ID') : '10.400.000'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              {totalSoldKg.toLocaleString()} kg jagung terserap langsung peternak Palu
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.76rem' }}>
            <span style={{ color: 'var(--slate-500)' }}>Pencairan Terakhir:</span>
            <strong style={{ color: 'var(--slate-800)' }}>19 Agu 2026 • Lunas</strong>
          </div>
        </div>
      </div>

      {/* Pending Incoming Orders Alert */}
      {pendingRequests.length > 0 && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 700, color: '#B45309' }}>
              <Clock size={16} />
              <span>Ada {pendingRequests.length} pesanan baru dari peternak ayam menunggu konfirmasi muat:</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {pendingRequests.map(o => (
                <button
                  key={o.id}
                  onClick={() => onSelectOrder(o)}
                  style={{ background: '#B45309', color: 'white', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Konfirmasi Muat ({o.code})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Section: Active Lots & Incoming Orders vs Sigi Market & Facilitator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px' }}>
        {/* Left: Active Lots & Sales Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Corn Lots */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  Lot Jagung Pipil Siap Muat
                </h2>
                <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                  Gudang Lolu, Sigi Biromaru
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveTab('market_corn')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                + Tambah Lot
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Kode Lot</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Kadar Air (KA)</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Sisa Stok</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Harga Jual</th>
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
                        <div style={{ color: '#047857', fontWeight: 700 }}>KA {lot.moistureLevel}%</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Uji Probe Tera Sigi</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {lot.remainingKg.toLocaleString()} kg
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--slate-900)' }}>
                        Rp {lot.pricePerKg.toLocaleString('id-ID')}/kg
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{ background: '#ECFDF5', color: '#047857', padding: '3px 8px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 700 }}>
                          Siap Ambil
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales History Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Penjualan ke Peternak Ayam
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
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Pendapatan Bersih</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Status BAST</th>
                  </tr>
                </thead>
                <tbody>
                  {mySalesOrders.slice(0, 4).map(order => (
                    <tr 
                      key={order.id} 
                      onClick={() => onSelectOrder(order)}
                      style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {order.code}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{order.buyerName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>{order.deliveryMethod}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {order.quantity.toLocaleString()} kg
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: '#047857' }}>
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
                          {order.status === 'completed' ? 'Cair ke Rekening' : 'Menunggu Muat'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Spot Prices & Field Facilitator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sigi Spot Price Benchmark */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={15} style={{ color: '#047857' }} /> Acuan Spot Jagung Sulteng
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Sigi Biromaru (Gudang)</span>
                <strong style={{ color: '#047857' }}>Rp 5.200 /kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Palu Barat (Pakan Layer)</span>
                <strong style={{ color: 'var(--slate-900)' }}>Rp 5.350 /kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--slate-400)' }}>
                <span>Acuan HET Bapanas</span>
                <span>Rp 5.000 /kg</span>
              </div>
            </div>
          </div>

          {/* Facilitator Contact Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '4px' }}>
              Pendamping Lapangan Sigi
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--slate-500)', lineHeight: 1.45, margin: '0 0 10px 0' }}>
              Butuh kalibrasi timbangan tera atau uji kadar air sebelum pengiriman?
            </p>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '10px' }}>
              Bapak Ilham Syafei, S.P.
            </div>
            <a 
              href="https://wa.me/6281245678901?text=Halo%20Pak%20Ilham%2C%20saya%20petani%20Sigi%20butuh%20pendampingan%20timbang%20Saudagro."
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '8px', background: '#075E54', color: '#FFFFFF', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.079-1.85-.426-1.505-.625-2.476-2.15-2.551-2.25-.074-.1-1.17-1.558-1.17-2.971 0-1.413.738-2.108 1.002-2.397.264-.289.576-.361.768-.361.192 0 .384.002.552.01.178.009.418-.068.653.498.24.577.817 1.996.889 2.14.072.145.12.313.024.505-.096.192-.144.312-.288.481-.144.168-.303.376-.433.504-.144.145-.295.302-.127.591.168.289.747 1.232 1.604 1.995 1.102.981 2.032 1.285 2.32 1.43.289.144.457.12.625-.073.168-.192.72-.842.912-1.13.192-.289.384-.24.649-.144.264.096 1.681.793 1.969.937.288.145.48.217.552.337.072.12.072.72-.072 1.125zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.399A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.15-.44-4.46-1.22l-.32-.19-2.96.83.82-2.88-.21-.34A8.16 8.16 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
              </svg>
              Chat Fasilitator WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
