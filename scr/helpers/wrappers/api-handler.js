const { ValidationError, ForeignKeyConstraintError, TimeoutError, UniqueConstraintError, ConnectionError } = require('sequelize');
const path = require('path')
const CustomError = require("../errors/custom-errors")
const apiHandler = (controller) => {
    const afterContoller = async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (e) {
            console.log('e instanceof TimeoutError ', e instanceof TimeoutError);
            console.log('e instanceof ConnectionError ', e instanceof ConnectionError);
            console.log("e instanceof Error ", e instanceof Error);
            console.log('e instanceof ValidationError ', e instanceof ValidationError);
            console.log('e instanceof ForeignKeyConstraintError ', e instanceof ForeignKeyConstraintError);
            console.log('e instanceof CustomError ', e instanceof CustomError);

            const messages = {};
            if (e instanceof CustomError) {
                let message = {
                    "message": e.message,
                    "statusCode": e.httpStatusCode
                };
                next(message)
            } else if (e instanceof ForeignKeyConstraintError) {
                let message = {
                    "message": `Cannot add or update a ${e.reltype} row: a foreign key constraint fails at ${e.fields[0]}`,
                    "statusCode": 422
                };
                next(message)
            } else if (e instanceof ValidationError) {
                const messages = {};
                e.errors.forEach((error) => {
                    let message;
                    console.log(e);
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
                            message = `Please complete this field ${e.path || e.errors[0].path} it can't be ${error.value}`;
                            break;
                        case 'not_unique':
                            message = error.value + ' is taken. Please choose another one';

                            error.path = error.path.replace("_UNIQUE", "");
                    }
                    messages[error.path] = message;
                    let errors = { messages, "statusCode": 422 };
                    next(errors);

                });
            } else if (e instanceof UniqueConstraintError) {
                let errors = { message: `${e.errors[0].message.split(".")[1]} on ${e.errors[0].path.split(".")[1]} ` }
                next(errors)
            } else if (e.message) {
                next(e)
            } else {
                next(e)
            }
        }

    };
    return afterContoller;
};

module.exports = apiHandler;
