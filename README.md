# 🚗 RideSharing Setup Guide

A full-stack RideSharing application built with Laravel (backend) and Vite frontend.

---

# ⚙️ Backend Setup

## 1. Go to backend folder
```bash
cd backend
```

---

## 2. Install dependencies
```bash
composer install
composer require laravel/boost --dev
```

---

## 3. Create environment file
```bash
cp .env.example .env
```

---

## 4. Configure database (.env)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=backend
DB_USERNAME=root
DB_PASSWORD=
```

---

## 5. Generate keys
```bash
php artisan key:generate
php artisan jwt:secret
```

---

## 6. Create database
```bash
mysql -u root -e "CREATE DATABASE backend;"
```

---

## 7. Run migrations & seed data
```bash
php artisan migrate
php artisan db:seed --class=RoleSeeder
```

---

## 8. Clear cache
```bash
php artisan config:clear
```

---

## 9. Start backend

### Option 1 (Laravel)
```bash
php artisan serve
```

### Option 2 (if port issue)
```bash
php -S 127.0.0.1:8080 -t public
```

### Option 3 (Recommended)
Use Laragon → Start All

---

# 🌐 Frontend Setup

## 1. Go to frontend folder
```bash
cd frontend
```

---

## 2. Install dependencies
```bash
npm install
```

---

## 3. Create .env file
cp .env.example .env
add the backend url to the VITE config
```env
VITE_API_URL=http://url-from-backend-server/api      
example: VITE_API_URL=http://127.0.0.1:8080/api

```

---

## 4. Start frontend
```bash
npm run dev
```

---

# 🔗 API CONFIG

```js
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL
}

export default API_CONFIG
```

---

# ⚠️ NOTES

- Make sure MySQL is running (Laragon → Start All)
- Run `php artisan config:clear` after `.env` changes
- Use Laragon if `artisan serve` fails
- Backend must be running before frontend

---

# 🚀 DONE

Backend: http://127.0.0.1:8000  
Frontend: http://localhost:5173
