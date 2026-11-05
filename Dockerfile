FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ENV APP_PORT=3333 APP_HOST=localhost AMBIENTE_PROCESSO=desenvolvimento
EXPOSE 3333
CMD ["npm", "start"]
