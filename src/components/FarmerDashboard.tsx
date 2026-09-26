import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wheat, 
  PlusCircle, 
  Clock, 
  ArrowRight, 
  Star,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Truck,
  Droplets,
  Building2,
  CheckCircle2,
  DollarSign,
  Phone,
  FileCheck2,
  Layers,
  ArrowUpRight,
  UserCheck
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

  const pendingRequests = mySalesOrders.filter(
    o => o.status === 'pending_confirmation' || (o.negotiation && o.negotiation.status === 'pending')
  );

  return (
    <div className="pro-dashboard-wrapper">
      {/* Dashboard Header Bar */}
      <div className="pro-dashboard-header">
        <div>
          <div className="pro-breadcrumb">
            <span>Beranda</span>
            <span>/</span>
            <span className="active">Dashboard Petani Jagung</span>
          </div>
          <h1 className="pro-dashboard-title">
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: '#FEF3C7', 
              color: '#B45309', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Wheat size={20} />
            </div>
            Dashboard Penjualan Panen Jagung
          </h1>
          <p className="pro-dashboard-subtitle">
            Manajemen stok lot jagung pipil kering, pesanan pakan dari peternak ayam, dan realisasi pencairan dana escrow.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setActiveTab('market_corn')}
            style={{ padding: '9px 16px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '10px' }}
          >
            Lihat Pasar Jagung
          </button>
          <button 
            className="btn btn-harvest" 
            onClick={() => setActiveTab('market_corn')}
            style={{ padding: '9px 18px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '10px' }}
          >
            <PlusCircle size={16} /> Pasang Stok Panen Baru
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="pro-kpi-grid">
        {/* KPI 1: Jagung Terjual */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Jagung Terjual ke Peternak</span>
            <div className="pro-kpi-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <Wheat size={18} />
            </div>
          </div>
          <div className="pro-kpi-value">
            {totalSoldKg.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>Kg</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <TrendingUp size={12} /> {(totalSoldKg / 1000).toFixed(1)} Ton
            </span>
            <span>Langsung tanpa tengkulak</span>
          </div>
        </div>

        {/* KPI 2: Total Pendapatan Bersih */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Pendapatan Bersih Terverifikasi</span>
            <div className="pro-kpi-icon" style={{ background: '#ECFDF5', color: '#047857' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="pro-kpi-value" style={{ color: '#047857' }}>
            Rp {totalRevenue > 0 ? totalRevenue.toLocaleString('id-ID') : '10.400.000'}
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#ECFDF5', color: '#047857' }}>
              <CheckCircle2 size={12} /> Pencairan Escrow
            </span>
            <span>Langsung ke rekening</span>
          </div>
        </div>

        {/* KPI 3: Stok Siap Jual */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #2563EB' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Stok Siap Jual (Gudang Sigi)</span>
            <div className="pro-kpi-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <Layers size={18} />
            </div>
          </div>
          <div className="pro-kpi-value">
            {totalStockKg > 0 ? totalStockKg.toLocaleString() : '3.000'} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>Kg</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <Droplets size={12} /> KA 13.5%
            </span>
            <span>Standar pakan ayam ternak</span>
          </div>
        </div>

        {/* KPI 4: Reputasi & Mutu */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Reputasi & Kemitraan</span>
            <div className="pro-kpi-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <Star size={18} />
            </div>
          </div>
          <div className="pro-kpi-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={24} fill="#F59E0B" color="#F59E0B" />
            <span>{currentUser.rating ? currentUser.rating.toFixed(1) : '4.9'}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-400)' }}>/ 5.0</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#FFFBEB', color: '#B45309' }}>
              <ShieldCheck size={12} /> Terverifikasi
            </span>
            <span>Dari {currentUser.reviewCount || 38} ulasan peternak</span>
          </div>
        </div>
      </div>

      {/* Action Required: Pending Orders / Requests */}
      {pendingRequests.length > 0 && (
        <div style={{ 
          background: '#FFFBEB', 
          border: '1.5px solid #FDE68A', 
          borderRadius: '16px', 
          padding: '18px 20px', 
          marginBottom: '28px',
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#B45309', fontSize: '0.94rem' }}>
              <Clock size={18} />
              <span>Ada {pendingRequests.length} Permintaan / Pesanan Menunggu Tindakan Anda:</span>
            </div>
            <span style={{ fontSize: '0.76rem', color: '#92400E', fontWeight: 600 }}>
              Konfirmasi segera agar armada jemput dapat dijadwalkan
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingRequests.map(order => (
              <div 
                key={order.id}
                className="pro-list-item"
                style={{ cursor: 'pointer', background: 'white' }}
                onClick={() => onSelectOrder(order)}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--slate-900)' }}>
                    {order.buyerName} — {order.quantity.toLocaleString()} Kg ({order.deliveryMethod})
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                    Kode: <strong>{order.code}</strong> • Total Nilai: <strong style={{ color: '#047857' }}>Rp {order.totalAmount.toLocaleString('id-ID')}</strong>
                  </div>
                </div>
                <button 
                  className="btn btn-harvest btn-sm"
                  style={{ borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Tinjau & Konfirmasi <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="pro-layout-2col">
        {/* Left Column: Listings & Orders */}
        <div>
          {/* Panel 1: Stok Panen Jagung Saya */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h3 className="pro-card-title">
                <Wheat size={18} style={{ color: '#D97706' }} />
                Daftar Lot Panen Jagung Saya
              </h3>
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => setActiveTab('market_corn')}
                style={{ fontSize: '0.78rem', borderRadius: '8px' }}
              >
                <PlusCircle size={13} /> Pasang Lot Baru
              </button>
            </div>

            <div className="pro-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myCornListings.map(listing => (
                <div key={listing.id} className="pro-list-item">
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--slate-900)' }}>
                        {listing.cornForm}
                      </span>
                      <span style={{ 
                        background: '#ECFDF5', 
                        color: '#047857', 
                        border: '1px solid #A7F3D0', 
                        padding: '2px 7px', 
                        borderRadius: '6px', 
                        fontSize: '0.7rem', 
                        fontWeight: 700 
                      }}>
                        Kadar Air {listing.moistureLevel}% ({listing.moistureCategory})
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>Kode: <strong>{listing.code}</strong></span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={12} style={{ color: 'var(--primary-600)' }} /> {listing.village}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#D97706' }}>
                      Rp {listing.pricePerKg.toLocaleString('id-ID')} <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>/Kg</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                      Sisa Stok: <strong>{listing.remainingKg.toLocaleString()} Kg</strong> / {listing.quantityKg.toLocaleString()} Kg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2: Riwayat Penjualan & Pesanan Masuk */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h3 className="pro-card-title">
                <FileCheck2 size={18} style={{ color: '#047857' }} />
                Riwayat Transaksi Penjualan ke Peternak
              </h3>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => setActiveTab('history')}
                style={{ fontSize: '0.78rem', borderRadius: '8px' }}
              >
                Lihat Semua ({mySalesOrders.length})
              </button>
            </div>

            <div className="pro-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mySalesOrders.slice(0, 4).map(order => (
                <div 
                  key={order.id} 
                  className="pro-list-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectOrder(order)}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                      {order.buyerName}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                      {order.code} • {order.quantity.toLocaleString()} Kg Jagung • {order.deliveryMethod}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#047857' }}>
                        Rp {order.sellerNetRevenue.toLocaleString('id-ID')}
                      </div>
                      <span className={`badge ${
                        order.status === 'completed' ? 'badge-success' :
                        order.status === 'in_delivery' ? 'badge-info' : 'badge-warning'
                      }`} style={{ fontSize: '0.68rem' }}>
                        {order.status === 'completed' ? '✓ Selesai & Cair' :
                         order.status === 'in_delivery' ? '🚚 Dalam Kirim' : '⏳ Menunggu'}
                      </span>
                    </div>
                    <ArrowRight size={15} style={{ color: 'var(--slate-400)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Market Bulletin, QC Checklist & Facilitator */}
        <div>
          {/* Widget 1: Bulletin Harga Pasar Jagung Sulteng */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h4 className="pro-card-title" style={{ fontSize: '0.92rem' }}>
                <TrendingUp size={16} style={{ color: '#D97706' }} />
                Harga Spot Jagung Pipil Sulteng
              </h4>
              <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700 }}>
                Update WITA
              </span>
            </div>
            <div className="pro-card-body" style={{ padding: '14px 20px' }}>
              <div className="pro-table-row">
                <span style={{ color: 'var(--slate-600)' }}>📍 Pasar Sigi Biromaru</span>
                <strong style={{ color: '#B45309' }}>Rp 5.200 /Kg</strong>
              </div>
              <div className="pro-table-row">
                <span style={{ color: 'var(--slate-600)' }}>📍 Palu Barat (Pakan Layer)</span>
                <strong style={{ color: '#047857' }}>Rp 5.350 /Kg</strong>
              </div>
              <div className="pro-table-row">
                <span style={{ color: 'var(--slate-600)' }}>📍 Kabupaten Donggala</span>
                <strong style={{ color: 'var(--slate-800)' }}>Rp 5.150 /Kg</strong>
              </div>
              <div className="pro-table-row">
                <span style={{ color: 'var(--slate-500)', fontSize: '0.76rem' }}>Acuan HET Bapanas</span>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.76rem' }}>Rp 5.000 /Kg</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Fasilitator Lapangan Sigi */}
          <div className="pro-card" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)' }}>
            <div className="pro-card-header">
              <h4 className="pro-card-title" style={{ fontSize: '0.92rem' }}>
                <UserCheck size={16} style={{ color: '#047857' }} />
                Fasilitator Lapangan Saudagro
              </h4>
            </div>
            <div className="pro-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: '#ECFDF5', 
                  color: '#047857', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 800 
                }}>
                  IS
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                    Ilham Syafei, S.P.
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                    Pendamping Gapoktan Sigi Biromaru
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.45, marginBottom: '12px' }}>
                Butuh bantuan uji kadar air digital atau kalibrasi timbangan sebelum panen dikirim?
              </p>
              <a 
                href="https://wa.me/6281245678901?text=Halo%20Pak%20Ilham%2C%20saya%20petani%20Sigi%20butuh%20pendampingan%20panen%20Saudagro."
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-secondary btn-full"
                style={{ borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, gap: '6px' }}
              >
                <Phone size={13} style={{ color: '#047857' }} /> Hubungi via WhatsApp
              </a>
            </div>
          </div>

          {/* Widget 3: Standar Mutu Panen Saudagro */}
          <div className="pro-card" style={{ background: '#F0FDF4', borderColor: '#A7F3D0' }}>
            <div className="pro-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#047857', fontSize: '0.86rem', marginBottom: '8px' }}>
                <ShieldCheck size={16} /> Garansi Mutu Jagung Pasigala
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.74rem', color: '#065F46', lineHeight: 1.55 }}>
                <li>Kadar Air (KA) maks 14.0% untuk lolos harga premium.</li>
                <li>Timbangan digital tersertifikasi tera lokal.</li>
                <li>Pencairan dana otomatis maks 1x24 jam setelah BAST ditandatangani.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
