FROM node:lts-alpine

WORKDIR /cms/api

COPY ./ /cms/api

RUN npm install --omit=dev

CMD [ "npm", "start" ]

EXPOSE 3334