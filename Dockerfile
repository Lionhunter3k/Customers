FROM microsoft/dotnet:2.1-sdk-alpine AS builder
WORKDIR /source
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -r linux-musl-x64 -o /app

FROM microsoft/dotnet:2.1-aspnetcore-runtime-alpine
WORKDIR /app
COPY --from=builder /app .

CMD export ASPNETCORE_URLS=http://*:$PORT && dotnet Customers.Api.dll