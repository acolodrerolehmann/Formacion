#!/usr/bin/env bash
set -euo pipefail

CNI_MANIFEST_URL="https://raw.githubusercontent.com/projectcalico/calico/v3.28.2/manifests/calico.yaml"
NAMESPACE="kube-system"
PROBLEM_NODE="cp-01"

echo "1) Estado general"
# TODO: mostrar el estado de los nodos

echo

echo "2) Pods críticos"
# TODO: listar los pods del namespace kube-system

echo

echo "3) Evidencia del problema"
# TODO: describir el nodo problemático para confirmar el error de CNI

echo

echo "4) Reparación"
# TODO: aplicar el manifiesto del plugin CNI

echo

echo "5) Verificación"
# TODO: esperar a que todos los nodos estén en Ready
# TODO: comprobar el estado de CoreDNS
# TODO: comprobar el estado de los pods de Calico
