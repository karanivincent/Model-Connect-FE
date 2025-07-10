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

// New API Response Types (Based on Backend Documentation)

// Enhanced Model Detail Response
export interface ModelDetailResponse {
  model: Model
  metrics: {
    totalSales: number
    totalEarnings: number
    averageRating: number
    conversionRate: number
    salesLast30Days: number
    salesLast7Days: number
    totalPlatformFees: number
  }
  photos: string[]
  user: {
    id: string
    phone: string
    telegramId?: string
    telegramUsername?: string
    firstName?: string
    lastName?: string
    registeredAt: string
    isActive: boolean
  }
  analytics?: any  // Optional for compatibility
  transactions?: any  // Optional for compatibility
}

// Model Search Response
export interface ModelSearchResponse {
  models: (Model & { relevanceScore: number })[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  searchInfo: {
    query: string
    totalMatches: number
    searchTime: number
    suggestions: string[]
  }
}

// Model Statistics Response
export interface ModelStatsResponse {
  totalModels: number
  approvedModels: number
  pendingModels: number
  rejectedModels: number
  activeModels: number
  totalRevenue: number
  totalTransactions: number
  conversionRate: number
  
  locationStats: Array<{
    location: string
    modelCount: number
    totalSales: number
    totalRevenue: number
    avgPrice: number
  }>
  
  specialtyStats: Array<{
    specialty: string
    modelCount: number
    totalSales: number
    avgPrice: number
  }>
  
  priceRangeStats: Array<{
    range: string
    modelCount: number
    totalSales: number
    avgPrice: number
  }>
  
  trends: Array<{
    date: string
    newModels: number
    approvedModels: number
    totalSales: number
    revenue: number
  }>
}

// Model Transaction Response
export interface ModelTransactionResponse {
  transactions: Array<{
    id: string
    modelId: string
    buyerId: string
    amount: number
    platformFee: number
    modelEarnings: number
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
    createdAt: string
    completedAt?: string
    paymentMethod: string
    transactionId: string
  }>
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  summary: {
    totalTransactions: number
    totalRevenue: number
    totalPlatformFees: number
    totalModelEarnings: number
    averageTransactionAmount: number
  }
}