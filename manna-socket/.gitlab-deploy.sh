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
        cd /projects
        rm -rf manna-socket
        rm -rf traefik
        mkdir traefik
        git clone "https://${CLONE_ACESS}@gitlab.com/MainDuelo/manna-socket.git"
        cd manna-socket
        cp traefik.yml /projects/traefik
        cp docker-compose.yaml /projects/traefik
        cd /projects
        rm -rf manna-socket
        cd /projects/traefik
        docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
        export MANNA_API_HOST="${MANNA_API_HOST}"
        export MANNA_SOCKET_LOGIN="${MANNA_SOCKET_LOGIN}"
        export MANNA_SOCKET_PASSWORD="${MANNA_SOCKET_PASSWORD}"
        export IMAGE_IDENTIFIER="${CI_REGISTRY_IMAGE}:production"
        docker stack deploy --compose-file docker-compose.yaml --with-registry-auth ${STACK_NAME}
        rm -rf docker-compose.yaml
ENDSSH
  done
}

main $@
