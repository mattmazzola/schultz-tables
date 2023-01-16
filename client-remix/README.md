# Schultz Tables

```
npm run dev
```

## Docker

```
docker build -t shultz-tables-client .

docker run -it --rm `
    -p 3000:3000 `
    schultz-tables-client
```

## Set Up Local Database

```
docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=<YourStrong@Passw0rd>' -p 1433:1433 --name sql1 -d mcr.microsoft.com/mssql/server:2019-latest
```
```
docker exec -it sql1 "bash"
```

```
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "<YourStrong@Passw0rd>"
```

```
CREATE DATABASE schultztables
CREATE DATABASE schultztablesshadow
GO
```