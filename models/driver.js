module.exports = function(sequelize, DataTypes) {
    var Driver = sequelize.define("Driver", {
        // Giving the Driver model a name of type STRING
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        userName: DataTypes.STRING,
        homeAddress: DataTypes.STRING,
        workAddress: DataTypes.STRING,
        type: DataTypes.STRING,
    });

    return Driver;
};