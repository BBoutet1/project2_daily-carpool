DROP DATABASE IF EXISTS carpool_db;
CREATE DATABASE carpool_db;
USE carpool_db;
CREATE TABLE Driver (
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    AddressName varchar(255),
    City varchar(255),
    PostalCode varchar(256),
    PickupPoint varchar(255),
    DropOffPoint varchar(256),
    CarType varchar(255)
);
CREATE TABLE Passenger (
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    AddressName varchar(255),
    City varchar(255),
    PostalCode varchar(256),
    PickupPoint varchar(255),
    DropOffPoint varchar(256),
    
);
CREATE TABLE PickUpPoint (
    Country varchar(255),
    Province varchar(255),
    Street varchar(255),
    Postalcode varchar(255),
    
);

CREATE TABLE Destination (
    Country varchar(255),
    Province varchar(255),
    Street varchar(255),
    Postalcode varchar(255),
    
);
CREATE TABLE UserProfile (
    UserName varchar(255),
    UserEmail varchar(255),
    UserID varchar(255),
);
CREATE TABLE DriverCar (
    CarType varchar(255),
    Color varchar(255),
    DriverName varchar(255),
);

