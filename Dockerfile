FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV VITE_API_URL=http://192.168.1.51:5001
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]