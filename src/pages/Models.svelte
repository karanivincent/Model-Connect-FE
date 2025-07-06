<script lang="ts">
  import { onMount } from 'svelte'
  import { ModelService } from '../services'
  import ModelFilters from '../components/ModelFilters.svelte'
  import ModelCard from '../components/ModelCard.svelte'
  import BulkActions from '../components/BulkActions.svelte'
  import type { Model, ModelFilters as ModelFiltersType, ModelListResponse } from '../types'

  let models: Model[] = []
  let loading = false
  let error = ''
  let selectedModels: string[] = []
  let filters: ModelFiltersType = { status: 'pending', limit: 20, offset: 0 }
  let pagination = { total: 0, limit: 20, offset: 0, hasMore: false }
  let currentView: 'all' | 'pending' = 'pending'

  const modelService = new ModelService()

  onMount(() => {
    loadModels()
  })

  async function loadModels() {
    loading = true
    error = ''
    
    try {
      let response: ModelListResponse
      
      if (currentView === 'pending') {
        response = await modelService.getPendingModels(filters.limit, filters.offset)
      } else {
        response = await modelService.getAllModels(filters)
      }
      
      models = response.models || []
      pagination = response.pagination
      
      // Clear selection when loading new data
      selectedModels = []
    } catch (err) {
      error = 'Failed to load models. Please try again.'
      console.error('Error loading models:', err)
    } finally {
      loading = false
    }
  }

  function handleFilterChange(event: CustomEvent<ModelFiltersType>) {
    filters = { ...event.detail, offset: 0 }
    loadModels()
  }

  function handleModelSelect(event: CustomEvent<{modelId: string, selected: boolean}>) {
    const { modelId, selected } = event.detail
    if (selected) {
      selectedModels = [...selectedModels, modelId]
    } else {
      selectedModels = selectedModels.filter(id => id !== modelId)
    }
  }

  function handleSelectAll() {
    selectedModels = models.map(model => model.modelId)
  }

  function handleClearSelection() {
    selectedModels = []
  }

  function handleViewDetails(event: CustomEvent<string>) {
    const modelId = event.detail
    // TODO: Navigate to model detail page
    console.log('View details for model:', modelId)
  }

  async function handleQuickApprove(event: CustomEvent<string>) {
    const modelId = event.detail
    try {
      await modelService.approveModel(modelId)
      loadModels() // Reload to reflect changes
    } catch (err) {
      console.error('Error approving model:', err)
    }
  }

  async function handleQuickReject(event: CustomEvent<string>) {
    const modelId = event.detail
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return
    
    try {
      await modelService.rejectModel(modelId, reason)
      loadModels() // Reload to reflect changes
    } catch (err) {
      console.error('Error rejecting model:', err)
    }
  }

  async function handleToggleAvailability(event: CustomEvent<string>) {
    const modelId = event.detail
    const model = models.find(m => m.modelId === modelId)
    if (!model) return
    
    try {
      await modelService.updateModelAvailability(modelId, !model.status.availability)
      loadModels() // Reload to reflect changes
    } catch (err) {
      console.error('Error updating availability:', err)
    }
  }

  async function handleBulkAction(event: CustomEvent<any>) {
    const { action, modelIds, data } = event.detail
    
    try {
      loading = true
      
      switch (action) {
        case 'approve':
          await modelService.bulkApprove(modelIds)
          break
        case 'reject':
          await modelService.bulkReject(modelIds, data.reason)
          break
        case 'set_availability':
          await modelService.bulkSetAvailability(modelIds, data.availability)
          break
        case 'toggle_availability':
          await modelService.bulkToggleAvailability(modelIds)
          break
      }
      
      loadModels() // Reload to reflect changes
    } catch (err) {
      console.error('Error performing bulk action:', err)
    } finally {
      loading = false
    }
  }

  function switchView(view: 'all' | 'pending') {
    currentView = view
    if (view === 'pending') {
      filters = { status: 'pending', limit: 20, offset: 0 }
    } else {
      filters = { limit: 20, offset: 0 }
    }
    loadModels()
  }

  function loadMore() {
    if (!pagination.hasMore || loading) return
    filters.offset = (filters.offset || 0) + (filters.limit || 20)
    loadModelsMore()
  }

  async function loadModelsMore() {
    loading = true
    
    try {
      let response: ModelListResponse
      
      if (currentView === 'pending') {
        response = await modelService.getPendingModels(filters.limit, filters.offset)
      } else {
        response = await modelService.getAllModels(filters)
      }
      
      models = [...models, ...(response.models || [])]
      pagination = response.pagination
    } catch (err) {
      console.error('Error loading more models:', err)
    } finally {
      loading = false
    }
  }
</script>

<div class="p-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Model Management</h1>
    <p class="text-gray-600 mt-2">Approve and manage model profiles</p>
    
    <!-- View Toggle -->
    <div class="mt-4 flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
      <button
        on:click={() => switchView('pending')}
        class="px-4 py-2 text-sm font-medium rounded-md transition-colors {currentView === 'pending' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
      >
        Pending Approvals
        {#if currentView === 'pending' && pagination.total > 0}
          <span class="ml-2 bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs">
            {pagination.total}
          </span>
        {/if}
      </button>
      <button
        on:click={() => switchView('all')}
        class="px-4 py-2 text-sm font-medium rounded-md transition-colors {currentView === 'all' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
      >
        All Models
      </button>
    </div>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <span class="text-red-400 mr-2">⚠️</span>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error Loading Models</h3>
          <p class="text-sm text-red-700 mt-1">{error}</p>
          <button
            on:click={loadModels}
            class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Filters (only show for 'all' view) -->
  {#if currentView === 'all'}
    <ModelFilters bind:filters on:filter={handleFilterChange} />
  {/if}

  <!-- Bulk Actions -->
  <BulkActions 
    {selectedModels} 
    {loading}
    on:bulk-action={handleBulkAction}
    on:select-all={handleSelectAll}
    on:clear-selection={handleClearSelection}
  />

  <!-- Models Grid -->
  {#if loading && models.length === 0}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span class="ml-2 text-gray-600">Loading models...</span>
    </div>
  {:else if models.length === 0}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div class="text-4xl text-gray-300 mb-4">👤</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {currentView === 'pending' ? 'No Pending Models' : 'No Models Found'}
      </h3>
      <p class="text-gray-600">
        {currentView === 'pending' 
          ? 'All models have been reviewed. Great work!' 
          : 'No models match your current filters. Try adjusting your search criteria.'}
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each models as model}
        <ModelCard 
          {model}
          selected={selectedModels.includes(model.modelId)}
          on:select={handleModelSelect}
          on:view-details={handleViewDetails}
          on:quick-approve={handleQuickApprove}
          on:quick-reject={handleQuickReject}
          on:toggle-availability={handleToggleAvailability}
        />
      {/each}
    </div>

    <!-- Load More Button -->
    {#if pagination.hasMore}
      <div class="mt-8 text-center">
        <button
          on:click={loadMore}
          disabled={loading}
          class="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {#if loading}
            <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {/if}
          Load More Models
        </button>
      </div>
    {/if}

    <!-- Results Summary -->
    <div class="mt-6 text-center text-sm text-gray-600">
      Showing {models.length} of {pagination.total} models
    </div>
  {/if}
</div>