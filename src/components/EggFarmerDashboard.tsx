import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Egg, 
  Wheat, 
  FileCheck2, 
  Truck, 
  ArrowRight, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Star,
  Package,
  Layers,
  Store
} from 'lucide-react';
import { TransactionOrder, B2BContract } from '../types';

interface EggFarmerDashboardProps {
  onSelectOrder: (order: TransactionOrder) => void;
  onSelectContract: (contract: B2BContract) => void;
}

export const EggFarmerDashboard: React.FC<EggFarmerDashboardProps> = ({ 
  onSelectOrder, 
  onSelectContract 
}) => {
  const { 
    currentUser, 
    orders, 
    contracts, 
    setActiveTab, 
    fulfillContractCycle 
  } = useApp();

  // Dual-sided data:
  // 1. My Corn Feed Purchases (Buy side)
  const myFeedOrders = orders.filter(o => o.buyerId === currentUser.id && o.type === 'CORN');
  const totalFeedProcuredKg = myFeedOrders
    .filter(o => o.status === 'completed')
    .reduce((acc, o) => acc + o.quantity, 0);

  // 2. My Egg Sales & Contracts (Sell side)
  const myEggOrders = orders.filter(o => o.sellerId === currentUser.id);
  const myContracts = contracts.filter(c => c.sellerId === currentUser.id);

  const activeContractsCount = myContracts.filter(c => c.status === 'active').length;

  return (
    <div className="main-wrapper" style={{ marginTop: '24px' }}>
      {/* Title & Overview */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-title">
          <Egg style={{ color: 'var(--egg-600)' }} />
          Dashboard Peternak Ayam — {currentUser.name}
        </h1>
        <p className="section-desc">
          Pusat integrasi ganda: Pengadaan pakan jagung langsung dari petani & Penjualan telur kontrak B2B ke UMKM.
        </p>
      </div>

      {/* Dual Sided Metrics */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card card-p" style={{ borderLeft: '4px solid var(--harvest-500)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Wheat size={14} style={{ color: 'var(--harvest-600)' }} /> Pakan Jagung Terbeli
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
            {totalFeedProcuredKg.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>Kg</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--harvest-700)', marginTop: '2px' }}>
            Langsung dari petani Sigi/Donggala
          </div>
        </div>

        <div className="card card-p" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FileCheck2 size={14} style={{ color: 'var(--primary-600)' }} /> Kontrak B2B Aktif
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
            {activeContractsCount} <span style={{ fontSize: '0.85rem' }}>Mitra UMKM</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--primary-700)', marginTop: '2px' }}>
            Pasokan rutin harga terkunci
          </div>
        </div>

        <div className="card card-p" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Egg size={14} style={{ color: '#3b82f6' }} /> Kapasitas Produksi
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
            150-180 <span style={{ fontSize: '0.85rem' }}>Rak/Hari</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            6.000 Ekor Layer Hen
          </div>
        </div>

        <div className="card card-p" style={{ borderLeft: '4px solid #eab308' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Star size={14} style={{ color: '#eab308' }} /> Skor Reputasi
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={18} fill="#eab308" color="#eab308" /> {currentUser.rating}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            {currentUser.reviewCount} Ulasan Terverifikasi
          </div>
        </div>
      </div>

      {/* Active B2B Contracts Highlights */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileCheck2 style={{ color: 'var(--primary-700)' }} />
            Kontrak Pasokan Rutin B2B ke UMKM
          </h3>
          <button className="btn btn-sm btn-outline" onClick={() => setActiveTab('market_eggs')}>
            <PlusCircle size={14} /> Pasang Kuota Telur Baru
          </button>
        </div>

        <div className="grid-2">
          {myContracts.map(contract => {
            const nextScheduled = contract.cycles.find(c => c.status === 'scheduled');
            return (
              <div 
                key={contract.id} 
                className="card card-p"
                style={{ borderTop: '4px solid var(--primary-600)', cursor: 'pointer' }}
                onClick={() => onSelectContract(contract)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                      {contract.buyerBusiness}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      PIC: {contract.buyerName} • {contract.code}
                    </div>
                  </div>
                  <span className="badge badge-success">
                    {contract.status === 'active' ? 'Kontrak Berjalan' : 'Selesai'}
                  </span>
                </div>

                <div style={{ background: 'var(--slate-50)', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--slate-600)' }}>Volume per Batch:</span>
                    <strong>{contract.volumePerCycle} {contract.unitType} / {contract.frequency}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--slate-600)' }}>Harga Terkunci:</span>
                    <strong style={{ color: 'var(--primary-800)' }}>Rp {contract.pricePerUnit.toLocaleString('id-ID')} /{contract.unitType.includes('Rak') ? 'Rak' : 'Kg'}</strong>
                  </div>
                </div>

                {nextScheduled && (
                  <div style={{ background: 'var(--harvest-50)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--harvest-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--harvest-700)', fontWeight: 700, textTransform: 'uppercase' }}>Pengiriman Terdekat:</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                        Batch #{nextScheduled.cycleNumber} — {nextScheduled.scheduledDate}
                      </div>
                    </div>
                    <button 
                      className="btn btn-sm btn-harvest"
                      onClick={(e) => {
                        e.stopPropagation();
                        fulfillContractCycle(contract.id, nextScheduled.cycleNumber);
                      }}
                    >
                      <Truck size={13} /> Kirim Batch Ini
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Feed Procurement & One-off Egg Orders */}
      <div className="grid-2">
        {/* Left: Feed Procurement from Corn Farmers */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wheat style={{ color: 'var(--harvest-600)' }} />
              Pengadaan Pakan Jagung Masuk
            </h3>
            <button className="btn btn-harvest btn-sm" onClick={() => setActiveTab('market_corn')}>
              <PlusCircle size={14} /> Pesan Jagung Lagi
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myFeedOrders.length === 0 ? (
              <div className="card card-p" style={{ textAlign: 'center', color: 'var(--slate-500)' }}>
                Belum ada riwayat pembelian jagung.
              </div>
            ) : (
              myFeedOrders.map(order => (
                <div 
                  key={order.id} 
                  className="card card-p"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectOrder(order)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{order.code}</span>
                    <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
                      {order.status === 'completed' ? 'Pakan Diterima' : 'Dalam Pengiriman'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                    Petani: <strong>{order.sellerName}</strong> • {order.quantity.toLocaleString()} Kg
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginTop: '4px' }}>
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: One-Off Egg Orders from UMKM */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Store style={{ color: 'var(--primary-700)' }} />
              Pesanan Grosir Telur Masuk
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('history')}>
              Lihat Riwayat
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myEggOrders.filter(o => o.type === 'EGG_ONEOFF').length === 0 ? (
              <div className="card card-p" style={{ textAlign: 'center', color: 'var(--slate-500)' }}>
                Belum ada pesanan grosir sekali beli.
              </div>
            ) : (
              myEggOrders.filter(o => o.type === 'EGG_ONEOFF').map(order => (
                <div 
                  key={order.id} 
                  className="card card-p"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectOrder(order)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{order.code}</span>
                    <span className="badge badge-success">
                      {order.status === 'completed' ? 'Selesai & Lunas' : 'Terkonfirmasi'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                    Pembeli: <strong>{order.buyerName}</strong> • {order.quantity} {order.unit}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginTop: '4px' }}>
                    Pendapatan Bersih: Rp {order.sellerNetRevenue.toLocaleString('id-ID')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
