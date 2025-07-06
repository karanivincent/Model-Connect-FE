import { apiClient } from './api'
import type { Model, ModelFilters, ModelListResponse, ModelDetailResponse, BulkOperationResponse, ModelAnalytics } from '../types'

export class ModelService {
  async getAllModels(filters: ModelFilters = {}): Promise<ModelListResponse> {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })

    const response = await apiClient.get<ModelListResponse>(`/admin-models?${queryParams}`)
    return response.success ? response.data || { models: [], pagination: { total: 0, limit: 50, offset: 0, hasMore: false } } : { models: [], pagination: { total: 0, limit: 50, offset: 0, hasMore: false } }
  }

  async getPendingModels(limit: number = 50, offset: number = 0): Promise<ModelListResponse> {
    const response = await apiClient.get<ModelListResponse>(`/admin-models?action=pending&limit=${limit}&offset=${offset}`)
    return response.success ? response.data || { models: [], pagination: { total: 0, limit, offset, hasMore: false } } : { models: [], pagination: { total: 0, limit, offset, hasMore: false } }
  }

  async getModelById(modelId: string): Promise<ModelDetailResponse | null> {
    const response = await apiClient.get<ModelDetailResponse>(`/admin-models?id=${modelId}`)
    return response.success ? response.data || null : null
  }

  async approveModel(modelId: string): Promise<boolean> {
    const response = await apiClient.put(`/admin-models?id=${modelId}`, { 
      action: 'approve' 
    })
    return response.success
  }

  async rejectModel(modelId: string, reason: string): Promise<boolean> {
    const response = await apiClient.put(`/admin-models?id=${modelId}`, { 
      action: 'reject',
      data: { reason }
    })
    return response.success
  }

  async updateModelAvailability(modelId: string, availability: boolean): Promise<boolean> {
    const response = await apiClient.put(`/admin-models?id=${modelId}`, { 
      action: 'set_availability',
      data: { availability }
    })
    return response.success
  }

  async updateModelPrice(modelId: string, price: number): Promise<boolean> {
    const response = await apiClient.put(`/admin-models?id=${modelId}`, { 
      action: 'update_price',
      data: { price }
    })
    return response.success
  }

  async deactivateModel(modelId: string): Promise<boolean> {
    const response = await apiClient.delete(`/admin-models?id=${modelId}`)
    return response.success
  }

  async bulkApprove(modelIds: string[]): Promise<BulkOperationResponse> {
    const response = await apiClient.post<BulkOperationResponse>('/admin-models', {
      action: 'approve',
      modelIds
    })
    return response.success ? response.data || { action: 'approve', affectedCount: 0, modelIds: [] } : { action: 'approve', affectedCount: 0, modelIds: [] }
  }

  async bulkReject(modelIds: string[], reason: string): Promise<BulkOperationResponse> {
    const response = await apiClient.post<BulkOperationResponse>('/admin-models', {
      action: 'reject',
      modelIds,
      data: { reason }
    })
    return response.success ? response.data || { action: 'reject', affectedCount: 0, modelIds: [] } : { action: 'reject', affectedCount: 0, modelIds: [] }
  }

  async bulkSetAvailability(modelIds: string[], availability: boolean): Promise<BulkOperationResponse> {
    const response = await apiClient.post<BulkOperationResponse>('/admin-models', {
      action: 'set_availability',
      modelIds,
      data: { availability }
    })
    return response.success ? response.data || { action: 'set_availability', affectedCount: 0, modelIds: [] } : { action: 'set_availability', affectedCount: 0, modelIds: [] }
  }

  async bulkToggleAvailability(modelIds: string[]): Promise<BulkOperationResponse> {
    const response = await apiClient.post<BulkOperationResponse>('/admin-models', {
      action: 'toggle_availability',
      modelIds
    })
    return response.success ? response.data || { action: 'toggle_availability', affectedCount: 0, modelIds: [] } : { action: 'toggle_availability', affectedCount: 0, modelIds: [] }
  }

  async getAnalytics(period: number = 30): Promise<ModelAnalytics | null> {
    const response = await apiClient.get<ModelAnalytics>(`/admin-models?action=analytics&period=${period}`)
    return response.success ? response.data || null : null
  }
}