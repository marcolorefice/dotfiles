# bundles
if [[ ! -d $HOME/zsh/lib/antigen ]];
then
  git clone https://github.com/zsh-users/antigen.git $HOME/zsh/lib/antigen
fi

#loading antigen
source $HOME/zsh/lib/antigen/antigen.zsh

antigen bundles <<EOBUNDLES
  zsh-users/zsh-syntax-highlighting
  zsh-users/zsh-completions src
  felixr/docker-zsh-completion
  zsh-users/zsh-history-substring-search
  primait/docker-enter-completion oh-my-zsh/custom/plugins/docker-enter
  common-aliases
  composer
  docker
  git
  git-extras
  git-flow
  web-search
EOBUNDLES

antigen theme pygmalion

antigen apply
