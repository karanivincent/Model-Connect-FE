<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  const menuItems = [
    { id: '/', label: 'Dashboard', icon: '📊' },
    { id: '/models', label: 'Models', icon: '👤' },
    { id: '/users', label: 'Users', icon: '👥' },
    { id: '/transactions', label: 'Transactions', icon: '💳' },
    { id: '/products', label: 'Products', icon: '📦' },
    { id: '/analytics', label: 'Analytics', icon: '📈' }
  ]

  function navigateTo(path: string) {
    goto(path)
  }

  $: activePage = $page.url.pathname
</script>

<aside class="w-64 bg-white shadow-sm border-r border-gray-200">
  <div class="p-6">
    <h1 class="text-xl font-bold text-primary-600">Admin Panel</h1>
  </div>
  
  <nav class="mt-6">
    {#each menuItems as item}
      <button
        on:click={() => navigateTo(item.id)}
        class="w-full flex items-center px-6 py-3 text-left hover:bg-primary-50 transition-colors {activePage === item.id ? 'bg-primary-100 border-r-2 border-primary-500 text-primary-700' : 'text-gray-600'}"
      >
        <span class="mr-3 text-lg">{item.icon}</span>
        <span class="font-medium">{item.label}</span>
      </button>
    {/each}
  </nav>
</aside>