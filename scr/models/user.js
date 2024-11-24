const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
let bcrypt = require("bcryptjs");
const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: {
                msg: function () {
                    throw new CustomError({message: "you must use a valid email", httpStatusCode: 422})
                }
            }
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8));
        }
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
});
module.exports = User;