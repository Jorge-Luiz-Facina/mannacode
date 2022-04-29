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
      HOST=${servershost[$var]}
      ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no $server <<ENDSSH
        cd /projects
        rm -rf traefik
        rm -rf traefikConfig
        mkdir traefikConfig
        git clone "https://${CLONE_ACESS}@gitlab.com/MainDuelo/traefik.git"
        cd traefik
        cp traefik.yml /projects/traefikConfig
        cp docker-compose.yml /projects/traefikConfig
        cd /projects
        rm -rf traefik
        cd /projects/traefikConfig
        docker stack deploy --compose-file docker-compose.yml --with-registry-auth traefik
        rm -rf docker-compose.yml
ENDSSH
  done
}

main $@
