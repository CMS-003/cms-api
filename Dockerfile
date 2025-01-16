FROM node:alpine

WORKDIR /cms/api

COPY ./ /cms/api

RUN npm install --omit=dev && npm install cross-env -g

ENV mongo_system_url mongodb://root:123456@192.168.0.124:27017/schema?authSource=admin

CMD [ "npm", "start" ]

EXPOSE 3334