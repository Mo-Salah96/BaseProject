FROM node:11 AS builder
ADD package*.json /tmp/
WORKDIR /tmp
RUN npm install --only=production
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app
FROM node:11-slim
COPY . /usr/src/app
COPY --from=builder /usr/src/app /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3000
CMD [ "node", "app.js" ]
