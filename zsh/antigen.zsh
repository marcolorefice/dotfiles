# bundles
if [[ ! -d $HOME/zsh/lib/antigen ]];
then
  git clone https://github.com/zsh-users/antigen.git $HOME/zsh/lib/antigen
fi
#loading antigen
source $HOME/zsh/lib/antigen/antigen.zsh

# antigen
antigen bundles <<EOBUNDLES
  zsh-users/zsh-syntax-highlighting
  zsh-users/zsh-completions src
EOBUNDLES

antigen apply

antigen theme stefanorg/oh-my-zsh themes/n4z4
