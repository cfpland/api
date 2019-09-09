FROM node:10

WORKDIR /usr/src/app

RUN mkdir src
COPY src/ ./src
COPY package.json .
COPY package-lock.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY tslint.json .
COPY nodemon.json .
COPY nodemon-debug.json .
COPY nest-cli.json .
RUN npm install
RUN npm run build

COPY test/ ./test

CMD ["npm", "run", "start:dev"]
