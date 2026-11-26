FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ENV APP_PORT=8080 APP_HOST=localhost AMBIENTE_PROCESSO=producao
EXPOSE 8080
CMD ["npm", "start"]
