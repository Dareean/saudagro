import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  Egg, 
  FileCheck2, 
  Calendar, 
  CheckCircle2, 
  Truck, 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  Sparkles,
  Layers,
  DollarSign,
  PlusCircle,
  Clock,
  Phone,
  Receipt,
  HelpCircle
} from 'lucide-react';
import { TransactionOrder, B2BContract } from '../types';

interface UMKMDashboardProps {
  onSelectOrder: (order: TransactionOrder) => void;
  onSelectContract: (contract: B2BContract) => void;
}

export const UMKMDashboard: React.FC<UMKMDashboardProps> = ({ 
  onSelectOrder, 
  onSelectContract 
}) => {
  const { 
    currentUser, 
    contracts, 
    orders, 
    setActiveTab, 
    payContractCycle 
  } = useApp();

  const myContracts = contracts.filter(c => c.buyerId === currentUser.id);
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);

  const totalEggsReceived = myOrders
    .filter(o => o.status === 'completed' && o.type === 'EGG_ONEOFF')
    .reduce((acc, o) => acc + o.quantity, 0) + 
    myContracts.reduce((acc, c) => acc + (c.completedCycles * c.volumePerCycle), 0);

  return (
    <div className="pro-dashboard-wrapper">
      {/* Header Bar */}
      <div className="pro-dashboard-header">
        <div>
          <div className="pro-breadcrumb">
            <span>Beranda</span>
            <span>/</span>
            <span className="active">Dashboard UMKM Bakery</span>
          </div>
          <h1 className="pro-dashboard-title">
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: '#EFF6FF', 
              color: '#2563EB', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Store size={20} />
            </div>
            Dashboard Pengadaan Pasokan Telur B2B
          </h1>
          <p className="pro-dashboard-subtitle">
            Manajemen pasokan telur rutin harga terkunci, jadwal pengiriman mingguan, verifikasi penerimaan QC, dan faktur digital.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setActiveTab('market_eggs')}
            style={{ padding: '9px 16px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '10px' }}
          >
            Katalog Pasar Telur
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveTab('market_eggs')}
            style={{ padding: '9px 18px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '10px' }}
          >
            <PlusCircle size={16} /> Buat Kontrak Pasokan Baru
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="pro-kpi-grid">
        {/* KPI 1: Total Telur Diterima */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Total Telur Diterima</span>
            <div className="pro-kpi-icon" style={{ background: '#ECFDF5', color: '#047857' }}>
              <Egg size={18} />
            </div>
          </div>
          <div className="pro-kpi-value" style={{ color: '#047857' }}>
            {totalEggsReceived > 0 ? totalEggsReceived : 150} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>Rak</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#ECFDF5', color: '#047857' }}>
              Grade A 100% Segar
            </span>
            <span>(4.500 Butir untuk produksi)</span>
          </div>
        </div>

        {/* KPI 2: Kontrak Pasokan Aktif */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #2563EB' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Kontrak Pasokan Aktif</span>
            <div className="pro-kpi-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <FileCheck2 size={18} />
            </div>
          </div>
          <div className="pro-kpi-value">
            {myContracts.filter(c => c.status === 'active').length || 1} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>Mitra Peternak</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              Peternakan Berkah Palu
            </span>
            <span>Jadwal mingguan terkunci</span>
          </div>
        </div>

        {/* KPI 3: Stabilitas Harga Terkunci */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Stabilitas Harga Terkunci</span>
            <div className="pro-kpi-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <TrendingDown size={18} />
            </div>
          </div>
          <div className="pro-kpi-value" style={{ color: '#B45309' }}>
            Rp 51.000 <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>/Rak</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#FEF3C7', color: '#B45309' }}>
              Hemat ~8%
            </span>
            <span>Bebas lonjakan harga pasar</span>
          </div>
        </div>

        {/* KPI 4: Garansi Mutu 24 Jam */}
        <div className="pro-kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="pro-kpi-card-header">
            <span className="pro-kpi-label">Garansi Retur & Mutu</span>
            <div className="pro-kpi-icon" style={{ background: '#ECFDF5', color: '#047857' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="pro-kpi-value">
            24 Jam <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>SLA</span>
          </div>
          <div className="pro-kpi-subtext">
            <span className="pro-kpi-badge" style={{ background: '#ECFDF5', color: '#047857' }}>
              ✓ 0% Risiko Rusak
            </span>
            <span>Klaim langsung via dashboard</span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="pro-layout-2col">
        {/* Left Column: Contracts & One-off Orders */}
        <div>
          {/* Panel 1: Kontrak Langganan Rutin */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h3 className="pro-card-title">
                <FileCheck2 size={18} style={{ color: '#2563EB' }} />
                Kontrak Langganan Pasokan Rutin Anda
              </h3>
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => setActiveTab('contracts')}
                style={{ fontSize: '0.78rem', borderRadius: '8px' }}
              >
                Detail Semua Kontrak
              </button>
            </div>

            <div className="pro-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myContracts.map(contract => {
                const nextCycle = contract.cycles.find(c => c.status === 'scheduled');
                const dispatchedCycle = contract.cycles.find(c => c.status === 'dispatched');

                return (
                  <div key={contract.id} className="pro-list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--slate-900)' }}>
                            {contract.sellerFarmName} ({contract.sellerName})
                          </span>
                          <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                            Harga Terkunci
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                          Kode: <strong>{contract.code}</strong> • Durasi: <strong>{contract.durationMonths} Bulan</strong> ({contract.frequency})
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#047857' }}>
                          Rp {contract.pricePerUnit.toLocaleString('id-ID')} <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)' }}>/{contract.unitType}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                          Volume: {contract.volumePerCycle} {contract.unitType}/Batch
                        </div>
                      </div>
                    </div>

                    {/* Active Shipment Alert / Scheduled Batch */}
                    {dispatchedCycle ? (
                      <div style={{ 
                        background: '#EFF6FF', 
                        border: '1.5px solid #BFDBFE', 
                        padding: '12px 16px', 
                        borderRadius: '10px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Truck size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#1D4ED8', fontSize: '0.88rem' }}>
                              Batch #{dispatchedCycle.cycleNumber} Sedang Diantar Armada Peternak!
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)' }}>
                              Volume: {contract.volumePerCycle} {contract.unitType} ({contract.eggGrade}) • Diantar ke Dilla Bakery Palu
                            </div>
                          </div>
                        </div>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            payContractCycle(contract.id, dispatchedCycle.cycleNumber);
                          }}
                          style={{ borderRadius: '8px', fontSize: '0.78rem', gap: '6px' }}
                        >
                          <CheckCircle2 size={14} /> Konfirmasi Diterima & Bayar
                        </button>
                      </div>
                    ) : nextCycle ? (
                      <div style={{ 
                        background: '#FFFBEB', 
                        border: '1px solid #FDE68A', 
                        padding: '10px 14px', 
                        borderRadius: '10px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        fontSize: '0.78rem'
                      }}>
                        <div>
                          <span style={{ color: '#B45309', fontWeight: 700 }}>Pengiriman Batch Berikutnya:</span>{' '}
                          <strong>Batch #{nextCycle.cycleNumber} — {nextCycle.scheduledDate}</strong> ({contract.volumePerCycle} {contract.unitType})
                        </div>
                        <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>Terjadwal Otomatis</span>
                      </div>
                    ) : null}

                    {/* Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '6px', color: 'var(--slate-600)' }}>
                        <span>Realisasi Pasokan: <strong>{contract.completedCycles} dari {contract.totalCycles} Siklus Selesai</strong></span>
                        <span>Next Delivery: <strong>{contract.nextDeliveryDate}</strong></span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${(contract.completedCycles / contract.totalCycles) * 100}%`, 
                            height: '100%', 
                            background: 'var(--primary-600)', 
                            borderRadius: '4px' 
                          }} 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--slate-100)' }}>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onSelectContract(contract)}
                        style={{ fontSize: '0.78rem', borderRadius: '8px' }}
                      >
                        Lihat Faktur & Kontrak Lengkap
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel 2: Pesanan Grosir Telur Tambahan */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h3 className="pro-card-title">
                <Receipt size={18} style={{ color: '#047857' }} />
                Pesanan Grosir Telur Tambahan (Spot Order)
              </h3>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => setActiveTab('market_eggs')}
                style={{ fontSize: '0.78rem', borderRadius: '8px' }}
              >
                + Pesan Tambahan
              </button>
            </div>

            <div className="pro-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myOrders.filter(o => o.type === 'EGG_ONEOFF').map(order => (
                <div 
                  key={order.id} 
                  className="pro-list-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectOrder(order)}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                      {order.code} — {order.quantity} {order.unit}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                      Peternak: <strong>{order.sellerName}</strong> • {order.deliveryMethod}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#047857' }}>
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                        {order.status === 'completed' ? '✓ Selesai & Lunas' : 'Terkonfirmasi'}
                      </span>
                    </div>
                    <ArrowRight size={15} style={{ color: 'var(--slate-400)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Savings, Guarantees & Farm Contacts */}
        <div>
          {/* Widget 1: Kalkulator Penghematan Biaya Kontrak */}
          <div className="pro-card" style={{ background: 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)', borderColor: '#A7F3D0' }}>
            <div className="pro-card-header" style={{ background: 'transparent' }}>
              <h4 className="pro-card-title" style={{ fontSize: '0.92rem', color: '#047857' }}>
                <TrendingDown size={16} />
                Efisiensi Biaya Bahan Baku UMKM
              </h4>
            </div>
            <div className="pro-card-body" style={{ paddingTop: '8px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857', marginBottom: '4px' }}>
                Hemat Rp 4.800.000 <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-600)' }}>/Tahun</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
                Dengan mengunci harga kontrak <strong>Rp 51.000/rak</strong> langsung dari peternak lokal Palu Barat, margin laba roti & cake terlindungi dari lonjakan pasar eceran (Rp 55.000/rak).
              </p>
            </div>
          </div>

          {/* Widget 2: Garansi Retur 1x24 Jam */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h4 className="pro-card-title" style={{ fontSize: '0.92rem' }}>
                <ShieldCheck size={16} style={{ color: '#047857' }} />
                Prosedur Garansi Mutu 1x24 Jam
              </h4>
            </div>
            <div className="pro-card-body">
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.74rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                <li>Periksa fisik rak telur saat serah terima di lokasi outlet bakery.</li>
                <li>Jika ditemukan telur retak akibat pengiriman, laporkan via dashboard dalam 1x24 jam.</li>
                <li>Peternak berkewajiban mengganti pada batch pengiriman berikutnya atau memotong nominal faktur.</li>
              </ul>
            </div>
          </div>

          {/* Widget 3: Kontak Peternak Mitra */}
          <div className="pro-card">
            <div className="pro-card-header">
              <h4 className="pro-card-title" style={{ fontSize: '0.92rem' }}>
                <Phone size={16} style={{ color: '#2563EB' }} />
                Kontak Cepat Peternak Mitra
              </h4>
            </div>
            <div className="pro-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
                  alt="Bu Rahmawati"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                    Bu Rahmawati, S.Pt.
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                    Peternakan Ayam Berkah Palu
                  </div>
                </div>
              </div>
              <a 
                href="https://wa.me/6285233445566?text=Halo%20Bu%20Rahma%2C%20saya%20Dilla%20Bakery%20ingin%20koordinasi%20jadwal%20kirim%20telur."
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-secondary btn-full"
                style={{ borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, gap: '6px' }}
              >
                <Phone size={13} style={{ color: '#2563EB' }} /> Chat WhatsApp Peternak
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
