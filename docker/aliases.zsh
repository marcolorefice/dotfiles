#various docker aliases
#
# #############
#    MACHINE
# #############
#
DOCKER_MACHINE=$(which docker-machine)

alias dms='$DOCKER_MACHINE status default'
alias dmh='$DOCKER_MACHINE stop default'
alias dml='$DOCKER_MACHINE ls'
