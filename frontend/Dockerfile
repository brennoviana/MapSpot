FROM node:20.16.0

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend ./

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ["npx", "expo", "start", "--tunnel"]
