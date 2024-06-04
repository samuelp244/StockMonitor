FROM node:latest

RUN mkdir /app
WORKDIR /app

RUN npm i -g @nestjs/cli

COPY package.json package-lock.json ./

RUN npm ci

COPY . .
RUN npm run build

EXPOSE 1337

CMD [ "npm", "run", "start" ]
