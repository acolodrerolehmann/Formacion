# Ejercicio 08 — Ingress con TLS (terminación TLS)

Objetivo

Configurar un Ingress que utilice un Secret TLS para terminar TLS en el controlador de Ingress. Se usará `secure.local` como host de ejemplo.

Criterios de éxito

- Secret TLS creado (nombre: tls-secret)
- Ingress `hello-tls` creado referenciando `tls-secret`
- Acceso HTTPS a `secure.local` (con certificado auto-firmado para pruebas)

Archivos

- manifests/solution/create-tls-secret.sh (script para generar certificado self-signed y crear el Secret)
- manifests/solution/ingress-tls.yaml

Verificación

# Generar y crear el secret (en local):
sh manifests/solution/create-tls-secret.sh secure.local
kubectl apply -f manifests/solution/ingress-tls.yaml
# Añadir en /etc/hosts: <INGRESS_IP> secure.local
# curl -k https://secure.local/

Notas

- El script genera un certificado auto-firmado. Para entornos reales usar certificados válidos (ACME/Let's Encrypt).
