"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackPayment = exports.deleteEmployeePayment = exports.insertPayment = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const knexfile_js_1 = __importDefault(require("../db/knexfile.js"));
const knex_1 = __importDefault(require("knex"));
const employees_1 = require("./employees");
const router = express_1.default.Router();
exports.router = router;
const knex = (0, knex_1.default)(knexfile_js_1.default.development);
/*
  Get all payments.
*/
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield getPayments();
    res.status(response.status).json({ "message": response.message });
}));
/*
  Get payment record for an employee.
*/
router.get('/:employeeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield getEmployeePayment(req.params.employeeId);
    res.status(response.status).json({ "message": response.message });
}));
/*
  Method to get all payments.
*/
const getPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield knex('payment').select();
        return { status: 200, message: response };
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
/*
  Method to get payment record for an employee.
*/
const getEmployeePayment = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield (0, employees_1.getEmployee)(employeeId);
    try {
        const response = yield knex('payment').where('employeeId', employeeId).select();
        if (response.length > 0) {
            return { status: 200, message: response[0] };
        }
        else if (employee.status == 404) {
            return { status: 404, message: "Employee doesn't exists." };
        }
        else if (response.length == 0) {
            return { status: 404, message: "No active payments for this employee." };
        }
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
/*
  Method to create new payment and/or update existing record with new employee's data shift.
*/
const insertPayment = (employeeId, quantity, totalHours) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield getEmployeePayment(employeeId);
    if (payment.status == 200) {
        try {
            const response = yield knex('payment').where('paymentId', payment.message.paymentId).update({
                quantity: payment.message.quantity + quantity,
                totalHours: payment.message.totalHours + totalHours
            });
            if (response == 1) {
                return { status: 200, message: "Payment Created." };
            }
            return { status: 400, message: "Bad Request." };
        }
        catch (error) {
            console.log(error);
            return { status: 500, message: "Server error. " + error };
        }
    }
    else if (payment.message == "No active payments for this employee.") {
        const newPayment = {
            paymentId: (0, uuid_1.v4)(),
            employeeId,
            quantity,
            totalHours
        };
        try {
            const response = yield knex('payment').insert(newPayment);
            if (response.rowCount == 1) {
                return { status: 200, message: newPayment };
            }
            return { status: 400, message: "Bad Request." };
        }
        catch (error) {
            console.log(error);
            return { status: 500, message: "Server error. " + error };
        }
    }
});
exports.insertPayment = insertPayment;
/*
  Method to rollback payment update if there was an error registering employee's exit in registration table.
*/
const rollbackPayment = (employeeId, quantity, totalHours) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield getEmployeePayment(employeeId);
    if (payment.status == 200) {
        try {
            const response = yield knex('payment').where('paymentId', payment.message.paymentId).update({
                quantity: payment.message.quantity - quantity,
                totalHours: payment.message.totalHours - totalHours
            });
            if (response == 1) {
                return { status: 200, message: "Payment Created." };
            }
            // Implement retries as payment needs to be rollbacked
            return { status: 400, message: "Bad Request." };
        }
        catch (error) {
            console.log(error);
            return { status: 500, message: "Server error. " + error };
        }
    }
    else {
        // Implement retries as payment needs to be rollbacked
        return { status: 400, message: "Bad Request." };
    }
});
exports.rollbackPayment = rollbackPayment;
/*
  Method to delete payment record for an employee.
*/
const deleteEmployeePayment = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield knex('payment').where('employeeId', employeeId).del();
        return response;
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
exports.deleteEmployeePayment = deleteEmployeePayment;
//# sourceMappingURL=payments.js.map