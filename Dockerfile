from node:12

RUN apt-get update && apt-get install -y --no-install-recommends netcat wget

WORKDIR /opt/study-buddies
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
RUN chmod +x cloud_sql_proxy
COPY . .
WORKDIR /opt/study-buddies/api
RUN npm install
WORKDIR /opt/study-buddies/client
RUN npm install
RUN npm run build
EXPOSE 3000
WORKDIR /opt/study-buddies
CMD [ "/bin/bash", "/opt/study-buddies/run-site.sh" ]
