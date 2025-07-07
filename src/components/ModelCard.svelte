<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Model } from '../types'

  export let model: Model
  export let selected: boolean = false

  const dispatch = createEventDispatcher()

  function toggleSelection() {
    dispatch('select', { modelId: model.modelId, selected: !selected })
  }

  function viewDetails() {
    dispatch('view-details', model.modelId)
  }

  function quickApprove() {
    dispatch('quick-approve', model.modelId)
  }

  function quickReject() {
    dispatch('quick-reject', model.modelId)
  }

  function toggleAvailability() {
    dispatch('toggle-availability', model.modelId)
  }

  function getStatusBadge(model: Model) {
    if (model.status.rejectionReason) {
      return { text: 'Rejected', class: 'bg-red-100 text-red-800' }
    }
    if (!model.status.adminApproved) {
      return { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' }
    }
    if (!model.status.availability) {
      return { text: 'Inactive', class: 'bg-gray-100 text-gray-800' }
    }
    return { text: 'Active', class: 'bg-green-100 text-green-800' }
  }

  function getPriorityBadge(priority: number | undefined) {
    if (!priority || priority < 7) return null
    if (priority >= 9) return { text: 'High Priority', class: 'bg-red-100 text-red-700' }
    if (priority >= 8) return { text: 'Medium Priority', class: 'bg-orange-100 text-orange-700' }
    return null
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
      month: 'short',
      day: 'numeric'
    })
  }

  $: statusBadge = getStatusBadge(model)
  $: priorityBadge = getPriorityBadge(model.priority)
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 {selected ? 'ring-2 ring-primary-500 bg-primary-50' : ''}">
  <!-- Header with selection and priority -->
  <div class="p-4 border-b border-gray-100">
    <div class="flex items-start justify-between">
      <div class="flex items-center space-x-3">
        <input
          type="checkbox"
          bind:checked={selected}
          on:change={toggleSelection}
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 truncate">
            {model.profile.name || 'Unnamed Model'}
          </h3>
          <p class="text-sm text-gray-600">
            ID: {model.modelId.slice(0, 8)}...
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end space-y-1">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {statusBadge.class}">
          {statusBadge.text}
        </span>
        {#if priorityBadge}
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {priorityBadge.class}">
            {priorityBadge.text}
          </span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Profile Photo -->
  <div class="px-4 py-3">
    {#if model.profile.photos && model.profile.photos.length > 0}
      <div class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mx-auto mb-3">
        <img 
          src={model.profile.photos[0]} 
          alt="{model.profile.name} profile photo"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    {:else}
      <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
        <span class="text-2xl text-gray-400">👤</span>
      </div>
    {/if}

    <!-- Profile Info -->
    <div class="text-center mb-3">
      {#if model.profile.location}
        <p class="text-sm text-gray-600 mb-1">📍 {model.profile.location}</p>
      {/if}
      {#if model.profile.specialties && model.profile.specialties.length > 0}
        <div class="flex flex-wrap justify-center gap-1 mb-2">
          {#each model.profile.specialties.slice(0, 2) as specialty}
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
              {specialty}
            </span>
          {/each}
          {#if model.profile.specialties.length > 2}
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
              +{model.profile.specialties.length - 2}
            </span>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Metrics -->
    <div class="grid grid-cols-2 gap-3 mb-3 text-center">
      <div class="bg-gray-50 rounded p-2">
        <div class="text-lg font-semibold text-gray-900">{formatCurrency(model.contactInfo.price)}</div>
        <div class="text-xs text-gray-600">Contact Price</div>
      </div>
      <div class="bg-gray-50 rounded p-2">
        <div class="text-lg font-semibold text-primary-600">{model.metrics?.salesCount || 0}</div>
        <div class="text-xs text-gray-600">Sales</div>
      </div>
    </div>

    <!-- User Info -->
    <div class="text-xs text-gray-500 mb-3">
      <p>@{model.user.username || 'No username'}</p>
      <p>Registered: {formatDate(model.timestamps.createdAt)}</p>
      {#if model.completeness}
        <div class="flex items-center mt-1">
          <div class="flex-1 bg-gray-200 rounded-full h-1.5">
            <div 
              class="h-1.5 rounded-full transition-all duration-300 {model.completeness.percentage >= 85 ? 'bg-green-500' : model.completeness.percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'}"
              style="width: {model.completeness.percentage}%"
            ></div>
          </div>
          <span class="ml-2 text-xs">{model.completeness.percentage}%</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- Actions -->
  <div class="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
    <div class="flex space-x-2">
      <button
        on:click={viewDetails}
        class="flex-1 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
      >
        View Details
      </button>
      
      {#if !model.status.adminApproved && !model.status.rejectionReason}
        <button
          on:click={quickApprove}
          class="px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded transition-colors"
        >
          ✓ Approve
        </button>
        <button
          on:click={quickReject}
          class="px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 rounded transition-colors"
        >
          ✗ Reject
        </button>
      {:else if model.status.adminApproved}
        <button
          on:click={toggleAvailability}
          class="px-3 py-1.5 text-sm {model.status.availability ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-700'} rounded transition-colors"
        >
          {model.status.availability ? 'Deactivate' : 'Activate'}
        </button>
      {/if}
    </div>
  </div>
</div>