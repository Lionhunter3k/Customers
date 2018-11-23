
    PRAGMA foreign_keys = OFF

    drop table if exists Address

    drop table if exists AgentRequest

    drop table if exists Customers_UpdatedByAgents_Mapping

    drop table if exists Customer

    drop table if exists hibernate_unique_key

    PRAGMA foreign_keys = ON

    create table Address (
        Id BIGINT not null,
       Street TEXT not null,
       Town TEXT not null,
       ZipCode TEXT not null,
       Country TEXT not null,
       CustomerId BIGINT not null,
       primary key (Id),
       constraint FK7D1F3672B18F5B2 foreign key (CustomerId) references Customer
    )

    create table AgentRequest (
        Id TEXT not null,
       CreatedOnUtc DATETIME,
       LastRequestOnUtc DATETIME,
       primary key (Id)
    )

    create table Customers_UpdatedByAgents_Mapping (
        AgentRequestId TEXT not null,
       CustomerId BIGINT not null,
       primary key (CustomerId, AgentRequestId),
       constraint FKEA3B7D5D2B18F5B2 foreign key (CustomerId) references Customer,
       constraint FKEA3B7D5D28C7F88E foreign key (AgentRequestId) references AgentRequest
    )

    create table Customer (
        Id BIGINT not null,
       Email TEXT not null,
       Name TEXT not null,
       PhoneNumber TEXT not null,
       NumberOfIndividualRequests INT,
       DateOfBirth DATETIME,
       CreatedOnUtc DATETIME,
       UpdatedOnUtc DATETIME,
       CreatedByAgentId TEXT not null,
       primary key (Id),
       constraint FK4CE7BACD5E7E2BC8 foreign key (CreatedByAgentId) references AgentRequest
    )

    create table hibernate_unique_key (
         next_hi BIGINT 
    )

    insert into hibernate_unique_key values ( 1 )
