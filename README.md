# Bookings Admin Frontend

Modern admin dashboard for the Bookings application, built with Svelte and TypeScript.

## Features

- **Svelte 4** - Reactive frontend framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Responsive Design** - Works on desktop and mobile
- **Admin Dashboard** - Manage models, users, and transactions

## Prerequisites

- Node.js 18+
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001

# App Configuration  
VITE_APP_NAME=Bookings Admin
VITE_APP_VERSION=1.0.0
```

For production, set `VITE_API_URL` to your backend API URL.

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

The development server includes:
- Hot Module Replacement (HMR)
- API proxy to backend (configured in vite.config.js)
- TypeScript checking
- Tailwind CSS compilation

## Building

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` - Your backend API URL

```bash
# Deploy to production
npm run deploy

# Deploy preview
npm run deploy:preview
```

### Netlify

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist/` folder to Netlify

3. Set environment variables in Netlify:
   - `VITE_API_URL` - Your backend API URL

### Other Hosting

The application builds to static files in `dist/` directory that can be served by any static hosting service.

## Project Structure

```
src/
├── components/          # Reusable Svelte components
│   ├── BulkActions.svelte
│   ├── ModelCard.svelte
│   ├── ModelFilters.svelte
│   └── Sidebar.svelte
├── pages/              # Page components
│   ├── Analytics.svelte
│   ├── Dashboard.svelte
│   ├── Models.svelte
│   ├── Products.svelte
│   ├── Transactions.svelte
│   └── Users.svelte
├── services/           # API and business logic
│   ├── api.ts          # HTTP client
│   ├── dashboardService.ts
│   ├── modelService.ts
│   └── userService.ts
├── stores/             # Svelte stores for state management
│   └── navigation.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.svelte          # Root component
├── app.css            # Global styles
└── main.ts            # Application entry point
```

## Features

### Admin Dashboard
- **Models Management** - Review and approve model profiles
- **User Management** - View and manage user accounts
- **Analytics** - View application metrics and charts
- **Transactions** - Monitor payment transactions
- **Products** - Manage e-commerce products

### UI Components
- **Responsive Sidebar** - Collapsible navigation
- **Data Tables** - Sortable and filterable tables
- **Model Cards** - Rich model profile displays
- **Bulk Actions** - Multi-select operations
- **Filters** - Advanced filtering options

## API Integration

The frontend communicates with the backend through a REST API. The API client is configured in `src/services/api.ts`.

### Environment-based API URLs
- **Development**: Uses proxy configuration in vite.config.js
- **Production**: Uses `VITE_API_URL` environment variable

### API Endpoints Used
- `GET /api/admin/models` - Fetch models for admin review
- `GET /api/admin/models?action=pending` - Fetch pending models
- Additional endpoints as needed

## Styling

The application uses **Tailwind CSS** for styling:

- Configuration in `tailwind.config.js`
- PostCSS configuration in `postcss.config.js` 
- Global styles in `src/app.css`

### Design System
- **Colors**: Custom color palette for branding
- **Typography**: Responsive text scales
- **Components**: Reusable utility classes
- **Dark Mode**: Ready for implementation

## State Management

Uses Svelte's built-in reactivity and stores:

- **Navigation Store** (`stores/navigation.ts`) - Sidebar state
- **Component State** - Local reactive variables
- **API State** - Managed in service layers

## TypeScript

Full TypeScript support with:

- Strict type checking enabled
- API response types defined
- Component prop types
- Service layer interfaces

Configuration in `tsconfig.json`.

## Testing

```bash
# Type checking
npm run check

# Build test (ensures no TypeScript errors)
npm run build
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run check` - TypeScript type checking
- `npm run deploy` - Deploy to production
- `npm run deploy:preview` - Deploy preview

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

Modern browsers with ES2020 support.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test the build: `npm run build`
4. Check types: `npm run check`
5. Submit a pull request

## Troubleshooting

### API Connection Issues
- Check `VITE_API_URL` environment variable
- Verify backend is running on correct port
- Check browser console for CORS errors

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors: `npm run check`

### Development Server Issues
- Change port in vite.config.js if 5173 is in use
- Clear Vite cache: `rm -rf .vite`