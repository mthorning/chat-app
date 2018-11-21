ssh vps <<'ENDSSH'
    echo "removing old container..."
    docker-compose rm -sf
    echo "removing old image..."
    docker image rm squishychat_web -f
    echo "renewing directory for new files..."
    rm -rf /containers/squishychat
    mkdir /containers/squishychat
ENDSSH

echo "creating tarball..."
tar cvfz ./release-package.tar.gz ./package.json ./docker-compose.yml \
 ./Dockerfile ./server ./build/dist ./login 

echo "transferring tarball to server..."
scp ./release-package.tar.gz server:/containers/squishychat \
&& rm ./release-package.tar.gz


ssh server <<'ENDSSH'
    cd /containers/squishychat
    echo "unzipping tarball"
    tar -xvzf release-package.tar.gz
    echo "building new image..."
    docker-compose build
    echo "starting container..."
    docker-compose up --force-recreate
ENDSSH