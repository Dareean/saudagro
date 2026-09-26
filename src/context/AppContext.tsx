import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserProfile, 
  CornListing, 
  EggListing, 
  TransactionOrder, 
  B2BContract, 
  NotificationItem, 
  OrderStatus, 
  PaymentMethod,
  District,
  CornMoisture,
  CornForm,
  EggGrade,
  EggUnitType,
  ContractFrequency
} from '../types';
import { 
  SEED_USERS, 
  SEED_CORN_LISTINGS, 
  SEED_EGG_LISTINGS, 
  SEED_ORDERS, 
  SEED_CONTRACTS, 
  SEED_NOTIFICATIONS 
} from '../data/seedData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: UserProfile;
  activeUserKey: string;
  allUsers: Record<string, UserProfile>;
  assistedMode: boolean;
  setAssistedMode: (val: boolean) => void;
  switchUser: (key: 'pak_jufri' | 'bu_rahma' | 'kak_dilla' | 'admin_saudagro') => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  cornListings: CornListing[];
  eggListings: EggListing[];
  orders: TransactionOrder[];
  contracts: B2BContract[];
  notifications: NotificationItem[];
  
  // Actions
  createCornListing: (data: {
    quantityKg: number;
    pricePerKg: number;
    moistureLevel: number;
    moistureCategory: CornMoisture;
    cornForm: CornForm;
    harvestDate: string;
    description: string;
    deliveryOptions: ('Ambil di Lokasi (Self-Pickup)' | 'Diantar Penjual')[];
    district: District;
    village: string;
  }) => CornListing;

  createEggListing: (data: {
    unitType: EggUnitType;
    pricePerUnit: number;
    dailyCapacity: number;
    minOrder: number;
    grade: EggGrade;
    deliveryOptions: ('Ambil di Peternakan' | 'Diantar ke Lokasi UMKM')[];
    description: string;
    district: District;
    village: string;
  }) => EggListing;

  createCornOrder: (
    listingId: string,
    quantityKg: number,
    deliveryMethod: 'Ambil Sendiri' | 'Diantar Penjual',
    deliveryAddress: string,
    offeredPricePerKg?: number
  ) => TransactionOrder;

  createEggOrder: (
    listingId: string,
    quantity: number,
    deliveryMethod: 'Ambil Sendiri' | 'Diantar Penjual',
    deliveryAddress: string
  ) => TransactionOrder;

  createB2BContract: (data: {
    listingId: string;
    volumePerCycle: number;
    frequency: ContractFrequency;
    durationMonths: number;
    pricePerUnit: number;
    startDate: string;
    deliveryAddress: string;
    deliveryMethod: 'Diantar Peternak' | 'Diambil UMKM';
    termsNotes?: string;
  }) => B2BContract;

  updateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
  acceptNegotiation: (orderId: string) => void;
  rejectNegotiation: (orderId: string) => void;
  simulatePayment: (orderId: string, method: PaymentMethod) => void;
  confirmDelivery: (orderId: string, notes?: string) => void;
  confirmReceipt: (orderId: string) => void;
  submitOrderRating: (orderId: string, stars: number, comment: string) => void;
  openDispute: (orderId: string, reason: string) => void;
  resolveDispute: (orderId: string, resolutionNotes: string) => void;

  fulfillContractCycle: (contractId: string, cycleNumber: number, notes?: string) => void;
  payContractCycle: (contractId: string, cycleNumber: number) => void;

  registerAssistedFarmer: (data: {
    name: string;
    phone: string;
    role: 'CORN_FARMER' | 'EGG_FARMER' | 'UMKM_BUYER';
    district: District;
    village: string;
    farmCapacity: string;
  }) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  loginAs: (userKey: string) => void;
  logout: () => void;
  registerUser: (data: {
    name: string;
    phone: string;
    role: 'CORN_FARMER' | 'EGG_FARMER' | 'UMKM_BUYER';
    district: District;
    village: string;
    businessName?: string;
  }) => void;

  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToSeedData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'saudagro_users_v3',
  ACTIVE_KEY: 'saudagro_active_user_key_v3',
  AUTH: 'saudagro_is_auth_v3',
  CORN_LISTINGS: 'saudagro_corn_listings_v3',
  EGG_LISTINGS: 'saudagro_egg_listings_v3',
  ORDERS: 'saudagro_orders_v3',
  CONTRACTS: 'saudagro_contracts_v3',
  NOTIFICATIONS: 'saudagro_notifications_v3',
  ASSISTED_MODE: 'saudagro_assisted_mode_v3',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<Record<string, UserProfile>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : false;
  });

  const [activeUserKey, setActiveUserKey] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_KEY);
    return saved || 'pak_jufri';
  });

  const [assistedMode, setAssistedMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSISTED_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  const [activeTab, setActiveTab] = useState<string>('market_corn');

  const [cornListings, setCornListings] = useState<CornListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CORN_LISTINGS);
    return saved ? JSON.parse(saved) : SEED_CORN_LISTINGS;
  });

  const [eggListings, setEggListings] = useState<EggListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EGG_LISTINGS);
    return saved ? JSON.parse(saved) : SEED_EGG_LISTINGS;
  });

  const [orders, setOrders] = useState<TransactionOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  const [contracts, setContracts] = useState<B2BContract[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
    return saved ? JSON.parse(saved) : SEED_CONTRACTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_KEY, activeUserKey);
  }, [activeUserKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSISTED_MODE, JSON.stringify(assistedMode));
  }, [assistedMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CORN_LISTINGS, JSON.stringify(cornListings));
  }, [cornListings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EGG_LISTINGS, JSON.stringify(eggListings));
  }, [eggListings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const currentUser = allUsers[activeUserKey] || SEED_USERS.pak_jufri;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const switchUser = (key: 'pak_jufri' | 'bu_rahma' | 'kak_dilla' | 'admin_saudagro') => {
    setActiveUserKey(key);
    if (key === 'pak_jufri') {
      setActiveTab('dashboard_farmer');
    } else if (key === 'bu_rahma') {
      setActiveTab('dashboard_egg_farmer');
    } else if (key === 'kak_dilla') {
      setActiveTab('dashboard_umkm');
    } else if (key === 'admin_saudagro') {
      setActiveTab('admin');
    }
  };

  const createCornListing = (data: {
    quantityKg: number;
    pricePerKg: number;
    moistureLevel: number;
    moistureCategory: CornMoisture;
    cornForm: CornForm;
    harvestDate: string;
    description: string;
    deliveryOptions: ('Ambil di Lokasi (Self-Pickup)' | 'Diantar Penjual')[];
    district: District;
    village: string;
  }): CornListing => {
    const newListing: CornListing = {
      id: `crn_${Date.now()}`,
      code: `JAG-SIG-${Math.floor(10 + Math.random() * 90)}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      district: data.district,
      village: data.village,
      quantityKg: data.quantityKg,
      remainingKg: data.quantityKg,
      pricePerKg: data.pricePerKg,
      moistureLevel: data.moistureLevel,
      moistureCategory: data.moistureCategory,
      cornForm: data.cornForm,
      harvestDate: data.harvestDate,
      status: 'available',
      description: data.description,
      deliveryOptions: data.deliveryOptions,
      images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80'],
      createdAt: new Date().toISOString()
    };

    setCornListings(prev => [newListing, ...prev]);
    addNotification({
      userId: currentUser.id,
      title: 'Listing Jagung Berhasil Dibuat',
      message: `Pasokan jagung ${data.quantityKg.toLocaleString()} Kg (${data.cornForm}) kini tayang di marketplace Saudagro.`,
      type: 'order'
    });

    triggerCelebration();
    return newListing;
  };

  const createEggListing = (data: {
    unitType: EggUnitType;
    pricePerUnit: number;
    dailyCapacity: number;
    minOrder: number;
    grade: EggGrade;
    deliveryOptions: ('Ambil di Peternakan' | 'Diantar ke Lokasi UMKM')[];
    description: string;
    district: District;
    village: string;
  }): EggListing => {
    const newListing: EggListing = {
      id: `egg_${Date.now()}`,
      code: `TLR-PLU-${Math.floor(10 + Math.random() * 90)}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      district: data.district,
      village: data.village,
      unitType: data.unitType,
      pricePerUnit: data.pricePerUnit,
      dailyCapacity: data.dailyCapacity,
      minOrder: data.minOrder,
      grade: data.grade,
      deliveryOptions: data.deliveryOptions,
      status: 'available',
      description: data.description,
      images: ['https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&auto=format&fit=crop&q=80'],
      createdAt: new Date().toISOString()
    };

    setEggListings(prev => [newListing, ...prev]);
    addNotification({
      userId: currentUser.id,
      title: 'Listing Pasokan Telur Diterbitkan',
      message: `Pasokan telur (${data.grade}) dengan kapasitas ${data.dailyCapacity} ${data.unitType}/hari siap menerima order UMKM.`,
      type: 'contract'
    });

    triggerCelebration();
    return newListing;
  };

  const createCornOrder = (
    listingId: string,
    quantityKg: number,
    deliveryMethod: 'Ambil Sendiri' | 'Diantar Penjual',
    deliveryAddress: string,
    offeredPricePerKg?: number
  ): TransactionOrder => {
    const listing = cornListings.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing jagung tidak ditemukan');

    const effectivePrice = offeredPricePerKg && offeredPricePerKg > 0 ? offeredPricePerKg : listing.pricePerKg;
    const subtotal = quantityKg * effectivePrice;
    const commissionRate = 0.03; // 3% per PRD REQ-23
    const commissionFee = Math.round(subtotal * commissionRate);
    const sellerNetRevenue = subtotal - commissionFee;
    const deliveryFee = deliveryMethod === 'Diantar Penjual' ? 150000 : 0;
    const totalAmount = subtotal + deliveryFee;

    const hasNegotiation = !!(offeredPricePerKg && offeredPricePerKg !== listing.pricePerKg);

    const newOrder: TransactionOrder = {
      id: `ord_${Date.now()}`,
      code: `SDG-JAG-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: 'CORN',
      listingId: listing.id,
      listingTitle: `${listing.cornForm} KA ${listing.moistureLevel}% (${listing.district})`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      buyerRole: currentUser.role,
      sellerId: listing.farmerId,
      sellerName: listing.farmerName,
      sellerPhone: listing.farmerPhone,
      sellerRole: 'CORN_FARMER',
      quantity: quantityKg,
      unit: 'Kg',
      pricePerUnit: effectivePrice,
      subtotal,
      commissionRate,
      commissionFee,
      sellerNetRevenue,
      deliveryMethod,
      deliveryAddress,
      deliveryFee,
      totalAmount,
      negotiation: hasNegotiation ? {
        originalPricePerUnit: listing.pricePerKg,
        offeredPricePerUnit: effectivePrice,
        status: 'pending',
        notes: `Tawaran harga khusus dari ${currentUser.name}`
      } : undefined,
      status: hasNegotiation ? 'pending_confirmation' : 'confirmed',
      paymentStatus: 'unpaid',
      paymentMethod: 'va_bri',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update remaining quantity
    setCornListings(prev => prev.map(item => {
      if (item.id === listingId) {
        const remaining = Math.max(0, item.remainingKg - quantityKg);
        return {
          ...item,
          remainingKg: remaining,
          status: remaining === 0 ? 'sold' : 'available'
        };
      }
      return item;
    }));

    // Notify seller
    addNotification({
      userId: listing.farmerId,
      title: hasNegotiation ? 'Tawaran Nego Pesanan Jagung Masuk' : 'Pesanan Jagung Pakan Baru',
      message: `${currentUser.name} memesan ${quantityKg.toLocaleString()} Kg jagung (${newOrder.code}).`,
      type: 'order'
    });

    triggerCelebration();
    return newOrder;
  };

  const createEggOrder = (
    listingId: string,
    quantity: number,
    deliveryMethod: 'Ambil Sendiri' | 'Diantar Penjual',
    deliveryAddress: string
  ): TransactionOrder => {
    const listing = eggListings.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing telur tidak ditemukan');

    const subtotal = quantity * listing.pricePerUnit;
    const commissionRate = 0.05; // 5% per PRD REQ-23
    const commissionFee = Math.round(subtotal * commissionRate);
    const sellerNetRevenue = subtotal - commissionFee;
    const deliveryFee = deliveryMethod === 'Diantar Penjual' ? 50000 : 0;
    const totalAmount = subtotal + deliveryFee;

    const newOrder: TransactionOrder = {
      id: `ord_${Date.now()}`,
      code: `SDG-TLR-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: 'EGG_ONEOFF',
      listingId: listing.id,
      listingTitle: `${listing.grade} (${listing.unitType})`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      buyerRole: currentUser.role,
      sellerId: listing.farmerId,
      sellerName: listing.farmerName,
      sellerPhone: listing.farmerPhone,
      sellerRole: 'EGG_FARMER',
      quantity,
      unit: listing.unitType,
      pricePerUnit: listing.pricePerUnit,
      subtotal,
      commissionRate,
      commissionFee,
      sellerNetRevenue,
      deliveryMethod,
      deliveryAddress,
      deliveryFee,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      paymentMethod: 'qris',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Notify seller
    addNotification({
      userId: listing.farmerId,
      title: 'Pesanan Telur Grosir Baru Masuk',
      message: `${currentUser.name} memesan ${quantity} ${listing.unitType} telur (${newOrder.code}).`,
      type: 'order'
    });

    triggerCelebration();
    return newOrder;
  };

  const createB2BContract = (data: {
    listingId: string;
    volumePerCycle: number;
    frequency: ContractFrequency;
    durationMonths: number;
    pricePerUnit: number;
    startDate: string;
    deliveryAddress: string;
    deliveryMethod: 'Diantar Peternak' | 'Diambil UMKM';
    termsNotes?: string;
  }): B2BContract => {
    const listing = eggListings.find(l => l.id === data.listingId);
    if (!listing) throw new Error('Listing telur tidak ditemukan');

    // Calculate total cycles
    let cyclesCount = 12;
    if (data.frequency === 'Harian') cyclesCount = data.durationMonths * 30;
    else if (data.frequency === '2x Seminggu') cyclesCount = data.durationMonths * 8;
    else if (data.frequency === 'Mingguan') cyclesCount = data.durationMonths * 4;
    else if (data.frequency === '2 Minggu Sekali') cyclesCount = data.durationMonths * 2;

    const commissionRate = 0.05; // 5% per PRD
    const cycleValue = data.volumePerCycle * data.pricePerUnit;
    const commissionFeePerCycle = Math.round(cycleValue * commissionRate);
    const estimatedTotalValue = cycleValue * cyclesCount;

    const cycles: B2BContract['cycles'] = [];
    const baseDate = new Date(data.startDate);

    for (let i = 1; i <= cyclesCount; i++) {
      const scheduled = new Date(baseDate);
      if (data.frequency === 'Harian') scheduled.setDate(baseDate.getDate() + (i - 1));
      else if (data.frequency === 'Mingguan') scheduled.setDate(baseDate.getDate() + (i - 1) * 7);
      else if (data.frequency === '2x Seminggu') scheduled.setDate(baseDate.getDate() + Math.floor((i - 1) * 3.5));
      else scheduled.setDate(baseDate.getDate() + (i - 1) * 14);

      cycles.push({
        cycleNumber: i,
        scheduledDate: scheduled.toISOString().split('T')[0],
        volume: data.volumePerCycle,
        status: 'scheduled',
        paidAmount: 0,
      });
    }

    const newContract: B2BContract = {
      id: `ktr_${Date.now()}`,
      code: `KTR-B2B-2026-${Math.floor(100 + Math.random() * 900)}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerBusiness: currentUser.businessName || `${currentUser.name} Business`,
      buyerPhone: currentUser.phone,
      sellerId: listing.farmerId,
      sellerName: listing.farmerName,
      sellerFarmName: listing.farmerName,
      sellerPhone: listing.farmerPhone,
      listingId: listing.id,
      eggGrade: listing.grade,
      unitType: listing.unitType,
      volumePerCycle: data.volumePerCycle,
      frequency: data.frequency,
      pricePerUnit: data.pricePerUnit,
      durationMonths: data.durationMonths,
      totalCycles: cyclesCount,
      completedCycles: 0,
      startDate: data.startDate,
      nextDeliveryDate: data.startDate,
      deliveryAddress: data.deliveryAddress,
      deliveryMethod: data.deliveryMethod,
      status: 'active',
      commissionRate,
      commissionFeePerCycle,
      estimatedTotalValue,
      cycles,
      termsNotes: data.termsNotes || 'Kontrak pasokan harga tetap dengan garansi kualitas Grade A dan retur pecah dalam 24 jam.',
      createdAt: new Date().toISOString(),
    };

    setContracts(prev => [newContract, ...prev]);

    // Notify seller
    addNotification({
      userId: listing.farmerId,
      title: 'Kontrak B2B Baru Diaktifkan!',
      message: `${currentUser.name} telah menandatangani kontrak pasokan rutin ${data.volumePerCycle} ${listing.unitType}/${data.frequency} selama ${data.durationMonths} bulan.`,
      type: 'contract'
    });

    triggerCelebration();
    return newContract;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, notes?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          trackingNotes: notes || o.trackingNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  const acceptNegotiation = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.negotiation) {
        return {
          ...o,
          negotiation: {
            ...o.negotiation,
            status: 'accepted'
          },
          status: 'confirmed',
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
    triggerCelebration();
  };

  const rejectNegotiation = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.negotiation) {
        return {
          ...o,
          negotiation: {
            ...o.negotiation,
            status: 'rejected'
          },
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  const simulatePayment = (orderId: string, method: PaymentMethod) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const isCOD = method === 'cod';
        return {
          ...o,
          paymentMethod: method,
          paymentStatus: isCOD ? 'cod_pending' : 'paid_escrow',
          status: 'in_delivery',
          trackingNotes: isCOD ? 'Pesanan COD diproses, kurir/penjual segera mengirim barang.' : 'Dana pembayaran aman di Escrow Saudagro, pesanan siap dikirim.',
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      addNotification({
        userId: targetOrder.sellerId,
        title: 'Pembayaran Pesanan Diterima (Escrow)',
        message: `Pembeli telah membayar ${targetOrder.code}. Silakan siapkan dan kirim pesanan.`,
        type: 'payment'
      });
    }

    triggerCelebration();
  };

  const confirmDelivery = (orderId: string, notes?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'in_delivery',
          trackingNotes: notes || 'Barang dalam perjalanan / siap diambil di lokasi.',
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      addNotification({
        userId: targetOrder.buyerId,
        title: 'Pesanan Sedang Dikirim / Siap Ambil',
        message: `Penjual telah mengirimkan ${targetOrder.code}. Konfirmasi penerimaan jika barang sudah sampai.`,
        type: 'order'
      });
    }
  };

  const confirmReceipt = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'completed',
          paymentStatus: 'released_to_seller',
          trackingNotes: 'Barang telah diterima pembeli dengan baik. Dana bersih telah diteruskan ke saldo penjual.',
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      addNotification({
        userId: targetOrder.sellerId,
        title: 'Pesanan Selesai & Dana Cair!',
        message: `Pembeli telah mengonfirmasi penerimaan barang untuk ${targetOrder.code}. Dana Rp ${targetOrder.sellerNetRevenue.toLocaleString()} telah masuk.`,
        type: 'payment'
      });
    }

    triggerCelebration();
  };

  const submitOrderRating = (orderId: string, stars: number, comment: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          rating: {
            stars,
            comment,
            createdAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    triggerCelebration();
  };

  const openDispute = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'disputed',
          dispute: {
            reason,
            status: 'open',
            createdAt: new Date().toISOString()
          },
          trackingNotes: `Sengketa diajukan: ${reason}. Tim Saudagro Ops akan segera melakukan mediasi.`,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    // Notify admin
    addNotification({
      userId: 'usr_admin',
      title: 'Sengketa Transaksi Baru Terbuka',
      message: `Pesanan ${orderId} mengajukan komplain sengketa: "${reason}"`,
      type: 'dispute'
    });
  };

  const resolveDispute = (orderId: string, resolutionNotes: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.dispute) {
        return {
          ...o,
          status: 'completed',
          paymentStatus: 'released_to_seller',
          dispute: {
            ...o.dispute,
            status: 'resolved',
            resolutionNotes
          },
          trackingNotes: `Sengketa diselesaikan oleh Ops: ${resolutionNotes}`,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  const fulfillContractCycle = (contractId: string, cycleNumber: number, notes?: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        const updatedCycles = c.cycles.map(cyc => {
          if (cyc.cycleNumber === cycleNumber) {
            return {
              ...cyc,
              status: 'dispatched' as const,
              deliveryNotes: notes || 'Batch telur dikirim tepat waktu sesuai jadwal kontrak.',
            };
          }
          return cyc;
        });
        return { ...c, cycles: updatedCycles };
      }
      return c;
    }));

    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      addNotification({
        userId: contract.buyerId,
        title: `Pengiriman Kontrak Batch #${cycleNumber} Sedang Berlangsung`,
        message: `${contract.sellerName} telah mengirimkan ${contract.volumePerCycle} ${contract.unitType} telur sesuai jadwal.`,
        type: 'contract'
      });
    }
  };

  const payContractCycle = (contractId: string, cycleNumber: number) => {
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        const cycleValue = c.volumePerCycle * c.pricePerUnit;
        const updatedCycles = c.cycles.map(cyc => {
          if (cyc.cycleNumber === cycleNumber) {
            return {
              ...cyc,
              status: 'paid' as const,
              paidAmount: cycleValue,
              completedAt: new Date().toISOString()
            };
          }
          return cyc;
        });

        const completedCount = updatedCycles.filter(cy => cy.status === 'paid').length;
        const nextPending = updatedCycles.find(cy => cy.status === 'scheduled');

        return {
          ...c,
          completedCycles: completedCount,
          nextDeliveryDate: nextPending ? nextPending.scheduledDate : 'Semua Batch Selesai',
          status: completedCount >= c.totalCycles ? 'completed' : 'active',
          cycles: updatedCycles
        };
      }
      return c;
    }));

    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      addNotification({
        userId: contract.sellerId,
        title: `Pembayaran Kontrak Batch #${cycleNumber} Selesai`,
        message: `${contract.buyerName} telah melunasi pembayaran batch ke-${cycleNumber}.`,
        type: 'payment'
      });
    }

    triggerCelebration();
  };

  const registerAssistedFarmer = (data: {
    name: string;
    phone: string;
    role: 'CORN_FARMER' | 'EGG_FARMER' | 'UMKM_BUYER';
    district: District;
    village: string;
    farmCapacity: string;
  }) => {
    const newUserId = `usr_${Date.now()}`;
    const newUser: UserProfile = {
      id: newUserId,
      name: data.name,
      phone: data.phone,
      role: data.role,
      district: data.district,
      village: data.village,
      address: `${data.village}, ${data.district}`,
      farmCapacity: data.farmCapacity,
      verified: true, // Auto-verified through assisted registration
      rating: 5.0,
      reviewCount: 1,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: `Anggota terdaftar pendampingan agen lapangan Saudagro ${data.district}.`,
      joinDate: 'Hari ini',
      assistedMode: true,
    };

    const key = `assisted_${newUserId}`;
    setAllUsers(prev => ({ ...prev, [key]: newUser }));
    setActiveUserKey(key);
    setAssistedMode(true);

    if (data.role === 'CORN_FARMER') setActiveTab('dashboard_farmer');
    else if (data.role === 'EGG_FARMER') setActiveTab('dashboard_egg_farmer');
    else setActiveTab('dashboard_umkm');

    triggerCelebration();
  };

  const loginAs = (userKey: string) => {
    setActiveUserKey(userKey);
    setIsAuthenticated(true);
    triggerCelebration();
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const registerUser = (data: {
    name: string;
    phone: string;
    role: 'CORN_FARMER' | 'EGG_FARMER' | 'UMKM_BUYER';
    district: District;
    village: string;
    businessName?: string;
  }) => {
    const newUserId = `usr_${Date.now()}`;
    const newUser: UserProfile = {
      id: newUserId,
      name: data.name,
      phone: data.phone,
      role: data.role,
      district: data.district,
      village: data.village,
      address: `${data.village}, ${data.district}`,
      businessName: data.businessName,
      verified: true,
      rating: 5.0,
      reviewCount: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: `Anggota resmi Saudagro ${data.district}.`,
      joinDate: 'Baru saja',
      assistedMode: false,
    };

    const key = `user_${newUserId}`;
    setAllUsers(prev => ({ ...prev, [key]: newUser }));
    setActiveUserKey(key);
    setIsAuthenticated(true);

    if (data.role === 'CORN_FARMER') setActiveTab('dashboard_farmer');
    else if (data.role === 'EGG_FARMER') setActiveTab('dashboard_egg_farmer');
    else setActiveTab('dashboard_umkm');

    triggerCelebration();
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const resetToSeedData = () => {
    localStorage.clear();
    setAllUsers(SEED_USERS);
    setActiveUserKey('pak_jufri');
    setAssistedMode(false);
    setCornListings(SEED_CORN_LISTINGS);
    setEggListings(SEED_EGG_LISTINGS);
    setOrders(SEED_ORDERS);
    setContracts(SEED_CONTRACTS);
    setNotifications(SEED_NOTIFICATIONS);
    setActiveTab('market_corn');
    triggerCelebration();
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      activeUserKey,
      allUsers,
      assistedMode,
      setAssistedMode,
      switchUser,
      activeTab,
      setActiveTab,
      cornListings,
      eggListings,
      orders,
      contracts,
      notifications,
      createCornListing,
      createEggListing,
      createCornOrder,
      createEggOrder,
      createB2BContract,
      updateOrderStatus,
      acceptNegotiation,
      rejectNegotiation,
      simulatePayment,
      confirmDelivery,
      confirmReceipt,
      submitOrderRating,
      openDispute,
      resolveDispute,
      fulfillContractCycle,
      payContractCycle,
      registerAssistedFarmer,
      isAuthenticated,
      setIsAuthenticated,
      loginAs,
      logout,
      registerUser,
      markNotificationAsRead,
      clearAllNotifications,
      resetToSeedData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
