# MCNetwork — Frontend

Stack : React + Vite + TypeScript

## Installation

```bash
npm install
npm run dev
```

Le frontend tourne sur `http://localhost:5173`  
L'API Spring Boot doit tourner sur `http://localhost:8080`

## Structure

```
src/
├── components/
│   ├── layout/       # Navbar, Sidebar
│   ├── skin/         # PlayerSkin3D (skinview3d), PlayerAvatar (Crafatar)
│   └── ui/           # Composants génériques
├── hooks/
│   ├── useMojangSkin.ts   # Récupère le skin via l'API Mojang
│   └── useServers.ts      # Fetch les serveurs depuis Spring Boot
├── lib/
│   ├── api.ts        # Instance axios + endpoints
│   └── utils.ts      # Helpers (dates, durées)
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Servers.tsx
│   └── History.tsx
└── assets/skins/     # Mettre les fichiers .png de skins ici
```

## Skin du joueur

Place ton skin PNG dans `public/skins/` et référence-le dans `Dashboard.tsx` :

```ts
const MOCK_SKIN_URL = '/skins/link-botw-sequel.png'
```

Une fois l'API branchée, le skin sera chargé dynamiquement via Mojang.
