module.exports = function(sequelize, DataTypes) {
    var Passenger = sequelize.define("Passenger", {
        // Giving the Driver model a name of type STRING
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        userName: DataTypes.STRING,
        homeAddress: DataTypes.STRING,
        workAddress: DataTypes.STRING,
        type: DataTypes.STRING,
    });

    return Passenger;
};