# Pakai PHP Apache (Bukan Node.js)
FROM php:8.1-apache

# Install Driver Database
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Aktifkan mod_rewrite agar URL aman
RUN a2enmod rewrite

# Copy kodingan PHP kamu ke dalam container
COPY . /var/www/html/

# Ubah izin folder agar bisa dibaca
RUN chown -R www-data:www-data /var/www/html