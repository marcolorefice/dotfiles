#!/bin/bash
# Installing dockerized command with make
# https://github.com/stefanorg/make-docker-command

if [[ ! -d $HOME/.make-docker-command ]];
then
  #statements
  echo "cloning make docker commands: https://github.com/stefanorg/make-docker-command"
  git clone https://github.com/stefanorg/make-docker-command $HOME/.make-docker-command
else
  echo "updating $HOME/.make-docker-command"
  cd $HOME/.make-docker-command && git pull
fi
