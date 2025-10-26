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

```zsh
az login
az account set -n "Matt Mazzola - Personal Projects Recovered"
az account show --query "name" -o tsv
az acr login --name sharedklgoyiacr
```

### Verify Deployment

```powershell
./pipelines/scripts/deploy.ps1
```

### Deploy

```powershell
./pipelines/scripts/deploy.ps1 -WhatIf:$False
```
