#! /bin/bash

set -e

echo "Print OS and Tool Versions"

# OS
lsb_release -a

# Tools
git --version
pwsh --version

az version
az bicep version
azd version

docker --version
jq --version
gh --version

npm --version
node --version

echo "postStartCommand.sh finished!"
