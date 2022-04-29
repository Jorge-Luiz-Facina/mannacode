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
    # servershost=(${DEPLOY_SERVER//,/})
    var=0
    echo "${REDIS_HOST}"
    for server in "${servers[@]}"
    do
      # HOST=${servershost[$var]}
      # var=$((var + 1))
      ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no $server <<ENDSSH
        echo "${REDIS_HOST}"
        cd /projects
        rm -rf mannacode-api
        git clone "https://${CLONE_ACESS}@gitlab.com/MainDuelo/mannacode-api.git"
        cd mannacode-api
        git checkout master
        docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
        export DB_HOST="${DB_HOST}"
        export DB_USER="${DB_USER}"
        export DB_PASSWORD="${DB_PASSWORD}"
        export DB_NAME="${DB_NAME}"
        export DB_PORT="${DB_PORT}"
        export REDIS_HOST="${REDIS_HOST}"
        export REDIS_PORT="${REDIS_PORT}"
        export REDIS_PASSWORD="${REDIS_PASSWORD}"
        export MAILER_HOST="${MAILER_HOST}"
        export MAILER_PORT="${MAILER_PORT}"
        export MAILER_USER="${MAILER_USER}"
        export MAILER_PASSWORD="${MAILER_PASSWORD}"
        export MAILER_FROM="${MAILER_FROM}"
        export LOGIN_RUNNER="${LOGIN_RUNNER}"
        export PASSWORD_RUNNER="${PASSWORD_RUNNER}"
        export HOST_RUNNER="${HOST_RUNNER}"
        export HOST="${HOST}"
        export LOGIN_SOCKET="${LOGIN_SOCKET}"
        export PASSWORD_SOCKET="${PASSWORD_SOCKET}"
        export HOST_SOCKET="${HOST_SOCKET}"
        export IMAGE_IDENTIFIER="${CI_REGISTRY_IMAGE}:production"
        docker stack deploy --compose-file docker/docker-compose.yaml --with-registry-auth ${STACK_NAME}
        cd /projects
        rm -rf mannacode-api
ENDSSH
  done
}

main $@
