# Base Image : 
FROM node:24 AS build

WORKDIR /app 

COPY package*.json ./

RUN npm ci --omit=dev

# Stage 2
FROM node:24-alpine

WORKDIR /app 

ENV NODE_ENV=production

COPY --from=build /app/node_modules /app/node_modules

COPY . .

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
