FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn

RUN yarn add @nestjs/cli

RUN yarn build

CMD ["yarn", "start:dev"]
