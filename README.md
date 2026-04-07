# MCNetwork — Frontend

Interface web du réseau Minecraft MCNetwork. Permet aux joueurs de se connecter via leur compte Microsoft, de visualiser les serveurs disponibles et de consulter leur historique de connexions.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **React Router v6** — navigation côté client
- **Axios** — appels API avec intercepteurs JWT
- **skinview3d** — rendu 3D du skin Minecraft (animations walk / run / idle)
- **CSS Modules** — styles scopés par composant

## Prérequis

- Node.js 18+
- API Spring Boot sur `http://localhost:8080`

## Installation

```bash
npm install
npm run dev
```

Le frontend tourne sur `http://localhost:5173`. Les appels `/api/*` sont proxifiés vers Spring Boot via Vite.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement avec HMR |
| `npm run build` | Build de production (`tsc` + Vite) |
| `npm run preview` | Prévisualisation du build |

## Pages

| Route | Composant | Description |
|---|---|---|
| `/login` | `Login.tsx` | Authentification Microsoft OAuth |
| `/dashboard` | `Dashboard.tsx` | Vue joueur : skin 3D, serveurs, historique |
| `/servers` | `Servers.tsx` | Liste complète des serveurs avec jauge de charge |
| `/history` | `History.tsx` | Historique de connexions |

## Structure

```
src/
├── components/
│   ├── layout/        # Navbar, Sidebar
│   └── skin/          # PlayerSkin3D (skinview3d), PlayerAvatar (Crafatar)
├── hooks/
│   ├── useMojangSkin.ts   # Récupère le skin via l'API Mojang
│   └── useServers.ts      # Fetch les serveurs depuis Spring Boot
├── lib/
│   ├── api.ts         # Instance axios + endpoints + intercepteurs JWT
│   └── utils.ts       # Helpers (formatDate, formatDuration)
└── pages/
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── Servers.tsx
    └── History.tsx
```

## Authentification

La connexion se fait via **Microsoft OAuth** (compte lié à Minecraft) :

1. L'utilisateur clique sur "Se connecter avec Microsoft"
2. Redirection vers `/api/auth/microsoft` (géré par Spring Boot)
3. Après succès, le token JWT est stocké dans le `localStorage`
4. Toutes les requêtes suivantes l'envoient automatiquement en header `Authorization: Bearer <token>`
5. En cas de 401, le token est supprimé et l'utilisateur est redirigé vers `/login`

## Skin du joueur

Le skin 3D est rendu via `skinview3d`. En développement, un skin local est utilisé :

```
public/skins/   ← place tes fichiers .png ici
```

Une fois l'API branchée, le skin sera chargé dynamiquement depuis Mojang via `useMojangSkin`.

## Données mockées

Les pages `Dashboard` et `Servers` utilisent des données mockées en fallback quand l'API Spring Boot n'est pas disponible (liste de serveurs français, historique fictif). Ces mocks seront remplacés automatiquement dès que l'API répond.
