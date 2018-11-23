# Purpose

When you use a hammer a lot of times, you tend to use it very well. If you use a lot of tools a lot of times, you kinda see repeating patterns and mistakes that could happen when those tools are used together. In this repo, I've put various configurations and conventions which have helped me tame codebases which grew larger and larger. It is not complete. It lacks details about localization, authentification, full blown error handling, structural negociation concerns, among other things.

# Usage

```bash
dotnet restore
dotnet run --project Customers.Api.csproj
```
# How to interact with the API

Go to http://localhost:5000/swagger/index.html

or try here: https://dellcustomers-web.herokuapp.com/swagger/index.html

# Stack

.Net Core 2.1, MVC Core 2.1, nHibernate 5.1, AutoMapper 5.2, Autofac 4.6, SQLite

# What can we customize to better handle a growing codebase?

Look at the code, see the **//commentary:** lying around.


