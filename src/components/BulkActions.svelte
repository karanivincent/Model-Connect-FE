<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let selectedModels: string[] = []
  export let loading: boolean = false

  const dispatch = createEventDispatcher()

  let showRejectModal = false
  let rejectionReason = ''

  function handleBulkApprove() {
    if (selectedModels.length === 0) return
    dispatch('bulk-action', {
      action: 'approve',
      modelIds: selectedModels
    })
  }

  function handleBulkReject() {
    if (selectedModels.length === 0) return
    showRejectModal = true
  }

  function confirmBulkReject() {
    if (!rejectionReason.trim()) return
    
    dispatch('bulk-action', {
      action: 'reject',
      modelIds: selectedModels,
      data: { reason: rejectionReason }
    })
    
    showRejectModal = false
    rejectionReason = ''
  }

  function handleBulkActivate() {
    if (selectedModels.length === 0) return
    dispatch('bulk-action', {
      action: 'set_availability',
      modelIds: selectedModels,
      data: { availability: true }
    })
  }

  function handleBulkDeactivate() {
    if (selectedModels.length === 0) return
    dispatch('bulk-action', {
      action: 'set_availability',
      modelIds: selectedModels,
      data: { availability: false }
    })
  }

  function handleBulkToggle() {
    if (selectedModels.length === 0) return
    dispatch('bulk-action', {
      action: 'toggle_availability',
      modelIds: selectedModels
    })
  }

  function selectAll() {
    dispatch('select-all')
  }

  function clearSelection() {
    dispatch('clear-selection')
  }
</script>

{#if selectedModels.length > 0}
  <div class="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <span class="text-sm font-medium text-primary-900">
          {selectedModels.length} model{selectedModels.length === 1 ? '' : 's'} selected
        </span>
        <button
          on:click={clearSelection}
          class="text-sm text-primary-700 hover:text-primary-900 underline"
        >
          Clear selection
        </button>
      </div>

      <div class="flex items-center space-x-2">
        <button
          on:click={handleBulkApprove}
          disabled={loading}
          class="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {#if loading}
            <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
          {/if}
          ✓ Approve All
        </button>

        <button
          on:click={handleBulkReject}
          disabled={loading}
          class="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ✗ Reject All
        </button>

        <div class="relative">
          <button
            class="px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors peer"
            disabled={loading}
          >
            More Actions ▼
          </button>
          
          <div class="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-200">
            <div class="py-1">
              <button
                on:click={handleBulkActivate}
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                🟢 Activate All
              </button>
              <button
                on:click={handleBulkDeactivate}
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                ⚫ Deactivate All
              </button>
              <button
                on:click={handleBulkToggle}
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                🔄 Toggle Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-600">
        No models selected
      </span>
      <button
        on:click={selectAll}
        class="text-sm text-primary-600 hover:text-primary-700 underline"
      >
        Select all visible
      </button>
    </div>
  </div>
{/if}

<!-- Rejection Modal -->
{#if showRejectModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Reject {selectedModels.length} Model{selectedModels.length === 1 ? '' : 's'}
      </h3>
      
      <p class="text-sm text-gray-600 mb-4">
        Please provide a reason for rejecting these models. This will be sent to the models for their reference.
      </p>

      <div class="mb-4">
        <label for="rejectionReason" class="block text-sm font-medium text-gray-700 mb-1">
          Rejection Reason *
        </label>
        <textarea
          id="rejectionReason"
          bind:value={rejectionReason}
          rows="4"
          placeholder="e.g., Incomplete profile information, poor photo quality, policy violations..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          required
        ></textarea>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          on:click={() => { showRejectModal = false; rejectionReason = '' }}
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          on:click={confirmBulkReject}
          disabled={!rejectionReason.trim() || loading}
          class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {#if loading}
            <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
          {/if}
          Reject Models
        </button>
      </div>
    </div>
  </div>
{/if}