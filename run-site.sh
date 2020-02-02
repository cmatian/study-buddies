#!/bin/bash

source init-study-buddies-env.sh
./await-port.sh
cd client/
npm run dev
