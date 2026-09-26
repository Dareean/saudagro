import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Egg, 
  Truck, 
  Plus, 
  Clock, 
  Check, 
  Store,
  Phone,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  PackageCheck,
  AlertCircle,
  FileText,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { TransactionOrder, B2BContract } from '../types';
import { AnimatedTrendChart } from './AnimatedTrendChart';

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

  const [qcChecked, setQcChecked] = useState<{ [key: string]: boolean }>({
    crackTolerance: true,
    harvestFreshness: true,
    weightStandard: true,
  });

  const myContracts = contracts.filter(c => c.buyerId === currentUser.id);
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);

  const totalEggsReceived = myOrders
    .filter(o => o.status === 'completed' && o.type === 'EGG_ONEOFF')
    .reduce((acc, o) => acc + o.quantity, 0) + 
    myContracts.reduce((acc, c) => acc + (c.completedCycles * c.volumePerCycle), 0);

  // Find if there is any dispatched cycle awaiting QC & Escrow release
  const activeContractWithDispatched = myContracts.find(c => c.cycles.some(cy => cy.status === 'dispatched'));
  const activeDispatchedCycle = activeContractWithDispatched?.cycles.find(cy => cy.status === 'dispatched');

  const umkmSupplyTrend = [
    { label: 'Batch 1', dateStr: '01 Sep 2026', value: 25, secondaryValue: 1275000 },
    { label: 'Batch 2', dateStr: '08 Sep 2026', value: 25, secondaryValue: 2550000 },
    { label: 'Batch 3', dateStr: '15 Sep 2026', value: 30, secondaryValue: 4080000 },
    { label: 'Batch 4', dateStr: '22 Sep 2026', value: 30, secondaryValue: 5610000 },
    { label: 'Batch 5', dateStr: '29 Sep (Jadwal)', value: 30, secondaryValue: 7140000 },
    { label: 'Batch 6', dateStr: '06 Okt (Jadwal)', value: 35, secondaryValue: 8925000 },
  ];

  const handleToggleQc = (key: string) => {
    setQcChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allQcPassed = qcChecked.crackTolerance && qcChecked.harvestFreshness && qcChecked.weightStandard;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 24px 60px 24px' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '8px' }}>
            <Store size={13} /> HUB PENGADAAN BAHAN BAKU UMKM • KOTA PALU
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Pusat Pengadaan Telur & Penerimaan Mutu (QC)
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            {currentUser.name} • Pasokan Langsung dari Peternak Balaroa • Proteksi Rekening Escrow BAST
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_eggs')}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', fontWeight: 600, padding: '8px 14px', borderRadius: '8px' }}
          >
            Katalog Pasar Telur
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('market_eggs')}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Buat Kontrak Baru
          </button>
        </div>
      </div>

      {/* LIVE SHIPMENT RADAR / QC HERO CARD */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '22px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', borderLeft: '5px solid #2563EB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
              <Truck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  Pelacak Pengiriman Armada B2B Terkini
                </h2>
                <span style={{ fontSize: '0.7rem', background: '#ECFDF5', color: '#047857', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  Live Tracking
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
                Rute: Peternakan Berkah (Balaroa) ➔ {currentUser.name} ({currentUser.village || 'Palu Barat'})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Kurir / Armada:</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-900)' }}>Pak Rudi (Carry DN 8291 QA)</div>
            </div>
            <a 
              href="https://wa.me/6285233445566?text=Halo%20Pak%20Rudi%2C%20saya%20Dilla%20Bakery%20ingin%20cek%20posisi%20pengiriman%20telur."
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                background: '#075E54',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.079-1.85-.426-1.505-.625-2.476-2.15-2.551-2.25-.074-.1-1.17-1.558-1.17-2.971 0-1.413.738-2.108 1.002-2.397.264-.289.576-.361.768-.361.192 0 .384.002.552.01.178.009.418-.068.653.498.24.577.817 1.996.889 2.14.072.145.12.313.024.505-.096.192-.144.312-.288.481-.144.168-.303.376-.433.504-.144.145-.295.302-.127.591.168.289.747 1.232 1.604 1.995 1.102.981 2.032 1.285 2.32 1.43.289.144.457.12.625-.073.168-.192.72-.842.912-1.13.192-.289.384-.24.649-.144.264.096 1.681.793 1.969.937.288.145.48.217.552.337.072.12.072.72-.072 1.125zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.399A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.15-.44-4.46-1.22l-.32-.19-2.96.83.82-2.88-.21-.34A8.16 8.16 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
              </svg>
              WA Driver
            </a>
          </div>
        </div>

        {/* 4-Step Visual Stepper */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', position: 'relative' }}>
          {/* Step 1 */}
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>
              <CheckCircle2 size={14} /> 1. Sortir Kandang
            </div>
            <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--slate-800)' }}>Grade A 30 Rak</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>08:15 WITA (Selesai)</div>
          </div>

          {/* Step 2 */}
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>
              <CheckCircle2 size={14} /> 2. Muat Armada
            </div>
            <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--slate-800)' }}>Berangkat dari Balaroa</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>09:00 WITA (Selesai)</div>
          </div>

          {/* Step 3 */}
          <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '4px' }}>
              <Truck size={14} /> 3. Dalam Perjalanan
            </div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1E40AF' }}>Jl. Sis Aljufri</div>
            <div style={{ fontSize: '0.7rem', color: '#3B82F6' }}>Est. Tiba 14:30 WITA</div>
          </div>

          {/* Step 4 */}
          <div style={{ background: '#FFFBEB', padding: '12px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#B45309', marginBottom: '4px' }}>
              <PackageCheck size={14} /> 4. QC & Rilis BAST
            </div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#92400E' }}>Pemeriksaan Fisik</div>
            <div style={{ fontSize: '0.7rem', color: '#B45309' }}>Siapkan Checklist</div>
          </div>
        </div>
      </div>

      {/* 4-METRIC PROCUREMENT SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Telur Diterima
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            {totalEggsReceived > 0 ? totalEggsReceived : 150} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>rak</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Grade A Segar (4.500 Butir)
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Harga Terkunci Kontrak
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '6px', letterSpacing: '-0.03em' }}>
            Rp 51.000 <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>/rak</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: '#047857', marginTop: '4px', fontWeight: 600 }}>
            Hemat Rp 4.000/rak vs pasar eceran
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Penghematan Biaya HPP
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: '6px', letterSpacing: '-0.03em' }}>
            Rp 4.800.000 <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>/thn</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Efisiensi langsung bahan baku roti
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Garansi Retak BAST
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '6px', letterSpacing: '-0.03em' }}>
            1x24 <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-400)' }}>Jam SLA</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Ganti rugi langsung dari dana escrow
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: WORKBENCH */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Contracts & Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Contracts Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  Kontrak Pasokan Rutin B2B Aktif
                </h2>
                <p style={{ fontSize: '0.74rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
                  Jadwal pengiriman mingguan terjadwal otomatis
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveTab('contracts')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Semua Kontrak ({myContracts.length})
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Mitra Peternak</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Volume / Batch</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Harga Terkunci</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700 }}>Siklus Berjalan</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {myContracts.map(contract => {
                    const dispatchedCycle = contract.cycles.find(c => c.status === 'dispatched');
                    return (
                      <tr key={contract.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{contract.sellerFarmName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{contract.sellerName} • {contract.code}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div>{contract.volumePerCycle} {contract.unitType}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{contract.frequency}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#047857' }}>
                          Rp {contract.pricePerUnit.toLocaleString('id-ID')} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--slate-500)' }}>/rak</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontSize: '0.74rem', color: 'var(--slate-700)', marginBottom: '4px' }}>
                            {contract.completedCycles} dari {contract.totalCycles} Siklus Selesai
                          </div>
                          <div style={{ width: '100px', height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(contract.completedCycles / contract.totalCycles) * 100}%`, height: '100%', background: 'var(--primary-600)' }} />
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {dispatchedCycle && (
                              <button
                                type="button"
                                onClick={() => payContractCycle(contract.id, dispatchedCycle.cycleNumber)}
                                className="btn btn-primary"
                                style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <CheckCircle2 size={12} /> Terima Batch #{dispatchedCycle.cycleNumber}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onSelectContract(contract)}
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px' }}
                            >
                              Faktur BAST
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supply Trend Chart */}
          <AnimatedTrendChart 
            title="Volume Pasokan Telur & Akumulasi Pengeluaran Bahan Baku"
            subtitle="Penerimaan pasokan mingguan dan total realisasi belanja terlindungi BAST"
            unit="rak"
            secondaryUnit="Rp"
            primaryLegend="Pasokan (Rak)"
            secondaryLegend="Total Belanja Terkunci"
            primaryColor="#047857"
            secondaryColor="#2563EB"
            data={umkmSupplyTrend}
            formatValue={(v) => `${v} rak`}
            formatSecondaryValue={(v) => `Rp ${v.toLocaleString('id-ID')}`}
            height={190}
          />
        </div>

        {/* RIGHT COLUMN: QC Inspection Panel & Price Shield */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Interactive QC Checklist Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <PackageCheck size={18} color="#2563EB" />
              <h2 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Checklist QC Penerimaan Fisik (BAST)
              </h2>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--slate-500)', margin: '0 0 14px 0', lineHeight: 1.45 }}>
              Lakukan verifikasi visual saat armada tiba sebelum merilis dana escrow kepada peternak:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.78rem', color: 'var(--slate-700)', cursor: 'pointer', background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <input 
                  type="checkbox" 
                  checked={qcChecked.crackTolerance} 
                  onChange={() => handleToggleQc('crackTolerance')}
                  style={{ marginTop: '2px', accentColor: '#047857' }}
                />
                <div>
                  <strong style={{ display: 'block', color: 'var(--slate-900)' }}>1. Kerabang Bersih & Bebas Retak</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Toleransi retak maksimal ≤1 butir per rak. Bebas cemaran feses.</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.78rem', color: 'var(--slate-700)', cursor: 'pointer', background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <input 
                  type="checkbox" 
                  checked={qcChecked.harvestFreshness} 
                  onChange={() => handleToggleQc('harvestFreshness')}
                  style={{ marginTop: '2px', accentColor: '#047857' }}
                />
                <div>
                  <strong style={{ display: 'block', color: 'var(--slate-900)' }}>2. Kesegaran Panen (&lt; 48 Jam)</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Kuning telur kental & putih telur tebal (HAUGH Unit &gt;72).</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.78rem', color: 'var(--slate-700)', cursor: 'pointer', background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <input 
                  type="checkbox" 
                  checked={qcChecked.weightStandard} 
                  onChange={() => handleToggleQc('weightStandard')}
                  style={{ marginTop: '2px', accentColor: '#047857' }}
                />
                <div>
                  <strong style={{ display: 'block', color: 'var(--slate-900)' }}>3. Bobot Standar Grade A (1.85 kg / Rak)</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Rata-rata 60-62 gram per butir sesuai spesifikasi baking.</span>
                </div>
              </label>
            </div>

            {activeDispatchedCycle && activeContractWithDispatched ? (
              <button
                type="button"
                disabled={!allQcPassed}
                onClick={() => payContractCycle(activeContractWithDispatched.id, activeDispatchedCycle.cycleNumber)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: allQcPassed ? '#047857' : 'var(--slate-300)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: allQcPassed ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={16} /> Loloskan QC & Rilis Escrow Batch #{activeDispatchedCycle.cycleNumber}
              </button>
            ) : (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '8px 12px', borderRadius: '6px', fontSize: '0.74rem', color: '#047857', textAlign: 'center', fontWeight: 700 }}>
                ✓ Seluruh batch sebelumnya telah lolos verifikasi QC BAST
              </div>
            )}
          </div>

          {/* Price Shield Comparison */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
              Perbandingan Harga Pasokan Telur
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Kontrak Saudagro B2B</span>
                <strong style={{ color: '#047857' }}>Rp 51.000 /rak</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--slate-600)' }}>Pasar Manonda / Inpres</span>
                <span style={{ color: 'var(--slate-500)', textDecoration: 'line-through' }}>Rp 55.000 /rak</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Selisih Hemat</span>
                <strong style={{ color: '#2563EB' }}>Hemat Rp 4.000 /rak</strong>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Farm Contact */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '4px' }}>
              Kontak Cepat Peternak Mitra
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-800)', marginTop: '6px' }}>
              Bu Rahmawati, S.Pt.
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
              Peternakan Ayam Berkah (Balaroa, Palu Barat)
            </div>
            <a 
              href="https://wa.me/6285233445566?text=Halo%20Bu%20Rahma%2C%20saya%20Dilla%20Bakery%20ingin%20koordinasi%20jadwal%20kirim%20telur."
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '8px', background: '#075E54', color: '#FFFFFF', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.079-1.85-.426-1.505-.625-2.476-2.15-2.551-2.25-.074-.1-1.17-1.558-1.17-2.971 0-1.413.738-2.108 1.002-2.397.264-.289.576-.361.768-.361.192 0 .384.002.552.01.178.009.418-.068.653.498.24.577.817 1.996.889 2.14.072.145.12.313.024.505-.096.192-.144.312-.288.481-.144.168-.303.376-.433.504-.144.145-.295.302-.127.591.168.289.747 1.232 1.604 1.995 1.102.981 2.032 1.285 2.32 1.43.289.144.457.12.625-.073.168-.192.72-.842.912-1.13.192-.289.384-.24.649-.144.264.096 1.681.793 1.969.937.288.145.48.217.552.337.072.12.072.72-.072 1.125zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.399A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.15-.44-4.46-1.22l-.32-.19-2.96.83.82-2.88-.21-.34A8.16 8.16 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
              </svg>
              Chat WhatsApp Peternak
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

