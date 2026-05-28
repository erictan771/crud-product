# --- Frontend Build Stage ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# --- Backend App Stage ---
FROM php:8.3-fpm-alpine AS app
WORKDIR /var/www

RUN apk add --no-cache \
    bash \
    curl \
    git \
    unzip \
    zip \
    icu-libs \
    libzip \
    libpng \
    freetype \
    libjpeg-turbo \
  && apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    oniguruma-dev \
    icu-dev \
    libzip-dev \
    libpng-dev \
    freetype-dev \
    libjpeg-turbo-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
  && apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts

COPY . .
RUN composer dump-autoload --no-dev --optimize --no-interaction \
  && php artisan package:discover --ansi

COPY --from=frontend-builder /app/public/build ./public/build

RUN chown -R www-data:www-data storage bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]

# --- Nginx Web Stage ---
FROM nginx:alpine AS web
WORKDIR /var/www
COPY --from=app /var/www /var/www
