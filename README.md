
# Store Rating System

A full‑stack web application that lets users discover local stores and rate their experiences. The system includes role-based access control (Administrators, Store Owners, and Users), JWT authentication, and a Prisma + PostgreSQL backend.

---

## 🚀 Features

- **User Roles**
  - **Admin:** Manage users and stores, view system-wide dashboard statistics.
  - **Store Owner:** View assigned store details and customer ratings.
  - **User:** Browse stores, search/filter, and leave ratings (1–5 stars).
- **Authentication:** Secure signup & login using JWT and `bcrypt`.
- **Dashboards:** Interactive dashboards for each role.
- **Backend:** Node.js + Express, Prisma ORM, PostgreSQL.
- **Frontend:** React (Vite recommended), React Router.
- **Seeders:** Scripts to create default admin and sample data.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite or Create React App
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JSON Web Tokens (JWT), `bcrypt`

---

## ⚙️ Prerequisites

- Node.js v16+
- PostgreSQL v13+
- `npm` (or `pnpm`/`yarn`)

---

## 📦 Installation & Setup

### 1. Create PostgreSQL role & database

Open `psql` or pgAdmin and run:

```sql
CREATE USER sanskruti WITH PASSWORD '123456';
ALTER USER sanskruti CREATEDB;
CREATE DATABASE store OWNER sanskruti;
GRANT ALL PRIVILEGES ON DATABASE store TO sanskruti;
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` in `backend/`:

```env
DATABASE_URL="postgresql://sanskruti:123456@localhost:5432/store?schema=public"
JWT_SECRET="supersecret_dev_key_change_later"
JWT_EXPIRES_IN="7d"
PORT=3000
```

Generate Prisma client and run migration:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Seed initial data:

```bash
# Create default Admin (admin@example.com / Admin@1234)
node prisma/seedAdmin.js

# Optional: seed more mock stores and owners
node prisma/seedMoreData.js
```

Start backend:

```bash
npm run dev
# OR
nodemon src/server.js
```

Backend runs at: `http://localhost:3000`

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev   # if using Vite
# OR
npm start     # if using CRA
```

Frontend runs at: `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA dev server)

---

## 🔑 Default Credentials (seeded)

- **Administrator**
  - Email: `admin@example.com`
  - Password: `Admin@1234`

- **Test Owner (if seeded)**
  - Email: `aarav@store.com`
  - Password: `Owner@1234`

---

## 🧭 API (example endpoints)

> Base URL: `http://localhost:3000/api`

- `POST /api/auth/signup` — Create user (body: `{ name, email, password, role }`)
- `POST /api/auth/login` — Login (body: `{ email, password }`) → returns JWT
- `GET /api/stores` — List stores (supports query params: `q`, `city`, `category`, `page`, `limit`)
- `GET /api/stores/:id` — Get store details (includes average rating & reviews)
- `POST /api/stores/:id/ratings` — Add rating (protected: User role)
- `GET /api/admin/dashboard` — Admin stats (protected: Admin role)
- `GET /api/owner/stores/:id/ratings` — Owner view of store ratings (protected: Owner role)

> All protected routes require `Authorization: Bearer <token>` header.

---

## 📂 Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seedAdmin.js
│   │   └── seedMoreData.js
│   ├── src/
│   │   ├── config/          # Prisma client instance
│   │   ├── controllers/     # Route logic
│   │   ├── middlewares/     # Auth, role checks
│   │   ├── routes/          # API endpoints
│   │   └── server.js        # App entrypoint
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client
│   │   ├── pages/           # Login, Dashboard, Stores, etc.
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # AuthContext, etc.
│   │   └── App.jsx
│   └── package.json
```
## 📸 Screenshots

<img width="1867" height="834" alt="image" src="https://github.com/user-attachments/assets/3adbe090-4650-41ce-819b-f5d853ed6a0a" />
<img width="1860" height="846" alt="image" src="https://github.com/user-attachments/assets/52d69c38-352a-46ee-9444-54ffc6809d78" />
<img width="1864" height="826" alt="image" src="https://github.com/user-attachments/assets/9732a3ce-fc60-4218-91c7-18410dd1ac35" />
<img width="1879" height="834" alt="image" src="https://github.com/user-attachments/assets/3959cd49-db4f-48aa-ae10-d23b10996275" />
<img width="1874" height="852" alt="image" src="https://github.com/user-attachments/assets/02e20875-2d0c-4e2f-8ce6-bfbc38846d79" />
<img width="1858" height="847" alt="image" src="https://github.com/user-attachments/assets/52c45b67-edd7-4391-818d-4b0637f73ac6" />
<img width="1867" height="847" alt="image" src="https://github.com/user-attachments/assets/8d75682b-2b18-4146-b0dd-031a94aeaee0" />









