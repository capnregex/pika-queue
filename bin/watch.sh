#!/bin/bash
on_die() {
  echo
  echo killing supervisors
  kill $LESS_PID $SERVER_PID
  exit
}

SUPERVISOR=./node_modules/.bin/supervisor

$SUPERVISOR -e "less|css" -w public/less -x make less-watch &
LESS_PID=$!

$SUPERVISOR -e "js|json" server.js &
SERVER_PID=$!

trap 'on_die' SIGINT
trap 'on_die' SIGTERM
sleep 10000000
