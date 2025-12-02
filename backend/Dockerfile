FROM node:20-alpine

RUN apk update && apk add --no-cache openssl

WORKDIR /backend

COPY package.json yarn.lock* ./


RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 3000

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && yarn seed && node dist/src/main.js"]