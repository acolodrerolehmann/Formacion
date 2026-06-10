#!/bin/sh
set -e
DOMAIN=${1:-secure.local}
# Genera un certificado auto-firmado y crea un secret TLS
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=${DOMAIN}/O=dev"
kubectl create secret tls tls-secret --cert=tls.crt --key=tls.key

echo "Secret 'tls-secret' creado para ${DOMAIN}."