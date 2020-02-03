#!/bin/bash

SB_DIR=/opt/study-buddies
cd $SB_DIR
source $SB_DIR/init-study-buddies-env.sh
./cloud_sql_proxy \
    -instances=study-buddies-266004:us-west1:study-buddies-db=tcp:0.0.0.0:3306\
    -credential_file=$SB_DIR/study-buddies-cloud-sql-sa.json &
./await-port.sh || exit 1
cd $SB_DIR/api/
npm run server
