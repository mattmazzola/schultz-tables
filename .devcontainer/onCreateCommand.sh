#! /bin/bash

set -e

echo "CONFIGURING GIT"
git config --global safe.directory '*'
git config --global core.editor "code --wait"
git config --global pager.branch false

echo "onCreateCommand.sh finished!"
