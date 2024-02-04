FROM python:3.8-slim-buster
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y build-essential python3-dev default-libmysqlclient-dev gcc -y
COPY requirements.txt .
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

ARG ENV
ADD ${ENV} ./
EXPOSE 5000
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
