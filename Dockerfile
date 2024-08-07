FROM node:lts-alpine

WORKDIR /cms/api

COPY ./ /cms/api

RUN npm install --omit=dev && npm install cross-env -g

ENV mongo_manager_url mongodb://root:123456@192.168.0.124:27017/manager?authSource=admin
ENV mongo_content_url mongodb://root:123456@192.168.0.124:27017/content?authSource=admin
ENV mongo_crawler_url mongodb://root:123456@192.168.0.124:27017/crawler?authSource=admin
ENV mongo_user_url mongodb://root:123456@192.168.0.124:27017/user?authSource=admin

CMD [ "npm", "start" ]

EXPOSE 3334