FROM mhart/alpine-node

WORKDIR /usr/app

COPY package.json .
RUN npm install --production

COPY ./server ./server
COPY ./build/dist ./build/dist
COPY ./login ./login