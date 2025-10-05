# 1. Stage: Build
FROM node:20-alpine AS build

WORKDIR /app

# package.json ve package-lock.json kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Proje dosyalarını kopyala
COPY . .

# Vite prod build
RUN npm run build

# 2. Stage: Serve
FROM nginx:alpine

# Nginx default web root
WORKDIR /usr/share/nginx/html

# Build dosyalarını kopyala
COPY --from=build /app/dist .

# Custom Nginx config (history mode için)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port aç
EXPOSE 80

# Nginx çalıştır
CMD ["nginx", "-g", "daemon off;"]
