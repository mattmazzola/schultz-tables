# Running Locally

1. Start Docker Desktop
1. Run Solution
```
docker compose up
```

## References

### Azure Cosmos DB State Store Configuration

https://docs.dapr.io/reference/components-reference/supported-state-stores/setup-azure-cosmosdb/

## Deployment

### Setup Context

```sh
az login
# Matt Mazzola - Personal
az account set -n 375b0f6d-8ad5-412d-9e11-15d36d14dc63
az acr login --name sharedklgoyiacr
az account show --query "name" -o tsv
```

### Verify Deployment

```sh
azd provision --preview

./pipelines/scripts/what-if.sh
```

### Deploy

```sh
azd up
```
