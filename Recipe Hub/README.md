# Recipe Hub

Aplicație full-stack pentru gestionarea rețetelor de bucătărie.

## Stack tehnologic

- **Frontend**: React (Vite) + TailwindCSS + React Router + lucide-react
- **Backend**: Node.js + Express + Prisma ORM
- **Bază de date**: SQLite (local) — ușor de migrat la PostgreSQL pentru producție

## Structură proiect

```
Recipe Hub/
├── server/          # API Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── index.js
│       ├── prismaClient.js
│       └── routes/recipes.js
└── client/          # React app (Vite)
    └── src/
        ├── App.jsx
        ├── api.js
        ├── components/
        └── pages/
```

## Rulare locală

### 1. Backend (API)

```powershell
cd "server"
npm install
npx prisma migrate dev --name init
npm run seed        # opțional: adaugă rețete demo
npm run dev          # pornește pe http://localhost:4000
```

### 2. Frontend

Într-un terminal separat:

```powershell
cd "client"
npm install
npm run dev          # pornește pe http://localhost:5173
```

Aplicația va fi disponibilă la `http://localhost:5173`. Cererile către `/api/*` sunt redirecționate automat spre backend (vezi `vite.config.js`).

## API Endpoints

| Metodă | Rută                 | Descriere                  |
|--------|----------------------|-----------------------------|
| GET    | `/api/recipes`       | Listă rețete (filtre: `search`, `category`) |
| GET    | `/api/recipes/:id`   | Detaliu rețetă              |
| POST   | `/api/recipes`       | Creează rețetă              |
| PUT    | `/api/recipes/:id`   | Actualizează rețetă         |
| DELETE | `/api/recipes/:id`   | Șterge rețetă               |

## Deploy (etapa următoare)

Când ești pregătit să publici aplicația:

1. **Bază de date**: migrează de la SQLite la PostgreSQL (ex. [Neon](https://neon.tech) sau [Supabase](https://supabase.com)) — schimbă `provider` în `prisma/schema.prisma` și `DATABASE_URL` în `.env`.
2. **Backend**: deploy pe [Render](https://render.com), [Railway](https://railway.app) sau similar.
3. **Frontend**: deploy pe [Netlify](https://netlify.com) sau [Vercel](https://vercel.com), setând `VITE_API_URL` către URL-ul backend-ului.

Putem parcurge acești pași împreună când ești pregătit.
