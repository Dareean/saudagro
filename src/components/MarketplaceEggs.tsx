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
    <div className="main-wrapper" ref={containerRef}>
      {/* Clean Page Hero */}
      <div className="page-hero">
        <div>
          <h1 className="page-title">
            Pasar Telur Utuh & Kontrak B2B
          </h1>
          <p className="page-subtitle">
            Pasokan telur segar langsung dari peternak ayam ke UMKM bakery, katering, dan resto se-Palu dengan kontrak harga tetap.
          </p>
        </div>

        <div>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCreateModal(true)}
          >
            <PlusCircle size={16} />
            Pasang Stok Telur
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
              placeholder="Cari peternakan, kelurahan, atau grade..." 
              style={{ paddingLeft: '34px' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select 
              className="form-select" 
              value={selectedUnit} 
              onChange={e => setSelectedUnit(e.target.value)}
            >
              <option value="all">Semua Satuan (Rak / Kg)</option>
              <option value="Rak / Tray (30 Butir)">Per Rak / Tray (30 Butir)</option>
              <option value="Kilogram (Kg)">Per Kilogram (Kg)</option>
            </select>
          </div>

          <div>
            <select 
              className="form-select" 
              value={selectedGrade} 
              onChange={e => setSelectedGrade(e.target.value)}
            >
              <option value="all">Semua Grade Kualitas</option>
              <option value="Grade A">Grade A (Utuh Bersih 60-65g)</option>
              <option value="Grade Standar">Grade Standar (55-60g)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Egg Listings Grid */}
      <div className="grid-3">
        {filteredListings.map(item => (
          <div key={item.id} className="card egg-card-item">
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
                <span className="badge badge-warning">
                  <Sparkles size={11} /> {item.grade.split('(')[0]}
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--forest-900)' }}>
                  {item.unitType}
                </span>
              </div>
            </div>

            <div className="card-body">
              <div>
                <div className="card-farmer-info">
                  <div className="card-farmer-name">
                    {item.farmerName}
                    <span title="Peternak Terverifikasi"><ShieldCheck size={15} style={{ color: '#2563eb' }} /></span>
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
                    <span style={{ color: 'var(--text-muted)' }}>Kapasitas Harian:</span>
                    <strong>~{item.dailyCapacity} {item.unitType}/hari</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Minimal Order:</span>
                    <span>{item.minOrder} {item.unitType}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="card-price-row">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Harga Satuan:</span>
                  <span className="card-price-value">
                    Rp {item.pricePerUnit.toLocaleString('id-ID')}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}> /{item.unitType.includes('Rak') ? 'rak' : 'kg'}</span>
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
                        defaultMessage: `Halo ${item.farmerName}, saya ingin menanyakan ketersediaan pasokan telur ${item.code} (${item.unitType}) untuk usaha saya.`,
                        actionTitle: 'Tanya Peternak via WhatsApp'
                      });
                    }}
                    title="Chat Peternak"
                    style={{ padding: '8px 12px' }}
                  >
                    <MessageSquare size={15} style={{ color: 'var(--wa-dark)' }} />
                  </button>

                  <button 
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      setActiveListing(item);
                      setContractPricePerUnit(item.pricePerUnit - 1000);
                      setOneOffQuantity(Math.max(item.minOrder, 20));
                    }}
                  >
                    <FileCheck2 size={15} /> Pesan / Kontrak B2B
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
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--forest-900)' }}>
                  Pesan Telur — {activeListing.farmerName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {activeListing.code} • {activeListing.grade}
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveListing(null)}>
                <X size={16} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', background: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: 'var(--radius-full)', marginBottom: '16px' }}>
              <button 
                type="button" 
                className={`btn btn-full btn-sm ${orderMode === 'contract' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
                onClick={() => setOrderMode('contract')}
              >
                <FileCheck2 size={15} />
                Kontrak Rutin B2B (Disarankan)
              </button>
              <button 
                type="button" 
                className={`btn btn-full btn-sm ${orderMode === 'one_off' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
                onClick={() => setOrderMode('one_off')}
              >
                <Package size={15} />
                Sekali Beli
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
                      <option value={1}>1 Bulan</option>
                      <option value={3}>3 Bulan (Rekomendasi)</option>
                      <option value={6}>6 Bulan</option>
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
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--forest-900)', marginBottom: '6px' }}>
                        Kalkulasi Nilai Kontrak Pasokan (Komisi 5%):
                      </div>
                      <div className="fee-row">
                        <span>Nilai per Batch ({contractVolume} {activeListing.unitType}):</span>
                        <span style={{ fontWeight: 600 }}>Rp {cycleValue.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="fee-row">
                        <span>Total Siklus Pengiriman:</span>
                        <span style={{ fontWeight: 600 }}>{cyclesCount} Kali Kirim</span>
                      </div>
                      <div className="fee-row" style={{ color: 'var(--text-light)', fontSize: '0.76rem' }}>
                        <span>*Komisi Platform 5% Telur:</span>
                        <span>(Rp {commissionFee.toLocaleString('id-ID')} /batch)</span>
                      </div>
                      <div className="fee-row total">
                        <span>Estimasi Total Nilai Kontrak:</span>
                        <span style={{ color: 'var(--forest-900)' }}>Rp {totalValue.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setActiveListing(null)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
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
                    value={oneOffAddress}
                    onChange={e => setOneOffAddress(e.target.value)}
                    required
                  />
                </div>

                {(() => {
                  const subtotal = oneOffQuantity * activeListing.pricePerUnit;
                  const deliveryFee = oneOffDeliveryMethod === 'Diantar Penjual' ? 50000 : 0;
                  const commissionFee = Math.round(subtotal * 0.05);
                  const total = subtotal + deliveryFee;

                  return (
                    <div className="fee-calc-box">
                      <div className="fee-row">
                        <span>Harga Telur ({oneOffQuantity} {activeListing.unitType}):</span>
                        <span style={{ fontWeight: 600 }}>Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="fee-row">
                        <span>Ongkir:</span>
                        <span style={{ fontWeight: 600 }}>Rp {deliveryFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="fee-row total">
                        <span>Total Bayar:</span>
                        <span style={{ color: 'var(--forest-900)' }}>Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setActiveListing(null)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
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
