# --- Backend App Stage ---
FROM php:8.3-fpm-alpine
WORKDIR /var/www

# Fix potential repository issues and install PHP extensions + dependencies
RUN sed -i 's/dl-cdn.alpinelinux.org/uk.alpinelinux.org/g' /etc/apk/repositories && \
    apk update --no-cache && \
    apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    oniguruma-dev \
    zlib-dev \
    libzip-dev \
    nodejs \
    npm

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip
