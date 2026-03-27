# Terraform Kubernetes and Helm Providers

Load this reference when Terraform needs to talk to a cluster API after the
cluster already exists or is created earlier in the same stack.

## Kubernetes Provider with EKS

```hcl
data "aws_eks_cluster" "main" {
  name = module.eks.cluster_name
}

data "aws_eks_cluster_auth" "main" {
  name = module.eks.cluster_name
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.main.endpoint
  cluster_ca_certificate = base64decode(
    data.aws_eks_cluster.main.certificate_authority[0].data
  )
  token = data.aws_eks_cluster_auth.main.token
}
```

## Kubernetes Provider with GKE

```hcl
data "google_client_config" "current" {}

data "google_container_cluster" "main" {
  name     = var.cluster_name
  location = var.region
}

provider "kubernetes" {
  host  = "https://${data.google_container_cluster.main.endpoint}"
  token = data.google_client_config.current.access_token
  cluster_ca_certificate = base64decode(
    data.google_container_cluster.main.master_auth[0].cluster_ca_certificate
  )
}
```

## Helm Provider

```hcl
provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.main.endpoint
    cluster_ca_certificate = base64decode(
      data.aws_eks_cluster.main.certificate_authority[0].data
    )
    token = data.aws_eks_cluster_auth.main.token
  }
}

resource "helm_release" "nginx" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "ingress-system"

  set {
    name  = "controller.service.type"
    value = "LoadBalancer"
  }
}
```

## Rules

- Prefer data sources over checked-in kubeconfig files.
- Keep cluster creation and cluster bootstrap ordering explicit.
- Use provider aliases if one stack targets multiple clusters.
- Avoid mixing ad hoc `kubectl` steps into the same Terraform flow unless the
  resource is genuinely unsupported.
