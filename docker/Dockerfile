# ---------------------------
# Build stage
# ---------------------------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package-lock.json package.json ./

RUN npm ci

COPY . .

RUN npm run build


# ---------------------------
# Production image
# ---------------------------
FROM nginx:1.29-alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]