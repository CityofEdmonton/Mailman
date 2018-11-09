# How to build this image:
# From the parent folder enter:
# docker image build -t mailman:latest -t mailman:fullstack -f Dockerfile.fullstack .

FROM microsoft/dotnet:2.1-sdk AS builder
ARG Configuration=Debug
ARG TlsPrivateKey=Str0ngPassw0rd!!

#create a certificate for HTTPS
# see https://github.com/dotnet/dotnet-docker/blob/master/samples/aspnetapp/aspnetcore-docker-https.md
RUN dotnet dev-certs https -ep /usr/aspnetapp.pfx -p $TlsPrivateKey

# set up node
ENV NODE_VERSION 11.1.0
ENV NODE_DOWNLOAD_SHA 52289a646a27511f5808290357798c7ebd4b5132a8fc3bf7d5bf53183b89c668
RUN curl -SL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" --output nodejs.tar.gz \
    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# build the app
WORKDIR /usr/src/mailman
COPY ./src/ .
WORKDIR /usr/src/mailman/Mailman.Server
RUN dotnet publish --configuration $Configuration

FROM microsoft/dotnet:2.1.5-aspnetcore-runtime-alpine
ARG Configuration=Debug
ARG TlsPrivateKey=Str0ngPassw0rd!!
WORKDIR /app
COPY --from=builder /usr/src/mailman/Mailman.Server/bin/$Configuration/netcoreapp2.1/publish  .
COPY --from=builder /usr/aspnetapp.pfx /https/aspnetapp.pfx

# ASPNET default environment variables
#ENV ASPNETCORE_URLS "https://+;http://+"
ENV ASPNETCORE_URLS "http://+"
ENV ASPNETCORE_Kestrel__Certificates__Default__Password $TlsPrivateKey
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx

EXPOSE 80/tcp
EXPOSE 443/tcp
CMD dotnet Mailman.Server.dll