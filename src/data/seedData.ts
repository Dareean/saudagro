import { UserProfile, CornListing, EggListing, TransactionOrder, B2BContract, NotificationItem } from '../types';

export const SEED_USERS: Record<string, UserProfile> = {
  pak_jufri: {
    id: 'usr_jufri',
    name: 'Pak Jufri Latandu',
    phone: '081245678901',
    role: 'CORN_FARMER',
    district: 'Kabupaten Sigi',
    village: 'Desa Lolu, Kec. Sigi Biromaru',
    address: 'Jl. Poros Palu-Kulawi Km 12, Sigi',
    farmCapacity: '4.5 Hektar (Kapasitas ~18 Ton/Panen)',
    verified: true,
    rating: 4.9,
    reviewCount: 38,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    bio: 'Petani jagung hibrida Sigi sejak 2012. Panen pipil kering dengan kadar air terjamin di bawah 14%. Siap pasok peternak Palu secara langsung tanpa perantara tengkulak.',
    joinDate: '15 Jan 2026',
    assistedMode: false,
  },
  bu_rahma: {
    id: 'usr_rahma',
    name: 'Bu Rahmawati, S.Pt.',
    phone: '085233445566',
    role: 'EGG_FARMER',
    district: 'Kota Palu',
    village: 'Kel. Balaroa, Kec. Palu Barat',
    address: 'Jl. Munif Rahman Lorong Peternakan No. 8, Palu Barat',
    businessName: 'Peternakan Ayam Petelur Berkah Palu',
    farmCapacity: '6.000 Ekor Layer (Produksi ~150-180 Rak/Hari)',
    verified: true,
    rating: 4.95,
    reviewCount: 52,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Peternak layer hen mandiri Palu. Membutuhkan pakan jagung pipil kering 2-3 ton/minggu dan menyediakan pasokan telur segar Grade A harian untuk bakery/catering.',
    joinDate: '10 Jan 2026',
    assistedMode: false,
  },
  kak_dilla: {
    id: 'usr_dilla',
    name: 'Dilla Fadilah (Kak Dilla)',
    phone: '082199887766',
    role: 'UMKM_BUYER',
    district: 'Kota Palu',
    village: 'Kel. Besusu Barat, Kec. Palu Timur',
    address: 'Jl. R.A. Kartini No. 45, Palu Timur',
    businessName: 'Dilla Bakery & Catering Palu',
    farmCapacity: 'Kebutuhan Harian: 40-60 Rak Telur Utuh',
    verified: true,
    rating: 5.0,
    reviewCount: 41,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Usaha roti, cake, dan catering harian di Palu. Membutuhkan kontinuitas pasokan telur segar berkualitas dengan harga kontrak tetap agar biaya produksi stabil.',
    joinDate: '20 Jan 2026',
    assistedMode: false,
  },
  admin_saudagro: {
    id: 'usr_admin',
    name: 'Saudagro Ops Palu Hub',
    phone: '08114500099',
    role: 'ADMIN',
    district: 'Kota Palu',
    village: 'Kec. Palu Selatan',
    address: 'Pusat Inkubasi Bisnis Agromandiri Sulteng, Palu',
    businessName: 'Saudagro Platform Operations',
    verified: true,
    rating: 5.0,
    reviewCount: 120,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Pusat verifikasi, rekonsiliasi komisi, dan pendampingan transaksi agribisnis Sulawesi Tengah.',
    joinDate: '01 Jan 2026',
    assistedMode: false,
  }
};

