import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionOrder } from '../types';
import { 
  FileText, 
  Search, 
  Filter, 
  Wheat, 
  Egg, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertTriangle,
  Star
} from 'lucide-react';

interface TransactionHistoryViewProps {
  onSelectOrder: (order: TransactionOrder) => void;
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({ onSelectOrder }) => {
  const { orders, currentUser } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.code.toLowerCase().includes(search.toLowerCase()) ||
                          order.buyerName.toLowerCase().includes(search.toLowerCase()) ||
                          order.sellerName.toLowerCase().includes(search.toLowerCase()) ||
                          order.listingTitle.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesRole = filterRole === 'all' || 
      (filterRole === 'as_buyer' && order.buyerId === currentUser.id) ||
      (filterRole === 'as_seller' && order.sellerId === currentUser.id);

    return matchesSearch && matchesType && matchesRole;
  });

  return (
    <div className="main-wrapper" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-title">
          <FileText style={{ color: 'var(--primary-700)' }} />
          Riwayat Transaksi & Audit Log Rantai Pasok (REQ-18)
        </h1>
        <p className="section-desc">
          Semua catatan transaksi jual-beli jagung dan telur tercatat secara transparan dan terverifikasi.
        </p>
      </div>

      {/* Filters */}
      <div className="card card-p" style={{ padding: '14px 18px', marginBottom: '20px', background: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Cari kode transaksi, nama mitra..." 
              style={{ paddingLeft: '36px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div>
            <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">Semua Komoditas</option>
              <option value="CORN">Pakan Jagung Sigi/Donggala (Flow A)</option>
              <option value="EGG_ONEOFF">Telur Utuh Grosir (Flow B)</option>
            </select>
          </div>

          <div>
            <select className="form-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="all">Semua Posisi Transaksi</option>
              <option value="as_buyer">Saya Sebagai Pembeli</option>
              <option value="as_seller">Saya Sebagai Penjual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredOrders.length === 0 ? (
          <div className="card card-p" style={{ textAlign: 'center', color: 'var(--slate-500)', padding: '40px' }}>
            Tidak ada riwayat transaksi yang cocok dengan filter.
          </div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="card card-p"
              style={{ cursor: 'pointer', transition: 'var(--transition)' }}
              onClick={() => onSelectOrder(order)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    background: order.type === 'CORN' ? 'var(--harvest-100)' : 'var(--egg-100)', 
                    color: order.type === 'CORN' ? 'var(--harvest-700)' : 'var(--egg-600)',
                    padding: '10px',
                    borderRadius: '10px'
                  }}>
                    {order.type === 'CORN' ? <Wheat size={20} /> : <Egg size={20} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)' }}>
                      {order.code} — {order.listingTitle}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                    </div>
                  </div>
                </div>

                <span className={`badge ${
                  order.status === 'completed' ? 'badge-success' :
                  order.status === 'disputed' ? 'badge-danger' :
                  order.status === 'in_delivery' ? 'badge-info' : 'badge-warning'
                }`}>
                  {order.status === 'completed' && '✓ Selesai & Lunas'}
                  {order.status === 'in_delivery' && '🚚 Dalam Pengiriman'}
                  {order.status === 'confirmed' && '⏳ Terkonfirmasi'}
                  {order.status === 'pending_confirmation' && '💬 Menunggu Respon'}
                  {order.status === 'disputed' && '⚠ Sengketa Terbuka'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', background: 'var(--slate-50)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--slate-500)' }}>Volume: </span>
                  <strong>{order.quantity.toLocaleString()} {order.unit}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-500)' }}>Pihak Terlibat: </span>
                  <span>{order.sellerName.split(' ')[0]} ➔ {order.buyerName.split(' ')[0]}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-500)' }}>Total Pembayaran: </span>
                  <strong style={{ color: 'var(--primary-800)' }}>Rp {order.totalAmount.toLocaleString('id-ID')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-500)' }}>Komisi ({(order.commissionRate * 100).toFixed(0)}%): </span>
                  <span>Rp {order.commissionFee.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {order.rating && (
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={13} fill="#f59e0b" color="#f59e0b" /> Rating {order.rating.stars}/5: "{order.rating.comment}"
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
