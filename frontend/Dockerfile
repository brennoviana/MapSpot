FROM node:20-slim

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend ./

EXPOSE 19000

CMD ["npx", "expo", "start", "--tunnel"]
