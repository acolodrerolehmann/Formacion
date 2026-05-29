#!/usr/bin/env bash
set -euo pipefail

CNI_MANIFEST_URL="https://raw.githubusercontent.com/projectcalico/calico/v3.28.2/manifests/calico.yaml"
NAMESPACE="kube-system"
PROBLEM_NODE="cp-01"

echo "1) Estado general"
kubectl get nodes -o wide

echo

echo "2) Pods críticos"
kubectl get pods -n "$NAMESPACE"

echo

echo "3) Evidencia del problema"
kubectl describe node "$PROBLEM_NODE"

echo

echo "4) Reparación"
kubectl apply -f "$CNI_MANIFEST_URL"

echo

echo "5) Verificación"
kubectl wait --for=condition=Ready node --all --timeout=180s
kubectl wait --for=condition=Ready pod -n "$NAMESPACE" -l k8s-app=kube-dns --timeout=180s
kubectl wait --for=condition=Ready pod -n "$NAMESPACE" -l k8s-app=calico-node --timeout=180s
kubectl get nodes -o wide
kubectl get pods -n "$NAMESPACE" | grep -E 'coredns|calico'
