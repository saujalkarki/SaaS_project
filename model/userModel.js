// creating Database
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNUll: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentOrgNumber: {
      type: DataTypes.INTEGER,
      allowNUll: true,
    },
  });

  return User;
};
