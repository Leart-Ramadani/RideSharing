# RideSharing Setup Guide

## Backend Setup

cd backend
composer require laravel/boost --dev
composer install
cp .env.example .env

# configure .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=backend
DB_USERNAME=root
DB_PASSWORD=

php artisan key:generate
php artisan jwt:secret

mysql -u root -e "CREATE DATABASE backend;"

php artisan migrate
php artisan db:seed --class=RoleSeeder

php artisan config:clear

# start backend
php artisan serve
(if that does not work try: php -S 127.0.0.1:8080 -t public)
# OR use Laragon → Start All
Create a `.env` file in the frontend folder:
cp .env.example .env

VITE_API_URL=http://127.0.0.1:8080/api

## Frontend Setup

cd frontend
npm install
npm run dev


## API Config
