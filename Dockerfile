FROM node:16.13.1-alpine3.14 AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY migrations ./
# COPY .npmrc ./
# COPY .npmrc ./prisma

RUN yarn add glob rimraf
RUN yarn --only=development

COPY . .

RUN yarn build

FROM node:16.13.1-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
# COPY .npmrc ./
# COPY .npmrc $HOME

RUN yarn --only=production

COPY . .
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
EXPOSE ${WEBSITES_PORT}

CMD ["node", "dist/main"]