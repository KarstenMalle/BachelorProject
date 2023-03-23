FROM python:3.9-slim

WORKDIR /gitlab_auth

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "app.py"]
