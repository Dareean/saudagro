import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionOrder, PaymentMethod } from '../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  CreditCard, 
  AlertTriangle, 
  Star, 
  MessageSquare, 
  Phone, 
  MapPin, 
  QrCode, 
  Building2,
  Banknote,
  Send
} from 'lucide-react';
import { WhatsAppActionModal } from './WhatsAppActionModal';

interface OrderDetailsModalProps {
  order: TransactionOrder | null;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const { 
    currentUser, 
    acceptNegotiation, 
    rejectNegotiation, 
    simulatePayment, 
    confirmDelivery, 
    confirmReceipt, 
    submitOrderRating,
    openDispute 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeInput, setShowDisputeInput] = useState(false);

  const [waModalData, setWaModalData] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientPhone: string;
    defaultMessage: string;
    actionTitle: string;
  }>({
    isOpen: false,
    recipientName: '',
    recipientPhone: '',
    defaultMessage: '',
    actionTitle: ''
  });

  if (!order) return null;

  const isBuyer = currentUser.id === order.buyerId;
  const isSeller = currentUser.id === order.sellerId;
  const otherPartyName = isBuyer ? order.sellerName : order.buyerName;
  const otherPartyPhone = isBuyer ? order.sellerPhone : order.buyerPhone;

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOrderRating(order.id, ratingStars, ratingComment || 'Transaksi sangat memuaskan, kualitas sesuai kesepakatan!');
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason) return;
    openDispute(order.id, disputeReason);
    setShowDisputeInput(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {order.code}
              </h3>
              <span className={`badge ${
                order.status === 'completed' ? 'badge-success' :
                order.status === 'disputed' ? 'badge-danger' :
                order.status === 'in_delivery' ? 'badge-info' : 'badge-warning'
              }`}>
                {order.status === 'pending_confirmation' && 'Menunggu Konfirmasi'}
                {order.status === 'confirmed' && 'Terkonfirmasi / Belum Bayar'}
                {order.status === 'in_delivery' && 'Dalam Pengiriman'}
                {order.status === 'received' && 'Telah Diterima'}
                {order.status === 'completed' && 'Selesai & Lunas'}
                {order.status === 'cancelled' && 'Dibatalkan'}
                {order.status === 'disputed' && 'Dalam Mediasi Sengketa'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Dibuat pada: {new Date(order.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Makassar' })} WITA
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Timeline Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: order.status !== 'cancelled' ? 'var(--primary-100)' : 'var(--slate-100)', color: 'var(--primary-800)' }}>
            <Clock size={16} style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>1. Order</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: (order.paymentStatus === 'paid_escrow' || order.paymentStatus === 'released_to_seller' || order.paymentStatus === 'cod_pending') ? 'var(--primary-100)' : 'var(--slate-100)', color: (order.paymentStatus === 'paid_escrow' || order.paymentStatus === 'released_to_seller') ? 'var(--primary-800)' : 'var(--slate-400)' }}>
            <CreditCard size={16} style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>2. Bayar</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: (order.status === 'in_delivery' || order.status === 'completed') ? 'var(--primary-100)' : 'var(--slate-100)', color: (order.status === 'in_delivery' || order.status === 'completed') ? 'var(--primary-800)' : 'var(--slate-400)' }}>
            <Truck size={16} style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>3. Kirim</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: order.status === 'completed' ? 'var(--primary-100)' : 'var(--slate-100)', color: order.status === 'completed' ? 'var(--primary-800)' : 'var(--slate-400)' }}>
            <PackageCheck size={16} style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>4. Selesai</div>
          </div>
        </div>

        {/* Order Items Info */}
        <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)', marginBottom: '4px' }}>
            {order.listingTitle}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '10px' }}>
            <span>Jumlah: <strong>{order.quantity.toLocaleString()} {order.unit}</strong></span>
            <span>Harga Satuan: <strong>Rp {order.pricePerUnit.toLocaleString('id-ID')}</strong></span>
          </div>

          <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Pembeli:</span>
              <span style={{ fontWeight: 600 }}>{order.buyerName} ({order.buyerPhone})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Penjual:</span>
              <span style={{ fontWeight: 600 }}>{order.sellerName} ({order.sellerPhone})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Metode Pengiriman:</span>
              <span style={{ fontWeight: 600 }}>{order.deliveryMethod} ({order.deliveryAddress})</span>
            </div>
          </div>
        </div>

        {/* Negotiation Box if pending */}
        {order.negotiation && order.negotiation.status === 'pending' && (
          <div style={{ background: 'var(--harvest-50)', border: '1.5px solid var(--harvest-500)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 800, color: 'var(--harvest-700)', fontSize: '0.9rem', marginBottom: '4px' }}>
              💬 Penawaran Harga Khusus (Nego) Diajukan
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-700)', marginBottom: '10px' }}>
              Pembeli mengajukan harga <strong>Rp {order.negotiation.offeredPricePerUnit.toLocaleString('id-ID')}/{order.unit}</strong> (Harga awal: Rp {order.negotiation.originalPricePerUnit.toLocaleString('id-ID')}).
            </p>
            {isSeller ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-sm btn-primary" onClick={() => acceptNegotiation(order.id)}>
                  Terima Tawaran Harga
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => rejectNegotiation(order.id)}>
                  Tolak & Batalkan
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                *Menunggu persetujuan penjual.
              </div>
            )}
          </div>
        )}

        {/* Calculation & Fee Breakdown */}
        <div className="fee-calc-box">
          <div className="fee-row">
            <span>Subtotal Barang:</span>
            <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="fee-row">
            <span>Ongkos Pengiriman:</span>
            <span>Rp {order.deliveryFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="fee-row" style={{ color: 'var(--slate-500)', fontSize: '0.78rem' }}>
            <span>*Potongan Komisi Platform ({(order.commissionRate * 100).toFixed(0)}%):</span>
            <span>(Rp {order.commissionFee.toLocaleString('id-ID')})</span>
          </div>
          <div className="fee-row total">
            <span>Total Tagihan Pembeli:</span>
            <span style={{ color: 'var(--primary-800)' }}>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textAlign: 'right', marginTop: '2px' }}>
            Pendapatan Bersih Penjual: <strong>Rp {order.sellerNetRevenue.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Action Controls based on state & role */}
        <div style={{ marginTop: '16px' }}>
          {/* Action 1: Pay if confirmed and unpaid (Buyer action) */}
          {order.paymentStatus === 'unpaid' && order.status === 'confirmed' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-primary btn-full btn-lg"
                onClick={() => setShowPaymentModal(true)}
              >
                <CreditCard size={18} /> Lakukan Pembayaran (Simulasi QRIS / VA / COD)
              </button>
            </div>
          )}

          {/* Action 2: Dispatch / Deliver (Seller action) */}
          {isSeller && (order.paymentStatus === 'paid_escrow' || order.paymentStatus === 'cod_pending') && order.status !== 'in_delivery' && order.status !== 'completed' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-harvest btn-full btn-lg"
                onClick={() => confirmDelivery(order.id, 'Barang telah dimuat dan sedang dikirim ke lokasi.')}
              >
                <Truck size={18} /> Konfirmasi Barang Telah Dikirim / Siap Ambil
              </button>
            </div>
          )}

          {/* Action 3: Confirm Receipt (Buyer action) */}
          {isBuyer && order.status === 'in_delivery' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-primary btn-full btn-lg"
                onClick={() => confirmReceipt(order.id)}
              >
                <PackageCheck size={18} /> Konfirmasi Barang Diterima Sesuai & Cairkan Dana
              </button>
            </div>
          )}

          {/* Action 4: Rating & Review when completed */}
          {order.status === 'completed' && !order.rating && (
            <form onSubmit={handleRatingSubmit} style={{ background: 'var(--primary-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', marginTop: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-900)', marginBottom: '8px' }}>
                ⭐ Beri Ulasan Reputasi Transaksi (REQ-19):
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={24} 
                    style={{ 
                      cursor: 'pointer', 
                      color: star <= ratingStars ? '#f59e0b' : 'var(--slate-300)',
                      fill: star <= ratingStars ? '#f59e0b' : 'none'
                    }} 
                    onClick={() => setRatingStars(star)}
                  />
                ))}
              </div>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Tulis ulasan kualitas barang (contoh: jagung sangat kering / telur segar)..."
                value={ratingComment}
                onChange={e => setRatingComment(e.target.value)}
                style={{ marginBottom: '8px' }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Kirim Ulasan Bintang
              </button>
            </form>
          )}

          {/* Display submitted rating */}
          {order.rating && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '12px', borderRadius: 'var(--radius-md)', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                <Star size={16} fill="#d97706" /> {order.rating.stars} / 5 Bintang Ulasan
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-700)', marginTop: '2px', fontStyle: 'italic' }}>
                "{order.rating.comment}"
              </p>
            </div>
          )}

          {/* Dispute Link */}
          {order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'disputed' && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              {!showDisputeInput ? (
                <button 
                  type="button" 
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setShowDisputeInput(true)}
                >
                  Ada kendala kualitas / pengiriman? Buka Komplain Sengketa
                </button>
              ) : (
                <form onSubmit={handleDisputeSubmit} style={{ background: 'var(--danger-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--danger)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '4px' }}>
                    Formulir Mediasi Sengketa Transaksi:
                  </div>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Jelaskan alasan (contoh: kadar air tidak sesuai / barang rusak)..."
                    value={disputeReason}
                    onChange={e => setDisputeReason(e.target.value)}
                    required
                    style={{ marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowDisputeInput(false)}>Batal</button>
                    <button type="submit" className="btn btn-sm" style={{ background: 'var(--danger)', color: 'white' }}>Kirim ke Ops Saudagro</button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* WhatsApp Button */}
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--slate-100)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Perlu koordinasi langsung dengan mitra?
          </div>
          <button 
            className="btn btn-wa btn-sm"
            onClick={() => {
              setWaModalData({
                isOpen: true,
                recipientName: otherPartyName,
                recipientPhone: otherPartyPhone,
                defaultMessage: `Halo ${otherPartyName}, mengenai pesanan ${order.code} (${order.listingTitle}) di Saudagro, mari kita koordinasikan jadwal dan pengirimannya. Terima kasih!`,
                actionTitle: `Chat WhatsApp dengan ${otherPartyName}`
              });
            }}
            style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.78rem' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.079-1.85-.426-1.505-.625-2.476-2.15-2.551-2.25-.074-.1-1.17-1.558-1.17-2.971 0-1.413.738-2.108 1.002-2.397.264-.289.576-.361.768-.361.192 0 .384.002.552.01.178.009.418-.068.653.498.24.577.817 1.996.889 2.14.072.145.12.313.024.505-.096.192-.144.312-.288.481-.144.168-.303.376-.433.504-.144.145-.295.302-.127.591.168.289.747 1.232 1.604 1.995 1.102.981 2.032 1.285 2.32 1.43.289.144.457.12.625-.073.168-.192.72-.842.912-1.13.192-.289.384-.24.649-.144.264.096 1.681.793 1.969.937.288.145.48.217.552.337.072.12.072.72-.072 1.125zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.399A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.15-.44-4.46-1.22l-.32-.19-2.96.83.82-2.88-.21-.34A8.16 8.16 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
            </svg>
            Chat WhatsApp ({otherPartyName})
          </button>
        </div>
      </div>

      {/* Payment Simulation Dialog */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Simulasi Pembayaran Transaksi</h3>
              <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Total Pembayaran:</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                Rp {order.totalAmount.toLocaleString('id-ID')}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div 
                className={`card ${paymentMethod === 'qris' ? 'border-primary' : ''}`}
                style={{ padding: '12px', cursor: 'pointer', border: paymentMethod === 'qris' ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)', background: paymentMethod === 'qris' ? 'var(--primary-50)' : 'white' }}
                onClick={() => setPaymentMethod('qris')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <QrCode size={20} style={{ color: 'var(--primary-700)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>QRIS Agribisnis Sulteng</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>BCA, Mandiri, BRI, DANA, GoPay, OVO</div>
                  </div>
                </div>
              </div>

              <div 
                className={`card ${paymentMethod === 'va_bri' ? 'border-primary' : ''}`}
                style={{ padding: '12px', cursor: 'pointer', border: paymentMethod === 'va_bri' ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)', background: paymentMethod === 'va_bri' ? 'var(--primary-50)' : 'white' }}
                onClick={() => setPaymentMethod('va_bri')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={20} style={{ color: 'var(--info)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Virtual Account BRI / Bank Sulteng</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Verifikasi otomatis dalam 1 detik</div>
                  </div>
                </div>
              </div>

              <div 
                className={`card ${paymentMethod === 'cod' ? 'border-primary' : ''}`}
                style={{ padding: '12px', cursor: 'pointer', border: paymentMethod === 'cod' ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)', background: paymentMethod === 'cod' ? 'var(--primary-50)' : 'white' }}
                onClick={() => setPaymentMethod('cod')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Banknote size={20} style={{ color: 'var(--warning)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Bayar Tunai di Tempat (COD Terverifikasi)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Bayar tunai ke penjual saat serah terima barang</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
              🔒 <strong>Perlindungan Escrow Saudagro:</strong> Dana disimpan dengan aman di rekening penampung dan baru dicairkan ke rekening penjual setelah pembeli mengonfirmasi barang telah diterima dalam kondisi baik.
            </div>

            <button 
              className="btn btn-primary btn-full btn-lg"
              onClick={() => {
                simulatePayment(order.id, paymentMethod);
                setShowPaymentModal(false);
              }}
            >
              <CheckCircle2 size={18} /> Simulasikan Pelunasan Pembayaran
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      <WhatsAppActionModal 
        isOpen={waModalData.isOpen}
        onClose={() => setWaModalData(prev => ({ ...prev, isOpen: false }))}
        recipientName={waModalData.recipientName}
        recipientPhone={waModalData.recipientPhone}
        defaultMessage={waModalData.defaultMessage}
        actionTitle={waModalData.actionTitle}
      />
    </div>
  );
};
