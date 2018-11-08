FROM node:9.6.1

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY .npmrc /root/.npmrc

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm i
RUN npm i -g @angular/cli@1.7.1 --unsafe

COPY . /usr/src/app

CMD ng serve --host 0.0.0.0
