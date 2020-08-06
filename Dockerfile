# build image
FROM node:erbium AS build

ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get -y -u upgrade

ENV TZ ${TZ:-"America/Los_Angeles"}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY build_docker_image.sh /usr/src/app/
RUN ./build_docker_image.sh

RUN npm prune --production

# production image
FROM node:erbium-slim AS production
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ ${TZ:-"America/Los_Angeles"}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get -y -u upgrade && apt-get install -y curl net-tools telnet tcpdump dnsutils

WORKDIR /usr/src/app

# libs and dependencies
COPY --from=build --chown=1000 /usr/src/app/package.json /usr/src/app/node_modules/.cache/package.json
COPY --from=build --chown=1000 /usr/src/app /usr/src/app

# startup file
COPY --chown=1000 ./run_docker_image.sh /usr/src/app/run_docker_image.sh


# Bundle app source
COPY --chown=1000 ./src /usr/src/app/src

USER node
EXPOSE 3000
CMD [ "npm", "run", "run_docker" ]
