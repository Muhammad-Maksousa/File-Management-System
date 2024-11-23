const User = require("../models/user");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = require("../helpers/db/config.secret");
const { Op } = require("sequelize");


class UserService {
    constructor({ username, password, image }) {
        this.username = username;
        this.password = password;
        this.image = image
    }
    async add() {
        if (!this.username || !this.password) {
            throw new CustomError(errors.You_Should_fill_All_The_Filds)
        }
        return await User.create({
            username: this.username,
            password: this.password,
            image: this.image
        });
    }
    async update(id) {
        return await User.update({
            password: this.password,
            image: this.image
        }, { where: { id: id } });
    }
    async login() {
        if (!this.username || !this.password)
            throw new CustomError(errors.You_Should_fill_All_The_Filds);

        const user = await User.findOne({ where: { username: this.username } });
        //const user = await User.findOne({ where: { username: this.username }, include: [{model:Wallet,model:StorageAdmin}] });
        if (!user)
            throw new CustomError(errors.Entity_Not_Found);

        let passwordIsValid = bcrypt.compareSync(this.password, user.password);
        if (!passwordIsValid)
            throw new CustomError(errors.Wrong_Password);

        let token = jwt.sign({ userId: user.id }, secretKey, {
            expiresIn: 86400 * 720 // 2 years
        });
        let result = {
            username:user.username,
            image:user.image,
            id:user.id
        }
        return { user: result, token: token }
    }
    async getById(id) {
        return await User.findByPk(id,{attributes:['id','username','image']});
    }
    async getUsersNotInthisGroup(users) {
        return await User.findAll({ where: { id: { [Op.notIn]: users } }, attributes: ['id', 'username'] });
    }
}
module.exports = UserService;
