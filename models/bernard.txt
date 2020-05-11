DROP DATABASE IF EXISTS carpool_db;
CREATE DATABASE carpool_db;
USE carpool_db;
CREATE TABLE Driver (
    id INT NOT NULL AUTO_INCREMENT,
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    AddressName varchar(255),
    City varchar(255),
    PostalCode varchar(256),
    PickupPoint varchar(255),
    DropOffPoint varchar(256),
    CarType varchar(255)
    PRIMARY KEY (id)
);
CREATE TABLE Passenger (
    id INT NOT NULL AUTO_INCREMENT,
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    AddressName varchar(255),
    City varchar(255),
    PostalCode varchar(256),
    PickupPoint varchar(255),
    DropOffPoint varchar(256),
    PRIMARY KEY (id)
    
);
CREATE TABLE PickUpPoint (
 id INT NOT NULL AUTO_INCREMENT,
    Country varchar(255),
    Province varchar(255),
    Street varchar(255),
    Postalcode varchar(255),
    PRIMARY KEY (id)
    
);

CREATE TABLE Destination (
     id INT NOT NULL AUTO_INCREMENT,
    Country varchar(255),
    Province varchar(255),
    Street varchar(255),
    Postalcode varchar(255),
    PRIMARY KEY (id)
    
);
CREATE TABLE UserProfile (
id INT NOT NULL AUTO_INCREMENT,
    UserName varchar(255),
    UserEmail varchar(255),
    UserID varchar(255),
    PRIMARY KEY (id)
);
CREATE TABLE DriverCar (
 id INT NOT NULL AUTO_INCREMENT,
    CarType varchar(255),
    Color varchar(255),
    DriverName varchar(255),
    PRIMARY KEY (id)
);

