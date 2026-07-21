##############################################################################
##                                 Base Image                               ##
##############################################################################
FROM node:14
ENV TZ=Europe/Berlin

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

##############################################################################
##                                 Global Dependecies                       ##
##############################################################################
EXPOSE 8888
# USER node

##############################################################################
##                                Install Dependencies                      ##
##############################################################################
WORKDIR /home/node

COPY ./package.json ./petra_web/
WORKDIR /home/node/petra_web
RUN npm install --legacy-peer-deps
RUN npm install -g serve

WORKDIR /home/node
# RUN git clone --depth 1 -b v1.0.0 https://<secret_removed>@www.w.hs-karlsruhe.de/gitlab/iras/research-projects/petra/petra_web.git
COPY . ./petra_web

##############################################################################
##                                 Build and run                            ##
##############################################################################
WORKDIR /home/node/petra_web
RUN npx browserslist@latest --update-db

ARG BACKEND_URL
ENV REACT_APP_FLASK_BACKEND_URL=$BACKEND_URL
RUN npm run build

CMD ["serve", "-n", "-s", "build", "-l", "3000"]
