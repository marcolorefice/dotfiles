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

DOCKER_COMPOSE=$(which docker-compose)

# #############
#  COMPOSE
# #############
alias dcu='$DOCKER_COMPOSE up -d'
alias dcs='$DOCKER_COMPOSE stop'
alias dcp='$DOCKER_COMPOSE ps'
alias dcl='$DOCKER_COMPOSE logs'

# ####################################################
#  Aliasing make docker command https://git.io/vggff
# ####################################################
alias composer='make -f $HOME/.make-docker-command/Makefile composer'
alias phpunit='make -f $HOME/.make-docker-command/Makefile phpunit'
alias bower='make -f $HOME/.make-docker-command/Makefile bower'
