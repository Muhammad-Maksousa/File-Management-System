const errors = require("../errors/errors.json");
const { ValidationError, ForeignKeyConstraintError, TimeoutError, UniqueConstraintError, ConnectionError } = require('sequelize');

class CustomError {
    constructor({ message, httpStatusCode }) {
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }

    static defaultHandler(err, req, res, next) {
        console.log('err instanceof TimeoutError');
        console.log(err instanceof TimeoutError);
        console.log('err instanceof ConnectionError ');
        console.log(err instanceof ConnectionError);
        console.log("err instanceof Error");
        console.log(err instanceof Error);
        console.log('err instanceof ValidationError');
        console.log(err instanceof ValidationError);
        console.log('err instanceof ForeignKeyConstraintError');
        console.log(err instanceof ForeignKeyConstraintError);
        console.log('err instanceof CustomError');
        console.log(err instanceof CustomError);
        console.log("Error had Happened", err);


        const messages = {};
        if (err instanceof CustomError) {
            let message = {
                "message": err.message,
                "statusCode": err.httpStatusCode
            };
            res.status(err.httpStatusCode).send(message)
        } else if (err instanceof ForeignKeyConstraintError) {
            let message = {
                "message": `Cannot add or update a ${err.reltype} row: a foreign key constraint fails at ${err.fields[0]}`,
                "statusCode": 422
            };
            res.status(422).send(message)
        } else if (err instanceof ValidationError) {
            const messages = {};
            err.errors.forEach((error) => {
                let message;
                console.log(err);
                switch (error.validatorKey) {
                    case 'isEmail':
                        message = 'Please enter a valid email';
                        break;
                    case 'isDate':
                        message = 'Please enter a valid date';
                        break;
                    case 'len':
                        if (error.validatorArgs[0] === error.validatorArgs[1]) {
                            message = 'Use ' + error.validatorArgs[0] + ' characters';
                        } else {
                            message = 'Use between ' + error.validatorArgs[0] + ' and ' + error.validatorArgs[1] + ' characters';
                        }
                        break;
                    case 'min':
                        message = 'Use a number greater or equal to ' + error.validatorArgs[0];
                        break;
                    case 'max':
                        message = 'Use a number less or equal to ' + error.validatorArgs[0];
                        break;
                    case 'isInt':
                        message = 'Please use an integer number';
                        break;
                    case 'is_null':
                        message = `Please complete this field ${err.path || err.errors[0].path} it can't be ${error.value}`;
                        break;
                    case 'not_unique':
                        message = error.value + ' is taken. Please choose another one';

                        error.path = error.path.replace("_UNIQUE", "");
                }
                let errors = { message: message, "statusCode": 422 };
                res.status(422).send(errors);

            });
        } else if (err instanceof UniqueConstraintError) {
            let errors = { message: `${err.errors[0].message.split(".")[1]} on ${err.errors[0].path.split(".")[1]} ` }
            res.status(422).send(errors)
        } else if (err.statusCode) {
            res.status(err.statusCode).send(err);
        } else if (err instanceof Error) {
            if (err.message === 'Unexpected field')
                res.status(406).send({ message: err.message + ' ' + err.code, status: 406 })
            else
                res.status(500).send(err)

        } else {
            res.status(500).send(err)
        }
    }
}

module.exports = CustomError;
