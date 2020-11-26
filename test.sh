#!/bin/bash

yarn start&
ID=$!
sleep 1
yarn mocha
kill $ID
