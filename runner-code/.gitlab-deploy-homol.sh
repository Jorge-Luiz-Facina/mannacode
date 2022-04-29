#!/bin/bash
set -feE -o functrace

failure() {
    local lineno=$1
    local msg=$2
    echo "Failed at ${lineno}: $msg"
}
trap 'failure ${LINENO}"$BASH_COMMAND"' ERR

set -o pipefail

main(){
    servers=(${DEPLOY_SERVER//,/})
    for server in "${servers[@]}"
    do
      ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no $server <<ENDSSH
        cd /projects
        rm -rf runner-code
        git clone "https://${CLONE_ACESS}@gitlab.com/MainDuelo/runner-code.git"
        cd runner-code
        git checkout develop
        docker stack deploy --compose-file docker-compose.yaml --with-registry-auth runner
        npm install
        npx patch-package
        npm run compile
        pm2 delete runnercode
        set NODE_ENV=production
        export NODE_ENV=production
        NODE_ENV=production pm2 start lib/ --name runnercode
ENDSSH
  done
}

main $@
