module.exports = function(sequelize, DataTypes) {
    var Passenger = sequelize.define("Passenger", {
        // Giving the Driver model a name of type STRING
        name: DataTypes.STRING,
        homeAddress: DataTypes.STRING,
        workAddress: DataTypes.STRING,
        type: DataTypes.STRING,
    });

    Passenger.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Passenger.belongsTo(models.Driver, {
            // foreignKey: {
            //     allowNull: false
            // }
        });
    };

    return Passenger;
};