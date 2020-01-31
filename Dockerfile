from node:12

WORKDIR /opt/study-buddies
COPY . .
WORKDIR /opt/study-buddies/api
RUN npm install
WORKDIR /opt/study-buddies/client
RUN npm install
EXPOSE 3000
WORKDIR /opt/study-buddies
CMD [ "/bin/sh", "run-site.sh" ]
