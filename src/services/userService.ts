import { apiClient } from './api'
import type { User } from '../types'

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users')
    return response.success ? response.data || [] : []
  }

  async getUserById(userId: string): Promise<User | null> {
    const response = await apiClient.get<User>(`/users/${userId}`)
    return response.success ? response.data || null : null
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<boolean> {
    const response = await apiClient.put(`/users/${userId}/status`, { isActive })
    return response.success
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`)
    return response.success ? response.data || [] : []
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(`/users?role=${role}`)
    return response.success ? response.data || [] : []
  }
}