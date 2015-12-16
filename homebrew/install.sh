#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.
if [ "$(echo $OS)" == "Windows_NT" ]
then
  echo "Windows_NT detected. Skip Homebrew installation."
  exit 0
fi

if [ "$(uname)" == "Linux" ]
then
  echo "Linux detected. Skip Homebrew installation."
  exit 0
fi

# Check for Homebrew
if test ! $(which brew)
then
  echo "  Installing Homebrew for you."

  # Install the correct homebrew for each OS type
  if test "$(uname)" = "Darwin"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    # Install homebrew packages
    brew install grc coreutils spark ack tmux reattach-to-user-namespace
  fi
fi


exit 0
