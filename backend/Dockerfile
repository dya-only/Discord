FROM node:lts-alpine AS build

WORKDIR /build

COPY package.json /build/package.json
COPY pnpm-lock.yaml /build/pnpm-lock.yaml

RUN npm i -g pnpm

RUN pnpm i

COPY . /build/

RUN pnpm build

# ---

FROM node:lts-alpine AS modules

WORKDIR /modules

COPY package.json /modules/package.json
COPY pnpm-lock.yaml /modules/pnpm-lock.yaml

RUN npm i -g pnpm

RUN pnpm i -P

# ---

FROM alpine AS app

WORKDIR /app

RUN apk add --no-cache nodejs

COPY --from=build /build/dist /app/dist
COPY --from=modules /modules/node_modules /app/node_modules

EXPOSE 3000

ENTRYPOINT [ "node", "/app/dist/main.js" ]