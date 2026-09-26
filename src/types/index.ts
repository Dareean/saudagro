export type UserRole = 'CORN_FARMER' | 'EGG_FARMER' | 'UMKM_BUYER' | 'ADMIN';

export type District = 'Kota Palu' | 'Kabupaten Sigi' | 'Kabupaten Donggala' | 'Kabupaten Parigi Moutong';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  district: District;
  village: string;
  address: string;
  businessName?: string;
  farmCapacity?: string; // e.g. "3.5 Hektar Jagung" or "5.000 Ekor Ayam Petelur"
  verified: boolean;
  rating: number;
  reviewCount: number;
  avatar: string;
  bio: string;
  joinDate: string;
  assistedMode?: boolean; // REQ-04 mode ramah lansia/petani
}

export type CornForm = 'Pipil Kering' | 'Tongkol Kering' | 'Pipil Basah';
export type CornMoisture = 'Standar Pakan (<= 14%)' | 'Sedang (14.1% - 16%)' | 'Basah (> 16%)';

export interface CornListing {
  id: string;
  code: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  district: District;
  village: string;
  quantityKg: number;
  remainingKg: number;
  pricePerKg: number;
  moistureLevel: number; // e.g. 13.5
  moistureCategory: CornMoisture;
  cornForm: CornForm;
  harvestDate: string;
  status: 'available' | 'reserved' | 'sold';
  description: string;
  deliveryOptions: ('Ambil di Lokasi (Self-Pickup)' | 'Diantar Penjual')[];
  images: string[];
  createdAt: string;
}

export type EggGrade = 'Grade A (Utuh Bersih 60-65g)' | 'Grade Standar (55-60g)' | 'Super Jumbo';
export type EggUnitType = 'Rak / Tray (30 Butir)' | 'Kilogram (Kg)';

export interface EggListing {
  id: string;
  code: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  district: District;
  village: string;
  unitType: EggUnitType;
  pricePerUnit: number;
  dailyCapacity: number; // e.g. 100 rak / hari
  minOrder: number;
  grade: EggGrade;
  deliveryOptions: ('Ambil di Peternakan' | 'Diantar ke Lokasi UMKM')[];
  status: 'available' | 'limited' | 'sold_out';
  description: string;
  images: string[];
  createdAt: string;
}

export type OrderStatus = 
  | 'pending_confirmation' 
  | 'confirmed' 
  | 'in_delivery' 
  | 'received' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed';

export type PaymentStatus = 
  | 'unpaid' 
  | 'paid_escrow' 
  | 'released_to_seller' 
  | 'cod_pending' 
  | 'cod_settled';

export type PaymentMethod = 'qris' | 'va_bca' | 'va_bri' | 'cod' | 'transfer_manual';

export interface TransactionOrder {
  id: string;
  code: string;
  type: 'CORN' | 'EGG_ONEOFF';
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerRole: UserRole;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerRole: UserRole;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  subtotal: number;
  commissionRate: number; // 0.03 for corn, 0.05 for egg
  commissionFee: number;
  sellerNetRevenue: number;
  deliveryMethod: 'Ambil Sendiri' | 'Diantar Penjual';
  deliveryAddress: string;
  deliveryFee: number;
  totalAmount: number;
  negotiation?: {
    originalPricePerUnit: number;
    offeredPricePerUnit: number;
    status: 'pending' | 'accepted' | 'rejected';
    notes?: string;
  };
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  trackingNotes?: string;
  rating?: {
    stars: number;
    comment: string;
    createdAt: string;
  };
  dispute?: {
    reason: string;
    status: 'open' | 'resolved' | 'rejected';
    resolutionNotes?: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ContractFrequency = 'Harian' | '2x Seminggu' | 'Mingguan' | '2 Minggu Sekali';

export interface ContractCycle {
  cycleNumber: number;
  scheduledDate: string;
  volume: number;
  status: 'scheduled' | 'dispatched' | 'received' | 'paid';
  paidAmount: number;
  deliveryNotes?: string;
  completedAt?: string;
}

export interface B2BContract {
  id: string;
  code: string;
  buyerId: string;
  buyerName: string;
  buyerBusiness: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerFarmName: string;
  sellerPhone: string;
  listingId: string;
  eggGrade: EggGrade;
  unitType: EggUnitType;
  volumePerCycle: number;
  frequency: ContractFrequency;
  pricePerUnit: number;
  durationMonths: number;
  totalCycles: number;
  completedCycles: number;
  startDate: string;
  nextDeliveryDate: string;
  deliveryAddress: string;
  deliveryMethod: 'Diantar Peternak' | 'Diambil UMKM';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  commissionRate: number; // 0.05
  commissionFeePerCycle: number;
  estimatedTotalValue: number;
  cycles: ContractCycle[];
  termsNotes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'contract' | 'payment' | 'dispute' | 'system';
  isRead: boolean;
  createdAt: string;
  linkAction?: string;
}
