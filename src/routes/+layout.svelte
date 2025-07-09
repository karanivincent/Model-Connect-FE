<script lang="ts">
  import '../app.css'
  import Sidebar from '../components/Sidebar.svelte'
</script>

<div class="flex h-screen bg-gray-50">
  <Sidebar />
  
  <main class="flex-1 overflow-auto">
    <slot />
  </main>
</div>