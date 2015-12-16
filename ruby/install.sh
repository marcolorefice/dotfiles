#!/bin/sh
#
# Ruby
#
# Check for gem
if test ! $(which gem)
then
  echo "  Installing rubygem for you."
  # Install the correct ruby env for each OS type
  if test "$(uname)" = "Darwin"
  then
    #https://gorails.com/setup/osx/10.10-yosemite
	  # brew install rbenv ruby-build
    # rbenv install 2.2.3
    # rbenv global 2.2.3
    echo "OSX install: TODO"
  elif test "$(expr substr $(uname -s) 1 5)" = "Linux"
  then
	 echo "You need to install rubygems manually on Linux"
   exit 1;
  elif [ "$(echo $OS)" == "Windows_NT" ];
  then
    echo "CYGWIN detected search form pact"
    if test ! $(which pact)
    then
      echo "Not a babun shell. Use babun shell on windows http://babun.github.io/"
      exit 1;
    fi
    pact install rubygems
  fi
fi
