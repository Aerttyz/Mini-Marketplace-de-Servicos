FROM node:20-alpine

WORKDIR /frontend

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

# Inicia o servidor Node.js
CMD ["node", "build"]