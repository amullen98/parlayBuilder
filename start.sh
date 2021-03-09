#!/bin/bash

export HOME_DIR=`pwd`
export NODE_PATH=${HOME_DIR}/Node

redis-server --daemonize yes
mkdir -p logs

export PATH=$PATH:$NODE_PATH/bin
npm config set strict-ssl false

cd ${HOME_DIR}
npm_command="npm install"
eval $npm_command

node_command="nohup node ./app.js > ${HOME_DIR}/logs/paralyWebsite.stdout.log 2> ${HOME_DIR}/logs/parlayWebsite.stderr.log &"
eval $node_command

exit 0
