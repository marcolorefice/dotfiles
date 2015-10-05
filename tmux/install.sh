#!/bin/sh
#
# Tmux
#
# Check for Homebrew
if test ! $(which tmux)
then
  echo "  Installing tmux for you."

  # Install the correct homebrew for each OS type
  if test "$(uname)" = "Darwin"
  then
	 brew install tmux reattach-to-user-namespace
  elif test "$(expr substr $(uname -s) 1 5)" = "Linux"
  then
	 brew install tmux reattach-to-user-namespace
  elif test "$(expr substr $(uname -s) 1 6)" = "CYGWIN"
  then
    echo "CYGWIN detected search form pact"
    if test ! $(which pact)
    then
      echo "Not a babun shell. Use babun shell on windows http://babun.github.io/"
      exit 1;
    fi
    pact install tmux
  fi

fi

if test ! $(which gem)
then
	echo "  No ruby gem found. Skipp installation of tmuxinator"
	exit 1;
fi

echo "  Installing tmuxinator ..."
sudo gem install tmuxinator

exit 0
