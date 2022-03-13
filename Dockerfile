FROM node:15.14.0-alpine3.10

RUN addgroup appuser && adduser --disabled-password --gecos '' appuser --ingroup appuser

EXPOSE 8000
ENV port 8000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

RUN chown -R appuser:appuser /usr/src/app
USER appuser

CMD [ "npm", "run", "prod" ]
