FROM node:14-alpine

WORKDIR /usr/src/app

ADD package.json .
ADD yarn.lock .

RUN yarn install

COPY . .

RUN yarn compile

ARG PORT=4000
ENV PORT $PORT
EXPOSE $PORT

CMD ["yarn", "start"]