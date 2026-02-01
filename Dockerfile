FROM 192.168.0.124:5000/ruanjiayou/node:amd64_20-chromium

WORKDIR /cms/api

COPY ./ /cms/api
VOLUME ["/cms/api/static"]

RUN npm install --omit=dev

ENV NODE_ENV=production
ENV mongo_url=mongodb://root:123456@192.168.0.124:27017/*?authSource=admin
ENV redis_url=redis://192.168.0.124:6379
ENV proxy=http://192.168.0.125:8888
ENV static=/cms/static

CMD [ "npm", "start" ]

EXPOSE 3333