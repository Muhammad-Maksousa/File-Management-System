const express = require("express");
const sequelize = require("./helpers/db/init");
const { port } = require("../configs.json");
const logger = require('morgan');
const cors = require('cors');
const app = express();
const models = require("./models");
const path = require('path');
//app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static('public'));
// Log requests to the console.
app.use(logger('dev'));
//allow the client to access the server
app.options('*', cors());
//to synchronizing all models at once
sequelize.sync({ alter: false }).then((_) => {
    console.log("connected to db successfully");
    app.use(express.urlencoded({ extended: false }));
    // cors policies
    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Access-Control-Allow-Credentials", true);
        next();
    });
    app.use(express.json({}));
    app.use(require("./routers"));
    app.use(require("./helpers/errors/custom-errors").defaultHandler);
    app.listen(port, () => {
        console.log(`Server is listening on ${port}`);
        
    });
}).catch(err => {
    console.log("Unable to connect to the database:", err)
});
