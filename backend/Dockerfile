FROM php:8.1-apache

# Install Driver Database
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Aktifkan mod_rewrite
RUN a2enmod rewrite

# COPY HANYA ISI FOLDER SRC KE ROOT HTML
# Ini penting biar URL-nya jadi http://localhost:5000/api_bookings.php (tanpa /src)
COPY src/ /var/www/html/

# Ubah izin folder
RUN chown -R www-data:www-data /var/www/html