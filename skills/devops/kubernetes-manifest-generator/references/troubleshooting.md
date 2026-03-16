# Kubernetes Troubleshooting

## Pods Not Starting

**Check image pull errors:**
```bash
kubectl describe pod <pod-name>
```

**Verify resource availability:**
```bash
kubectl get nodes
```

**Check events:**
```bash
kubectl get events --sort-by='.lastTimestamp'
```

---

## Service Not Accessible

**Verify selector matches pod labels:**
```bash
kubectl get endpoints <service-name>
```

**Check service type and port configuration**

**Test from within cluster:**
```bash
kubectl run debug --rm -it --image=busybox -- sh
```

---

## ConfigMap/Secret Not Loading

- Verify names match in Deployment
- Check namespace
- Ensure resources exist:
```bash
kubectl get configmap,secret
```

---

## Next Steps After Creating Manifests

1. Store in Git repository
2. Set up CI/CD pipeline for deployment
3. Consider using Helm or Kustomize for templating
4. Implement GitOps with ArgoCD or Flux
5. Add monitoring and observability
