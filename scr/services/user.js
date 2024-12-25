const User = require("../models/user");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = require("../helpers/db/config.secret");
const { Op } = require("sequelize");


class UserService {
    constructor({ email, firstName, lastName, password }) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }
    async add() {
        if (!this.email || !this.password) {
            throw new CustomError(errors.You_Should_fill_All_The_Filds)
        }
        return await User.create({
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password
        });
    }
    async update(id) {
        return await User.update({
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName
        }, { where: { id: id } });
    }
    async login() {
        if (!this.email || !this.password)
            throw new CustomError(errors.You_Should_fill_All_The_Filds);

        const user = await User.findOne({ where: { email: this.email } });
        if (!user)
            throw new CustomError(errors.Entity_Not_Found);

        let passwordIsValid = bcrypt.compareSync(this.password, user.password);

        if (!passwordIsValid)
            throw new CustomError(errors.Wrong_Password);

        if(user.isBlocked == true)
            throw new CustomError(errors.YOU_ARE_BLOCKED_BY_ADMIN);
            
        let token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, secretKey, {
            expiresIn: 86400 * 720 // 2 years
        });
        let result = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked
        }
        return { user: result, token: token }
    }
    async getById(id) {
        return await User.findByPk(id, { attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin', 'isBlocked'] });
    }
    async getUsersNotInthisGroup(users) {
        return await User.findAll({ where: { id: { [Op.notIn]: users } }, attributes: ['id', 'email', 'firstName', 'lastName'] });
    }
    async getBasicInfo(id) {
        return await User.findOne({ where: { id: id }, attributes: ['email', 'firstName', 'lastName'] });
    }
    async getAllUsers() {
        return await User.findAll({ where: { isAdmin: false }, attributes: ['id', 'email', 'firstName', 'lastName', 'isBlocked'] });
    }
    async block(id) {
        return await User.update({ isBlocked: true }, { where: { id: id } });
    }
    async unBlock(id) {
        return await User.update({ isBlocked: false }, { where: { id: id } });
    }
}
module.exports = UserService;
