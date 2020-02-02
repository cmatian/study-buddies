from node:12

RUN apt-get update && apt-get install netcat -y --no-install-recommends

WORKDIR /opt/study-buddies
COPY . .
WORKDIR /opt/study-buddies/api
RUN npm install
WORKDIR /opt/study-buddies/client
RUN npm install
EXPOSE 3000
WORKDIR /opt/study-buddies
CMD [ "/bin/bash", "run-site.sh" ]
