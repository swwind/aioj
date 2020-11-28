#!/bin/bash
yarn start&
ID=$!
sleep 1
yarn mocha
EXIT_CODE=$?
kill $ID
exit $?
