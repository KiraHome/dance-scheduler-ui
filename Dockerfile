FROM node:8.12.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV HTTPS_PROXY=http://PITC-Zscaler-EMEA-Amsterdam3PR.proxy.corporate.ge.com:80
ENV HTTP_PROXY=http://PITC-Zscaler-EMEA-Amsterdam3PR.proxy.corporate.ge.com:80
ENV ftp_proxy=http://PITC-Zscaler-EMEA-Amsterdam3PR.proxy.corporate.ge.com:80
ENV http_proxy=http://PITC-Zscaler-EMEA-Amsterdam3PR.proxy.corporate.ge.com:80
ENV https_proxy=http://PITC-Zscaler-EMEA-Amsterdam3PR.proxy.corporate.ge.com:80
ENV no_proxy=127.0.0.1,localhost,build.ge.com,openge.ge.com,ice.ge.com,sw.ge.com,swcoe.ge.com,e2k.ad.ge.com,szeged-nexus.cloud.health.ge.com

ADD 00proxy.conf /etc/apt/apt.conf.d/
ADD GE_cert.crt /usr/local/share/ca-certificates/

RUN apt-get install -y ca-certificates 

COPY .npmrc .npmrc
COPY .npmrc /root/.npmrc
COPY .npmrc /usr/src/app/.npmrc
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/

RUN npm i
RUN npm i node-sass --unsafe-perm
RUN npm i -g @angular/cli@1.7.1 --unsafe

RUN rm -f .npmrc

COPY . /usr/src/app

EXPOSE 4200
CMD ng serve --host 0.0.0.0
