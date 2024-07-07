FROM node:lts-alpine

WORKDIR /cms/api

COPY ./ /cms/api

RUN npm install --omit=dev && npm install cross-env -g

env MONGO_URL mongodb://root:123456@192.168.0.124:27017/manage?authSource=admin

CMD [ "npm", "start" ]

EXPOSE 3334