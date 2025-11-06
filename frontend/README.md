# Frontend - City Explorer

React + TypeScript frontend application for City Explorer game-based learning app.

## 🚀 Quick Start

### Development (Local)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Development (Docker)

```bash
# From project root
docker-compose up frontend
```

## 📁 Structure

```
frontend/
├── src/
│   ├── pages/          # React page components
│   │   ├── Explore.tsx
│   │   ├── DiscoveryScanner.tsx
│   │   ├── LandmarkDetail.tsx
│   │   └── ...
│   ├── services/       # API client and services
│   │   └── api.ts      # Backend API client
│   ├── assets/         # Images and media files
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── package.json        # Dependencies
└── vite.config.ts      # Vite configuration
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### API Client

The API client is located in `src/services/api.ts` and provides type-safe methods to interact with the backend:

```typescript
import api from './services/api';

// Get all landmarks
const landmarks = await api.getLandmarks();

// Discover a landmark
await api.discoverLandmark(landmarkId, userId, 'ar_scan');
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Dependencies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 🌐 API Integration

The frontend communicates with the FastAPI backend running on port 8000. See `src/services/api.ts` for all available API methods.

## 🐛 Troubleshooting

### Port Already in Use

Change the port in `vite.config.ts` or use:
```bash
npm run dev -- --port 3000
```

### API Connection Issues

- Ensure backend is running on port 8000
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS settings in backend
