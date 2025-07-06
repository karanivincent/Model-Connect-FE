<script lang="ts">
  // Dashboard placeholder content
</script>

<div class="p-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
    <p class="text-gray-600 mt-2">Welcome to the Bookings admin interface</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div class="flex items-center">
        <div class="p-2 bg-primary-100 rounded-lg">
          <span class="text-2xl">👤</span>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Models</p>
          <p class="text-2xl font-bold text-gray-900">--</p>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div class="flex items-center">
        <div class="p-2 bg-primary-100 rounded-lg">
          <span class="text-2xl">👥</span>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Users</p>
          <p class="text-2xl font-bold text-gray-900">--</p>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div class="flex items-center">
        <div class="p-2 bg-primary-100 rounded-lg">
          <span class="text-2xl">💳</span>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Transactions</p>
          <p class="text-2xl font-bold text-gray-900">--</p>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div class="flex items-center">
        <div class="p-2 bg-primary-100 rounded-lg">
          <span class="text-2xl">📦</span>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Products</p>
          <p class="text-2xl font-bold text-gray-900">--</p>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div class="space-y-4">
        <p class="text-gray-500 text-center py-8">No recent activity</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
      <div class="space-y-4">
        <p class="text-gray-500 text-center py-8">No pending approvals</p>
      </div>
    </div>
  </div>
</div>