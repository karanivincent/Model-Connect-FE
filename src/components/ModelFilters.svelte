<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { ModelFilters } from '../types'

  export let filters: ModelFilters = {}

  const dispatch = createEventDispatcher()

  function applyFilters() {
    dispatch('filter', filters)
  }

  function clearFilters() {
    filters = {}
    dispatch('filter', filters)
  }

  function handleStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement
    filters.status = target.value as ModelFilters['status'] || undefined
    applyFilters()
  }

  function handleSortChange(event: Event) {
    const target = event.target as HTMLSelectElement
    const [sortBy, sortOrder] = target.value.split(':')
    filters.sortBy = sortBy as ModelFilters['sortBy']
    filters.sortOrder = sortOrder as ModelFilters['sortOrder']
    applyFilters()
  }
</script>

<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
    <!-- Search -->
    <div class="xl:col-span-2">
      <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
      <input
        id="search"
        type="text"
        bind:value={filters.search}
        on:input={applyFilters}
        placeholder="Name, bio, location, phone..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
    </div>

    <!-- Status Filter -->
    <div>
      <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        id="status"
        on:change={handleStatusChange}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Status</option>
        <option value="pending" selected={filters.status === 'pending'}>Pending</option>
        <option value="approved" selected={filters.status === 'approved'}>Approved</option>
        <option value="rejected" selected={filters.status === 'rejected'}>Rejected</option>
        <option value="inactive" selected={filters.status === 'inactive'}>Inactive</option>
      </select>
    </div>

    <!-- Location Filter -->
    <div>
      <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
      <input
        id="location"
        type="text"
        bind:value={filters.location}
        on:input={applyFilters}
        placeholder="City or region"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
    </div>

    <!-- Price Range -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
      <div class="flex space-x-2">
        <input
          type="number"
          bind:value={filters.priceMin}
          on:input={applyFilters}
          placeholder="Min"
          min="0"
          class="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        />
        <input
          type="number"
          bind:value={filters.priceMax}
          on:input={applyFilters}
          placeholder="Max"
          min="0"
          class="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        />
      </div>
    </div>

    <!-- Sort Options -->
    <div>
      <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
      <select
        id="sort"
        on:change={handleSortChange}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="created_at:desc">Newest First</option>
        <option value="created_at:asc">Oldest First</option>
        <option value="name:asc">Name A-Z</option>
        <option value="name:desc">Name Z-A</option>
        <option value="price:desc">Price High-Low</option>
        <option value="price:asc">Price Low-High</option>
        <option value="sales:desc">Most Sales</option>
        <option value="updated_at:desc">Recently Updated</option>
      </select>
    </div>
  </div>

  <!-- Filter Actions -->
  <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
    <div class="flex items-center space-x-4">
      <span class="text-sm text-gray-600">
        {#if filters.search || filters.status || filters.location || filters.priceMin || filters.priceMax}
          Filters applied
        {:else}
          No filters applied
        {/if}
      </span>
    </div>
    
    <div class="flex space-x-2">
      <button
        on:click={clearFilters}
        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
      >
        Clear All
      </button>
      <button
        on:click={applyFilters}
        class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  </div>
</div>