"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const Registration_1 = __importDefault(require("./Registration"));
const Payment_1 = __importDefault(require("./Payment"));
class Employee extends objection_1.Model {
    static get tableName() {
        return 'employee';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['employeeId', 'firstName', 'lastName', 'position', 'salary_per_week'],
            properties: {
                employeeId: { type: 'string', minLength: 12 },
                firstName: { type: 'string', minLength: 1, maxLength: 255 },
                lastName: { type: 'string', minLength: 1, maxLength: 255 },
                position: { type: 'string', minLength: 1, maxLength: 255 },
                salary_per_week: { type: 'integer' }
            },
        };
    }
    static get relationMappings() {
        return {
            registrations: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: Registration_1.default,
                join: {
                    from: 'employee.employeeId',
                    to: 'registration.employeeId',
                },
            },
            payments: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: Payment_1.default,
                join: {
                    from: 'employee.employeeId',
                    to: 'payment.employeeId',
                },
            },
        };
    }
}
exports.default = Employee;
//# sourceMappingURL=Employee.js.map