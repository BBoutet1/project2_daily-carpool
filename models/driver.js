module.exports = function(sequelize, DataTypes) {
    var Driver = sequelize.define("Driver", {
        // Giving the Driver model a name of type STRING
        name: DataTypes.STRING,
        homeAddress: DataTypes.STRING,
        workAddress: DataTypes.STRING,
        email: DataTypes.STRING,
        passagenrNumber: DataTypes.INTEGER
    });

    Driver.associate = function(models) {
        // Associating Driver with Posts
        // When an Driver is deleted, also delete any associated Posts
        Driver.hasMany(models.Passenger, {
            // onDelete: "cascade"
        });
    };

    return Driver;
};