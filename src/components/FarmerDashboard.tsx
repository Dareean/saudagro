import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wheat, 
  PlusCircle, 
  Clock, 
  ArrowRight, 
  Star,
  MapPin
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

  const pendingRequests = mySalesOrders.filter(
    o => o.status === 'pending_confirmation' || (o.negotiation && o.negotiation.status === 'pending')
  );

  return (
    <div className="main-wrapper">
      {/* Header */}
      <div className="page-hero">
        <div>
          <h1 className="page-title">
            Dashboard Petani Jagung — {currentUser.name}
          </h1>
          <p className="page-subtitle">
            Kelola stok lot jagung pakan, pesanan masuk dari peternak ayam Palu, dan catatan pencairan panen.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--amber-harvest)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Jagung Terjual ke Peternak
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 700, color: 'var(--forest-900)', marginTop: '4px' }}>
            {totalSoldKg.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>Kg</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--amber-dark)', marginTop: '2px' }}>
            ({ (totalSoldKg / 1000).toFixed(1) } Ton langsung tanpa tengkulak)
          </div>
        </div>

        <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--forest-700)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Pendapatan Bersih
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 700, color: 'var(--forest-900)', marginTop: '4px' }}>
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--forest-700)', marginTop: '2px' }}>
            Masuk langsung ke rekening petani
          </div>
        </div>

        <div className="card" style={{ padding: '18px', borderLeft: '4px solid #2B6282' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Listing Panen Aktif
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 700, color: 'var(--forest-900)', marginTop: '4px' }}>
            {myCornListings.length} <span style={{ fontSize: '0.85rem' }}>Lot Panen</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Terbuka dipesan peternak se-Sulteng
          </div>
        </div>

        <div className="card" style={{ padding: '18px', borderLeft: '4px solid #D9822B' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Reputasi Peternak
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 700, color: 'var(--forest-900)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={18} fill="#D9822B" color="#D9822B" /> {currentUser.rating}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Dari {currentUser.reviewCount} transaksi selesai
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div style={{ background: 'var(--amber-soft)', border: '1px solid var(--amber-border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--amber-dark)', fontSize: '0.92rem', marginBottom: '10px' }}>
            <Clock size={18} />
            Ada {pendingRequests.length} Permintaan / Nego Pesanan yang Menunggu Respon Anda:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pendingRequests.map(order => (
              <div 
                key={order.id} 
                className="card" 
                style={{ padding: '12px 16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => onSelectOrder(order)}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.buyerName} — {order.quantity.toLocaleString()} Kg</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.code} • {order.deliveryMethod}</div>
                </div>
                <button className="btn btn-primary btn-sm">
                  Tinjau Pesanan <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Columns */}
      <div className="grid-2">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--forest-900)' }}>
              Stok Panen Jagung Saya
            </h3>
            <button className="btn btn-harvest btn-sm" onClick={() => setActiveTab('market_corn')}>
              <PlusCircle size={14} /> Tambah Stok
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myCornListings.map(listing => (
              <div key={listing.id} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--forest-900)' }}>
                      {listing.cornForm} (Kadar Air {listing.moistureLevel}%)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {listing.code} • {listing.village}
                    </div>
                  </div>
                  <span className="badge badge-success">
                    Rp {listing.pricePerKg.toLocaleString('id-ID')}/Kg
                  </span>
                </div>

                <div style={{ background: 'var(--bg-surface-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-md)', margin: '8px 0', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sisa Stok:</span>
                  <strong style={{ color: 'var(--forest-900)' }}>
                    {listing.remainingKg.toLocaleString()} Kg / {listing.quantityKg.toLocaleString()} Kg
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--forest-900)' }}>
              Transaksi Penjualan ke Peternak
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('history')}>
              Lihat Riwayat
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mySalesOrders.slice(0, 4).map(order => (
              <div 
                key={order.id} 
                className="card"
                style={{ padding: '14px', cursor: 'pointer' }}
                onClick={() => onSelectOrder(order)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{order.code}</span>
                  <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {order.status === 'completed' ? 'Selesai & Lunas' : 'Dalam Proses'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Pembeli: {order.buyerName} • {order.quantity.toLocaleString()} Kg
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-900)', marginTop: '4px' }}>
                  Penerimaan Bersih: Rp {order.sellerNetRevenue.toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
