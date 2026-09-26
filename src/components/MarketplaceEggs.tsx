import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { EggListing, EggGrade, EggUnitType, ContractFrequency, District } from '../types';
import gsap from 'gsap';
import { 
  Egg, 
  Search, 
  MapPin, 
  ShieldCheck, 
  PlusCircle, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  X,
  FileCheck2,
  Package,
  Sparkles
} from 'lucide-react';
import { WhatsAppActionModal } from './WhatsAppActionModal';

export const MarketplaceEggs: React.FC = () => {
  const { 
    currentUser, 
    eggListings, 
    createEggOrder, 
    createB2BContract, 
    createEggListing 
  } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const filteredListings = eggListings.filter(item => {
    const matchesSearch = item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = selectedUnit === 'all' || item.unitType === selectedUnit;
    const matchesGrade = selectedGrade === 'all' || item.grade.includes(selectedGrade);
    return matchesSearch && matchesUnit && matchesGrade;
  });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.egg-card-item'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [selectedUnit, selectedGrade, searchQuery]);

  // Order / Contract Modal
  const [activeListing, setActiveListing] = useState<EggListing | null>(null);
  const [orderMode, setOrderMode] = useState<'one_off' | 'contract'>('contract');

  // One-off State
  const [oneOffQuantity, setOneOffQuantity] = useState<number>(20);
  const [oneOffDeliveryMethod, setOneOffDeliveryMethod] = useState<'Ambil Sendiri' | 'Diantar Penjual'>('Diantar Penjual');
  const [oneOffAddress, setOneOffAddress] = useState(currentUser.address || '');

  // Contract State
  const [contractVolume, setContractVolume] = useState<number>(50);
  const [contractFrequency, setContractFrequency] = useState<ContractFrequency>('Mingguan');
  const [contractDurationMonths, setContractDurationMonths] = useState<number>(3);
  const [contractPricePerUnit, setContractPricePerUnit] = useState<number>(51000);
  const [contractStartDate, setContractStartDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [contractAddress, setContractAddress] = useState(currentUser.address || '');
  const [contractDeliveryMethod, setContractDeliveryMethod] = useState<'Diantar Peternak' | 'Diambil UMKM'>('Diantar Peternak');

  // Create Listing Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGrade, setNewGrade] = useState<EggGrade>('Grade A (Utuh Bersih 60-65g)');
  const [newUnitType, setNewUnitType] = useState<EggUnitType>('Rak / Tray (30 Butir)');
  const [newPrice, setNewPrice] = useState<number>(52000);
  const [newDailyCapacity, setNewDailyCapacity] = useState<number>(150);
  const [newMinOrder, setNewMinOrder] = useState<number>(5);
  const [newDistrict, setNewDistrict] = useState<District>(currentUser.district || 'Kota Palu');
  const [newVillage, setNewVillage] = useState(currentUser.village || 'Balaroa, Palu Barat');
  const [newDesc, setNewDesc] = useState('');

  // WhatsApp Modal
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



  const handleOneOffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeListing) return;

    createEggOrder(
      activeListing.id,
      oneOffQuantity,
      oneOffDeliveryMethod,
      oneOffAddress
    );

    const savedListing = activeListing;
    setActiveListing(null);

    setWaModalData({
      isOpen: true,
      recipientName: savedListing.farmerName,
      recipientPhone: savedListing.farmerPhone,
      defaultMessage: `Halo ${savedListing.farmerName}, saya ${currentUser.name} (${currentUser.businessName || 'UMKM Palu'}). Saya baru saja membuat pesanan grosir telur ${oneOffQuantity} ${savedListing.unitType} melalui Saudagro. Mohon bantuannya untuk disiapkan ya. Terima kasih!`,
      actionTitle: 'Kirim Notifikasi Order Telur via WhatsApp'
    });
  };

  const handleContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeListing) return;

    createB2BContract({
      listingId: activeListing.id,
      volumePerCycle: contractVolume,
      frequency: contractFrequency,
      durationMonths: contractDurationMonths,
      pricePerUnit: contractPricePerUnit,
      startDate: contractStartDate,
      deliveryAddress: contractAddress,
      deliveryMethod: contractDeliveryMethod,
      termsNotes: 'Pengiriman rutin pagi hari. Garansi retur bila ada telur retak/pecah dalam 24 jam.'
    });

    const savedListing = activeListing;
    setActiveListing(null);

    setWaModalData({
      isOpen: true,
      recipientName: savedListing.farmerName,
      recipientPhone: savedListing.farmerPhone,
      defaultMessage: `Halo ${savedListing.farmerName}, saya ${currentUser.name} (${currentUser.businessName || 'UMKM Palu'}). Saya baru saja mengaktifkan KONTRAK PASOKAN RUTIN B2B (${contractVolume} ${savedListing.unitType}/${contractFrequency}) selama ${contractDurationMonths} bulan di harga Rp ${contractPricePerUnit.toLocaleString('id-ID')} via Saudagro.`,
      actionTitle: 'Kirim Akad Kontrak B2B via WhatsApp'
    });
  };

  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEggListing({
      grade: newGrade,
      unitType: newUnitType,
      pricePerUnit: newPrice,
      dailyCapacity: newDailyCapacity,
      minOrder: newMinOrder,
      district: newDistrict,
      village: newVillage,
      deliveryOptions: ['Ambil di Peternakan', 'Diantar ke Lokasi UMKM'],
      description: newDesc || `Telur ayam ras ${newGrade} segar panen pagi dari kandang ${newVillage}. Kualitas terjamin untuk kebutuhan UMKM bakery/catering.`
    });
    setShowCreateModal(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 60px 24px' }} ref={containerRef}>
      {/* Clean Page Hero */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Pasar Telur Utuh & Kontrak Pasokan B2B
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            {currentUser.role === 'UMKM_BUYER' 
              ? 'Pengadaan pasokan telur segar Grade A langsung dari peternak Palu Barat dengan kontrak harga terkunci (Rp 51.000/rak).'
              : currentUser.role === 'EGG_FARMER'
              ? 'Etalase pasokan telur kandang Anda untuk melayani pesanan spot dan akad kontrak langganan rutin UMKM kuliner Palu.'
              : 'Informasi pasokan komoditas telur ayam ras segar kawasan Palu Barat dan Kota Palu.'}
          </p>
        </div>

        <div>
          {(currentUser.role === 'EGG_FARMER' || currentUser.role === 'ADMIN') && (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PlusCircle size={16} />
              Pasang Stok Pasokan Telur
            </button>
          )}

          {currentUser.role === 'UMKM_BUYER' && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '6px 14px', borderRadius: '8px', fontSize: '0.76rem', color: '#1D4ED8', fontWeight: 700 }}>
              Mode Pembeli UMKM • Ajukan Kontrak atau Pesan Spot di Bawah
            </div>
          )}

          {currentUser.role === 'CORN_FARMER' && (
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.76rem', color: 'var(--slate-600)', fontWeight: 600 }}>
              Mode Pantau Acuan Harga Hilir Peternak
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
            placeholder="Cari peternakan, kelurahan, atau grade..." 
            style={{ width: '100%', paddingLeft: '34px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ flex: '0 1 200px' }}>
          <select 
            className="form-select" 
            value={selectedUnit} 
            onChange={e => setSelectedUnit(e.target.value)}
            style={{ width: '100%', padding: '7px 12px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
          >
            <option value="all">Semua Satuan (Rak / Kg)</option>
            <option value="Rak / Tray (30 Butir)">Per Rak / Tray (30 Butir)</option>
            <option value="Kilogram (Kg)">Per Kilogram (Kg)</option>
          </select>
        </div>

        <div style={{ flex: '0 1 200px' }}>
          <select 
            className="form-select" 
            value={selectedGrade} 
            onChange={e => setSelectedGrade(e.target.value)}
            style={{ width: '100%', padding: '7px 12px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
          >
            <option value="all">Semua Grade Kualitas</option>
            <option value="Grade A">Grade A (Utuh Bersih 60-65g)</option>
            <option value="Grade Standar">Grade Standar (55-60g)</option>
          </select>
        </div>
      </div>

      {/* Egg Listings Grid - Compact & Responsive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredListings.map(item => (
          <div key={item.id} className="card egg-card-item" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div className="card-img-wrapper">
              <img 
                src={item.images[0]} 
                alt={item.code} 
                className="card-img"
              />
              <div className="card-img-tags">
                <span className="badge" style={{ background: 'rgba(15, 23, 42, 0.85)', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 700 }}>
                  {item.code}
                </span>
                <span className="badge" style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.68rem', fontWeight: 700 }}>
                  <Sparkles size={10} /> {item.grade.split('(')[0]}
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: '6px', right: '6px' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--slate-800)', fontSize: '0.68rem', fontWeight: 700 }}>
                  {item.unitType}
                </span>
              </div>
            </div>

            <div className="card-body">
              <div>
                <div className="card-farmer-info">
                  <div className="card-farmer-name">
                    {item.farmerName}
                    <span title="Peternak Terverifikasi"><ShieldCheck size={14} style={{ color: '#047857' }} /></span>
                  </div>
                </div>

                <div className="card-location">
                  <MapPin size={12} /> {item.village}, {item.district}
                </div>

                <p className="card-desc">
                  {item.description}
                </p>

                <div className="card-data-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ color: 'var(--slate-500)' }}>Kapasitas Harian:</span>
                    <strong>~{item.dailyCapacity} {item.unitType}/hari</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--slate-500)' }}>Minimal Order:</span>
                    <span>{item.minOrder} {item.unitType}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="card-price-row">
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Harga Satuan:</span>
                  <span className="card-price-value">
                    Rp {item.pricePerUnit.toLocaleString('id-ID')}
                    <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--slate-500)' }}> /{item.unitType.includes('Rak') ? 'rak' : 'kg'}</span>
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
                        defaultMessage: `Halo ${item.farmerName}, saya ingin menanyakan ketersediaan pasokan telur ${item.code} (${item.unitType}) untuk usaha saya.`,
                        actionTitle: 'Tanya Peternak via WhatsApp'
                      });
                    }}
                    title="Chat Peternak via WhatsApp"
                    style={{ padding: '6px 10px', borderRadius: '7px' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.079-1.85-.426-1.505-.625-2.476-2.15-2.551-2.25-.074-.1-1.17-1.558-1.17-2.971 0-1.413.738-2.108 1.002-2.397.264-.289.576-.361.768-.361.192 0 .384.002.552.01.178.009.418-.068.653.498.24.577.817 1.996.889 2.14.072.145.12.313.024.505-.096.192-.144.312-.288.481-.144.168-.303.376-.433.504-.144.145-.295.302-.127.591.168.289.747 1.232 1.604 1.995 1.102.981 2.032 1.285 2.32 1.43.289.144.457.12.625-.073.168-.192.72-.842.912-1.13.192-.289.384-.24.649-.144.264.096 1.681.793 1.969.937.288.145.48.217.552.337.072.12.072.72-.072 1.125zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.399A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.15-.44-4.46-1.22l-.32-.19-2.96.83.82-2.88-.21-.34A8.16 8.16 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
                    </svg>
                  </button>

                  <button 
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      setActiveListing(item);
                      setContractPricePerUnit(item.pricePerUnit - 1000);
                      setOneOffQuantity(Math.max(item.minOrder, 20));
                    }}
                    style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '7px', fontWeight: 700 }}
                  >
                    <FileCheck2 size={14} /> Pesan / Kontrak B2B
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order / Contract Modal */}
      {activeListing && (
        <div className="modal-overlay" onClick={() => setActiveListing(null)}>
          <div 
            className="modal-card" 
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '620px', padding: '24px 28px', maxHeight: '92vh', overflowY: 'auto' }}
          >
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  Pesan Telur — {activeListing.farmerName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '4px 0 0 0' }}>
                  {activeListing.code} • {activeListing.grade} ({activeListing.village})
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveListing(null)}>
                <X size={16} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', background: 'var(--slate-100)', padding: '4px', borderRadius: '10px', marginBottom: '18px', gap: '4px' }}>
              <button 
                type="button" 
                className={`btn btn-full btn-sm ${orderMode === 'contract' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 700, borderRadius: '8px' }}
                onClick={() => setOrderMode('contract')}
              >
                <FileCheck2 size={15} />
                Kontrak Rutin B2B (Disarankan)
              </button>
              <button 
                type="button" 
                className={`btn btn-full btn-sm ${orderMode === 'one_off' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 700, borderRadius: '8px' }}
                onClick={() => setOrderMode('one_off')}
              >
                <Package size={15} />
                Sekali Beli (Spot)
              </button>
            </div>

            {orderMode === 'contract' ? (
              <form onSubmit={handleContractSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Volume per Pengiriman ({activeListing.unitType}):</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min={activeListing.minOrder}
                      value={contractVolume}
                      onChange={e => setContractVolume(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Frekuensi Pasokan:</label>
                    <select 
                      className="form-select" 
                      value={contractFrequency}
                      onChange={e => setContractFrequency(e.target.value as ContractFrequency)}
                    >
                      <option value="Harian">Harian (Setiap Hari Pagi)</option>
                      <option value="2x Seminggu">2x Seminggu (Senin & Kamis)</option>
                      <option value="Mingguan">Mingguan (Setiap Sabtu)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Durasi Kontrak:</label>
                    <select 
                      className="form-select" 
                      value={contractDurationMonths}
                      onChange={e => setContractDurationMonths(Number(e.target.value))}
                    >
                      <option value={1}>1 Bulan (Uji Coba)</option>
                      <option value={3}>3 Bulan (Rekomendasi Hemat)</option>
                      <option value={6}>6 Bulan (Jangka Panjang)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Harga Kesepakatan (Rp/{activeListing.unitType.includes('Rak') ? 'Rak' : 'Kg'}):</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      step={500}
                      value={contractPricePerUnit}
                      onChange={e => setContractPricePerUnit(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Mulai Tanggal:</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={contractStartDate}
                      onChange={e => setContractStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Metode Logistik:</label>
                    <select 
                      className="form-select" 
                      value={contractDeliveryMethod}
                      onChange={e => setContractDeliveryMethod(e.target.value as any)}
                    >
                      <option value="Diantar Peternak">Diantar Peternak ke Dapur UMKM</option>
                      <option value="Diambil UMKM">Diambil Sendiri oleh UMKM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Dapur UMKM:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Alamat lengkap lokasi pengiriman..."
                    value={contractAddress}
                    onChange={e => setContractAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Calculation breakdown */}
                {(() => {
                  const cycleValue = contractVolume * contractPricePerUnit;
                  const commissionFee = Math.round(cycleValue * 0.05);
                  let cyclesCount = 12;
                  if (contractFrequency === 'Harian') cyclesCount = contractDurationMonths * 30;
                  else if (contractFrequency === '2x Seminggu') cyclesCount = contractDurationMonths * 8;
                  else cyclesCount = contractDurationMonths * 4;

                  const totalValue = cycleValue * cyclesCount;

                  return (
                    <div className="fee-calc-box">
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                        Kalkulasi Nilai Kontrak Pasokan (Komisi 5%):
                      </div>
                      <div className="fee-row">
                        <span>Nilai per Batch ({contractVolume} {activeListing.unitType}):</span>
                        <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Rp {cycleValue.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="fee-row">
                        <span>Total Siklus Pengiriman:</span>
                        <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{cyclesCount} Kali Kirim</span>
                      </div>
                      <div className="fee-row" style={{ color: 'var(--slate-500)', fontSize: '0.74rem' }}>
                        <span>*Komisi Platform 5% Telur:</span>
                        <span>(Rp {commissionFee.toLocaleString('id-ID')} /batch)</span>
                      </div>
                      <div className="fee-row total">
                        <span>Estimasi Total Nilai Kontrak:</span>
                        <span style={{ color: '#047857' }}>Rp {totalValue.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }} onClick={() => setActiveListing(null)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '10px', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <FileCheck2 size={16} /> Aktifkan Akad Kontrak
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOneOffSubmit}>
                <div className="form-group">
                  <label className="form-label">Jumlah Pembelian ({activeListing.unitType}):</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min={activeListing.minOrder}
                    value={oneOffQuantity}
                    onChange={e => setOneOffQuantity(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Metode Pengiriman:</label>
                  <select 
                    className="form-select" 
                    value={oneOffDeliveryMethod}
                    onChange={e => setOneOffDeliveryMethod(e.target.value as any)}
                  >
                    <option value="Diantar Penjual">Diantar Peternak (+Ongkir Rp 50.000)</option>
                    <option value="Ambil Sendiri">Ambil Sendiri di Peternakan (Gratis)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Pengiriman:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Alamat lengkap tujuan..."
                    value={oneOffAddress}
                    onChange={e => setOneOffAddress(e.target.value)}
                    required
                  />
                </div>

                {(() => {
                  const subtotal = oneOffQuantity * activeListing.pricePerUnit;
                  const deliveryFee = oneOffDeliveryMethod === 'Diantar Penjual' ? 50000 : 0;
                  const total = subtotal + deliveryFee;

                  return (
                    <div className="fee-calc-box">
                      <div className="fee-row">
                        <span>Harga Telur ({oneOffQuantity} {activeListing.unitType}):</span>
                        <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="fee-row">
                        <span>Biaya Pengiriman:</span>
                        <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Rp {deliveryFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="fee-row total">
                        <span>Total Bayar:</span>
                        <span style={{ color: '#047857' }}>Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }} onClick={() => setActiveListing(null)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '10px', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Buat Pesanan
                  </button>
                </div>
              </form>
            )}
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
                  Pasang Listing Telur
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Tawarkan pasokan telur ke UMKM se-Palu
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateListingSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Grade Kualitas:</label>
                  <select 
                    className="form-select" 
                    value={newGrade}
                    onChange={e => setNewGrade(e.target.value as EggGrade)}
                  >
                    <option value="Grade A (Utuh Bersih 60-65g)">Grade A (Utuh Bersih 60-65g)</option>
                    <option value="Grade Standar (55-60g)">Grade Standar (55-60g)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Satuan:</label>
                  <select 
                    className="form-select" 
                    value={newUnitType}
                    onChange={e => setNewUnitType(e.target.value as EggUnitType)}
                  >
                    <option value="Rak / Tray (30 Butir)">Rak / Tray (30 Butir)</option>
                    <option value="Kilogram (Kg)">Kilogram (Kg)</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Harga Satuan (Rp):</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    step={500}
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kapasitas Harian ({newUnitType}):</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    step={10}
                    value={newDailyCapacity}
                    onChange={e => setNewDailyCapacity(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi & Mutu Telur:</label>
                <textarea 
                  className="form-textarea" 
                  rows={2} 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Contoh: Telur segar langsung disortir tiap jam 7 pagi, garansi ganti telur retak."
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  <PlusCircle size={16} /> Terbitkan Pasokan
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
