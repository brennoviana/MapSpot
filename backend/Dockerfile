FROM node:20.16.0

WORKDIR /usr/src/app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend ./

EXPOSE 3000

CMD ["npm", "run", "start"]

