# Gunakan image PHP dengan Web Server Apache
FROM php:8.1-apache

# Install ekstensi PHP yang wajib untuk connect ke MySQL (mysqli & pdo)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Aktifkan mod_rewrite (supaya URL cantik/routing aman)
RUN a2enmod rewrite

# Set folder kerja
WORKDIR /var/www/html

# Copy semua file dari folder backend komputer ke dalam folder html di container
COPY . /var/www/html/

# Berikan hak akses (optional tapi bagus untuk mencegah error permission)
RUN chown -R www-data:www-data /var/www/html