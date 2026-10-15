# Toolva Kubernetes Deployment

## Prerequisites

- Kubernetes cluster (1.28+)
- kubectl configured
- NGINX Ingress Controller
- cert-manager (for TLS)

## Quick Deploy

```bash
# 1. Create namespace and config
kubectl apply -f namespace.yaml
kubectl apply -f config.yaml
kubectl apply -f pvc.yaml

# 2. Deploy services
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f services.yaml

# 3. Configure networking
kubectl apply -f ingress.yaml
kubectl apply -f network-policy.yaml
kubectl apply -f hpa.yaml

# 4. Verify
kubectl get pods -n toolva
kubectl get svc -n toolva
```

## Architecture

```
Internet → Ingress → Frontend Service → Frontend Pods (2-10)
                  → Backend Service  → Backend Pods (2-8) → SQLite/PVC
```

## Security

- Network policies restrict backend access to frontend pods only
- All pods run as non-root
- Secrets managed via K8s Secrets
- TLS via cert-manager + Let's Encrypt
- Resource limits enforced
