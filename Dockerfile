FROM node:21.2.0 AS builder

WORKDIR /chat

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./

EXPOSE 3001

CMD ["npm", "start"]
