import { Product, Order, TransportRequest, OrderStatus } from '@/types';

// Sample products for marketplace
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Organic Tomatoes',
    category: 'vegetables',
    pricePerKg: 45,
    availableQuantity: 200,
    unit: 'kg',
    freshnessDays: 7,
    sellerId: 'seller-demo-001',
    sellerName: 'Priya Sharma',
    sellerRating: 4.8,
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Noida, Uttar Pradesh'
    },
    isOrganic: true,
    createdAt: new Date('2024-03-01'),
  },
  {
    id: 'prod-002',
    name: 'Fresh Potatoes',
    category: 'vegetables',
    pricePerKg: 25,
    availableQuantity: 500,
    unit: 'kg',
    freshnessDays: 30,
    sellerId: 'seller-002',
    sellerName: 'Mohan Patel',
    sellerRating: 4.5,
    location: {
      lat: 28.4089,
      lng: 77.3178,
      address: 'Greater Noida, UP'
    },
    isOrganic: false,
    createdAt: new Date('2024-03-05'),
  },
  {
    id: 'prod-003',
    name: 'Alphonso Mangoes',
    category: 'fruits',
    pricePerKg: 350,
    availableQuantity: 100,
    unit: 'kg',
    freshnessDays: 5,
    sellerId: 'seller-003',
    sellerName: 'Suresh Deshmukh',
    sellerRating: 4.9,
    location: {
      lat: 28.6280,
      lng: 77.2175,
      address: 'Ratnagiri Farm, Delhi'
    },
    isOrganic: true,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'prod-004',
    name: 'Basmati Rice',
    category: 'grains',
    pricePerKg: 120,
    availableQuantity: 1000,
    unit: 'kg',
    freshnessDays: 365,
    sellerId: 'seller-004',
    sellerName: 'Gurpreet Singh',
    sellerRating: 4.7,
    location: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Gurgaon, Haryana'
    },
    isOrganic: false,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'prod-005',
    name: 'Green Chilies',
    category: 'vegetables',
    pricePerKg: 80,
    availableQuantity: 50,
    unit: 'kg',
    freshnessDays: 10,
    sellerId: 'seller-demo-001',
    sellerName: 'Priya Sharma',
    sellerRating: 4.8,
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Noida, Uttar Pradesh'
    },
    isOrganic: true,
    createdAt: new Date('2024-03-12'),
  },
  {
    id: 'prod-006',
    name: 'Fresh Onions',
    category: 'vegetables',
    pricePerKg: 35,
    availableQuantity: 300,
    unit: 'kg',
    freshnessDays: 45,
    sellerId: 'seller-005',
    sellerName: 'Ramesh Yadav',
    sellerRating: 4.3,
    location: {
      lat: 28.7041,
      lng: 77.1025,
      address: 'Rohini, Delhi'
    },
    isOrganic: false,
    createdAt: new Date('2024-03-08'),
  },
];

// Sample ugly produce for swipe section
export const UGLY_PRODUCE: Product[] = [
  {
    id: 'ugly-001',
    name: 'Curved Cucumbers',
    category: 'vegetables',
    pricePerKg: 15,
    availableQuantity: 50,
    unit: 'kg',
    freshnessDays: 5,
    sellerId: 'seller-demo-001',
    sellerName: 'Priya Sharma',
    sellerRating: 4.8,
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Noida, Uttar Pradesh'
    },
    isOrganic: true,
    isUgly: true,
    createdAt: new Date('2024-03-14'),
  },
  {
    id: 'ugly-002',
    name: 'Odd-Shaped Carrots',
    category: 'vegetables',
    pricePerKg: 18,
    availableQuantity: 40,
    unit: 'kg',
    freshnessDays: 14,
    sellerId: 'seller-002',
    sellerName: 'Mohan Patel',
    sellerRating: 4.5,
    location: {
      lat: 28.4089,
      lng: 77.3178,
      address: 'Greater Noida, UP'
    },
    isOrganic: false,
    isUgly: true,
    createdAt: new Date('2024-03-13'),
  },
  {
    id: 'ugly-003',
    name: 'Spotted Apples',
    category: 'fruits',
    pricePerKg: 40,
    availableQuantity: 80,
    unit: 'kg',
    freshnessDays: 10,
    sellerId: 'seller-003',
    sellerName: 'Suresh Deshmukh',
    sellerRating: 4.9,
    location: {
      lat: 28.6280,
      lng: 77.2175,
      address: 'Ratnagiri Farm, Delhi'
    },
    isOrganic: true,
    isUgly: true,
    createdAt: new Date('2024-03-12'),
  },
];

