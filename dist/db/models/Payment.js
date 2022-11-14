"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const Employee_1 = __importDefault(require("./Employee"));
class Payment extends objection_1.Model {
    static get tableName() {
        return 'payment';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['paymentId', 'employeeId', 'quantity', 'totalHours'],
            properties: {
                paymentId: { type: 'string' },
                employeeId: { type: 'string', minLength: 12 },
                quantity: { type: 'integer' },
                totalHours: { type: 'float' },
            },
        };
    }
    static get relationMappings() {
        return {
            employee: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: Employee_1.default,
                join: {
                    from: 'payment.employeeId',
                    to: 'employee.employeeId',
                },
            },
        };
    }
}
exports.default = Payment;
//# sourceMappingURL=Payment.js.map