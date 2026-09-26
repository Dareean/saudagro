import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CornListing, District, CornMoisture, CornForm } from '../types';
import gsap from 'gsap';
import { 
  Wheat, 
  Search, 
  MapPin, 
  ShieldCheck, 
  PlusCircle, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  X,
  Droplets,
  Calendar,
  Layers
} from 'lucide-react';
import { WhatsAppActionModal } from './WhatsAppActionModal';

export const MarketplaceCorn: React.FC = () => {
  const { 
    currentUser, 
    cornListings, 
    createCornOrder, 
    createCornListing,
    openProductDetail
  } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedMoisture, setSelectedMoisture] = useState<string>('all');
  const [selectedForm, setSelectedForm] = useState<string>('all');

  // Modal State for Ordering
  const [orderingListing, setOrderingListing] = useState<CornListing | null>(null);
  const [orderQuantityKg, setOrderQuantityKg] = useState<number>(1000);
  const [deliveryMethod, setDeliveryMethod] = useState<'Ambil Sendiri' | 'Diantar Penjual'>('Diantar Penjual');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser.address || '');
  const [enableNego, setEnableNego] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState<number>(0);

  // Modal State for New Listing
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuantity, setNewQuantity] = useState<number>(3000);
  const [newPrice, setNewPrice] = useState<number>(5200);
  const [newMoisture, setNewMoisture] = useState<number>(13.5);
  const [newForm, setNewForm] = useState<CornForm>('Pipil Kering');
  const [newHarvestDate, setNewHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newDistrict, setNewDistrict] = useState<District>(currentUser.district || 'Kabupaten Sigi');
  const [newVillage, setNewVillage] = useState(currentUser.village || 'Desa Lolu, Sigi');
  const [newDescription, setNewDescription] = useState('');

  // WhatsApp Modal State
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

  // Filter listings
  const filteredListings = cornListings.filter(item => {
    const matchesSearch = item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchesMoisture = selectedMoisture === 'all' || 
      (selectedMoisture === 'standard' && item.moistureLevel <= 14.0) ||
      (selectedMoisture === 'above' && item.moistureLevel > 14.0);
    const matchesForm = selectedForm === 'all' || item.cornForm === selectedForm;

    return matchesSearch && matchesDistrict && matchesMoisture && matchesForm;
  });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.corn-card-item'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [selectedDistrict, selectedMoisture, selectedForm, searchQuery]);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingListing) return;

    if (orderQuantityKg <= 0 || orderQuantityKg > orderingListing.remainingKg) {
      alert(`Jumlah pesanan harus antara 1 Kg dan ${orderingListing.remainingKg} Kg`);
      return;
    }

    createCornOrder(
      orderingListing.id,
      orderQuantityKg,
      deliveryMethod,
      deliveryAddress,
      enableNego ? offeredPrice : undefined
    );

    const savedListing = orderingListing;
    setOrderingListing(null);
    setEnableNego(false);

    setWaModalData({
      isOpen: true,
      recipientName: savedListing.farmerName,
      recipientPhone: savedListing.farmerPhone,
      defaultMessage: `Halo ${savedListing.farmerName}, saya ${currentUser.name} (${currentUser.role === 'EGG_FARMER' ? 'Peternak Ayam Palu' : 'Pembeli'}). Saya baru saja membuat pesanan pakan jagung ${orderQuantityKg.toLocaleString()} Kg (${savedListing.code}) melalui Saudagro Platform. Mohon dikonfirmasi ya Pak/Bu. Terima kasih!`,
      actionTitle: 'Kirim Notifikasi Order via WhatsApp'
    });
  };

  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const moistureCategory: CornMoisture = 
      newMoisture <= 14.0 ? 'Standar Pakan (<= 14%)' : 
      newMoisture <= 16.0 ? 'Sedang (14.1% - 16%)' : 'Basah (> 16%)';

    createCornListing({
      quantityKg: newQuantity,
      pricePerKg: newPrice,
      moistureLevel: newMoisture,
      moistureCategory,
      cornForm: newForm,
      harvestDate: newHarvestDate,
      district: newDistrict,
      village: newVillage,
      description: newDescription || `Jagung ${newForm} panen ${newHarvestDate} di ${newVillage}. Kadar air ${newMoisture}%. Pakan berkualitas tinggi.`,
      deliveryOptions: ['Ambil di Lokasi (Self-Pickup)', 'Diantar Penjual']
    });

    setShowCreateModal(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 60px 24px' }} ref={containerRef}>
      {/* Clean Page Hero */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Pasar Jagung Pipil Kering Sigi & Donggala
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            {currentUser.role === 'EGG_FARMER' 
              ? 'Pengadaan pakan jagung pipil langsung dari petani Sigi untuk ransum mandiri peternakan ayam Anda (KA ≤ 14%).'
              : currentUser.role === 'CORN_FARMER'
              ? 'Katalog penjualan jagung panen petani Sigi langsung ke peternak layer tanpa perantara tengkulak.'
              : 'Informasi komoditas jagung pipil kering wilayah Sigi, Palu, dan Donggala.'}
          </p>
        </div>

        <div>
          {(currentUser.role === 'CORN_FARMER' || currentUser.role === 'ADMIN') && (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PlusCircle size={16} />
              Pasang Stok Panen Jagung
            </button>
          )}

          {currentUser.role === 'EGG_FARMER' && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '6px 14px', borderRadius: '8px', fontSize: '0.76rem', color: '#047857', fontWeight: 700 }}>
              Mode Pembeli Pakan Ternak • Pilih Petani Sigi di Bawah
            </div>
          )}
        </div>
      </div>


      {/* Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '12px 16px',
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
            placeholder="Cari petani, desa, atau pakan..." 
            style={{ width: '100%', paddingLeft: '34px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ flex: '0 1 180px' }}>
          <select 
            className="form-select" 
            value={selectedDistrict} 
            onChange={e => setSelectedDistrict(e.target.value)}
            style={{ width: '100%', padding: '7px 12px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
          >
            <option value="all">Semua Wilayah</option>
            <option value="Kabupaten Sigi">Kabupaten Sigi</option>
            <option value="Kota Palu">Kota Palu</option>
            <option value="Kabupaten Donggala">Kabupaten Donggala</option>
          </select>
        </div>

        <div style={{ flex: '0 1 180px' }}>
          <select 
            className="form-select" 
            value={selectedMoisture} 
            onChange={e => setSelectedMoisture(e.target.value)}
            style={{ width: '100%', padding: '7px 12px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
          >
            <option value="all">Semua Kadar Air</option>
            <option value="standard">Kadar Air Aman (≤ 14%)</option>
            <option value="above">Kadar Air &gt; 14%</option>
          </select>
        </div>

        <div style={{ flex: '0 1 180px' }}>
          <select 
            className="form-select" 
            value={selectedForm} 
            onChange={e => setSelectedForm(e.target.value)}
            style={{ width: '100%', padding: '7px 12px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
          >
            <option value="all">Semua Bentuk Jagung</option>
            <option value="Pipil Kering">Pipil Kering (Siap Giling)</option>
            <option value="Tongkol Kering">Tongkol Kering</option>
          </select>
        </div>
      </div>

      {/* Clean Organic Cards Grid - Compact & Responsive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredListings.map(item => {
          const isStandardFeed = item.moistureLevel <= 14.0;
          return (
            <div key={item.id} className="card corn-card-item" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
              <div 
                className="card-img-wrapper" 
                onClick={() => openProductDetail('corn', item.id)}
                style={{ cursor: 'pointer' }}
                title="Klik untuk melihat spesifikasi detail produk"
              >
                <img 
                  src={item.images[0]} 
                  alt={item.code} 
                  className="card-img"
                />
                <div className="card-img-tags">
                  <span className="badge" style={{ background: 'rgba(15, 23, 42, 0.85)', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 700 }}>
                    {item.code}
                  </span>
                  {isStandardFeed ? (
                    <span className="badge badge-success" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                      <Droplets size={10} /> KA {item.moistureLevel}% (Aman)
                    </span>
                  ) : (
                    <span className="badge badge-warning" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                      <Droplets size={10} /> KA {item.moistureLevel}% (Perlu Jemur)
                    </span>
                  )}
                </div>
                <div style={{ position: 'absolute', bottom: '6px', right: '6px' }}>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--slate-800)', fontSize: '0.68rem', fontWeight: 700 }}>
                    {item.cornForm}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div>
                  <div 
                    className="card-farmer-info"
                    onClick={() => openProductDetail('corn', item.id)}
                    style={{ cursor: 'pointer' }}
                    title="Klik untuk melihat spesifikasi detail produk"
                  >
                    <div className="card-farmer-name">
                      {item.farmerName}
                      <span title="Petani Terverifikasi"><ShieldCheck size={14} style={{ color: '#047857' }} /></span>
                    </div>
                  </div>

                  <div className="card-location">
                    <MapPin size={12} /> {item.village}, {item.district}
                  </div>

                  <p 
                    className="card-desc"
                    onClick={() => openProductDetail('corn', item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.description}
                  </p>

                  <div className="card-data-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Stok Siap Kirim:</span>
                      <strong>{item.remainingKg.toLocaleString()} Kg ({ (item.remainingKg / 1000).toFixed(1) } Ton)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Panen Pada:</span>
                      <span>{item.harvestDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="card-price-row">
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Harga Satuan:</span>
                    <span className="card-price-value">
                      Rp {item.pricePerKg.toLocaleString('id-ID')}
                      <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--slate-500)' }}> /kg</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn btn-wa btn-sm"
                      onClick={() => {
                        setWaModalData({
                          isOpen: true,
                          recipientName: item.farmerName,
                          recipientPhone: item.farmerPhone,
                          defaultMessage: `Halo ${item.farmerName}, saya tertarik dengan stok pakan jagung ${item.code} (${item.quantityKg} Kg) di Saudagro. Apakah masih ready?`,
                          actionTitle: 'Tanya Petani via WhatsApp'
                        });
                      }}
                      title="Hubungi Petani via WhatsApp"
                      style={{ padding: '6px 10px', borderRadius: '7px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.079-1.85-.426-1.505-.625-2.476-2.15-2.551-2.25-.074-.1-1.17-1.558-1.17-2.971 0-1.413.738-2.108 1.002-2.397.264-.289.576-.361.768-.361.192 0 .384.002.552.01.178.009.418-.068.653.498.24.577.817 1.996.889 2.14.072.145.12.313.024.505-.096.192-.144.312-.288.481-.144.168-.303.376-.433.504-.144.145-.295.302-.127.591.168.289.747 1.232 1.604 1.995 1.102.981 2.032 1.285 2.32 1.43.289.144.457.12.625-.073.168-.192.72-.842.912-1.13.192-.289.384-.24.649-.144.264.096 1.681.793 1.969.937.288.145.48.217.552.337.072.12.072.72-.072 1.125zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.399A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.15-.44-4.46-1.22l-.32-.19-2.96.83.82-2.88-.21-.34A8.16 8.16 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
                      </svg>
                    </button>
                    
                    <button 
                      className="btn btn-primary btn-full"
                      disabled={item.remainingKg <= 0}
                      onClick={() => {
                        setOrderingListing(item);
                        setOrderQuantityKg(Math.min(1000, item.remainingKg));
                        setOfferedPrice(item.pricePerKg);
                      }}
                      style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '7px', fontWeight: 700 }}
                    >
                      {item.remainingKg <= 0 ? 'Stok Habis' : 'Pesan Jagung Pakan'}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Modal */}
      {orderingListing && (
        <div className="modal-overlay" onClick={() => setOrderingListing(null)}>
          <div 
            className="modal-card" 
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '24px 28px', maxHeight: '92vh', overflowY: 'auto' }}
          >
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  Pesan Pakan Jagung — {orderingListing.farmerName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '4px 0 0 0' }}>
                  {orderingListing.code} • {orderingListing.village}, {orderingListing.district} (KA {orderingListing.moistureLevel}%)
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setOrderingListing(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmOrder}>
              <div className="form-group">
                <label className="form-label">Jumlah Pembelian (Kg):</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min={50} 
                  max={orderingListing.remainingKg} 
                  step={50}
                  value={orderQuantityKg}
                  onChange={e => setOrderQuantityKg(Number(e.target.value))}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                  <span>Min order: 50 Kg</span>
                  <span>Tersedia: <strong>{orderingListing.remainingKg.toLocaleString()} Kg</strong></span>
                </div>
              </div>

              {/* Price Negotiation (REQ-10) */}
              <div style={{ background: '#FFFBEB', padding: '12px 14px', borderRadius: '10px', border: '1px solid #FDE68A', marginBottom: '14px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={enableNego} 
                    onChange={e => setEnableNego(e.target.checked)} 
                    style={{ accentColor: '#D97706' }}
                  />
                  Ajukan Penawaran Harga Khusus (Nego)
                </label>

                {enableNego && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400E' }}>Tawaran: Rp</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      step={50}
                      value={offeredPrice} 
                      onChange={e => setOfferedPrice(Number(e.target.value))}
                      style={{ width: '130px', padding: '6px 10px', fontSize: '0.84rem' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#92400E' }}>/Kg</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Metode Pengiriman:</label>
                <select 
                  className="form-select" 
                  value={deliveryMethod}
                  onChange={e => setDeliveryMethod(e.target.value as any)}
                >
                  <option value="Diantar Penjual">Diantar oleh Petani / Armada Lokal (+Ongkir Rp 150.000)</option>
                  <option value="Ambil Sendiri">Ambil Sendiri ke Lokasi Petani (Gratis Ongkir)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Alamat / Lokasi Kandang Peternak:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Contoh: Peternakan Berkah, Balaroa, Palu Barat"
                  required
                />
              </div>

              {/* Commission Box (REQ-23) */}
              {(() => {
                const effectivePrice = enableNego && offeredPrice > 0 ? offeredPrice : orderingListing.pricePerKg;
                const subtotal = orderQuantityKg * effectivePrice;
                const commissionRate = 0.03;
                const commissionFee = Math.round(subtotal * commissionRate);
                const deliveryFee = deliveryMethod === 'Diantar Penjual' ? 150000 : 0;
                const total = subtotal + deliveryFee;

                return (
                  <div className="fee-calc-box">
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                      Rincian Biaya & Transparansi Komisi (3%):
                    </div>
                    <div className="fee-row">
                      <span>Harga Jagung ({orderQuantityKg.toLocaleString()} Kg x Rp {effectivePrice.toLocaleString('id-ID')}):</span>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="fee-row">
                      <span>Ongkos Kirim ({deliveryMethod}):</span>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Rp {deliveryFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="fee-row" style={{ color: 'var(--slate-500)', fontSize: '0.74rem' }}>
                      <span>*Komisi Platform 3% (dipotong dari escrow penjual):</span>
                      <span>(Rp {commissionFee.toLocaleString('id-ID')})</span>
                    </div>
                    <div className="fee-row total">
                      <span>Total Pembayaran:</span>
                      <span style={{ color: '#047857' }}>Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }} onClick={() => setOrderingListing(null)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '10px', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Ajukan Pesanan Pakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--forest-900)' }}>
                  Pasang Stok Panen Jagung
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Langsung tayang ke peternak ayam se-Sulteng
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateListingSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Bentuk Jagung:</label>
                  <select 
                    className="form-select" 
                    value={newForm}
                    onChange={e => setNewForm(e.target.value as CornForm)}
                  >
                    <option value="Pipil Kering">Pipil Kering (Siap Giling)</option>
                    <option value="Tongkol Kering">Tongkol Kering</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Kadar Air (%):</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    step={0.1}
                    min={10}
                    max={25}
                    value={newMoisture}
                    onChange={e => setNewMoisture(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Stok Panen (Kg):</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    step={100}
                    value={newQuantity}
                    onChange={e => setNewQuantity(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Harga per Kg (Rp):</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    step={50}
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Kabupaten:</label>
                  <select 
                    className="form-select" 
                    value={newDistrict}
                    onChange={e => setNewDistrict(e.target.value as District)}
                  >
                    <option value="Kabupaten Sigi">Kabupaten Sigi</option>
                    <option value="Kota Palu">Kota Palu</option>
                    <option value="Kabupaten Donggala">Kabupaten Donggala</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Desa / Kebun:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newVillage}
                    onChange={e => setNewVillage(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal Panen:</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={newHarvestDate}
                  onChange={e => setNewHarvestDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Mutu Jagung:</label>
                <textarea 
                  className="form-textarea" 
                  rows={2} 
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Contoh: Biji kuning mengilap, bebas jamur, sudah diayak bersih."
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-harvest" style={{ flex: 2 }}>
                  <PlusCircle size={16} /> Pasang Listing
                </button>
              </div>
            </form>
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
