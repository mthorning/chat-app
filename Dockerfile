FROM mhart/alpine-node

WORKDIR /usr/app

COPY package.json .
RUN npm ci

COPY ./server ./server
COPY ./build/dist ./build/dist
