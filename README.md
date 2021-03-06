# Helpful Workflows & Composite Actions

❗ [Implementation Pending, Currently Unstable]

## Docker

### lbp (docker/lbp)

- lbp abbreviated from "Login Build Push".
    - Setups Docker
    - Logs in to the Docker registry
    - Builds the image from the Dockerfile in current directory
    - Pushes the image to the registry

### pull (docker/pull)

- Setups Docker
- Login to the Docker registry
- Pulls the image from the registry

**TODO**

- [ ] Make login optional
- [ ] Create a separate action for logging in to the registry

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
- [ ] Add an input to specify the kubectl version to install

### ytt (k8s/ytt)

- Setup & configures carvel (ytt)
- Generates the kubernetes manifest from the given Carvel ytt template

## Environment (env)

### init (env/init)

- Initialize the environment variables from the given JSON file.

*As of now, the JSON parsers are highly unpredictable. Symbols like $ or Flower Braces {} should be avoided in the json
file.*

**Todo**

- [ ] Option to specify whether to override existing environment variable or not
- [ ] Better Validation
- [ ] Optimization
- [ ] Add Tests
- [ ] Better Project Skeleton
- [ ] Better parsers
- [ ] Option to disable printing env variables
- [ ] Option to specify a custom prefix for env variable

## Node (node)

### yarn (node/yarn)

- Installs & configures NodeJS
- Installs & configures Yarn
