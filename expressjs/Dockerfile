FROM node:16

WORKDIR /usr/svc/expressdemo
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

CMD [ "node", "index.js" ]

