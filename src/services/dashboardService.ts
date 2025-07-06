import { apiClient } from './api'
import type { DashboardMetrics } from '../types'

export class DashboardService {
  async getMetrics(): Promise<DashboardMetrics | null> {
    try {
      // This will eventually call multiple endpoints to gather metrics
      const [usersResponse, modelsResponse, transactionsResponse, productsResponse] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/models'),
        apiClient.get('/transactions'),
        apiClient.get('/products')
      ])

      // For now, return mock data until we implement the actual endpoints
      return {
        totalUsers: 0,
        totalModels: 0,
        totalTransactions: 0,
        totalProducts: 0,
        pendingApprovals: 0,
        activeUsers: 0
      }
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error)
      return null
    }
  }
}