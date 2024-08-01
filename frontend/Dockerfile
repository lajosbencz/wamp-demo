FROM node:20-alpine3.17

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 5173

ENTRYPOINT [ "yarn" ]
CMD [ "dev" ]
