FROM node:20.16.0

WORKDIR /usr/src/app

COPY ./backend/services/auth/package*.json ./

RUN npm install

COPY ./backend/services/auth ./

EXPOSE 3000

CMD ["npm", "run", "start"]

