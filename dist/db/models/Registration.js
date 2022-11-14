"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const Employee_1 = __importDefault(require("./Employee"));
class Registration extends objection_1.Model {
    static get tableName() {
        return 'registration';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['registrationId', 'employeeId', 'entryTime', 'exitTime', 'hours', 'extraPayment'],
            properties: {
                registrationId: { type: 'string' },
                employeeId: { type: 'string', minLength: 12 },
                entryTime: { type: 'string', minLength: 1, maxLength: 255 },
                exitTime: { type: 'string', minLength: 1, maxLength: 255 },
                hours: { type: 'float' },
                extraPayment: { type: 'integer' },
            },
        };
    }
    static get relationMappings() {
        return {
            employee: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: Employee_1.default,
                join: {
                    from: 'registration.employeeId',
                    to: 'employee.employeeId',
                },
            },
        };
    }
}
exports.default = Registration;
//# sourceMappingURL=Registration.js.map