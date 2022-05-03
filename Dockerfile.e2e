FROM node:16.13.2-alpine3.14 AS build

WORKDIR /usr/src/app
ADD package.json yarn.lock tsconfig.json /usr/src/app/
RUN yarn --pure-lockfile

FROM node:16.13.2-alpine3.14 as production

EXPOSE ${WEBSITES_PORT}
WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /usr/src/app .
ADD . /usr/src/app/
RUN yarn build

CMD ["node", "dist/main"]