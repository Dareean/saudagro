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
    createCornListing 
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
    <div className="main-wrapper" ref={containerRef}>
      {/* Clean Page Hero */}
      <div className="page-hero">
        <div>
          <h1 className="page-title">
            Pasar Pakan Jagung Petani ke Peternak
          </h1>
          <p className="page-subtitle">
            Pasokan langsung dari petani jagung Sigi, Palu, dan Donggala ke peternak ayam tanpa tengkulak.
          </p>
        </div>

        <div>
          <button 
            className="btn btn-harvest" 
            onClick={() => setShowCreateModal(true)}
          >
            <PlusCircle size={16} />
            Pasang Stok Panen
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-grid">
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Cari petani, desa, atau pakan..." 
              style={{ paddingLeft: '34px' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select 
              className="form-select" 
              value={selectedDistrict} 
              onChange={e => setSelectedDistrict(e.target.value)}
            >
              <option value="all">Semua Wilayah</option>
              <option value="Kabupaten Sigi">Kabupaten Sigi</option>
              <option value="Kota Palu">Kota Palu</option>
              <option value="Kabupaten Donggala">Kabupaten Donggala</option>
            </select>
          </div>

          <div>
            <select 
              className="form-select" 
              value={selectedMoisture} 
              onChange={e => setSelectedMoisture(e.target.value)}
            >
              <option value="all">Semua Kadar Air</option>
              <option value="standard">Kadar Air Aman (≤ 14%)</option>
              <option value="above">Kadar Air &gt; 14%</option>
            </select>
          </div>

          <div>
            <select 
              className="form-select" 
              value={selectedForm} 
              onChange={e => setSelectedForm(e.target.value)}
            >
              <option value="all">Semua Bentuk Jagung</option>
              <option value="Pipil Kering">Pipil Kering (Siap Giling)</option>
              <option value="Tongkol Kering">Tongkol Kering</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clean Organic Cards Grid */}
      <div className="grid-3">
        {filteredListings.map(item => {
          const isStandardFeed = item.moistureLevel <= 14.0;
          return (
            <div key={item.id} className="card corn-card-item">
              <div className="card-img-wrapper">
                <img 
                  src={item.images[0]} 
                  alt={item.code} 
                  className="card-img"
                />
                <div className="card-img-tags">
                  <span className="badge badge-info" style={{ background: 'rgba(27, 56, 26, 0.85)', color: 'white', border: 'none' }}>
                    {item.code}
                  </span>
                  {isStandardFeed ? (
                    <span className="badge badge-success">
                      <Droplets size={11} /> KA {item.moistureLevel}% (Pakan Aman)
                    </span>
                  ) : (
                    <span className="badge badge-warning">
                      <Droplets size={11} /> KA {item.moistureLevel}% (Perlu Jemur)
                    </span>
                  )}
                </div>
                <div style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--forest-900)' }}>
                    {item.cornForm}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div>
                  <div className="card-farmer-info">
                    <div className="card-farmer-name">
                      {item.farmerName}
                      <span title="Petani Terverifikasi"><ShieldCheck size={15} style={{ color: '#2563eb' }} /></span>
                    </div>
                  </div>

                  <div className="card-location">
                    <MapPin size={12} /> {item.village}, {item.district}
                  </div>

                  <p className="card-desc">
                    {item.description}
                  </p>

                  <div className="card-data-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Stok Siap Kirim:</span>
                      <strong>{item.remainingKg.toLocaleString()} Kg ({ (item.remainingKg / 1000).toFixed(1) } Ton)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Panen Pada:</span>
                      <span>{item.harvestDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="card-price-row">
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Harga Satuan:</span>
                    <span className="card-price-value">
                      Rp {item.pricePerKg.toLocaleString('id-ID')}
                      <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}> /kg</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setWaModalData({
                          isOpen: true,
                          recipientName: item.farmerName,
                          recipientPhone: item.farmerPhone,
                          defaultMessage: `Halo ${item.farmerName}, saya tertarik dengan stok pakan jagung ${item.code} (${item.quantityKg} Kg) di Saudagro. Apakah masih ready?`,
                          actionTitle: 'Tanya Petani via WhatsApp'
                        });
                      }}
                      title="Hubungi Petani"
                      style={{ padding: '8px 12px' }}
                    >
                      <MessageSquare size={15} style={{ color: 'var(--wa-dark)' }} />
                    </button>
                    
                    <button 
                      className="btn btn-primary btn-full"
                      disabled={item.remainingKg <= 0}
                      onClick={() => {
                        setOrderingListing(item);
                        setOrderQuantityKg(Math.min(1000, item.remainingKg));
                        setOfferedPrice(item.pricePerKg);
                      }}
                    >
                      {item.remainingKg <= 0 ? 'Stok Habis' : 'Pesan Jagung Pakan'}
                      <ArrowRight size={15} />
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
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--forest-900)' }}>
                  Pesan Pakan Jagung
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Kode: {orderingListing.code} • {orderingListing.farmerName}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                  <span>Min order: 50 Kg</span>
                  <span>Tersedia: {orderingListing.remainingKg.toLocaleString()} Kg</span>
                </div>
              </div>

              {/* Price Negotiation (REQ-10) */}
              <div style={{ background: 'var(--amber-soft)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--amber-border)', marginBottom: '14px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--amber-dark)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={enableNego} 
                    onChange={e => setEnableNego(e.target.checked)} 
                  />
                  Ajukan Penawaran Harga Khusus (Nego)
                </label>

                {enableNego && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Tawaran: Rp</span>
                      <input 
                        type="number" 
                        className="form-input" 
                        step={50}
                        value={offeredPrice} 
                        onChange={e => setOfferedPrice(Number(e.target.value))}
                        style={{ width: '130px', padding: '6px 10px' }}
                      />
                      <span style={{ fontSize: '0.8rem' }}>/Kg</span>
                    </div>
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
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--forest-900)', marginBottom: '6px' }}>
                      Rincian Biaya & Transparansi Komisi (3%):
                    </div>
                    <div className="fee-row">
                      <span>Harga Jagung ({orderQuantityKg.toLocaleString()} Kg x Rp {effectivePrice.toLocaleString('id-ID')}):</span>
                      <span style={{ fontWeight: 600 }}>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="fee-row">
                      <span>Ongkos Kirim ({deliveryMethod}):</span>
                      <span style={{ fontWeight: 600 }}>Rp {deliveryFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="fee-row" style={{ color: 'var(--text-light)', fontSize: '0.76rem' }}>
                      <span>*Komisi Platform 3% (dipotong dari penjual):</span>
                      <span>(Rp {commissionFee.toLocaleString('id-ID')})</span>
                    </div>
                    <div className="fee-row total">
                      <span>Total Pembayaran:</span>
                      <span style={{ color: 'var(--forest-900)' }}>Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setOrderingListing(null)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  <CheckCircle2 size={16} /> Ajukan Pesanan
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
