cd ../front-end
call npm install
call npm run build
cd ../desenvolvimento
docker-compose up --build

# docker-compose up -d