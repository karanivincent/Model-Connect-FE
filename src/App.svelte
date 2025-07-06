<script lang="ts">
  import './app.css'
  import Sidebar from './components/Sidebar.svelte'
  import Dashboard from './pages/Dashboard.svelte'
  import Models from './pages/Models.svelte'
  import Users from './pages/Users.svelte'
  import Transactions from './pages/Transactions.svelte'
  import Products from './pages/Products.svelte'
  import Analytics from './pages/Analytics.svelte'
  import { currentPage } from './stores/navigation'

  let page: string = 'dashboard'

  currentPage.subscribe(value => {
    page = value
  })
</script>

<div class="flex h-screen bg-gray-50">
  <Sidebar />
  
  <main class="flex-1 overflow-auto">
    {#if page === 'dashboard'}
      <Dashboard />
    {:else if page === 'models'}
      <Models />
    {:else if page === 'users'}
      <Users />
    {:else if page === 'transactions'}
      <Transactions />
    {:else if page === 'products'}
      <Products />
    {:else if page === 'analytics'}
      <Analytics />
    {/if}
  </main>
</div>