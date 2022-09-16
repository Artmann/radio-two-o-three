FROM node:18-alpine
WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn

COPY ./ .

RUN yarn run build

ENV NODE_ENV=production

CMD [ "yarn", "start" ]
