FROM php:8.1-apache

# Install ekstensi MySQL (Wajib buat CRUD)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Aktifkan mod_rewrite (Biar URL cantik kalau nanti butuh)
RUN a2enmod rewrite