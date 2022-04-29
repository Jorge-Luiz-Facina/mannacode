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
    servers=(${DEPLOY_SERVER//,/ })
    for server in "${servers[@]}"
    do
      ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no $server <<ENDSSH
        pm2 delete runnercode
        cd /projects
        rm -rf runner-code
        git clone "https://${CLONE_ACESS}@gitlab.com/MainDuelo/runner-code.git"
        cd runner-code
        docker stack deploy --compose-file docker-compose.yaml --with-registry-auth runner
        git checkout master
        npm install
        npx patch-package
        npm run compile
        set NODE_ENV=production
        export NODE_ENV=production
        NODE_ENV=production pm2 start lib/ --name runnercode
ENDSSH
  done
}

main $@
