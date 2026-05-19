FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache \
    fontconfig \
    ttf-dejavu

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm","run","dev"]