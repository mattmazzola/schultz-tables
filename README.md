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

```powershell
az login
az account set -n "375b0f6d-8ad5-412d-9e11-15d36d14dc63"
az account show --query "name"
az acr login --name sharedzkpwxzacr
```

### Verify Deployment

```powershell
./pipelines/scripts/deploy.ps1
```

### Deploy

```powershell
./pipelines/scripts/deploy.ps1 -WhatIf:$False
```
