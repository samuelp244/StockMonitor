FROM node:latest

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ] 
