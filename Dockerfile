# ---- Stage 1: Build UI ----
FROM node:20-alpine AS build

WORKDIR /app

# Bağımlılıkları yükle
COPY package*.json ./
RUN npm ci

# Kodları kopyala ve build al
COPY . .
RUN npm run build

# ---- Stage 2: Export only dist ----
# Runtime stage'e gerek yok, sadece build çıktısı kullanılacak
FROM alpine:3.20

WORKDIR /output
COPY --from=build /app/dist ./

# sadece build çıktısını volume olarak paylaşacağız
CMD ["sh", "-c", "echo 'UI build hazır /output altında' && ls -la /output"]
