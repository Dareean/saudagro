import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Scale, 
  FileText, 
  CheckCircle2, 
  Wheat, 
  Egg, 
  Store, 
  Lock, 
  Truck, 
  HelpCircle,
  AlertCircle,
  Building2,
  Receipt
} from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ 
  isOpen, 
  onClose,
  onAccept 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'komisi' | 'mutu' | 'pembayaran' | 'sengketa'>('all');

  if (!isOpen) return null;

  const sections = [
    {
      id: 'umum',
      category: 'all',
      title: '1. Ketentuan Umum & Kedudukan Hukum Platform',
      icon: Building2,
      content: (
        <div>
          <p style={{ margin: '0 0 10px 0', lineHeight: 1.6, color: 'var(--slate-700)' }}>
            <strong>Saudagro Platform</strong> beroperasi sebagai sistem mediasi digital, agregator rantai pasok agribisnis, dan penjamin transaksi transparan regional yang menghubungkan Petani Jagung (Sigi & Donggala), Peternak Ayam Layer/Pedaging (Palu & Sigi), serta Pelaku Usaha Olahan Pangan (UMKM Bakery & Kuliner di Kota Palu).
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: 1.6, color: 'var(--slate-600)' }}>
            <li>Saudagro <strong>bukan tengkulak monopoli</strong>, melainkan fasilitator teknologi mediasi pasar bebas yang adil dan terbuka.</li>
            <li>Setiap mitra yang mendaftar menyatakan bahwa seluruh data penanggung jawab, kontak WhatsApp, dan lokasi operasional adalah benar dan sah menurut hukum yang berlaku di Republik Indonesia.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'komisi',
      category: 'komisi',
      title: '2. Transparansi Komisi Layanan (3% - 5%)',
      icon: Receipt,
      content: (
        <div>
          <p style={{ margin: '0 0 10px 0', lineHeight: 1.6, color: 'var(--slate-700)' }}>
            Saudagro memegang teguh prinsip <em>Akad Transparan</em> tanpa potongan tersembunyi. Skema bagi hasil/komisi operasional diatur sebagai berikut:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 800, color: '#B45309', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Wheat size={16} /> Komisi Komoditas Jagung Pipil: 3%
              </div>
              <p style={{ fontSize: '0.78rem', color: '#92400E', margin: 0, lineHeight: 1.45 }}>
                Dikenakan pada transaksi B2B jagung pipil kering untuk pasokan bahan baku pakan ternak volume besar.
              </p>
            </div>
            <div style={{ background: '#F0FDF4', border: '1px solid #A7F3D0', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Egg size={16} /> Komisi Pasokan Telur & UMKM: 3% - 5%
              </div>
              <p style={{ fontSize: '0.78rem', color: '#065F46', margin: 0, lineHeight: 1.45 }}>
                Mencakup biaya QC, penjaminan kualitas rak telur, penerbitan invoice B2B resmi, dan kurasi retur.
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: 0 }}>
            *Biaya komisi dipotong secara otomatis oleh sistem saat dana transaksi dicairkan ke rekening/dompet penjual.
          </p>
        </div>
      )
    },
    {
      id: 'mutu',
      category: 'mutu',
      title: '3. Standar Mutu, QC & Garansi Penggantian Barang',
      icon: Scale,
      content: (
        <div>
          <p style={{ margin: '0 0 10px 0', lineHeight: 1.6, color: 'var(--slate-700)' }}>
            Untuk melindungi pembeli dan menjaga nama baik penjual di Sulawesi Tengah, berlaku standar mutu baku:
          </p>
          <div style={{ background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
            <h5 style={{ margin: '0 0 6px 0', fontSize: '0.84rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              A. Jagung Pipil (Corn):
            </h5>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.78rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              <li><strong>Kadar Air (KA):</strong> Standar 14.0% – 15.5% untuk pakan ternak. Jika KA {'>'} 16%, berlaku penyesuaian rafaksi harga sesuai kesepakatan kontrak.</li>
              <li><strong>Kondisi:</strong> Bebas kutu hidup, bebas jamur/aflatoksin berat, dan lolos uji timbang tera resmi.</li>
            </ul>
          </div>
          <div style={{ background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}>
            <h5 style={{ margin: '0 0 6px 0', fontSize: '0.84rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              B. Telur Ayam Ras (Eggs):
            </h5>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.78rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              <li><strong>Standar Kemasan:</strong> Rak karton kokoh isi 30 butir, bersih dari kotoran basah berlebih.</li>
              <li><strong>Garansi Retur 1x24 Jam:</strong> Apabila ditemukan telur busuk atau retak dalam perjalanan, pembeli berhak mengajukan klaim penggantian/potongan invoice via aplikasi dengan melampirkan foto unboxing.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'pembayaran',
      category: 'pembayaran',
      title: '4. Rekening Bersama (Escrow Amanah) & Pencairan Dana',
      icon: Lock,
      content: (
        <div>
          <p style={{ margin: '0 0 10px 0', lineHeight: 1.6, color: 'var(--slate-700)' }}>
            Seluruh transaksi finansial di Saudagro diamankan melalui sistem <strong>Escrow Mediasi Resmi</strong>:
          </p>
          <ol style={{ paddingLeft: '20px', margin: '0 0 10px 0', lineHeight: 1.6, color: 'var(--slate-600)', fontSize: '0.82rem' }}>
            <li><strong>Pembeli Menyetor Dana:</strong> Pembeli mentransfer dana pesanan ke Rekening Escrow Saudagro sebelum komoditas dikirim.</li>
            <li><strong>Pengiriman & Pemeriksaan:</strong> Petani/Peternak mengirim pesanan ke titik serah terima (Palu/Sigi/Donggala).</li>
            <li><strong>Konfirmasi Penerimaan:</strong> Pembeli memeriksa kesesuaian timbangan/kualitas dan memasukkan PIN Konfirmasi.</li>
            <li><strong>Pencairan Instan:</strong> Dana langsung dicairkan ke rekening penjual dalam waktu maksimal 1 x 24 jam hari kerja.</li>
          </ol>
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: '#047857', flexShrink: 0 }} />
            <span style={{ fontSize: '0.76rem', color: '#065F46', fontWeight: 600 }}>
              Sistem ini melindungi Petani dari risiko gagal bayar (gali lubang tutup lubang) serta melindungi UMKM dari barang fiktif.
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'logistik',
      category: 'all',
      title: '5. Ketentuan Pengiriman & Logistik Pasigala',
      icon: Truck,
      content: (
        <div>
          <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: 1.6, color: 'var(--slate-600)', fontSize: '0.82rem' }}>
            <li>Pengiriman dapat menggunakan armada mandiri penjual/pembeli atau mitra logistik resmi Saudagro.</li>
            <li>Surat Jalan Digital dan Berita Acara Serah Terima (BAST) wajib ditandatangani saat serah terima fisik komoditas di lokasi.</li>
            <li>Risiko kerusakan selama perjalanan menjadi tanggung jawab pihak pengangkut sesuai klausul opsi armada yang dipilih saat checkout.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'fasilitator',
      category: 'all',
      title: '6. Peran Fasilitator Lapangan (Pendamping Petani)',
      icon: HelpCircle,
      content: (
        <div>
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--slate-600)', fontSize: '0.82rem' }}>
            Bagi petani atau peternak di pelosok pedesaan yang belum terbiasa mengoperasikan aplikasi ponsel cerdas, Saudagro menyediakan <strong>Fasilitator Lapangan Terverifikasi</strong>. Fasilitator berhak membantu input data panen, verifikasi timbangan lapangan, dan pendampingan serah terima tanpa memungut pungutan liar di luar ketentuan platform.
          </p>
        </div>
      )
    },
    {
      id: 'sengketa',
      category: 'sengketa',
      title: '7. Penyelesaian Sengketa & Arbitrase Musyawarah',
      icon: AlertCircle,
      content: (
        <div>
          <p style={{ margin: '0 0 8px 0', lineHeight: 1.6, color: 'var(--slate-600)', fontSize: '0.82rem' }}>
            Apabila terjadi perselisihan mengenai timbangan, kadar air, atau keterlambatan pengiriman:
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: 1.6, color: 'var(--slate-600)', fontSize: '0.82rem' }}>
            <li>Para pihak sepakat mengutamakan musyawarah mufakat yang dimediasi oleh Tim Arbitrase Saudagro bersama perwakilan Gapoktan/Asosiasi Peternak terkait.</li>
            <li>Keputusan tim mediasi berdasarkan data uji laboratorium atau Berita Acara resmi bersifat mengikat kedua belah pihak.</li>
          </ul>
        </div>
      )
    }
  ];

  const filteredSections = activeTab === 'all' 
    ? sections 
    : sections.filter(s => s.category === activeTab || s.category === 'all');

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{ 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)', 
        background: 'rgba(15, 23, 42, 0.7)',
        zIndex: 10000,
        padding: '16px'
      }}
    >
      <div 
        className="auth-modal-card" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '740px', 
          maxHeight: '92vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          padding: '20px 26px 16px 26px', 
          borderBottom: '1px solid var(--border-subtle)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: '#ECFDF5', 
              border: '1px solid #A7F3D0', 
              color: '#047857',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0 
            }}>
              <FileText size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  Ketentuan Layanan & Akad Transparan
                </h3>
                <span style={{ 
                  background: '#ECFDF5', 
                  color: '#047857', 
                  border: '1px solid #A7F3D0', 
                  padding: '2px 7px', 
                  borderRadius: '6px', 
                  fontSize: '0.65rem', 
                  fontWeight: 800 
                }}>
                  VERSI 2026.1
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px', margin: 0 }}>
                Pedoman Operasional Rantai Pasok & Perlindungan Mitra Saudagro Sulteng
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Tutup Ketentuan Layanan"
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'var(--slate-100)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--slate-500)', 
              transition: 'background 0.2s',
              flexShrink: 0
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Quick Filter Subtabs */}
        <div style={{ 
          padding: '10px 24px', 
          borderBottom: '1px solid var(--border-subtle)', 
          background: 'var(--slate-50)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          flexShrink: 0
        }}>
          {[
            { id: 'all', label: 'Semua Pasal' },
            { id: 'komisi', label: 'Komisi (3%-5%)' },
            { id: 'mutu', label: 'Standar Mutu & QC' },
            { id: 'pembayaran', label: 'Escrow & Pembayaran' },
            { id: 'sengketa', label: 'Penyelesaian Sengketa' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: activeTab === tab.id ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                background: activeTab === tab.id ? '#ECFDF5' : 'white',
                color: activeTab === tab.id ? 'var(--primary-700)' : 'var(--slate-600)',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Terms Content */}
        <div style={{ 
          padding: '20px 26px', 
          overflowY: 'auto', 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}>
          {filteredSections.map(sec => {
            const IconComp = sec.icon;
            return (
              <div 
                key={sec.id}
                style={{ 
                  background: 'white', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '12px', 
                  padding: '16px 18px',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '8px', 
                    background: 'var(--slate-100)', 
                    color: 'var(--primary-700)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <IconComp size={16} />
                  </div>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                    {sec.title}
                  </h4>
                </div>
                <div style={{ fontSize: '0.84rem' }}>
                  {sec.content}
                </div>
              </div>
            );
          })}

          <div style={{ 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', 
            border: '1px dashed var(--slate-300)', 
            borderRadius: '12px', 
            padding: '16px', 
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--slate-600)'
          }}>
            <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: 'var(--slate-800)' }}>
              Ada Pertanyaan atau Butuh Klarifikasi Klausul?
            </p>
            <p style={{ margin: 0 }}>
              Hubungi Tim Legal & Kepatuhan Saudagro Sulteng melalui WhatsApp Layanan Mitra di <strong>+62 811-4500-1234</strong> atau email ke <strong>halo@saudagro.id</strong>
            </p>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div style={{ 
          padding: '16px 26px', 
          borderTop: '1px solid var(--border-subtle)', 
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--slate-500)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--primary-600)' }} />
            <span>Dokumen ini mengikat secara sah seluruh mitra terdaftar Saudagro.</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '8px 18px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '8px' }}
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                if (onAccept) onAccept();
                onClose();
              }}
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle2 size={15} /> Saya Mengerti & Setuju
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
