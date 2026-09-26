import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionOrder } from '../types';
import { 
  Search, 
  Wheat, 
  Egg, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  AlertTriangle,
  Star,
  FileText
} from 'lucide-react';

interface TransactionHistoryViewProps {
  onSelectOrder: (order: TransactionOrder) => void;
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({ onSelectOrder }) => {
  const { orders, currentUser } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.code.toLowerCase().includes(search.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      order.listingTitle.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesRole = filterRole === 'all' || 
      (filterRole === 'as_buyer' && order.buyerId === currentUser.id) ||
      (filterRole === 'as_seller' && order.sellerId === currentUser.id);

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesType && matchesRole && matchesStatus;
  });

  const totalCompletedValue = orders
    .filter(o => o.status === 'completed')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Riwayat Transaksi & Audit Log Rantai Pasok
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            Seluruh transaksi jual-beli jagung pipil dan telur tercatat transparan dengan verifikasi Berita Acara Serah Terima (BAST).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 14px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--slate-500)' }}>Total Realisasi Transaksi: </span>
            <strong style={{ color: '#047857' }}>Rp {totalCompletedValue.toLocaleString('id-ID')}</strong>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cari kode pesanan, nama pembeli/penjual..." 
            style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ flex: '0 1 180px' }}>
          <select 
            className="form-select" 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
          >
            <option value="all">Semua Komoditas</option>
            <option value="CORN">Jagung Pipil (Sigi/Donggala)</option>
            <option value="EGG_ONEOFF">Telur Ayam Segar (Palu)</option>
          </select>
        </div>

        <div style={{ flex: '0 1 180px' }}>
          <select 
            className="form-select" 
            value={filterRole} 
            onChange={e => setFilterRole(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
          >
            <option value="all">Semua Peran</option>
            <option value="as_buyer">Saya Sebagai Pembeli</option>
            <option value="as_seller">Saya Sebagai Penjual</option>
          </select>
        </div>

        <div style={{ flex: '0 1 170px' }}>
          <select 
            className="form-select" 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
          >
            <option value="all">Semua Status</option>
            <option value="completed">Selesai & Lunas</option>
            <option value="in_delivery">Dalam Pengiriman</option>
            <option value="confirmed">Terkonfirmasi</option>
            <option value="pending_confirmation">Menunggu Respon</option>
            <option value="disputed">Sengketa</option>
          </select>
        </div>
      </div>

      {/* Main Table Layout */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--slate-500)', padding: '48px 20px', fontSize: '0.86rem' }}>
            Tidak ada riwayat transaksi yang cocok dengan kriteria pencarian.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 700, width: '160px', whiteSpace: 'nowrap' }}>No. Pesanan & Tanggal</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, width: '250px' }}>Komoditas & Volume</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, minWidth: '280px' }}>Pihak Transaksi (Penjual → Pembeli)</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, width: '160px', whiteSpace: 'nowrap' }}>Total Pembayaran</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, width: '140px', whiteSpace: 'nowrap' }}>Status BAST</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, width: '110px', textAlign: 'right', whiteSpace: 'nowrap' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const isCorn = order.type === 'CORN';
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr 
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--slate-50)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Code & Date */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)', fontSize: '0.86rem', letterSpacing: '-0.01em' }}>
                          {order.code}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                          {formattedDate}
                        </div>
                      </td>

                      {/* Commodity & Volume */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--slate-900)' }}>
                          {isCorn ? (
                            <Wheat size={15} style={{ color: '#D97706', flexShrink: 0 }} />
                          ) : (
                            <Egg size={15} style={{ color: '#047857', flexShrink: 0 }} />
                          )}
                          <span>{order.listingTitle}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '3px', whiteSpace: 'nowrap' }}>
                          Volume: <strong>{order.quantity.toLocaleString()} {order.unit}</strong> ({order.deliveryMethod})
                        </div>
                      </td>

                      {/* Parties involved */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{order.sellerName}</span>
                          <ArrowRight size={13} style={{ color: 'var(--slate-400)', flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{order.buyerName}</span>
                        </div>
                        {order.rating && (
                          <div style={{ fontSize: '0.72rem', color: '#B45309', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', background: '#FFFBEB', padding: '3px 8px', borderRadius: '4px', width: 'fit-content' }}>
                            <Star size={11} fill="#B45309" />
                            <span>"{order.rating.comment}"</span>
                          </div>
                        )}
                      </td>

                      {/* Payment & Fee */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.9rem' }}>
                          Rp {order.totalAmount.toLocaleString('id-ID')}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                          Komisi: Rp {order.commissionFee.toLocaleString('id-ID')} ({(order.commissionRate * 100).toFixed(0)}%)
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: 
                            order.status === 'completed' ? '#ECFDF5' :
                            order.status === 'in_delivery' ? '#EFF6FF' :
                            order.status === 'disputed' ? '#FEF2F2' : '#FFFBEB',
                          color: 
                            order.status === 'completed' ? '#047857' :
                            order.status === 'in_delivery' ? '#1D4ED8' :
                            order.status === 'disputed' ? '#B91C1C' : '#B45309'
                        }}>
                          {order.status === 'completed' && <CheckCircle2 size={12} />}
                          {order.status === 'in_delivery' && <Truck size={12} />}
                          {order.status === 'disputed' && <AlertTriangle size={12} />}
                          {order.status === 'completed' ? 'Selesai & Lunas' :
                           order.status === 'in_delivery' ? 'Dalam Pengiriman' :
                           order.status === 'confirmed' ? 'Terkonfirmasi' :
                           order.status === 'disputed' ? 'Sengketa Mediasi' : 'Menunggu Respon'}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '5px 12px', fontSize: '0.74rem', borderRadius: '6px', fontWeight: 600 }}
                        >
                          Detail BAST
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
