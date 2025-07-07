// User types
export interface User {
  id: string
  phone: string
  telegramId?: string
  telegramUsername?: string
  role: 'CLIENT' | 'MODEL' | 'ADMIN'
  registeredAt: string
  isActive: boolean
}

// Model types
export interface Model {
  modelId: string
  userId?: string
  profile: {
    name: string
    bio?: string
    location?: string
    specialties?: string[]
    photos?: string[]
  }
  contactInfo: {
    phone?: string
    price: number
  }
  status: {
    adminApproved: boolean
    availability: boolean
    consentGiven?: boolean
    rejectionReason?: string
  }
  user: {
    telegramId?: number
    username?: string
    firstName?: string
    lastName?: string
    status?: string
  }
  metrics?: {
    salesCount: number
    totalEarnings: number
  }
  timestamps: {
    createdAt: string
    updatedAt?: string
    approvalDate?: string
    rejectionDate?: string
    consentDate?: string
  }
  completeness?: {
    checks?: Record<string, boolean>
    score?: number
    percentage: number
    isComplete?: boolean
  }
  priority?: number
}

export interface ModelProfile {
  id: string
  userId: string
  name: string
  bio?: string
  location?: string
  specialties?: string[]
  contact?: string
  availability?: string
  isApproved: boolean
  approvedAt?: string
  rejectedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ModelFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'inactive' | 'all'
  search?: string
  location?: string
  priceMin?: number
  priceMax?: number
  sortBy?: 'created_at' | 'name' | 'price' | 'sales' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface ModelListResponse {
  data: {
    models: Model[]
    pagination: {
      total: number
      limit: number
      offset: number
      hasMore: boolean
    }
    summary?: {
      totalPending: number
      highPriority: number
      readyForReview: number
      needsAttention: number
    }
  }
  success: boolean
}

export interface ModelDetailResponse {
  model: Model
  analytics: {
    totalSales: number
    totalEarnings: number
    totalPlatformFees: number
    salesLast30Days: number
    salesLast7Days: number
  }
  transactions: Transaction[]
}

export interface BulkOperationResponse {
  action: string
  affectedCount: number
  modelIds: string[]
}

// Transaction types
export interface Transaction {
  id: string
  userId: string
  amount: number
  currency: string
  type: 'PAYMENT' | 'REFUND' | 'PAYOUT'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  description?: string
  createdAt: string
  completedAt?: string
}

// Product types
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  category?: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Order types
export interface Order {
  id: string
  userId: string
  total: number
  currency: string
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
}

// Analytics types
export interface ModelAnalytics {
  period: number
  overview: {
    totalModels: number
    approvedModels: number
    pendingModels: number
    rejectedModels: number
    activeModels: number
    totalTransactions: number
    totalRevenue: number
    totalPlatformFees: number
    totalModelEarnings: number
    approvalRate: number
    conversionRate: number
  }
  topModels: Array<{
    modelId: string
    name: string
    location: string
    contactPrice: number
    salesCount: number
    totalEarnings: number
    grossRevenue: number
  }>
  dailyMetrics: Array<{
    date: string
    transactions: number
    revenue: number
    activeModels: number
    uniqueBuyers: number
  }>
  registrationTrends: Array<{
    date: string
    newRegistrations: number
    approved: number
    rejected: number
  }>
  locationAnalytics: Array<{
    location: string
    modelCount: number
    totalSales: number
    totalRevenue: number
    avgPrice: number
  }>
  priceAnalytics: Array<{
    priceRange: string
    modelCount: number
    totalSales: number
    totalRevenue: number
    avgTransactionAmount: number
  }>
}

// Dashboard metrics
export interface DashboardMetrics {
  totalUsers: number
  totalModels: number
  totalTransactions: number
  totalProducts: number
  pendingApprovals: number
  activeUsers: number
}