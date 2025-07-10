<script lang="ts">
  import ModelDetail from '../../../pages/ModelDetail.svelte'
  import { page } from '$app/stores'
  
  $: modelId = $page.params.id || ''
  $: console.log('Route: modelId changed to:', modelId, 'from params:', $page.params)
</script>

{#if modelId}
  <ModelDetail {modelId} />
{:else}
  <div class="p-8">
    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 class="text-sm font-medium text-red-800">Invalid Model ID</h3>
      <p class="text-sm text-red-700 mt-1">Model ID not found in URL parameters</p>
    </div>
  </div>
{/if}