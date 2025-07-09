FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install

ARG CACHE_BUST
COPY . .



EXPOSE 5000

VOLUME /app/node_modules

CMD ["node", "server.js"]
