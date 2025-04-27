# Сборка проекта
FROM node:16-alpine AS builder

WORKDIR /app

RUN apk add --no-cache bash curl libc6-compat

RUN npm install -g @nestjs/cli

COPY package*.json ./

RUN npm install

COPY . .

COPY tsconfig.json ./

RUN npm run build

# Образ
FROM node:16-alpine AS runner

WORKDIR /app

RUN apk add --no-cache bash curl libc6-compat

RUN npm install -g @nestjs/cli

COPY package*.json ./

RUN npm install --only=production

RUN npm install pm2 -g

COPY ./wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

COPY --from=builder /app/dist ./dist

COPY ecosystem.config.js ./

EXPOSE 3001

CMD ["./wait-for-it.sh", "postgres-db:5432", "--", "pm2-runtime", "ecosystem.config.js"]
