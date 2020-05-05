ssh $1 <<'ENDSSH'
    echo "removing old container..."
    docker-compose rm -sf
    echo "removing old image..."
    docker image rm squishychat_web -f
    echo "cleaning folder..."
    rm -rf ~/containers/squishychat/build ~/containers/squishychat/server
ENDSSH

echo "creating tarball..."
tar cvfz ./release-package.tar.gz ./package.json ./docker-compose.yml \
 ./Dockerfile ./server ./build/dist ./.env

echo "transferring tarball to server..."
scp ./release-package.tar.gz $1:~/containers/squishychat \
&& rm ./release-package.tar.gz


ssh $1 <<'ENDSSH'
    cd ~/containers/squishychat
    echo "unzipping tarball"
    tar -xvzf release-package.tar.gz
    echo "building new image..."
    docker-compose build
    echo "starting container..."
    echo y | docker-compose up -d --force-recreate
ENDSSH