export const SEED_CORN_LISTINGS: CornListing[] = [
  {
    id: 'crn_001',
    code: 'JAG-SIG-01',
    farmerId: 'usr_jufri',
    farmerName: 'Pak Jufri Latandu',
    farmerPhone: '081245678901',
    district: 'Kabupaten Sigi',
    village: 'Desa Lolu, Sigi Biromaru',
    quantityKg: 3000,
    remainingKg: 2000,
    pricePerKg: 5200,
    moistureLevel: 13.5,
    moistureCategory: 'Standar Pakan (<= 14%)',
    cornForm: 'Pipil Kering',
    harvestDate: '2026-08-18',
    status: 'available',
    description: 'Jagung hibrida panen segar sudah dipipil dan dijemur matahari terik. Kadar air terukur moisture meter 13.5%, sangat aman disimpan untuk pakan ayam petelur.',
    deliveryOptions: ['Ambil di Lokasi (Self-Pickup)', 'Diantar Penjual'],
    images: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: '2026-08-19T08:30:00Z'
  },
  {
    id: 'crn_002',
    code: 'JAG-DGL-02',
    farmerId: 'usr_farmer_anto',
    farmerName: 'Pak Anto Marawola',
    farmerPhone: '081399881122',
    district: 'Kabupaten Donggala',
    village: 'Kec. Sindue, Donggala',
    quantityKg: 5000,
    remainingKg: 5000,
    pricePerKg: 5000,
    moistureLevel: 14.0,
    moistureCategory: 'Standar Pakan (<= 14%)',
    cornForm: 'Pipil Kering',
    harvestDate: '2026-08-17',
    status: 'available',
    description: 'Jagung pakan berkualitas tinggi dari lahan subur Sindue. Biji kuning bersih, bebas jamur, siap kirim ke peternakan area Palu & Donggala.',
    deliveryOptions: ['Ambil di Lokasi (Self-Pickup)', 'Diantar Penjual'],
    images: [
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: '2026-08-20T09:15:00Z'
  },
  {
    id: 'crn_003',
    code: 'JAG-SIG-03',
    farmerId: 'usr_farmer_yusuf',
    farmerName: 'Kelompok Tani Tolo Sigi',
    farmerPhone: '085344119900',
    district: 'Kabupaten Sigi',
    village: 'Desa Marawola, Sigi',
    quantityKg: 8000,
    remainingKg: 8000,
    pricePerKg: 4900,
    moistureLevel: 15.2,
    moistureCategory: 'Sedang (14.1% - 16%)',
    cornForm: 'Tongkol Kering',
    harvestDate: '2026-08-19',
    status: 'available',
    description: 'Jagung tongkol kering jemur 2 hari. Cocok untuk peternak yang punya mesin pemipil sendiri. Harga lebih ekonomis.',
    deliveryOptions: ['Ambil di Lokasi (Self-Pickup)'],
    images: [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: '2026-08-20T11:00:00Z'
  }
];

export const SEED_EGG_LISTINGS: EggListing[] = [
  {
    id: 'egg_001',
    code: 'TLR-PLU-01',
    farmerId: 'usr_rahma',
    farmerName: 'Bu Rahmawati (Berkah Palu)',
    farmerPhone: '085233445566',
    district: 'Kota Palu',
    village: 'Kel. Balaroa, Palu Barat',
    unitType: 'Rak / Tray (30 Butir)',
    pricePerUnit: 52000,
    dailyCapacity: 150,
    minOrder: 5,
    grade: 'Grade A (Utuh Bersih 60-65g)',
    deliveryOptions: ['Ambil di Peternakan', 'Diantar ke Lokasi UMKM'],
    status: 'available',
    description: 'Telur ayam ras segar panen pagi hari. Cangkang tebal warna cokelat mulus, kuning telur oranye pekat, bebas retak. Tersedia untuk order rutin bakery & resto.',
    images: [
      'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: '2026-08-18T07:00:00Z'
  },
  {
    id: 'egg_002',
    code: 'TLR-SIG-02',
    farmerId: 'usr_egg_hendra',
    farmerName: 'Peternakan Surya Sigi',
    farmerPhone: '081299882244',
    district: 'Kabupaten Sigi',
    village: 'Desa Kalukubula, Sigi',
    unitType: 'Kilogram (Kg)',
    pricePerUnit: 28500,
    dailyCapacity: 300,
    minOrder: 20,
    grade: 'Grade Standar (55-60g)',
    deliveryOptions: ['Ambil di Peternakan', 'Diantar ke Lokasi UMKM'],
    status: 'available',
    description: 'Telur segar ditimbang per Kg (1 Kg isi sekitar 16-17 butir). Kualitas standar hotel & catering, higienis dan disortir harian.',
    images: [
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: '2026-08-19T06:30:00Z'
  },
  {
    id: 'egg_003',
    code: 'TLR-SIG-03',
    farmerId: 'usr_egg_dani',
    farmerName: 'Peternakan Mandiri Dolo',
    farmerPhone: '085299441133',
    district: 'Kabupaten Sigi',
    village: 'Desa Kotapulu, Dolo, Sigi',
    unitType: 'Rak / Tray (30 Butir)',
    pricePerUnit: 53000,
    dailyCapacity: 200,
    minOrder: 10,
    grade: 'Grade A (Utuh Bersih 60-65g)',
    deliveryOptions: ['Ambil di Peternakan', 'Diantar ke Lokasi UMKM'],
    status: 'available',
    description: 'Telur ayam ras layer pakan jagung murni. Cangkang cokelat tebal, kuning telur warna oranye alami, sangat cocok untuk bakery dan resto Palu.',
    images: [
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: '2026-08-20T08:00:00Z'
  }
];

export const SEED_CONTRACTS: B2BContract[] = [
  {
    id: 'ktr_001',
    code: 'KTR-B2B-2026-001',
    buyerId: 'usr_dilla',
    buyerName: 'Kak Dilla',
    buyerBusiness: 'Dilla Bakery & Catering Palu',
    buyerPhone: '082199887766',
    sellerId: 'usr_rahma',
    sellerName: 'Bu Rahmawati',
    sellerFarmName: 'Peternakan Berkah Palu',
    sellerPhone: '085233445566',
    listingId: 'egg_001',
    eggGrade: 'Grade A (Utuh Bersih 60-65g)',
    unitType: 'Rak / Tray (30 Butir)',
    volumePerCycle: 50,
    frequency: 'Mingguan',
    pricePerUnit: 51000, // Diskon kontrak Rp 51.000 vs retail Rp 52.000
    durationMonths: 3,
    totalCycles: 12,
    completedCycles: 3,
    startDate: '2026-08-01',
    nextDeliveryDate: '2026-08-22',
    deliveryAddress: 'Dilla Bakery, Jl. R.A. Kartini No. 45, Palu Timur',
    deliveryMethod: 'Diantar Peternak',
    status: 'active',
    commissionRate: 0.05,
    commissionFeePerCycle: 127500, // 5% of (50 * 51000 = 2,550,000)
    estimatedTotalValue: 30600000,
    termsNotes: 'Pengiriman setiap hari Sabtu pukul 08.00 WITA. Garansi retur untuk telur retak/pecah dalam waktu 24 jam.',
    cycles: [
      {
        cycleNumber: 1,
        scheduledDate: '2026-08-01',
        volume: 50,
        status: 'paid',
        paidAmount: 2550000,
        deliveryNotes: '50 Rak Grade A diantar tepat waktu.',
        completedAt: '2026-08-01T09:30:00Z'
      },
      {
        cycleNumber: 2,
        scheduledDate: '2026-08-08',
        volume: 50,
        status: 'paid',
        paidAmount: 2550000,
        deliveryNotes: 'Diterima dalam kondisi prima oleh staf dapur.',
        completedAt: '2026-08-08T09:15:00Z'
      },
      {
        cycleNumber: 3,
        scheduledDate: '2026-08-15',
        volume: 50,
        status: 'paid',
        paidAmount: 2550000,
        deliveryNotes: 'Kualitas telur sangat baik untuk adonan chiffon cake.',
        completedAt: '2026-08-15T08:45:00Z'
      },
      {
        cycleNumber: 4,
        scheduledDate: '2026-08-22',
        volume: 50,
        status: 'scheduled',
        paidAmount: 0,
        deliveryNotes: 'Jadwal pengiriman batch ke-4 akhir pekan ini.'
      },
      {
        cycleNumber: 5,
        scheduledDate: '2026-08-29',
        volume: 50,
        status: 'scheduled',
        paidAmount: 0
      }
    ],
    createdAt: '2026-07-28T10:00:00Z'
  }
];

export const SEED_ORDERS: TransactionOrder[] = [
  {
    id: 'ord_001',
    code: 'SDG-JAG-2026-001',
    type: 'CORN',
    listingId: 'crn_001',
    listingTitle: 'Jagung Pipil Kering Kadar Air 13.5%',
    buyerId: 'usr_rahma',
    buyerName: 'Bu Rahmawati (Peternak Berkah Palu)',
    buyerPhone: '085233445566',
    buyerRole: 'EGG_FARMER',
    sellerId: 'usr_jufri',
    sellerName: 'Pak Jufri Latandu',
    sellerPhone: '081245678901',
    sellerRole: 'CORN_FARMER',
    quantity: 1000,
    unit: 'Kg',
    pricePerUnit: 5200,
    subtotal: 5200000,
    commissionRate: 0.03,
    commissionFee: 156000, // 3%
    sellerNetRevenue: 5044000,
    deliveryMethod: 'Diantar Penjual',
    deliveryAddress: 'Peternakan Berkah Palu, Jl. Munif Rahman No. 8, Palu Barat',
    deliveryFee: 150000,
    totalAmount: 5350000,
    status: 'completed',
    paymentStatus: 'released_to_seller',
    paymentMethod: 'va_bri',
    trackingNotes: 'Jagung telah sampai dan diperiksa kadar airnya oleh peternak (hasil 13.4%).',
    rating: {
      stars: 5,
      comment: 'Jagung Pak Jufri sangat kering dan bersih, ayam kami makan lahap dan produksi telur terjaga!',
      createdAt: '2026-08-20T16:00:00Z'
    },
    createdAt: '2026-08-19T10:00:00Z',
    updatedAt: '2026-08-20T16:00:00Z'
  },
  {
    id: 'ord_002',
    code: 'SDG-TLR-2026-002',
    type: 'EGG_ONEOFF',
    listingId: 'egg_001',
    listingTitle: 'Telur Ayam Segar Grade A (Pagi)',
    buyerId: 'usr_dilla',
    buyerName: 'Kak Dilla (Dilla Bakery)',
    buyerPhone: '082199887766',
    buyerRole: 'UMKM_BUYER',
    sellerId: 'usr_rahma',
    sellerName: 'Bu Rahmawati (Peternak Berkah Palu)',
    sellerPhone: '085233445566',
    sellerRole: 'EGG_FARMER',
    quantity: 20,
    unit: 'Rak / Tray (30 Butir)',
    pricePerUnit: 52000,
    subtotal: 1040000,
    commissionRate: 0.05,
    commissionFee: 52000, // 5%
    sellerNetRevenue: 988000,
    deliveryMethod: 'Ambil Sendiri',
    deliveryAddress: 'Ambil langsung di peternakan Balaroa',
    deliveryFee: 0,
    totalAmount: 1040000,
    status: 'completed',
    paymentStatus: 'released_to_seller',
    paymentMethod: 'qris',
    trackingNotes: 'Pesanan tambahan untuk pesanan kue pernikahan akhir pekan.',
    rating: {
      stars: 5,
      comment: 'Telur Grade A sangat segar, kuning telurnya kental dan tidak ada yang pecah.',
      createdAt: '2026-08-20T14:30:00Z'
    },
    createdAt: '2026-08-20T09:00:00Z',
    updatedAt: '2026-08-20T14:30:00Z'
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_001',
    userId: 'usr_jufri',
    title: 'Pesanan Jagung Selesai & Dana Diteruskan',
    message: 'Pesanan 1.000 Kg Jagung (SDG-JAG-2026-001) telah dikonfirmasi diterima oleh Bu Rahma. Dana Rp 5.044.000 telah masuk ke rekening.',
    type: 'payment',
    isRead: false,
    createdAt: '2026-08-20T16:05:00Z'
  },
  {
    id: 'notif_002',
    userId: 'usr_rahma',
    title: 'Pengingat Pasokan Kontrak B2B',
    message: 'Jadwal pasokan batch ke-4 (50 Rak) untuk Dilla Bakery dijadwalkan besok Sabtu, 22 Agustus 2026.',
    type: 'contract',
    isRead: false,
    createdAt: '2026-08-21T07:00:00Z'
  },
  {
    id: 'notif_003',
    userId: 'usr_dilla',
    title: 'Konfirmasi Kontrak Pasokan Aktif',
    message: 'Kontrak B2B (KTR-B2B-2026-001) berjalan lancar dengan 3 batch telah terpenuhi 100%.',
    type: 'contract',
    isRead: true,
    createdAt: '2026-08-16T10:00:00Z'
  }
];
