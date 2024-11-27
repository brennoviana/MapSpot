FROM node:20.16.0

WORKDIR /usr/src/app

COPY ./backend/services/location/package*.json ./

RUN npm install

COPY ./backend/services/location ./

EXPOSE 3001

CMD ["npm", "run", "start"]

