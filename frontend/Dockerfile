FROM node:20-slim

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend ./

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ["npx", "expo", "start", "--tunnel"]
