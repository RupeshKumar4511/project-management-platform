# Step 1: Build React App
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci


# 1. Catch the arguments from docker-compose
ARG VITE_BACKEND_URL
ARG VITE_FRONTEND_URL
ARG VITE_RAZORPAY_API_KEY_ID
ARG VITE_API_URL

# 2. Make them available to the build command
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL
ENV VITE_RAZORPAY_API_KEY_ID=$VITE_RAZORPAY_API_KEY_ID
ENV VITE_API_URL=$VITE_API_URL

COPY . .

RUN npm run build

# Step 2 : Serve via Nginx
FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]