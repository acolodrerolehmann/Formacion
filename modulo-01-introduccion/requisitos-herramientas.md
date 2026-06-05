# Requisitos y herramientas

## Software necesario

### Docker

Necesario para Kind. Sin Docker no hay clúster local.

| Sistema | Comando |
|---------|---------|
| macOS | `brew install --cask docker` |
| Linux (Ubuntu) | `sudo apt-get install docker-ce docker-ce-cli containerd.io` |
| Windows | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |

Verificar: `docker info` y `docker version`

### Kind

Crea clústeres Kubernetes usando contenedores Docker como nodos.

| Sistema | Comando |
|---------|---------|
| macOS | `brew install kind` |
| Linux | `curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.23.0/kind-linux-amd64 && chmod +x ./kind && sudo mv ./kind /usr/local/bin/kind` |

Verificar: `kind --version`

### kubectl

El CLI para hablar con cualquier clúster Kubernetes.

| Sistema | Comando |
|---------|---------|
| macOS | `brew install kubectl` |
| Linux | `curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && chmod +x kubectl && sudo mv kubectl /usr/local/bin/` |

Verificar: `kubectl version --client`

---

## Productividad

### kubectx y kubens

Cambiar de cluster y namespace sin escribir `kubectl config use-context ...` cada vez.

    brew install kubectx

Uso:

    kubectx                      # listar contextos
    kubectx kind-m3-dashboard    # cambiar de cluster
    kubectx -                    # volver al anterior

    kubens                       # listar namespaces
    kubens kube-system           # cambiar namespace
    kubens -                     # volver al anterior

En Linux si no hay paquete:

    git clone https://github.com/ahmetb/kubectx.git ~/.kubectx
    ln -s ~/.kubectx/kubectx /usr/local/bin/kubectx
    ln -s ~/.kubectx/kubens /usr/local/bin/kubens

### krew (gestor de plugins de kubectl)

    brew install krew

Plugins que merece la pena instalar:

    kubectl krew install ctx       # cambiar contexto (como kubectx)
    kubectl krew install ns        # cambiar namespace (como kubens)
    kubectl krew install neat      # limpia YAML de campos gestionados
    kubectl krew install tree      # muestra jerarquía de recursos
    kubectl krew install images    # lista imágenes usadas
    kubectl krew install whoami    # tu identidad en el clúster

Ejemplo:

    kubectl ctx
    kubectl ns kube-system
    kubectl neat get pod nginx -o yaml
    kubectl tree deployment nginx

### fzf

Si instalas `fzf`, kubectx/kubens pasan a ser interactivos con búsqueda fuzzy.

    brew install fzf

### k9s

TUI para Kubernetes. Como un `htop` para tu clúster.

    brew install derailed/k9s/k9s

    k9s                       # abre en el contexto actual
    k9s -n kube-system        # abre en un namespace
    k9s --context kind-m3     # abre en un contexto concreto

Atajos dentro de k9s:
- `:pods`, `:deploy`, `:svc`, `:ns` — navegar recursos
- `d` describe, `l` logs, `s` shell, `ctrl+d` borrar

---

## Autocompletado y aliases

Añade a tu `~/.zshrc` (o `~/.bashrc`):

    # Autocompletado
    source <(kubectl completion zsh)

    # Alias base
    alias k='kubectl'
    alias kgp='kubectl get pods'
    alias kgn='kubectl get nodes'
    alias kgs='kubectl get svc'
    alias kga='kubectl get all'
    alias kaf='kubectl apply -f'
    alias kdel='kubectl delete'
    alias klog='kubectl logs -f'
    alias kexec='kubectl exec -it'
    alias kctx='kubectx'
    alias kns='kubens'

    # Que el alias 'k' también tenga autocompletado
    complete -o default -F __start_kubectl k   # bash
    compdef k=kubectl                          # zsh

Después: `k get po<TAB>` autocompleta a pods, `k get pods -n <TAB>` autocompleta namespaces.

---

## Verificación rápida

    docker version --format '{{.Server.Version}}'
    kind --version
    kubectl version --client
    command -v kubectx && echo OK
    command -v k9s && echo OK
