# Stage 1 : Build Stage : 
FROM node:24 AS build

WORKDIR /app 

COPY package*.json ./

RUN npm ci --omit=dev

# Stage 2 : Production Stage
FROM node:24-alpine

WORKDIR /app 

ENV NODE_ENV=production

COPY --from=build /app/node_modules /app/node_modules

COPY . .

# In production localhost refers to current container not ec2 instance 
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
