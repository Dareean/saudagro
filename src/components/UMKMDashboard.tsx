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
  DollarSign
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
    <div className="main-wrapper" style={{ marginTop: '24px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-title">
          <Store style={{ color: 'var(--primary-700)' }} />
          Dashboard UMKM Bakery — {currentUser.name}
        </h1>
        <p className="section-desc">
          Manajemen pasokan telur rutin harga terkunci untuk kelancaran produksi kue, roti, dan katering.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card card-p" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Egg size={14} style={{ color: 'var(--primary-600)' }} /> Total Telur Diterima
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
            {totalEggsReceived} <span style={{ fontSize: '0.85rem' }}>Rak (4.500 Butir)</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--primary-700)', marginTop: '2px' }}>
            Kualitas Grade A 100% segar
          </div>
        </div>

        <div className="card card-p" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FileCheck2 size={14} style={{ color: '#3b82f6' }} /> Kontrak Pasokan Aktif
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
            {myContracts.filter(c => c.status === 'active').length} <span style={{ fontSize: '0.85rem' }}>Mitra Peternak</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Peternakan Berkah Palu
          </div>
        </div>

        <div className="card card-p" style={{ borderLeft: '4px solid var(--harvest-500)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <TrendingDown size={14} style={{ color: 'var(--harvest-700)' }} /> Stabilitas Harga Terkunci
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--harvest-700)', marginTop: '4px' }}>
            Rp 51.000 <span style={{ fontSize: '0.85rem' }}>/Rak</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--harvest-700)', marginTop: '2px' }}>
            Hemat ~8% dari harga fluktuatif pasar
          </div>
        </div>

        <div className="card card-p" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={14} style={{ color: 'var(--success)' }} /> Garansi Retur Pecah
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
            24 Jam
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Klaim langsung via sistem
          </div>
        </div>
      </div>

      {/* Active Contract Detail Card */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileCheck2 style={{ color: 'var(--primary-700)' }} />
            Kontrak Langganan Pasokan Rutin Anda
          </h3>
          <button className="btn btn-sm btn-primary" onClick={() => setActiveTab('market_eggs')}>
            <Egg size={14} /> Tambah Kontrak Peternak Lain
          </button>
        </div>

        {myContracts.map(contract => {
          const nextCycle = contract.cycles.find(c => c.status === 'scheduled');
          const dispatchedCycle = contract.cycles.find(c => c.status === 'dispatched');

          return (
            <div 
              key={contract.id} 
              className="card card-p"
              style={{ borderTop: '4px solid var(--primary-600)', marginBottom: '16px', cursor: 'pointer' }}
              onClick={() => onSelectContract(contract)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--slate-900)' }}>
                    {contract.sellerFarmName} ({contract.sellerName})
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                    Kode Kontrak: {contract.code} • Durasi: {contract.durationMonths} Bulan
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                  Harga Terkunci: Rp {contract.pricePerUnit.toLocaleString('id-ID')} / {contract.unitType}
                </span>
              </div>

              {/* Next batch notification */}
              {dispatchedCycle ? (
                <div style={{ background: 'var(--info-bg)', border: '1.5px solid var(--info)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Truck size={22} style={{ color: 'var(--info)' }} />
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--info)', fontSize: '0.9rem' }}>
                        Batch #{dispatchedCycle.cycleNumber} Sedang Dalam Pengiriman!
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                        Volume: {contract.volumePerCycle} {contract.unitType} ({contract.eggGrade})
                      </div>
                    </div>
                  </div>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      payContractCycle(contract.id, dispatchedCycle.cycleNumber);
                    }}
                  >
                    <CheckCircle2 size={14} /> Konfirmasi Diterima & Bayar
                  </button>
                </div>
              ) : nextCycle ? (
                <div style={{ background: 'var(--harvest-50)', border: '1px solid var(--harvest-200)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--harvest-700)', textTransform: 'uppercase' }}>
                      Jadwal Pengiriman Berikutnya:
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--slate-900)', fontSize: '0.95rem' }}>
                      Batch #{nextCycle.cycleNumber} — {nextCycle.scheduledDate} ({contract.volumePerCycle} {contract.unitType})
                    </div>
                  </div>
                  <span className="badge badge-warning">Terjadwal Otomatis</span>
                </div>
              ) : null}

              {/* Progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--slate-600)' }}>Progres Pemenuhan Kontrak:</span>
                  <strong>{contract.completedCycles} dari {contract.totalCycles} Siklus Selesai</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(contract.completedCycles / contract.totalCycles) * 100}%`, height: '100%', background: 'var(--primary-600)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* One-Off Orders List */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '12px' }}>
          Pesanan Grosir Telur Tambahan (Sekali Beli)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myOrders.filter(o => o.type === 'EGG_ONEOFF').map(order => (
            <div 
              key={order.id} 
              className="card card-p"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectOrder(order)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                    {order.code} — {order.quantity} {order.unit}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    Peternak: {order.sellerName} • {order.deliveryMethod}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-800)' }}>
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                    {order.status === 'completed' ? 'Selesai & Lunas' : 'Terkonfirmasi'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
