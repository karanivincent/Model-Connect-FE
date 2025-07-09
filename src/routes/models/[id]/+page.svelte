<script lang="ts">
  import ModelDetail from '../../../pages/ModelDetail.svelte'
  import { page } from '$app/stores'
  
  $: modelId = $page.params.id
</script>

<ModelDetail {modelId} />