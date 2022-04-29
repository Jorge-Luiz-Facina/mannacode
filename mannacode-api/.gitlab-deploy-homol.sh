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
    servers=(${DEPLOY_SERVER_HOMOL//,/ })
    servershost=(${DEPLOY_SERVER_HOST_HOMOL//,/ })
    var=0
    for server in "${servers[@]}"
    do
      HOST=${servershost[$var]}
      var=$((var + 1))
      ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no $server <<ENDSSH
        cd /projects
        rm -rf mannacode-api
        git clone "https://${CLONE_ACESS}@gitlab.com/MainDuelo/mannacode-api.git"
        cd mannacode-api
        git checkout develop
        docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
        export IMAGE_IDENTIFIER="${CI_REGISTRY_IMAGE}:latest"
        docker-compose -f docker/docker-compose.yaml -f docker/docker-compose.beta.yaml config > docker-compose.yml
        docker stack deploy --compose-file docker-compose.yml --with-registry-auth ${STACK_NAME}
        cd /projects
        rm -rf mannacode-api
ENDSSH
  done
}

main $@
