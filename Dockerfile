FROM node:12-alpine

WORKDIR /app

COPY package*.json tsconfig.json /app/
RUN npm install

COPY src /app/src/
RUN npm run build

EXPOSE 3001

CMD [ "npm", "run", "start" ]