# bundles
if [[ ! -d $HOME/zsh/lib/antigen ]];
then
  git clone https://github.com/zsh-users/antigen.git $HOME/zsh/lib/antigen
fi

#loading antigen
source $HOME/zsh/lib/antigen/antigen.zsh

#antigen use oh-my-zsh

antigen bundles <<EOBUNDLES
  zsh-users/zsh-syntax-highlighting
  zsh-users/zsh-completions src
EOBUNDLES

antigen theme pygmalion

antigen apply