// Sample transport requests
export const SAMPLE_TRANSPORT_REQUESTS: TransportRequest[] = [
  {
    id: 'req-001',
    orderId: 'order-001',
    pickupLocation: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Sector 62, Noida'
    },
    deliveryLocation: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, Delhi'
    },
    distance: 18.5,
    estimatedEarnings: 185,
    items: ['Organic Tomatoes', 'Green Chilies'],
    totalWeight: 25,
    buyerName: 'Rajesh Kumar',
    sellerName: 'Priya Sharma',
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    expiresAt: new Date(Date.now() + 1000 * 60 * 20),
  },
  {
    id: 'req-002',
    orderId: 'order-002',
    pickupLocation: {
      lat: 28.4089,
      lng: 77.3178,
      address: 'Alpha Commercial Belt, Greater Noida'
    },
    deliveryLocation: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Cyber City, Gurgaon'
    },
    distance: 32.0,
    estimatedEarnings: 320,
    items: ['Fresh Potatoes', 'Onions'],
    totalWeight: 100,
    buyerName: 'Vikram Mehta',
    sellerName: 'Mohan Patel',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    expiresAt: new Date(Date.now() + 1000 * 60 * 25),
  },
];

// Sample orders
export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'order-001',
    buyerId: 'buyer-demo-001',
    buyerName: 'Rajesh Kumar',
    buyerPhone: '+91 98765 43210',
    sellerId: 'seller-demo-001',
    sellerName: 'Priya Sharma',
    sellerPhone: '+91 98765 43211',
    transporterId: 'transporter-demo-001',
    transporterName: 'Amit Singh',
    transporterPhone: '+91 98765 43212',
    items: [
      {
        id: 'item-001',
        productId: 'prod-001',
        productName: 'Organic Tomatoes',
        quantity: 20,
        pricePerKg: 45,
        totalPrice: 900,
        sellerId: 'seller-demo-001',
        sellerName: 'Priya Sharma',
      },
      {
        id: 'item-002',
        productId: 'prod-005',
        productName: 'Green Chilies',
        quantity: 5,
        pricePerKg: 80,
        totalPrice: 400,
        sellerId: 'seller-demo-001',
        sellerName: 'Priya Sharma',
      },
    ],
    totalAmount: 1300,
    deliveryFee: 185,
    status: 'IN_TRANSIT',
    pickupLocation: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Sector 62, Noida'
    },
    deliveryLocation: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, Delhi'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    estimatedDelivery: new Date(Date.now() + 1000 * 60 * 45),
  },
];

// Order status labels and colors
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  CREATED: { label: 'Order Placed', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  TRANSPORT_ASSIGNED: { label: 'Transport Assigned', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  PICKED_UP: { label: 'Picked Up', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  IN_TRANSIT: { label: 'In Transit', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  DELIVERED: { label: 'Delivered', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  COMPLETED: { label: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
};

// Category icons/labels
export const CATEGORY_CONFIG: Record<string, { label: string; emoji: string }> = {
  vegetables: { label: 'Vegetables', emoji: '🥬' },
  fruits: { label: 'Fruits', emoji: '🍎' },
  grains: { label: 'Grains', emoji: '🌾' },
  dairy: { label: 'Dairy', emoji: '🥛' },
  pulses: { label: 'Pulses', emoji: '🫘' },
  spices: { label: 'Spices', emoji: '🌶️' },
  other: { label: 'Other', emoji: '📦' },
};
