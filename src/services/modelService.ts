import { apiClient } from './api'
import type { Model, ModelFilters, ModelListResponse, ModelDetailResponse, BulkOperationResponse, ModelAnalytics, ModelSearchResponse, ModelStatsResponse, ModelTransactionResponse } from '../types'

export class ModelService {
  async getAllModels(filters: ModelFilters = {}): Promise<ModelListResponse> {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })

    const response = await apiClient.get<ModelListResponse>(`/admin/models?${queryParams}`)
    return response.success ? response.data || { data: { models: [], pagination: { total: 0, limit: 50, offset: 0, hasMore: false } }, success: true } : { data: { models: [], pagination: { total: 0, limit: 50, offset: 0, hasMore: false } }, success: false }
  }

  async getPendingModels(limit: number = 50, offset: number = 0): Promise<ModelListResponse> {
    const queryParams = new URLSearchParams()
    queryParams.append('status', 'pending')
    queryParams.append('limit', String(limit))
    queryParams.append('offset', String(offset))
    
    const response = await apiClient.get<ModelListResponse>(`/admin/models?${queryParams}`)
    return response.success ? response.data || { data: { models: [], pagination: { total: 0, limit, offset, hasMore: false } }, success: true } : { data: { models: [], pagination: { total: 0, limit, offset, hasMore: false } }, success: false }
  }

  async getModelById(modelId: string): Promise<Model | null> {
    console.log('ModelService: Fetching model with ID:', modelId)
    const response = await apiClient.get<any>(`/admin/models/${modelId}`)
    console.log('ModelService: Raw API response:', response)
    
    if (!response.success) {
      console.log('ModelService: API call failed:', response.error)
      return null
    }
    
    if (!response.data) {
      console.log('ModelService: No data in response')
      return null
    }
    
    console.log('ModelService: Response data:', response.data)
    
    // Handle different response structures
    if (response.data.model) {
      console.log('ModelService: Found model in response.data.model')
      return response.data.model
    } else if (response.data.modelId) {
      console.log('ModelService: Found model directly in response.data')
      return response.data
    } else {
      console.log('ModelService: Unexpected response structure')
      return null
    }
  }

  async approveModel(modelId: string): Promise<boolean> {
    const response = await apiClient.put(`/admin/models/${modelId}`, { 
      action: 'approve' 
    })
    return response.success
  }

  async rejectModel(modelId: string, reason: string): Promise<boolean> {
    const response = await apiClient.put(`/admin/models/${modelId}`, { 
      action: 'reject',
      data: { reason }
    })
    return response.success
  }

  async updateModelAvailability(modelId: string, availability: boolean): Promise<boolean> {
    const response = await apiClient.put(`/admin/models/${modelId}`, { 
      action: 'set_availability',
      data: { availability }
    })
    return response.success
  }

  async updateModelPrice(modelId: string, price: number): Promise<boolean> {
    const response = await apiClient.put(`/admin/models/${modelId}`, { 
      action: 'update_price',
      data: { price }
    })
    return response.success
  }

  async deactivateModel(modelId: string): Promise<boolean> {
    const response = await apiClient.delete(`/admin/models/${modelId}`)
    return response.success
  }

  async bulkApprove(modelIds: string[]): Promise<BulkOperationResponse> {
    const response = await apiClient.post<BulkOperationResponse>('/admin/models', {
      action: 'approve',
      modelIds
    })
    return response.success ? response.data || { action: 'approve', affectedCount: 0, modelIds: [] } : { action: 'approve', affectedCount: 0, modelIds: [] }
  }

  async bulkReject(modelIds: string[], reason: string): Promise<BulkOperationResponse> {
    const response = await apiClient.post<BulkOperationResponse>('/admin/models', {
      action: 'reject',
      modelIds,
      data: { reason }
    })
    return response.success ? response.data || { action: 'reject', affectedCount: 0, modelIds: [] } : { action: 'reject', affectedCount: 0, modelIds: [] }
  }

  async bulkSetAvailability(modelIds: string[], availability: boolean): Promise<BulkOperationResponse> {
    const response = await apiClient.post<BulkOperationResponse>('/admin/models', {
      action: 'set_availability',
      modelIds,
      data: { availability }
    })
    return response.success ? response.data || { action: 'set_availability', affectedCount: 0, modelIds: [] } : { action: 'set_availability', affectedCount: 0, modelIds: [] }
  }

  async bulkToggleAvailability(modelIds: string[]): Promise<BulkOperationResponse> {
    const response = await apiClient.post<BulkOperationResponse>('/admin/models', {
      action: 'toggle_availability',
      modelIds
    })
    return response.success ? response.data || { action: 'toggle_availability', affectedCount: 0, modelIds: [] } : { action: 'toggle_availability', affectedCount: 0, modelIds: [] }
  }

  async getModelAnalytics(modelId: string, period: number = 30): Promise<ModelAnalytics | null> {
    const response = await apiClient.get<ModelAnalytics>(`/admin/models/${modelId}/analytics?period=${period}`)
    return response.success ? response.data || null : null
  }

  async getModelTransactions(modelId: string, filters: { startDate?: string, endDate?: string, limit?: number, offset?: number } = {}): Promise<any> {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })

    const response = await apiClient.get<{success: boolean, data: any}>(`/admin/models/${modelId}/transactions?${queryParams}`)
    return response.success ? response.data || null : null
  }

  async searchModels(query: string, filters: ModelFilters = {}): Promise<ModelSearchResponse | null> {
    const queryParams = new URLSearchParams()
    queryParams.append('q', query)
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })

    const response = await apiClient.get<ModelSearchResponse>(`/admin/models/search?${queryParams}`)
    return response.success ? response.data || null : null
  }

  async getModelStats(period: number = 30): Promise<ModelStatsResponse | null> {
    const response = await apiClient.get<ModelStatsResponse>(`/admin/models/stats?period=${period}`)
    return response.success ? response.data || null : null
  }
}