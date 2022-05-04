# Helpful Workflows & Composite Actions

❗ [Implementation Pending, Currently Unstable]

## Docker

### lbp (docker/lbp)

- lbp abbreviated from "Login Build Push".
    - Logs in to the Docker registry
    - Builds the image from the Dockerfile in current directory
    - Pushes the image to the registry

## Kubernetes (k8s)

### deploy (k8s/deploy)

- Setup Kubectl
- Configures kubectl to use the kube config
- Deletes the existing resources specified by the label
- Deploys the given manifest

**Todo**

- [ ] Create namespace if not exists
- [ ] Make Deleting existing resources as optional
- [ ] Implement kubectl setup as a separate composite action
- [ ] Add a validator for deleteByLabel input
- [ ] (Input) Custom step/command to execute after deletion