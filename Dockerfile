# --- Frontend Build Stage ---
FROM node:20-alpine as frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# --- Backend App Stage ---
FROM php:8.3-fpm-alpine
WORKDIR /var/www

# Install PHP extensions dan dependencies
RUN apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    oniguruma-dev \
    zlib-dev \
    libzip-dev

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy kode aplikasi
COPY . .

# Copy assets hasil build dari stage frontend
COPY --from=frontend-builder /app/public/build ./public/build

# Install composer dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
