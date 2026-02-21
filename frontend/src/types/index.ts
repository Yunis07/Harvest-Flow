// Order Types
export type OrderStatus = 
  | 'CREATED'
  | 'TRANSPORT_ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number; // in kg
  pricePerKg: number;
  totalPrice: number;
  sellerId: string;
  sellerName: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  transporterId?: string;
  transporterName?: string;
  transporterPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  pricePerKg: number;
  availableQuantity: number;
  unit: 'kg' | 'piece' | 'dozen';
  freshnessDays: number;
  imageUrl?: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  isOrganic: boolean;
  isUgly?: boolean; // For ugly produce section
  harvestedAt?: Date;
  createdAt: Date;
}

export type ProductCategory = 
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'dairy'
  | 'pulses'
  | 'spices'
  | 'other';

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Transporter Types
export interface TransportRequest {
  id: string;
  orderId: string;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  distance: number; // in km
  estimatedEarnings: number;
  items: string[]; // Product names
  totalWeight: number; // in kg
  buyerName: string;
  sellerName: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface ActiveRide {
  orderId: string;
  status: OrderStatus;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  currentLocation: {
    lat: number;
    lng: number;
  };
  route: [number, number][]; // Array of [lat, lng] coordinates
  distance: number;
  estimatedTime: number; // in minutes
  earnings: number;
  buyerName: string;
  buyerPhone: string;
  sellerName: string;
  sellerPhone: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'transporter' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'location';
}

export interface GroupChat {
  orderId: string;
  participants: {
    id: string;
    name: string;
    role: 'buyer' | 'seller' | 'transporter';
  }[];
  messages: ChatMessage[];
  createdAt: Date;
  isActive: boolean;
}

// Risk Assessment Types
export interface RiskAssessment {
  cropType: string;
  region: string;
  confidenceScore: number; // 0-100
  riskCategory: 'low' | 'medium' | 'high' | 'critical';
  expectedYield: number;
  yieldVariance: number;
  simulationResults: number[];
  weatherFactors: {
    rainfall: number;
    temperature: number;
    humidity: number;
  };
  recommendation: string;
  timestamp: Date;
}

// Seller Stats
export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalRatings: number;
  activeOrders: number;
}

// Transporter Stats
export interface TransporterStats {
  totalDeliveries: number;
  totalEarnings: number;
  totalDistance: number;
  averageRating: number;
  activeRide: boolean;
}
