FROM ruanjiayou/node:amd64_20-chromium

WORKDIR /cms/api

COPY ./ /cms/api
VOLUME ["/cms/api/static/downloads", "/cms/api/static/upload", "/cms/api/static/images", "/cms/api/static/proxy", "/cms/api/static/nas"]

RUN npm install --omit=dev

ENV NODE_ENV=production
ENV mongo_system_url=mongodb://root:123456@192.168.0.124:27017/schema?authSource=admin
ENV redis_url=redis://192.168.0.124:6379
ENV proxy_agent=http://192.168.0.125:8888

CMD [ "npm", "start" ]

EXPOSE 3333