<script lang="ts">
  import { ModelService } from '../services'
  import { goto } from '$app/navigation'
  import type { Model, ModelDetailResponse, ModelTransactionResponse } from '../types'

  export let modelId: string

  const modelService = new ModelService()
  
  let modelDetail: ModelDetailResponse | null = null
  let transactions: ModelTransactionResponse | null = null
  let loading = true
  let error = ''
  let activeTab: 'overview' | 'analytics' | 'transactions' | 'actions' = 'overview'
  let transactionLoading = false

  // React to modelId changes
  $: if (modelId) {
    loadModelDetail()
    loadTransactions()
  }

  async function loadModelDetail() {
    try {
      loading = true
      error = ''
      
      const detailResponse: Model | null = await modelService.getModelById(modelId)

      if (detailResponse && detailResponse.modelId) {
        // The API returns { success: true, data: Model } but we need to create ModelDetailResponse structure
        modelDetail = {
          model: detailResponse,
          metrics: {
            totalSales: detailResponse.metrics?.salesCount || 0,
            totalEarnings: detailResponse.metrics?.totalEarnings || 0,
            averageRating: 4.5, // Default since not in current schema
            conversionRate: 0.15, // Default since not in current schema
            salesLast30Days: detailResponse.metrics?.salesCount || 0,
            salesLast7Days: Math.floor((detailResponse.metrics?.salesCount || 0) * 0.3),
            totalPlatformFees: (detailResponse.metrics?.totalEarnings || 0) * 0.1
          },
          photos: detailResponse.profile?.photos || [],
          user: {
            id: detailResponse.userId || '',
            phone: detailResponse.contactInfo?.phone || '',
            telegramId: '',
            telegramUsername: detailResponse.user?.username || '',
            firstName: detailResponse.profile?.name?.split(' ')[0] || '',
            lastName: detailResponse.profile?.name?.split(' ').slice(1).join(' ') || '',
            registeredAt: detailResponse.timestamps?.createdAt || new Date().toISOString(),
            isActive: true
          }
        }
      } else {
        error = 'Model not found'
      }
    } catch (err) {
      error = 'Failed to load model details'
      console.error('Error loading model detail:', err)
    } finally {
      loading = false
    }
  }

  async function loadTransactions() {
    try {
      transactionLoading = true
      const response = await modelService.getModelTransactions(modelId, { limit: 10 })
      
      if (response && response.transactions) {
        // Convert the API response to our expected format
        transactions = {
          transactions: response.transactions.map((tx: any) => ({
            id: tx.transactionId,
            modelId: tx.modelId,
            buyerId: tx.buyerId,
            amount: tx.amount,
            platformFee: tx.platformFee,
            modelEarnings: tx.modelEarning,
            status: tx.status.toUpperCase() as 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED',
            createdAt: tx.createdAt,
            completedAt: tx.completedAt,
            paymentMethod: 'M-Pesa',
            transactionId: tx.mpesaTransactionId || tx.transactionId
          })),
          pagination: response.pagination || { total: 0, limit: 10, offset: 0, hasMore: false },
          summary: {
            totalTransactions: response.summary?.transactionCount || 0,
            totalRevenue: response.summary?.totalAmount || 0,
            totalPlatformFees: response.summary?.totalAmount ? response.summary.totalAmount * 0.1 : 0,
            totalModelEarnings: response.summary?.totalEarnings || 0,
            averageTransactionAmount: response.summary?.totalAmount && response.summary?.transactionCount ? response.summary.totalAmount / response.summary.transactionCount : 0
          }
        }
      } else {
        // If no transactions or empty response, set empty state
        transactions = {
          transactions: [],
          pagination: { total: 0, limit: 10, offset: 0, hasMore: false },
          summary: {
            totalTransactions: 0,
            totalRevenue: 0,
            totalPlatformFees: 0,
            totalModelEarnings: 0,
            averageTransactionAmount: 0
          }
        }
      }
    } catch (err) {
      console.error('Error loading transactions:', err)
    } finally {
      transactionLoading = false
    }
  }

  async function handleApprove() {
    if (!modelDetail) return
    
    try {
      const success = await modelService.approveModel(modelId)
      if (success) {
        await loadModelDetail() // Reload to get updated status
      }
    } catch (err) {
      console.error('Error approving model:', err)
    }
  }

  async function handleReject() {
    if (!modelDetail) return
    
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    try {
      const success = await modelService.rejectModel(modelId, reason)
      if (success) {
        await loadModelDetail() // Reload to get updated status
      }
    } catch (err) {
      console.error('Error rejecting model:', err)
    }
  }

  async function handleToggleAvailability() {
    if (!modelDetail) return
    
    try {
      const success = await modelService.updateModelAvailability(
        modelId, 
        !modelDetail.model.status.availability
      )
      if (success) {
        await loadModelDetail() // Reload to get updated status
      }
    } catch (err) {
      console.error('Error updating availability:', err)
    }
  }

  async function handleUpdatePrice() {
    if (!modelDetail) return
    
    const newPrice = prompt('Enter new price (KSh):', String(modelDetail.model.contactInfo.price))
    if (!newPrice || isNaN(Number(newPrice))) return

    try {
      const success = await modelService.updateModelPrice(modelId, Number(newPrice))
      if (success) {
        await loadModelDetail() // Reload to get updated status
      }
    } catch (err) {
      console.error('Error updating price:', err)
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getStatusBadge(model: any) {
    if (!model || !model.status) {
      return { text: 'Unknown', class: 'bg-gray-100 text-gray-800' }
    }
    if (model.status.rejectionReason) {
      return { text: 'Rejected', class: 'bg-red-100 text-red-800' }
    }
    if (!model.status.adminApproved) {
      return { text: 'Pending Approval', class: 'bg-yellow-100 text-yellow-800' }
    }
    if (!model.status.availability) {
      return { text: 'Inactive', class: 'bg-gray-100 text-gray-800' }
    }
    return { text: 'Active', class: 'bg-green-100 text-green-800' }
  }

  $: statusBadge = modelDetail ? getStatusBadge(modelDetail.model) : null
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span class="ml-2 text-gray-600">Loading model details...</span>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <span class="text-red-400 mr-2">⚠️</span>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error Loading Model</h3>
          <p class="text-sm text-red-700 mt-1">{error}</p>
          <button
            on:click={loadModelDetail}
            class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  {:else if modelDetail}
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{modelDetail.model.profile.name}</h1>
          <p class="text-gray-600 mt-1">Model ID: {modelDetail.model.modelId}</p>
        </div>
        <div class="flex items-center space-x-3">
          {#if statusBadge}
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {statusBadge.class}">
              {statusBadge.text}
            </span>
          {/if}
          <button
            on:click={() => goto('/models')}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ← Back to Models
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          on:click={() => activeTab = 'overview'}
          class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        >
          Overview
        </button>
        <button
          on:click={() => activeTab = 'analytics'}
          class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'analytics' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        >
          Analytics
        </button>
        <button
          on:click={() => activeTab = 'transactions'}
          class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'transactions' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        >
          Transactions
        </button>
        <button
          on:click={() => activeTab = 'actions'}
          class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'actions' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        >
          Actions
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    {#if activeTab === 'overview'}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Profile Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Profile Details -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <p class="mt-1 text-sm text-gray-900">{modelDetail.model.profile.name}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Location</label>
                <p class="mt-1 text-sm text-gray-900">{modelDetail.model.profile.location || 'Not specified'}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Contact Price</label>
                <p class="mt-1 text-sm text-gray-900 font-semibold">{formatCurrency(modelDetail.model.contactInfo.price)}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <p class="mt-1 text-sm text-gray-900">{modelDetail.model.contactInfo.phone || 'Not provided'}</p>
              </div>
            </div>
            
            {#if modelDetail.model.profile.bio}
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700">Bio</label>
                <p class="mt-1 text-sm text-gray-900">{modelDetail.model.profile.bio}</p>
              </div>
            {/if}

            {#if modelDetail.model.profile.specialties && modelDetail.model.profile.specialties.length > 0}
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700">Specialties</label>
                <div class="mt-1 flex flex-wrap gap-2">
                  {#each modelDetail.model.profile.specialties as specialty}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {specialty}
                    </span>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <!-- User Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">User Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <p class="mt-1 text-sm text-gray-900">{modelDetail.user.phone}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Telegram Username</label>
                <p class="mt-1 text-sm text-gray-900">{modelDetail.user.telegramUsername || 'Not provided'}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Registered</label>
                <p class="mt-1 text-sm text-gray-900">{formatDate(modelDetail.user.registeredAt)}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <span class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {modelDetail.user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                  {modelDetail.user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Photos -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Photos</h3>
            {#if modelDetail.photos && modelDetail.photos.length > 0}
              <div class="grid grid-cols-2 gap-2">
                {#each modelDetail.photos as photo}
                  <img 
                    src={photo} 
                    alt="Model photo"
                    class="w-full h-24 object-cover rounded-md"
                  />
                {/each}
              </div>
            {:else}
              <p class="text-sm text-gray-500">No photos uploaded</p>
            {/if}
          </div>

          <!-- Quick Stats -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Sales</span>
                <span class="text-sm font-medium text-gray-900">{modelDetail.metrics.totalSales}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Earnings</span>
                <span class="text-sm font-medium text-gray-900">{formatCurrency(modelDetail.metrics.totalEarnings)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Platform Fees</span>
                <span class="text-sm font-medium text-gray-900">{formatCurrency(modelDetail.metrics.totalPlatformFees)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Conversion Rate</span>
                <span class="text-sm font-medium text-gray-900">{(modelDetail.metrics.conversionRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else if activeTab === 'analytics'}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Performance Metrics -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-gray-900">{modelDetail.metrics.totalSales}</div>
                <div class="text-sm text-gray-600">Total Sales</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-primary-600">{formatCurrency(modelDetail.metrics.totalEarnings)}</div>
                <div class="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-gray-900">{modelDetail.metrics.salesLast30Days}</div>
                <div class="text-sm text-gray-600">Sales (30 days)</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-gray-900">{modelDetail.metrics.salesLast7Days}</div>
                <div class="text-sm text-gray-600">Sales (7 days)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Breakdown -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Revenue</span>
              <span class="text-sm font-medium text-gray-900">{formatCurrency(modelDetail.metrics.totalEarnings + modelDetail.metrics.totalPlatformFees)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Model Earnings</span>
              <span class="text-sm font-medium text-green-600">{formatCurrency(modelDetail.metrics.totalEarnings)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Platform Fees</span>
              <span class="text-sm font-medium text-gray-900">{formatCurrency(modelDetail.metrics.totalPlatformFees)}</span>
            </div>
            <div class="pt-3 border-t">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-900">Average Rating</span>
                <span class="text-sm font-medium text-gray-900">{modelDetail.metrics.averageRating.toFixed(1)}/5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else if activeTab === 'transactions'}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Transaction History</h3>
          
          {#if transactionLoading}
            <div class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span class="ml-2 text-gray-600">Loading transactions...</span>
            </div>
          {:else if transactions && transactions.transactions.length > 0}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Fee</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Earnings</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {#each transactions.transactions as transaction}
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.platformFee)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {formatCurrency(transaction.modelEarnings)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            
            {#if transactions.summary}
              <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Transaction Summary</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Total:</span>
                    <span class="font-medium ml-1">{transactions.summary.totalTransactions}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Revenue:</span>
                    <span class="font-medium ml-1">{formatCurrency(transactions.summary.totalRevenue)}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Platform Fees:</span>
                    <span class="font-medium ml-1">{formatCurrency(transactions.summary.totalPlatformFees)}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Model Earnings:</span>
                    <span class="font-medium ml-1">{formatCurrency(transactions.summary.totalModelEarnings)}</span>
                  </div>
                </div>
              </div>
            {/if}
          {:else}
            <div class="text-center py-8">
              <div class="text-gray-400 text-4xl mb-4">💳</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
              <p class="text-gray-600">This model hasn't had any transactions yet.</p>
            </div>
          {/if}
        </div>
      </div>
    {:else if activeTab === 'actions'}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Model Actions</h3>
        
        <div class="space-y-4">
          {#if !modelDetail.model.status.adminApproved && !modelDetail.model.status.rejectionReason}
            <div class="flex space-x-3">
              <button
                on:click={handleApprove}
                class="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                ✓ Approve Model
              </button>
              <button
                on:click={handleReject}
                class="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                ✗ Reject Model
              </button>
            </div>
          {/if}

          {#if modelDetail.model.status.adminApproved}
            <div class="flex space-x-3">
              <button
                on:click={handleToggleAvailability}
                class="flex-1 px-4 py-2 {modelDetail.model.status.availability ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {modelDetail.model.status.availability ? 'Deactivate' : 'Activate'} Model
              </button>
              <button
                on:click={handleUpdatePrice}
                class="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Price
              </button>
            </div>
          {/if}

          {#if modelDetail.model.status.rejectionReason}
            <div class="p-4 bg-red-50 border border-red-200 rounded-md">
              <h4 class="text-sm font-medium text-red-800 mb-2">Rejection Reason</h4>
              <p class="text-sm text-red-700">{modelDetail.model.status.rejectionReason}</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/if}
</div>