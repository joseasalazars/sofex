"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
// In this example `res` is an express response object.
function errorHandler(err, res) {
    if (err instanceof objection_1.ValidationError) {
        switch (err.type) {
            case 'ModelValidation':
                res.status(400).send({
                    message: err.message,
                    type: err.type,
                    data: err.data
                });
                break;
            case 'RelationExpression':
                res.status(400).send({
                    message: err.message,
                    type: 'RelationExpression',
                    data: {}
                });
                break;
            case 'UnallowedRelation':
                res.status(400).send({
                    message: err.message,
                    type: err.type,
                    data: {}
                });
                break;
            case 'InvalidGraph':
                res.status(400).send({
                    message: err.message,
                    type: err.type,
                    data: {}
                });
                break;
            default:
                res.status(400).send({
                    message: err.message,
                    type: 'UnknownValidationError',
                    data: {}
                });
                break;
        }
    }
    else if (err instanceof objection_1.NotFoundError) {
        res.status(404).send({
            message: err.message,
            type: 'NotFound',
            data: {}
        });
    }
    else if (err instanceof objection_1.UniqueViolationError) {
        res.status(409).send({
            message: err.message,
            type: 'UniqueViolation',
            data: {
                columns: err.columns,
                table: err.table,
                constraint: err.constraint
            }
        });
    }
    else if (err instanceof objection_1.NotNullViolationError) {
        res.status(400).send({
            message: err.message,
            type: 'NotNullViolation',
            data: {
                column: err.column,
                table: err.table
            }
        });
    }
    else if (err instanceof objection_1.ForeignKeyViolationError) {
        res.status(409).send({
            message: err.message,
            type: 'ForeignKeyViolation',
            data: {
                table: err.table,
                constraint: err.constraint
            }
        });
    }
    else if (err instanceof objection_1.CheckViolationError) {
        res.status(400).send({
            message: err.message,
            type: 'CheckViolation',
            data: {
                table: err.table,
                constraint: err.constraint
            }
        });
    }
    else if (err instanceof objection_1.DataError) {
        res.status(400).send({
            message: err.message,
            type: 'InvalidData',
            data: {}
        });
    }
    else if (err instanceof objection_1.DBError) {
        res.status(500).send({
            message: err.message,
            type: 'UnknownDatabaseError',
            data: {}
        });
    }
    else {
        res.status(500).send({
            message: err.message,
            type: 'UnknownError',
            data: {}
        });
    }
}
exports.default = errorHandler;
//# sourceMappingURL=errors.js.map