import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Calendar, 
  Wheat, 
  Egg, 
  Scale, 
  Sparkles, 
  Clock, 
  Share2, 
  HelpCircle,
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';
import { WhatsAppActionModal } from './WhatsAppActionModal';
import { CornListing, EggListing } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductDetail, 
    closeProductDetail, 
    cornListings, 
    eggListings, 
    currentUser, 
    createCornOrder, 
    createEggOrder,
    openProductDetail,
    setActiveTab
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState<'specs' | 'producer' | 'escrow' | 'reviews'>('specs');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Order Form State
  const [orderQuantity, setOrderQuantity] = useState<number>(500);
  const [enableNego, setEnableNego] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState<number>(0);
  const [deliveryMethod, setDeliveryMethod] = useState<'Ambil Sendiri' | 'Diantar Penjual'>('Diantar Penjual');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser.address || 'Kec. Palu Barat, Kota Palu');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // WhatsApp modal state
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

  if (!selectedProductDetail) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Produk Tidak Ditemukan</h2>
        <p style={{ color: 'var(--slate-500)', marginTop: '8px' }}>Silakan pilih produk dari katalog pasar terlebih dahulu.</p>
        <button className="btn btn-primary" onClick={closeProductDetail} style={{ marginTop: '16px' }}>
          Kembali ke Pasar
        </button>
      </div>
    );
  }

  const isCorn = selectedProductDetail.type === 'corn';
  const cornItem: CornListing | undefined = isCorn ? cornListings.find(c => c.id === selectedProductDetail.id) || cornListings[0] : undefined;
  const eggItem: EggListing | undefined = !isCorn ? eggListings.find(e => e.id === selectedProductDetail.id) || eggListings[0] : undefined;

  const title = isCorn ? `Jagung Pipil Kering ${cornItem?.district || 'Sigi'}` : `Telur Ayam Ras Segar Grade A`;
  const code = isCorn ? cornItem?.code : eggItem?.code;
  const sellerName = isCorn ? cornItem?.farmerName : eggItem?.farmerName;
  const sellerPhone = isCorn ? cornItem?.farmerPhone : eggItem?.farmerPhone;
  const village = isCorn ? cornItem?.village : eggItem?.village;
  const district = isCorn ? cornItem?.district : eggItem?.district;
  const price = isCorn ? (cornItem?.pricePerKg || 5000) : (eggItem?.pricePerUnit || 52000);
  const unit = isCorn ? 'kg' : (eggItem?.unitType?.includes('Rak') ? 'rak' : 'kg');
  const remainingStock = isCorn ? (cornItem?.remainingKg || 0) : (eggItem?.dailyCapacity ? eggItem.dailyCapacity * 2 : 150);
  const totalStock = isCorn ? (cornItem?.quantityKg || 0) : (eggItem?.dailyCapacity ? eggItem.dailyCapacity * 3 : 200);
  const description = isCorn ? cornItem?.description : eggItem?.description;
  const harvestDate = isCorn ? cornItem?.harvestDate : 'Panen Segar Harian';
  const images = (isCorn ? cornItem?.images : eggItem?.images) || [
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&auto=format&fit=crop&q=80'
  ];

  // Set initial negotiation and order quantity based on item
  React.useEffect(() => {
    if (isCorn) {
      setOrderQuantity(Math.min(1000, remainingStock || 500));
      setOfferedPrice(cornItem?.pricePerKg || 5200);
    } else {
      setOrderQuantity(Math.min(30, remainingStock || 10));
      setOfferedPrice(eggItem?.pricePerUnit || 52000);
    }
  }, [selectedProductDetail.id, isCorn]);

  // Calculations
  const activeUnitPrice = enableNego && offeredPrice > 0 ? offeredPrice : price;
  const subtotal = orderQuantity * activeUnitPrice;
  const deliveryFee = deliveryMethod === 'Diantar Penjual' ? (isCorn ? 150000 : 50000) : 0;
  const totalOrderAmount = subtotal + deliveryFee;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuantity <= 0 || orderQuantity > remainingStock) {
      alert(`Jumlah pesanan harus antara 1 dan ${remainingStock.toLocaleString()} ${unit}`);
      return;
    }

    if (isCorn && cornItem) {
      createCornOrder(
        cornItem.id,
        orderQuantity,
        deliveryMethod,
        deliveryAddress,
        enableNego ? offeredPrice : undefined
      );
    } else if (!isCorn && eggItem) {
      createEggOrder(
        eggItem.id,
        orderQuantity,
        deliveryMethod,
        deliveryAddress
      );
    }

    setOrderSuccess(true);

    setWaModalData({
      isOpen: true,
      recipientName: sellerName || 'Penjual',
      recipientPhone: sellerPhone || '',
      defaultMessage: `Halo ${sellerName}, saya ${currentUser.name} (${currentUser.businessName || currentUser.role}). Saya baru saja membuat pesanan ${isCorn ? 'pakan jagung' : 'telur segar'} ${orderQuantity.toLocaleString()} ${unit} (${code}) melalui Rekening Bersama SaudAgro Platform. Mohon diproses ya Pak/Bu. Terima kasih!`,
      actionTitle: 'Kirim Konfirmasi Order via WhatsApp'
    });
  };

  // Related products
  const relatedCorn = cornListings.filter(c => c.id !== selectedProductDetail.id).slice(0, 3);
  const relatedEggs = eggListings.filter(e => e.id !== selectedProductDetail.id).slice(0, 3);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 24px 80px 24px' }}>
      
      {/* Top Navigation & Breadcrumbs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
          <button 
            onClick={closeProductDetail}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'var(--slate-700)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowLeft size={16} />
            Kembali ke {isCorn ? 'Pasar Jagung Sigi' : 'Pasar Telur Palu'}
          </button>
          <span>/</span>
          <span>{isCorn ? 'Komoditas Jagung Pipil' : 'Komoditas Telur Ayam Ras'}</span>
          <span>/</span>
          <span style={{ color: 'var(--slate-900)', fontWeight: 700 }}>{code}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Tautan spesifikasi produk disalin ke clipboard!');
              }
            }}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--slate-600)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Share2 size={14} />
            Bagikan Lot
          </button>
        </div>
      </div>

      {/* Main 2-Column Hero: Left Gallery & QC, Right Info & Order Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: '28px', alignItems: 'start', marginBottom: '36px' }}>
        
        {/* LEFT COLUMN: Gallery & Quality Certifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Main Visual Image Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ position: 'relative', width: '100%', height: '360px', background: '#0F172A' }}>
              <img 
                src={images[selectedImageIndex] || images[0]} 
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Badges Overlay */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: '#0F172A', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                  {code}
                </span>

                {isCorn && (
                  <span style={{
                    background: (cornItem?.moistureLevel || 14) <= 14 ? '#047857' : '#D97706',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Sparkles size={12} />
                    KA {cornItem?.moistureLevel}% ({(cornItem?.moistureLevel || 14) <= 14 ? 'Standar Pakan Aman' : 'Perlu Dijemur'})
                  </span>
                )}

                {!isCorn && (
                  <span style={{
                    background: '#047857',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Egg size={12} />
                    {eggItem?.grade || 'Grade A Super'} (60-65g/butir)
                  </span>
                )}
              </div>

              {/* Verification Watermark */}
              <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#34D399" />
                QC Terverifikasi SaudAgro Pasigala
              </div>
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', padding: '14px 18px', background: '#F8FAFC', borderTop: '1px solid var(--border-subtle)' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '64px',
                      height: '52px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid #047857' : '1px solid var(--border-subtle)',
                      padding: 0,
                      cursor: 'pointer',
                      opacity: selectedImageIndex === idx ? 1 : 0.65,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* QC Inspection & Traceability Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontWeight: 800, fontSize: '0.90rem' }}>
              <ShieldCheck size={20} />
              Lembar Hasil Uji Mutu Fisik & Traceability
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--slate-500)', fontWeight: 600 }}>METODE PENGERINGAN / PANEN</div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '3px' }}>
                  {isCorn ? 'Jemur Terik Alami (Lantai Semen)' : 'Panen Segar Harian (Kandang Baterai)'}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--slate-500)', fontWeight: 600 }}>TANGGAL PANEN AKTIF</div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '3px' }}>
                  {harvestDate} (Segar Siap Kirim)
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--slate-500)', fontWeight: 600 }}>KEMASAN LOGISTIK</div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '3px' }}>
                  {isCorn ? 'Karung PP Bersih 50 Kg' : 'Rak Karton Tebal (30 Butir/Rak)'}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--slate-500)', fontWeight: 600 }}>STANDAR PENYERAPAN</div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#047857', marginTop: '3px' }}>
                  {isCorn ? 'Lolos Pakan Mandiri SNI 4483' : 'Bebas Retak & Bersih Tanpa Noda'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
              🛡️ <strong>Jaminan Bebas Resiko:</strong> Jika kualitas fisik barang saat tiba tidak sesuai kadar air/grade yang tertera, pembeli berhak mengajukan retur atau penyesuaian harga melalui Rekening Bersama SaudAgro.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Info, Seller Bio & Escrow Order Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Info Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            
            {/* Title & Location Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontSize: '0.78rem', fontWeight: 700 }}>
                {isCorn ? <Wheat size={16} /> : <Egg size={16} />}
                <span>{isCorn ? 'Komoditas Pertanian Sigi' : 'Komoditas Peternakan Layer Palu'}</span>
              </div>
              
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', margin: '6px 0 8px 0', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                {title} — {sellerName}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                <MapPin size={15} color="#64748B" />
                <span>{village}, {district}</span>
              </div>
            </div>

            {/* Price Row */}
            <div style={{ margin: '18px 0', padding: '14px 18px', background: '#F0FDF4', borderRadius: '12px', border: '1px solid #DCFCE7', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>Harga Satuan Transparan</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#047857', letterSpacing: '-0.02em' }}>
                  Rp {price.toLocaleString('id-ID')}
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#166534' }}> /{unit}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.70rem', color: '#166534', fontWeight: 600 }}>Tersedia Siap Kirim</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {remainingStock.toLocaleString()} {unit}
                </div>
              </div>
            </div>

            {/* Stock Progress Meter */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--slate-500)', marginBottom: '5px' }}>
                <span>Ketersediaan Stok Lot:</span>
                <span><strong>{remainingStock.toLocaleString()}</strong> dari {totalStock.toLocaleString()} {unit}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${Math.min(100, Math.max(10, (remainingStock / (totalStock || 1)) * 100))}%`, 
                    height: '100%', 
                    background: '#047857', 
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            </div>

            {/* Producer Badge & Verified Seller Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #EEF2F6',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#047857', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.92rem' }}>
                  {sellerName?.charAt(0) || 'P'}
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {sellerName}
                    <CheckCircle2 size={14} color="#047857" />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                    Mitra Terverifikasi SaudAgro • Rating 4.9 (38+ Ulasan)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setWaModalData({
                    isOpen: true,
                    recipientName: sellerName || 'Petani',
                    recipientPhone: sellerPhone || '',
                    defaultMessage: `Halo ${sellerName}, saya ingin bertanya tentang stok ${title} (${code}) di SaudAgro. Apakah masih ready?`,
                    actionTitle: 'Tanya Petani via WhatsApp'
                  });
                }}
                className="btn btn-wa btn-sm"
                style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: '8px' }}
              >
                💬 Chat WA
              </button>
            </div>

            {/* ORDER CHECKOUT FORM (GARANSI ESCROW) */}
            <form onSubmit={handleCreateOrder} style={{ borderTop: '1px solid #EEF2F6', paddingTop: '18px' }}>
              <div style={{ fontSize: '0.90rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scale size={18} color="#047857" />
                Simulasi Pemesanan & Rekening Bersama (Escrow)
              </div>

              {/* Quantity Input */}
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Jumlah Pembelian ({unit}):</label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                    Min order: {isCorn ? '50 Kg' : '5 Rak'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="number" 
                    className="form-input" 
                    min={isCorn ? 50 : 1} 
                    max={remainingStock} 
                    step={isCorn ? 50 : 1}
                    value={orderQuantity}
                    onChange={e => setOrderQuantity(Number(e.target.value))}
                    required
                    style={{ fontWeight: 800, fontSize: '0.95rem' }}
                  />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--slate-600)' }}>{unit.toUpperCase()}</span>
                </div>
              </div>

              {/* Nego Checkbox */}
              <div style={{ background: '#FFFBEB', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FDE68A', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={enableNego} 
                    onChange={e => setEnableNego(e.target.checked)} 
                    style={{ accentColor: '#D97706' }}
                  />
                  Ajukan Penawaran Harga Khusus B2B (Nego)
                </label>

                {enableNego && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.80rem', fontWeight: 700, color: '#92400E' }}>Tawaran: Rp</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      step={isCorn ? 50 : 500}
                      value={offeredPrice} 
                      onChange={e => setOfferedPrice(Number(e.target.value))}
                      style={{ width: '130px', padding: '4px 8px', fontSize: '0.82rem' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#92400E' }}>/{unit}</span>
                  </div>
                )}
              </div>

              {/* Delivery Method */}
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Metode Pengiriman:</label>
                <select 
                  className="form-select" 
                  value={deliveryMethod}
                  onChange={e => setDeliveryMethod(e.target.value as any)}
                >
                  <option value="Diantar Penjual">Diantar oleh Armada Penjual (+Ongkir Rp {deliveryFee.toLocaleString('id-ID')})</option>
                  <option value="Ambil Sendiri">Ambil Sendiri di Lokasi Petani (Gratis Ongkir)</option>
                </select>
              </div>

              {/* Delivery Address */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Alamat Pengiriman Tujuan:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Contoh: Jl. Munif Rahman No. 8, Palu Barat"
                  required
                />
              </div>

              {/* Price Calculation Summary Box */}
              <div style={{ background: '#F8FAFC', border: '1px solid #EEF2F6', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '0.80rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--slate-600)' }}>
                  <span>Subtotal ({orderQuantity.toLocaleString()} {unit} x Rp {activeUnitPrice.toLocaleString('id-ID')}):</span>
                  <span style={{ fontWeight: 700 }}>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--slate-600)' }}>
                  <span>Ongkos Kirim Armada:</span>
                  <span style={{ fontWeight: 700 }}>{deliveryFee === 0 ? 'Gratis' : `Rp ${deliveryFee.toLocaleString('id-ID')}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#047857' }}>
                  <span>Proteksi Rekber Escrow SaudAgro (1%):</span>
                  <span style={{ fontWeight: 700 }}>Gratis (Subsidi Platform)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #CBD5E1', paddingTop: '8px', fontSize: '0.94rem', fontWeight: 900, color: 'var(--slate-900)' }}>
                  <span>Total Transaksi Aman:</span>
                  <span style={{ color: '#047857' }}>Rp {totalOrderAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={remainingStock <= 0}
                  style={{
                    padding: '12px 18px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <ShieldCheck size={18} />
                  {remainingStock <= 0 ? 'Stok Telah Habis' : 'Pesan Sekarang — Garansi Escrow Aman'}
                </button>

                {!isCorn && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('contracts')}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #047857',
                      color: '#047857',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={16} />
                    Ajukan Kontrak Pasokan Rutin B2B (Harga Terkunci)
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Tabs Section for Deep Dive Info */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '36px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: '#F8FAFC', overflowX: 'auto' }}>
          {[
            { id: 'specs', label: 'Spesifikasi & Uji Mutu' },
            { id: 'producer', label: 'Tentang Produsen & Kebun/Kandang' },
            { id: 'escrow', label: 'Mekanisme Rekber Escrow SaudAgro' },
            { id: 'reviews', label: 'Ulasan Pembeli Terverifikasi' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabSection(tab.id as any)}
              style={{
                border: 'none',
                background: activeTabSection === tab.id ? '#FFFFFF' : 'transparent',
                color: activeTabSection === tab.id ? '#047857' : 'var(--slate-600)',
                fontWeight: activeTabSection === tab.id ? 800 : 600,
                fontSize: '0.86rem',
                padding: '14px 22px',
                cursor: 'pointer',
                borderBottom: activeTabSection === tab.id ? '3px solid #047857' : '3px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '24px 28px' }}>
          {activeTabSection === 'specs' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: 0, marginBottom: '12px' }}>
                Deskripsi & Parameter Kualitas
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-700)', lineHeight: 1.6, marginBottom: '20px' }}>
                {description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {isCorn ? (
                  <>
                    <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>KADAR AIR AKTIF</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#047857', marginTop: '2px' }}>
                        {cornItem?.moistureLevel}% (Sangat Kering & Bebas Jamur)
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>BENTUK KOMODITAS</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '2px' }}>
                        {cornItem?.cornForm || 'Pipil Kering'}
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>KEMURNIAN & KEBERSIHAN</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '2px' }}>
                        99.2% Bersih dari Tongkol & Batu
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>GRADE & BOBOT BUTIR</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#047857', marginTop: '2px' }}>
                        Grade A Super (60 - 65 Gram / Butir)
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>ASUPAN RANSUM LAYER</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '2px' }}>
                        Formula Mandiri Jagung Sigi + Bebas Antibiotik AGP
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>UMUR SIMPAN MAKSIMAL</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '2px' }}>
                        30 Hari pada Suhu Ruang Sejuk
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTabSection === 'producer' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#047857', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem' }}>
                  {sellerName?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                    {sellerName}
                  </h3>
                  <p style={{ fontSize: '0.80rem', color: 'var(--slate-500)', margin: '3px 0 0 0' }}>
                    {village}, {district} • Anggota Rantai Pasok Terverifikasi Pasigala
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.86rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
                {isCorn 
                  ? 'Petani jagung hibrida binaan Sigi sejak 2012. Menerapkan pengeringan terik matahari alami di lantai semen khusus sehingga bebas dari kontaminasi tanah dan aflatoksin. Siap melayani pengiriman langsung ke peternak ayam petelur di Palu dan Donggala.'
                  : 'Peternakan ayam petelur mandiri dengan populasi 6.000 ekor layer di Palu Barat. Memproduksi telur segar harian berkualitas tinggi dengan pakan mandiri kaya nutrisi dari jagung lokal Sigi. Pasokan konsisten untuk UMKM bakery dan katering.'}
              </p>
            </div>
          )}

          {activeTabSection === 'escrow' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: 0, marginBottom: '8px' }}>
                Alur Transaksi Aman & Terlindungi (Garansi 100%)
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', marginBottom: '20px' }}>
                Platform SaudAgro melindungi dana Anda di Rekening Bersama resmi hingga barang diterima dan dicek secara fisik:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #EEF2F6' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#047857', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.80rem', marginBottom: '8px' }}>1</div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--slate-900)', display: 'block', marginBottom: '4px' }}>Pemesanan & Titip Dana</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Pembeli transfer ke Rekening Bersama SaudAgro. Dana aman tersimpan.</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #EEF2F6' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#047857', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.80rem', marginBottom: '8px' }}>2</div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--slate-900)', display: 'block', marginBottom: '4px' }}>Petani Kirim Barang</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Petani menerima konfirmasi dan mengirimkan komoditas sesuai jadwal.</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #EEF2F6' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#047857', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.80rem', marginBottom: '8px' }}>3</div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--slate-900)', display: 'block', marginBottom: '4px' }}>Pemeriksaan Mutu (QC)</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Pembeli memeriksa kadar air / fisik telur di lokasi penerimaan.</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #EEF2F6' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#047857', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.80rem', marginBottom: '8px' }}>4</div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--slate-900)', display: 'block', marginBottom: '4px' }}>Pencairan Dana Otomatis</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Setelah pembeli klik "Konfirmasi Terima", dana langsung cair ke petani.</span>
                </div>
              </div>
            </div>
          )}

          {activeTabSection === 'reviews' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#047857' }}>4.9</div>
                <div>
                  <div style={{ color: '#F59E0B', fontSize: '0.90rem' }}>★★★★★</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)' }}>Berdasarkan 38 transaksi selesai di Pasigala</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--slate-900)' }}>Bu Rahmawati (Peternak Palu)</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>2 hari lalu</span>
                  </div>
                  <p style={{ fontSize: '0.80rem', color: 'var(--slate-600)', margin: 0 }}>
                    "Jagung pipilnya sangat kering dan bersih, kadar air pas 13.5% waktu dicek moisture meter di kandang Balaroa. Ayam-ayam nafsu makan dan produksi telur stabil!"
                  </p>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #EEF2F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--slate-900)' }}>Dilla Bakery (UMKM Palu Timur)</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>1 minggu lalu</span>
                  </div>
                  <p style={{ fontSize: '0.80rem', color: 'var(--slate-600)', margin: 0 }}>
                    "Kuning telurnya pekat dan segar sekali untuk adonan roti manis. Tidak ada yang pecah saat pengiriman. Sangat puas dengan layanan SaudAgro."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products in Pasigala */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
              Komoditas Terkait di Sekitar Sigi, Palu & Donggala
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: '3px 0 0 0' }}>
              Bandingkan penawaran lain dari petani dan peternak terverifikasi
            </p>
          </div>
          <button 
            type="button" 
            onClick={closeProductDetail}
            style={{ fontSize: '0.78rem', fontWeight: 700, color: '#047857', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Lihat Semua →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {isCorn && relatedCorn.map(c => (
            <div
              key={c.id}
              onClick={() => openProductDetail('corn', c.id)}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ height: '140px', position: 'relative' }}>
                <img src={c.images?.[0]} alt={c.code} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#0F172A', color: '#FFF', fontSize: '0.66rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  {c.code}
                </span>
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)' }}>{c.farmerName}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{c.village}, {c.district}</div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#047857', marginTop: '8px' }}>
                  Rp {c.pricePerKg.toLocaleString('id-ID')} /kg
                </div>
              </div>
            </div>
          ))}

          {!isCorn && relatedEggs.map(e => (
            <div
              key={e.id}
              onClick={() => openProductDetail('egg', e.id)}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={el => (el.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={el => (el.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ height: '140px', position: 'relative' }}>
                <img src={e.images?.[0]} alt={e.code} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#0F172A', color: '#FFF', fontSize: '0.66rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  {e.code}
                </span>
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)' }}>{e.farmerName}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{e.village}, {e.district}</div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#047857', marginTop: '8px' }}>
                  Rp {e.pricePerUnit.toLocaleString('id-ID')} /{e.unitType.includes('Rak') ? 'rak' : 'kg'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppActionModal 
        isOpen={waModalData.isOpen}
        onClose={() => setWaModalData({ ...waModalData, isOpen: false })}
        recipientName={waModalData.recipientName}
        recipientPhone={waModalData.recipientPhone}
        defaultMessage={waModalData.defaultMessage}
        actionTitle={waModalData.actionTitle}
      />
    </div>
  );
};
