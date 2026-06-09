docker build -t frontend-project:dev .
docker run -p 5173:5173 frontend-project:dev
docker run -d -p 5173:5173 --name frontend-dev frontend-project:dev
