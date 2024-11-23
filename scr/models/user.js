const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
let bcrypt = require("bcryptjs");
const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8));
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull:true
    }
});
module.exports = User;