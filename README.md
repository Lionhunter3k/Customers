# Purpose

When you use a hammer a lot of times, you tend to use it very well. If you use a lot of tools a lot of times, you kinda see repeating patterns and mistakes that could happen when those tools are used together. In this repo, I've put various configurations and conventions which have helped me tame codebases which grew larger and larger. It is not complete. It lacks details about localization, authentification, full blown error handling, structural negociation concerns, among other things.

## Prerequisites for Debian 9:
  
Nodejs/NPM (https://tecadmin.net/install-latest-nodejs-npm-on-debian/)
Net Core (https://dotnet.microsoft.com/download/linux-package-manager/debian9/runtime-2.1.6)
ElasticSearch 6.x (https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html, and use the oss dist)
If ElasticSearch isn't installed on the machine that runs the web server, you should uncomment in the /etc/elasticsearch/elasticsearch.yml file with your favorite editor the following line: network.host: 0.0.0.0 (or put the exact addresseses you want to allow remote connections from)

## Usage for Customers

```bash
dotnet restore
cd Customers.Api
dotnet run
```
## How to interact with the Customers API

Go to http://localhost:5000/swagger/index.html

or try here: https://dellcustomers-web.herokuapp.com/swagger/index.html

## Usage for Movies

```bash
dotnet restore
cd Movies.Api
npm install
npm run grunt-prod
dotnet run
```

## How to interact with the Movies API

Go to http://localhost:5000/swagger/index.html

or try here: https://mdmovies.herokuapp.com/v1/movies/ to see the list of indexed movies through ElasticSearch or https://mdmovies.herokuapp.com/v1/movies/insertmovies to index another dataset.

## Stack

.Net Core 2.1, MVC Core 2.1, nHibernate 5.1, AutoMapper 5.2, Autofac 4.6, SQLite, NEST 6.x, CanJS 2.x, Grunt, RequireJS, Babel, Bootstrap 3.x

## What can we customize to better handle a growing codebase?

Look at the code, see the **//commentary:** lying around.


